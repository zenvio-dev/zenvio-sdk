package zenvio

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

// Client is the main Zenvio SDK client.
type Client struct {
	APIKey   string
	BaseURL  string
	HTTPClient *http.Client
	WhatsApp *WhatsAppNamespace
}

// Config contains the configuration for the Zenvio client.
type Config struct {
	APIKey  string
	BaseURL string
}

// NewClient creates a new Zenvio SDK client.
func NewClient(apiKey string) *Client {
	return NewClientWithConfig(Config{
		APIKey:  apiKey,
		BaseURL: "https://api.zenvio.com/v1",
	})
}

// NewClientWithConfig creates a new Zenvio SDK client with custom configuration.
func NewClientWithConfig(config Config) *Client {
	if config.BaseURL == "" {
		config.BaseURL = "https://api.zenvio.com/v1"
	}
	config.BaseURL = strings.TrimSuffix(config.BaseURL, "/")

	c := &Client{
		APIKey:  config.APIKey,
		BaseURL: config.BaseURL,
		HTTPClient: &http.Client{
			Timeout: time.Second * 30,
		},
	}
	c.WhatsApp = &WhatsAppNamespace{client: c}
	return c
}

// request performs the actual HTTP request to the Zenvio API.
func (c *Client) request(method, path string, body interface{}) (*SendResponse, error) {
	url := c.BaseURL + path

	var buf io.ReadWriter
	if body != nil {
		buf = new(bytes.Buffer)
		err := json.NewEncoder(buf).Encode(body)
		if err != nil {
			return nil, err
		}
	}

	req, err := http.NewRequest(method, url, buf)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+c.APIKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "Zenvio-Go-SDK/0.1.0")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result SendResponse
	err = json.NewDecoder(resp.Body).Decode(&result)
	if err != nil {
		// If decoding fails, it might not be a JSON response or a different structure
		if resp.StatusCode >= 400 {
			return &SendResponse{
				Success: false,
				Error:   fmt.Sprintf("HTTP Error: %d %s", resp.StatusCode, resp.Status),
			}, nil
		}
		return nil, err
	}

	return &result, nil
}

// WhatsAppNamespace contains WhatsApp-specific methods.
type WhatsAppNamespace struct {
	client *Client
}

// Send sends a WhatsApp message.
func (w *WhatsAppNamespace) Send(phoneID string, params SendParams) (*SendResponse, error) {
	path := fmt.Sprintf("/whatsapp/%s/messages", phoneID)
	return w.client.request("POST", path, params)
}

// SendText is a shortcut to send a simple WhatsApp text message.
func (w *WhatsAppNamespace) SendText(phoneID string, to []string, text string) (*SendResponse, error) {
	params := SendParams{
		To:      to,
		Type:    TypeText,
		Payload: TextPayload{Text: text},
	}
	return w.Send(phoneID, params)
}
