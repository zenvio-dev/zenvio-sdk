package notifique

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
	return fmt.Sprintf("notifique api error %d: %s", e.Code, e.Body)
}

// ParseErrorBody decodifica o body do erro no formato ErrorResponse da API (quando JSON).
func (e *APIError) ParseErrorBody() (*ErrorResponse, error) {
	var errResp ErrorResponse
	if err := json.Unmarshal([]byte(e.Body), &errResp); err != nil {
		return nil, err
	}
	return &errResp, nil
}

// Notifique é o cliente principal do SDK (WhatsApp, SMS, Email, Push, Messages).
type Notifique struct {
	APIKey     string
	BaseURL    string
	HTTPClient *http.Client
	WhatsApp   *WhatsAppNamespace
	SMS        *SmsNamespace
	Email      *EmailNamespace
	Messages   *MessagesNamespace
	Push       *PushNamespace
}

// Client é alias para Notifique (deprecated).
type Client = Notifique

// Config configuração do cliente.
type Config struct {
	APIKey            string
	BaseURL           string
	AllowInsecureHTTP bool
}

// NewClient creates a client with the default base URL (https://api.notifique.dev/v1).
// Panics if apiKey is empty — use NewClientWithConfig to handle the error explicitly.
func NewClient(apiKey string) *Notifique {
	c, err := NewClientWithConfig(Config{
		APIKey:  apiKey,
		BaseURL: "https://api.notifique.dev/v1",
	})
	if err != nil {
		panic(err)
	}
	return c
}

