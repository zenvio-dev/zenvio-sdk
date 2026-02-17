package zenvio

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// APIError representa erro 4xx/5xx da API (status code + body).
type APIError struct {
	Code int
	Body string
}

func (e *APIError) Error() string {
	return fmt.Sprintf("zenvio api error %d: %s", e.Code, e.Body)
}

// Client é o cliente principal do SDK (WhatsApp, SMS, Email, Messages).
type Client struct {
	APIKey     string
	BaseURL    string
	HTTPClient *http.Client
	WhatsApp   *WhatsAppNamespace
	SMS        *SmsNamespace
	Email      *EmailNamespace
	Messages   *MessagesNamespace
}

// Config configuração do cliente.
type Config struct {
	APIKey  string
	BaseURL string
}

// NewClient cria um novo cliente com a URL padrão.
func NewClient(apiKey string) *Client {
	return NewClientWithConfig(Config{
		APIKey:  apiKey,
		BaseURL: "https://api.zenvio.com/v1",
	})
}

// NewClientWithConfig cria um cliente com configuração customizada.
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
	c.SMS = &SmsNamespace{client: c}
	c.Email = &EmailNamespace{client: c}
	c.Messages = &MessagesNamespace{client: c}
	return c
}

// request executa a requisição HTTP. Se status >= 400, retorna *APIError. Se result != nil, decodifica o body em result.
func (c *Client) request(method, path string, body interface{}, result interface{}) error {
	reqURL := c.BaseURL + path
	var buf io.ReadWriter
	if body != nil {
		buf = new(bytes.Buffer)
		if err := json.NewEncoder(buf).Encode(body); err != nil {
			return err
		}
	}
	req, err := http.NewRequest(method, reqURL, buf)
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+c.APIKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "Zenvio-Go-SDK/0.2.0")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		return &APIError{Code: resp.StatusCode, Body: string(bodyBytes)}
	}

	if result != nil && len(bodyBytes) > 0 {
		if err := json.Unmarshal(bodyBytes, result); err != nil {
			return err
		}
	}
	return nil
}

// --- WhatsAppNamespace ---

// WhatsAppNamespace métodos WhatsApp: send, getMessage, instances, etc.
type WhatsAppNamespace struct {
	client *Client
}

// Send envia mensagem(s) — POST /v1/whatsapp/send (instance_id no body).
func (w *WhatsAppNamespace) Send(instanceID string, params WhatsAppSendParams) (*WhatsAppSendResponse, error) {
	params.InstanceID = instanceID
	var res WhatsAppSendResponse
	if err := w.client.request("POST", "/whatsapp/send", params, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// SendText atalho para texto (payload.message).
func (w *WhatsAppNamespace) SendText(instanceID string, to []string, text string) (*WhatsAppSendResponse, error) {
	params := WhatsAppSendParams{
		InstanceID: instanceID,
		To:         to,
		Type:       "text",
		Payload:    WhatsAppTextPayload{Message: text},
	}
	return w.Send(instanceID, params)
}

// GetMessage GET /v1/whatsapp/:messageId
func (w *WhatsAppNamespace) GetMessage(messageID string) (*WhatsAppMessageStatus, error) {
	var res WhatsAppMessageStatus
	if err := w.client.request("GET", "/whatsapp/"+messageID, nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// DeleteMessage DELETE /v1/whatsapp/:messageId
func (w *WhatsAppNamespace) DeleteMessage(messageID string) (*WhatsAppMessageActionResponse, error) {
	var res WhatsAppMessageActionResponse
	if err := w.client.request("DELETE", "/whatsapp/"+messageID, nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// EditMessage PATCH /v1/whatsapp/:messageId/edit — body: { "text": "..." }
func (w *WhatsAppNamespace) EditMessage(messageID string, text string) (*WhatsAppMessageActionResponse, error) {
	var res WhatsAppMessageActionResponse
	body := map[string]string{"text": text}
	if err := w.client.request("PATCH", "/whatsapp/"+messageID+"/edit", body, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// CancelMessage POST /v1/whatsapp/:messageId/cancel
func (w *WhatsAppNamespace) CancelMessage(messageID string) (*WhatsAppMessageActionResponse, error) {
	var res WhatsAppMessageActionResponse
	if err := w.client.request("POST", "/whatsapp/"+messageID+"/cancel", nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// ListInstances GET /v1/whatsapp/instances (params opcional: page, limit, status, search)
func (w *WhatsAppNamespace) ListInstances(params map[string]string) (*WhatsAppInstanceListResponse, error) {
	path := "/whatsapp/instances"
	if len(params) > 0 {
		q := url.Values{}
		for k, v := range params {
			q.Set(k, v)
		}
		path = path + "?" + q.Encode()
	}
	var res WhatsAppInstanceListResponse
	if err := w.client.request("GET", path, nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// GetInstance GET /v1/whatsapp/instances/:instanceId
func (w *WhatsAppNamespace) GetInstance(instanceID string) (*WhatsAppInstanceResponse, error) {
	var res WhatsAppInstanceResponse
	if err := w.client.request("GET", "/whatsapp/instances/"+instanceID, nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// CreateInstance POST /v1/whatsapp/instances — body: { "name": "..." }
func (w *WhatsAppNamespace) CreateInstance(name string) (*WhatsAppCreateInstanceResponse, error) {
	body := map[string]string{"name": name}
	var res WhatsAppCreateInstanceResponse
	if err := w.client.request("POST", "/whatsapp/instances", body, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// DisconnectInstance POST /v1/whatsapp/instances/:instanceId/disconnect
func (w *WhatsAppNamespace) DisconnectInstance(instanceID string) (*WhatsAppInstanceActionResponse, error) {
	var res WhatsAppInstanceActionResponse
	if err := w.client.request("POST", "/whatsapp/instances/"+instanceID+"/disconnect", nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// DeleteInstance DELETE /v1/whatsapp/instances/:instanceId
func (w *WhatsAppNamespace) DeleteInstance(instanceID string) (*WhatsAppInstanceActionResponse, error) {
	var res WhatsAppInstanceActionResponse
	if err := w.client.request("DELETE", "/whatsapp/instances/"+instanceID, nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// --- SmsNamespace ---

// SmsNamespace métodos SMS: send, get.
type SmsNamespace struct {
	client *Client
}

// Send POST /v1/sms/send
func (s *SmsNamespace) Send(params SmsSendParams) (*SmsSendResponse, error) {
	var res SmsSendResponse
	if err := s.client.request("POST", "/sms/send", params, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Get GET /v1/sms/:id
func (s *SmsNamespace) Get(id string) (*SmsStatusResponse, error) {
	var res SmsStatusResponse
	if err := s.client.request("GET", "/sms/"+id, nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// --- EmailNamespace ---

// EmailNamespace métodos Email: send, get, cancel.
type EmailNamespace struct {
	client *Client
}

// Send POST /v1/email/send
func (e *EmailNamespace) Send(params EmailSendParams) (*EmailSendResponse, error) {
	var res EmailSendResponse
	if err := e.client.request("POST", "/email/send", params, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Get GET /v1/email/:id
func (e *EmailNamespace) Get(id string) (*EmailStatusResponse, error) {
	var res EmailStatusResponse
	if err := e.client.request("GET", "/email/"+id, nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Cancel POST /v1/email/:id/cancel
func (e *EmailNamespace) Cancel(id string) (*EmailCancelResponse, error) {
	var res EmailCancelResponse
	if err := e.client.request("POST", "/email/"+id+"/cancel", nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// --- MessagesNamespace ---

// MessagesNamespace envio por template — POST /v1/templates/send.
type MessagesNamespace struct {
	client *Client
}

// Send POST /v1/templates/send
func (m *MessagesNamespace) Send(params MessagesSendParams) (*MessagesSendResponse, error) {
	var res MessagesSendResponse
	if err := m.client.request("POST", "/templates/send", params, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