// NewClientWithConfig creates a client with a custom configuration.
// Returns nil and a non-nil error if config.APIKey is empty.
func NewClientWithConfig(config Config) (*Notifique, error) {
	if strings.TrimSpace(config.APIKey) == "" {
		return nil, fmt.Errorf("notifique: APIKey must not be empty")
	}
	if config.BaseURL == "" {
		config.BaseURL = "https://api.notifique.dev/v1"
	}
	config.BaseURL = strings.TrimSuffix(config.BaseURL, "/")
	parsedURL, err := url.Parse(config.BaseURL)
	if err != nil || parsedURL.Host == "" {
		return nil, fmt.Errorf("notifique: BaseURL must be an absolute URL")
	}
	if parsedURL.Scheme != "https" && !config.AllowInsecureHTTP {
		return nil, fmt.Errorf("notifique: BaseURL must be HTTPS")
	}
	c := &Notifique{
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
	c.Push = newPushNamespace(c)
	return c, nil
}

// SendOptions opções para requisições de envio (Email, SMS, Push, WhatsApp). IdempotencyKey envia o header Idempotency-Key (e x-idempotency-key) conforme OpenAPI.
type SendOptions struct {
	IdempotencyKey string
}

// buildQueryPath appends a query string to path from a params map. Returns path unchanged if params is empty.
func buildQueryPath(base string, params map[string]string) string {
	if len(params) == 0 {
		return base
	}
	q := url.Values{}
	for k, v := range params {
		q.Set(k, v)
	}
	return base + "?" + q.Encode()
}

// request executa a requisição HTTP. Se status >= 400, retorna *APIError. Se result != nil, decodifica o body em result.
func (c *Notifique) request(method, path string, body interface{}, result interface{}) error {
	return c.requestWithHeaders(method, path, body, result, nil)
}

// requestWithHeaders como request, mas permite headers extras (ex.: Idempotency-Key).
func (c *Notifique) requestWithHeaders(method, path string, body interface{}, result interface{}, headers map[string]string) error {
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
	req.Header.Set("User-Agent", "Notifique-Go-SDK/0.2.0")
	for k, v := range headers {
		if v != "" {
			req.Header.Set(k, v)
		}
	}

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

func idempotencyHeaders(opts *SendOptions) map[string]string {
	if opts == nil || opts.IdempotencyKey == "" {
		return nil
	}
	return map[string]string{
		"Idempotency-Key":  opts.IdempotencyKey,
		"x-idempotency-key": opts.IdempotencyKey,
	}
}

// --- WhatsAppNamespace ---

// WhatsAppNamespace métodos WhatsApp: send, listMessages, getMessage, instances, qr, etc.
type WhatsAppNamespace struct {
	client *Notifique
}

// Send envia mensagem(s) — POST /v1/whatsapp/messages (instanceId no body). opts opcional: IdempotencyKey (header Idempotency-Key / x-idempotency-key).
func (w *WhatsAppNamespace) Send(instanceID string, params WhatsAppSendParams, opts ...*SendOptions) (*WhatsAppSendEnvelope, error) {
	params.InstanceID = instanceID
	var opt *SendOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	var res WhatsAppSendEnvelope
	if err := w.client.requestWithHeaders("POST", "/whatsapp/messages", params, &res, idempotencyHeaders(opt)); err != nil {
		return nil, err
	}
	return &res, nil
}

// SendText atalho para texto (payload.message). opts opcional: IdempotencyKey.
func (w *WhatsAppNamespace) SendText(instanceID string, to []string, text string, opts ...*SendOptions) (*WhatsAppSendEnvelope, error) {
	params := WhatsAppSendParams{
		InstanceID: instanceID,
		To:         to,
		Type:       "text",
		Payload:    WhatsAppTextPayload{Message: text},
	}
	return w.Send(instanceID, params, opts...)
}

// ListMessages GET /v1/whatsapp/messages (params: page, limit, fromDate, toDate, instanceIds, status, type, includeEvents)
func (w *WhatsAppNamespace) ListMessages(params map[string]string) (*WhatsAppListMessagesResponse, error) {
	path := buildQueryPath("/whatsapp/messages", params)
	var res WhatsAppListMessagesResponse
	if err := w.client.request("GET", path, nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// GetMessage GET /v1/whatsapp/messages/:messageId — retorna envelope success/data.
func (w *WhatsAppNamespace) GetMessage(messageID string) (*WhatsAppMessageEnvelope, error) {
	var res WhatsAppMessageEnvelope
	if err := w.client.request("GET", "/whatsapp/messages/"+url.PathEscape(messageID), nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// GetInstanceQr GET /v1/whatsapp/instances/:instanceId/qr
func (w *WhatsAppNamespace) GetInstanceQr(instanceID string) (*WhatsAppInstanceQrResponse, error) {
	var res WhatsAppInstanceQrResponse
	if err := w.client.request("GET", "/whatsapp/instances/"+url.PathEscape(instanceID)+"/qr", nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// DeleteMessage DELETE /v1/whatsapp/messages/:messageId
func (w *WhatsAppNamespace) DeleteMessage(messageID string) (*WhatsAppMessageActionResponse, error) {
	var res WhatsAppMessageActionResponse
	if err := w.client.request("DELETE", "/whatsapp/messages/"+url.PathEscape(messageID), nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// EditMessage PATCH /v1/whatsapp/messages/:messageId/edit — body: { "text": "..." }
func (w *WhatsAppNamespace) EditMessage(messageID string, text string) (*WhatsAppMessageActionResponse, error) {
	var res WhatsAppMessageActionResponse
	body := map[string]string{"text": text}
	if err := w.client.request("PATCH", "/whatsapp/messages/"+url.PathEscape(messageID)+"/edit", body, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// CancelMessage POST /v1/whatsapp/messages/:messageId/cancel
func (w *WhatsAppNamespace) CancelMessage(messageID string) (*WhatsAppMessageActionResponse, error) {
	var res WhatsAppMessageActionResponse
	if err := w.client.request("POST", "/whatsapp/messages/"+url.PathEscape(messageID)+"/cancel", nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// ListInstances GET /v1/whatsapp/instances (params opcional: page, limit, status, search)
func (w *WhatsAppNamespace) ListInstances(params map[string]string) (*WhatsAppInstanceListResponse, error) {
	path := buildQueryPath("/whatsapp/instances", params)
	var res WhatsAppInstanceListResponse
	if err := w.client.request("GET", path, nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// GetInstance GET /v1/whatsapp/instances/:instanceId
func (w *WhatsAppNamespace) GetInstance(instanceID string) (*WhatsAppInstanceResponse, error) {
	var res WhatsAppInstanceResponse
	if err := w.client.request("GET", "/whatsapp/instances/"+url.PathEscape(instanceID), nil, &res); err != nil {
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
	if err := w.client.request("POST", "/whatsapp/instances/"+url.PathEscape(instanceID)+"/disconnect", nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// DeleteInstance DELETE /v1/whatsapp/instances/:instanceId
func (w *WhatsAppNamespace) DeleteInstance(instanceID string) (*WhatsAppInstanceActionResponse, error) {
	var res WhatsAppInstanceActionResponse
	if err := w.client.request("DELETE", "/whatsapp/instances/"+url.PathEscape(instanceID), nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// --- SmsNamespace ---

// SmsNamespace métodos SMS: send, get, cancel.
type SmsNamespace struct {
	client *Notifique
}

// Send POST /v1/sms/messages. opts opcional: IdempotencyKey (header Idempotency-Key / x-idempotency-key).
func (s *SmsNamespace) Send(params SmsSendParams, opts ...*SendOptions) (*SmsSendResponse, error) {
	var opt *SendOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	var res SmsSendResponse
	if err := s.client.requestWithHeaders("POST", "/sms/messages", params, &res, idempotencyHeaders(opt)); err != nil {
		return nil, err
	}
	return &res, nil
}

// Get GET /v1/sms/messages/:id
func (s *SmsNamespace) Get(id string) (*SmsStatusResponse, error) {
	var res SmsStatusResponse
	if err := s.client.request("GET", "/sms/messages/"+url.PathEscape(id), nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Cancel POST /v1/sms/messages/:id/cancel — cancela SMS agendado (status SCHEDULED). Escopo: sms:cancel.
func (s *SmsNamespace) Cancel(id string) (*SmsCancelResponse, error) {
	var res SmsCancelResponse
	if err := s.client.request("POST", "/sms/messages/"+url.PathEscape(id)+"/cancel", nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// --- EmailNamespace ---

// EmailNamespace métodos Email: send, get, cancel, Domains.
type EmailNamespace struct {
	client *Notifique
}

// Send POST /v1/email/messages. opts opcional: IdempotencyKey (header Idempotency-Key / x-idempotency-key).
func (e *EmailNamespace) Send(params EmailSendParams, opts ...*SendOptions) (*EmailSendResponse, error) {
	var opt *SendOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	var res EmailSendResponse
	if err := e.client.requestWithHeaders("POST", "/email/messages", params, &res, idempotencyHeaders(opt)); err != nil {
		return nil, err
	}
	return &res, nil
}

// Get GET /v1/email/messages/:id
func (e *EmailNamespace) Get(id string) (*EmailStatusResponse, error) {
	var res EmailStatusResponse
	if err := e.client.request("GET", "/email/messages/"+url.PathEscape(id), nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Cancel POST /v1/email/messages/:id/cancel
func (e *EmailNamespace) Cancel(id string) (*EmailCancelResponse, error) {
	var res EmailCancelResponse
	if err := e.client.request("POST", "/email/messages/"+url.PathEscape(id)+"/cancel", nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Domains retorna o namespace de domínios de e-mail (list, create, get, verify).
func (e *EmailNamespace) Domains() *EmailDomainsNamespace {
	return &EmailDomainsNamespace{client: e.client}
}

// --- EmailDomainsNamespace ---

// EmailDomainsNamespace GET/POST /v1/email/domains, GET /v1/email/domains/:id, POST verify
type EmailDomainsNamespace struct {
	client *Notifique
}

// List GET /v1/email/domains
func (d *EmailDomainsNamespace) List() (*ListEmailDomainsResponse, error) {
	var res ListEmailDomainsResponse
	if err := d.client.request("GET", "/email/domains", nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Create POST /v1/email/domains
func (d *EmailDomainsNamespace) Create(req CreateEmailDomainRequest) (*CreateEmailDomainResponse, error) {
	var res CreateEmailDomainResponse
	if err := d.client.request("POST", "/email/domains", req, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Get GET /v1/email/domains/:id
func (d *EmailDomainsNamespace) Get(id string) (*GetEmailDomainResponse, error) {
	var res GetEmailDomainResponse
	if err := d.client.request("GET", "/email/domains/"+url.PathEscape(id), nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Verify POST /v1/email/domains/:id/verify
func (d *EmailDomainsNamespace) Verify(id string) (*VerifyEmailDomainResponse, error) {
	var res VerifyEmailDomainResponse
	if err := d.client.request("POST", "/email/domains/"+url.PathEscape(id)+"/verify", nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// --- PushNamespace ---

// PushNamespace Push API: Apps, Devices, Messages.
type PushNamespace struct {
	client *Notifique
	Apps   *PushAppsNamespace
	Devices *PushDevicesNamespace
	Messages *PushMessagesNamespace
}

func newPushNamespace(c *Notifique) *PushNamespace {
	p := &PushNamespace{client: c}
	p.Apps = &PushAppsNamespace{client: c}
	p.Devices = &PushDevicesNamespace{client: c}
	p.Messages = &PushMessagesNamespace{client: c}
	return p
}

// PushAppsNamespace GET/POST /v1/push/apps, GET/PUT/DELETE /v1/push/apps/:id
type PushAppsNamespace struct {
	client *Notifique
}

// List GET /v1/push/apps
func (p *PushAppsNamespace) List(params map[string]string) (*PushAppListResponse, error) {
	path := buildQueryPath("/push/apps", params)
	var res PushAppListResponse
	if err := p.client.request("GET", path, nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Get GET /v1/push/apps/:id
func (p *PushAppsNamespace) Get(id string) (*PushAppSingleResponse, error) {
	var res PushAppSingleResponse
	if err := p.client.request("GET", "/push/apps/"+url.PathEscape(id), nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Create POST /v1/push/apps — body: { "name": "..." }
func (p *PushAppsNamespace) Create(name string) (*PushAppSingleResponse, error) {
	body := map[string]string{"name": name}
	var res PushAppSingleResponse
	if err := p.client.request("POST", "/push/apps", body, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Update PUT /v1/push/apps/:id
func (p *PushAppsNamespace) Update(id string, body map[string]interface{}) (*PushAppSingleResponse, error) {
	var res PushAppSingleResponse
	if err := p.client.request("PUT", "/push/apps/"+url.PathEscape(id), body, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Delete DELETE /v1/push/apps/:id
func (p *PushAppsNamespace) Delete(id string) error {
	return p.client.request("DELETE", "/push/apps/"+url.PathEscape(id), nil, nil)
}

// PushDevicesNamespace POST/GET /v1/push/devices, GET/DELETE /v1/push/devices/:id
type PushDevicesNamespace struct {
	client *Notifique
}

// Register POST /v1/push/devices
func (p *PushDevicesNamespace) Register(params PushDeviceRegisterRequest) (*PushDeviceSingleResponse, error) {
	var res PushDeviceSingleResponse
	if err := p.client.request("POST", "/push/devices", params, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// List GET /v1/push/devices
func (p *PushDevicesNamespace) List(params map[string]string) (*PushDeviceListResponse, error) {
	path := buildQueryPath("/push/devices", params)
	var res PushDeviceListResponse
	if err := p.client.request("GET", path, nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Get GET /v1/push/devices/:id
func (p *PushDevicesNamespace) Get(id string) (*PushDeviceSingleResponse, error) {
	var res PushDeviceSingleResponse
	if err := p.client.request("GET", "/push/devices/"+url.PathEscape(id), nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Delete DELETE /v1/push/devices/:id
func (p *PushDevicesNamespace) Delete(id string) error {
	return p.client.request("DELETE", "/push/devices/"+url.PathEscape(id), nil, nil)
}

// PushMessagesNamespace POST/GET /v1/push/messages, GET /v1/push/messages/:id, POST cancel
type PushMessagesNamespace struct {
	client *Notifique
}

// Send POST /v1/push/messages. opts opcional: IdempotencyKey (header Idempotency-Key / x-idempotency-key).
func (p *PushMessagesNamespace) Send(params SendPushParams, opts ...*SendOptions) (*SendPushResponse, error) {
	var opt *SendOptions
	if len(opts) > 0 {
		opt = opts[0]
	}
	var res SendPushResponse
	if err := p.client.requestWithHeaders("POST", "/push/messages", params, &res, idempotencyHeaders(opt)); err != nil {
		return nil, err
	}
	return &res, nil
}

// List GET /v1/push/messages
func (p *PushMessagesNamespace) List(params map[string]string) (*PushMessageListResponse, error) {
	path := buildQueryPath("/push/messages", params)
	var res PushMessageListResponse
	if err := p.client.request("GET", path, nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Get GET /v1/push/messages/:id
func (p *PushMessagesNamespace) Get(id string) (*PushMessageSingleResponse, error) {
	var res PushMessageSingleResponse
	if err := p.client.request("GET", "/push/messages/"+url.PathEscape(id), nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// Cancel POST /v1/push/messages/:id/cancel
func (p *PushMessagesNamespace) Cancel(id string) (*CancelPushResponse, error) {
	var res CancelPushResponse
	if err := p.client.request("POST", "/push/messages/"+url.PathEscape(id)+"/cancel", nil, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

// --- MessagesNamespace ---

// MessagesNamespace envio por template — POST /v1/templates/send.
type MessagesNamespace struct {
	client *Notifique
}

// Send POST /v1/templates/send
func (m *MessagesNamespace) Send(params MessagesSendParams) (*MessagesSendResponse, error) {
	var res MessagesSendResponse
	if err := m.client.request("POST", "/templates/send", params, &res); err != nil {
		return nil, err
	}
	return &res, nil
}
