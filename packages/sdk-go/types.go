package notifique

// ErrorResponse — corpo de erro 4xx/5xx (OpenAPI: ErrorResponse em todos os specs)
type ErrorResponse struct {
	Success bool     `json:"success"`
	Error   string   `json:"error,omitempty"`
	Message string   `json:"message,omitempty"`
	Code    string   `json:"code,omitempty"`
	Details []struct {
		Field   string `json:"field"`
		Message string `json:"message"`
	} `json:"details,omitempty"`
	Data map[string]interface{} `json:"data,omitempty"`
}

// ========== WhatsApp — POST /v1/whatsapp/messages, GET/DELETE/PATCH/POST /v1/whatsapp/messages/:id, instances ==========

// WhatsAppTextPayload — tipo text: payload.message
type WhatsAppTextPayload struct {
	Message string `json:"message"`
}

// WhatsAppMediaPayload — tipo image, video, audio, document: mediaUrl, fileName e mimetype obrigatórios
type WhatsAppMediaPayload struct {
	MediaURL  string `json:"mediaUrl"`
	FileName  string `json:"fileName"`
	Mimetype  string `json:"mimetype"`
}

// WhatsAppLocationPayload — tipo location (latitude, longitude, name e address obrigatórios)
type WhatsAppLocationPayload struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Name      string  `json:"name"`
	Address   string  `json:"address"`
}

// WhatsAppContactPayload — tipo contact: fullName e wuid ou phoneNumber obrigatórios
type WhatsAppContactPayload struct {
	FullName     string `json:"fullName"`
	Wuid         string `json:"wuid,omitempty"`         // Número só dígitos com DDI
	PhoneNumber  string `json:"phoneNumber,omitempty"` // Formatado, ex: +55 28 99999-9999
	Organization string `json:"organization,omitempty"`
	Email        string `json:"email,omitempty"`
	URL          string `json:"url,omitempty"`
}

// WhatsAppContactMessagePayload — payload para type=contact: contact (objeto) ou contact_id (ID do workspace)
type WhatsAppContactMessagePayload struct {
	Contact   *WhatsAppContactPayload `json:"contact,omitempty"`
	ContactID string                  `json:"contactId,omitempty"`
}

// WhatsAppSendParams — body para POST /v1/whatsapp/messages (OpenAPI: schedule.sendAt, options.maxRetries)
type WhatsAppSendParams struct {
	InstanceID string      `json:"instanceId"`
	To         []string    `json:"to"`
	Type       string      `json:"type"` // text, image, video, audio, document, location, contact
	Payload    interface{} `json:"payload"`
	Schedule   *struct {
		SendAt string `json:"sendAt"`
	} `json:"schedule,omitempty"`
	Options *struct {
		Priority   string `json:"priority,omitempty"`
		MaxRetries int    `json:"maxRetries,omitempty"`
		Webhook    *struct {
			URL    string `json:"url"`
			Secret string `json:"secret,omitempty"`
		} `json:"webhook,omitempty"`
		AutoReplyText string `json:"autoReplyText,omitempty"`
		Fallback      *struct {
			Channel string `json:"channel"`
		} `json:"fallback,omitempty"`
	} `json:"options,omitempty"`
}

// WhatsAppSendResponse — conteúdo de data na resposta do send
type WhatsAppSendResponse struct {
	MessageIDs  []string `json:"messageIds"`
	Status      string   `json:"status"`
	ScheduledAt string   `json:"scheduledAt,omitempty"`
}

// WhatsAppSendEnvelope — resposta 202 de POST /v1/whatsapp/messages
type WhatsAppSendEnvelope struct {
	Success bool                  `json:"success"`
	Data    WhatsAppSendResponse  `json:"data"`
}

// WhatsAppListMessagesResponse — GET /v1/whatsapp/messages
type WhatsAppListMessagesResponse struct {
	Success    bool                   `json:"success"`
	Data       []map[string]interface{} `json:"data"`
	Pagination WhatsAppPagination    `json:"pagination"`
}

// WhatsAppInstanceQrResponse — GET /v1/whatsapp/instances/:id/qr
type WhatsAppInstanceQrResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Status string  `json:"status"`
		Base64 *string `json:"base64"`
	} `json:"data"`
}

// WhatsAppMessageEnvelope — GET /v1/whatsapp/messages/:id (envelope success/data)
type WhatsAppMessageEnvelope struct {
	Success bool                   `json:"success"`
	Data    WhatsAppMessageStatus `json:"data"`
}

// WhatsAppMessageStatus — GET /v1/whatsapp/messages/:messageId
type WhatsAppMessageStatus struct {
	MessageID   string  `json:"messageId"`
	To          string  `json:"to"`
	Type        string  `json:"type"`
	Status      string  `json:"status"`
	ScheduledAt *string `json:"scheduledAt"`
	SentAt      *string `json:"sentAt"`
	DeliveredAt *string `json:"deliveredAt"`
	ReadAt      *string `json:"readAt"`
	FailedAt    *string `json:"failedAt"`
	ErrorMessage *string `json:"errorMessage"`
	CreatedAt   string  `json:"createdAt"`
}

// WhatsAppMessageActionResponse — delete, edit, cancel (OpenAPI: envelope success + data.messageId, data.status)
type WhatsAppMessageActionResponse struct {
	Success bool `json:"success"`
	Data    struct {
		MessageID string `json:"messageId"`
		Status    string `json:"status"`
	} `json:"data"`
}

// WhatsAppInstance — item da listagem (OpenAPI: phoneNumber, createdAt, updatedAt)
type WhatsAppInstance struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	PhoneNumber *string `json:"phoneNumber"`
	Status      string  `json:"status"`
	CreatedAt   string  `json:"createdAt"`
	UpdatedAt   string  `json:"updatedAt"`
}

// WhatsAppInstanceListResponse — GET /v1/whatsapp/instances
type WhatsAppInstanceListResponse struct {
	Success    bool                 `json:"success"`
	Data       []WhatsAppInstance   `json:"data"`
	Pagination WhatsAppPagination  `json:"pagination"`
}

// WhatsAppPagination — paginação da listagem
type WhatsAppPagination struct {
	Total     int `json:"total"`
	Page      int `json:"page"`
	Limit     int `json:"limit"`
	TotalPages int `json:"totalPages"`
}

// WhatsAppInstanceResponse — GET /v1/whatsapp/instances/:id (data = instance)
type WhatsAppInstanceResponse struct {
	Success bool               `json:"success"`
	Data    WhatsAppInstance   `json:"data"`
}

// WhatsAppCreateInstanceResponse — POST /v1/whatsapp/instances
type WhatsAppCreateInstanceResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Instance   WhatsAppInstance      `json:"instance"`
		Connection map[string]interface{} `json:"connection"`
	} `json:"data"`
}

// WhatsAppInstanceActionResponse — disconnect, delete instance
type WhatsAppInstanceActionResponse struct {
	Success bool   `json:"success"`
	Data    struct {
		InstanceID string `json:"instanceId"`
		Status     string `json:"status"`
	} `json:"data"`
	Message string `json:"message,omitempty"`
}

// ========== SMS — POST /v1/sms/messages, GET /v1/sms/messages/:id ==========

// SmsSendParams — body para POST /v1/sms/messages (OpenAPI: schedule.sendAt)
type SmsSendParams struct {
	To      []string `json:"to"`
	Message string   `json:"message"`
	Schedule *struct {
		SendAt string `json:"sendAt"`
	} `json:"schedule,omitempty"`
	Options *struct {
		Priority string `json:"priority,omitempty"`
	} `json:"options,omitempty"`
}

// SmsSendResponse — resposta do send
type SmsSendResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Status     string   `json:"status"`
		Count      int      `json:"count"`
		SmsIDs     []string `json:"smsIds"`
		ScheduledAt string  `json:"scheduledAt,omitempty"`
	} `json:"data"`
}

// SmsStatusResponse — GET /v1/sms/messages/:id
type SmsStatusResponse struct {
	Success bool `json:"success"`
	Data    struct {
		SmsID       string  `json:"smsId"`
		To          string  `json:"to"`
		Message     string  `json:"message"`
		Status      string  `json:"status"`
		SentAt      *string `json:"sentAt"`
		DeliveredAt *string `json:"deliveredAt"`
		FailedAt    *string `json:"failedAt"`
		ScheduledFor *string `json:"scheduledFor"`
		ErrorMessage *string `json:"errorMessage"`
		CreatedAt   string  `json:"createdAt"`
	} `json:"data"`
}

// SmsCancelResponse — POST /v1/sms/messages/:id/cancel
type SmsCancelResponse struct {
	Success bool `json:"success"`
	Data    struct {
		SmsID   string `json:"smsId"`
		Status  string `json:"status"`
	} `json:"data"`
}

// ========== Email — POST /v1/email/messages, GET /v1/email/messages/:id, POST /v1/email/messages/:id/cancel ==========

// EmailSendParams — body para POST /v1/email/messages (OpenAPI: from, fromName, schedule.sendAt)
type EmailSendParams struct {
	From     string   `json:"from"`
	FromName string   `json:"fromName,omitempty"`
	To       []string `json:"to"`
	Subject  string   `json:"subject"`
	Text     string   `json:"text,omitempty"`
	HTML     string   `json:"html,omitempty"`
	Schedule *struct {
		SendAt string `json:"sendAt"`
	} `json:"schedule,omitempty"`
	Options *struct {
		Priority string `json:"priority,omitempty"`
	} `json:"options,omitempty"`
}

// EmailSendResponse — resposta do send
type EmailSendResponse struct {
	Success bool `json:"success"`
	Data    struct {
		EmailIDs    []string `json:"emailIds"`
		Status      string   `json:"status"`
		Count       int      `json:"count"`
		ScheduledAt string   `json:"scheduledAt,omitempty"`
	} `json:"data"`
}

// EmailStatusResponse — GET /v1/email/messages/:id (OpenAPI: camelCase em data)
type EmailStatusResponse struct {
	Success bool `json:"success"`
	Data    struct {
		ID            string  `json:"id"`
		To            string  `json:"to"`
		From          string  `json:"from"`
		FromName      *string `json:"fromName"`
		Subject       string  `json:"subject"`
		Status        string  `json:"status"`
		ScheduledFor  *string `json:"scheduledFor"`
		SentAt        *string `json:"sentAt"`
		DeliveredAt   *string `json:"deliveredAt"`
		FailedAt      *string `json:"failedAt"`
		ErrorMessage  *string `json:"errorMessage"`
		CreatedAt     string  `json:"createdAt"`
	} `json:"data"`
}

// EmailCancelResponse — POST /v1/email/messages/:id/cancel
type EmailCancelResponse struct {
	Success bool `json:"success"`
	Data    struct {
		EmailID string `json:"emailId"`
		Status  string `json:"status"`
	} `json:"data"`
}

// ========== Messages (templates) — POST /v1/templates/send ==========
// Mesmos campos em todos os SDKs: to, template, variables, channels, instanceId, from, fromName.

// MessagesSendParams — body para POST /v1/templates/send
type MessagesSendParams struct {
	To         []string               `json:"to"`
	Template   string                 `json:"template"`
	Variables  map[string]interface{} `json:"variables,omitempty"`
	Channels   []string               `json:"channels"` // whatsapp, sms, email
	InstanceID string                 `json:"instanceId,omitempty"`
	From       string                 `json:"from,omitempty"`
	FromName   string                 `json:"fromName,omitempty"`
}

// MessagesSendResponse — resposta do templates/send
type MessagesSendResponse struct {
	Success bool `json:"success"`
	Data    struct {
		MessageIDs []string `json:"messageIds,omitempty"`
		SmsIDs     []string `json:"smsIds,omitempty"`
		EmailIDs   []string `json:"emailIds,omitempty"`
		Status     string   `json:"status"`
		Count      int      `json:"count"`
	} `json:"data"`
}

// ========== Email Domains — GET/POST /v1/email/domains, GET /v1/email/domains/:id, POST verify ==========

// EmailDomainItem — item de domínio (OpenAPI: dnsRecords, verifiedAt, createdAt, updatedAt)
type EmailDomainItem struct {
	ID         string              `json:"id"`
	Domain     string              `json:"domain"`
	Status     string              `json:"status"`
	DNSRecords []map[string]string `json:"dnsRecords,omitempty"`
	VerifiedAt *string             `json:"verifiedAt"`
	CreatedAt  string              `json:"createdAt"`
	UpdatedAt  string              `json:"updatedAt,omitempty"`
}

// ListEmailDomainsResponse — GET /v1/email/domains
type ListEmailDomainsResponse struct {
	Success bool             `json:"success"`
	Data    []EmailDomainItem `json:"data"`
}

// CreateEmailDomainRequest — POST /v1/email/domains
type CreateEmailDomainRequest struct {
	Domain string `json:"domain"`
}

// CreateEmailDomainResponse — resposta do create domain
type CreateEmailDomainResponse struct {
	Success bool             `json:"success"`
	Data    EmailDomainItem  `json:"data"`
	Message string           `json:"message,omitempty"`
}

// GetEmailDomainResponse — GET /v1/email/domains/:id
type GetEmailDomainResponse struct {
	Success bool            `json:"success"`
	Data    EmailDomainItem `json:"data"`
}

// VerifyEmailDomainResponse — POST /v1/email/domains/:id/verify
type VerifyEmailDomainResponse struct {
	Success  bool            `json:"success"`
	Data     EmailDomainItem `json:"data"`
	Verified bool            `json:"verified"`
}

// ========== Push — apps, devices, messages ==========

// PushAppItem — item de push app (OpenAPI: inclui prompt_config)
type PushAppItem struct {
	ID               string                 `json:"id"`
	Name             string                 `json:"name"`
	WorkspaceID      string                 `json:"workspaceId"`
	VapidPublicKey   *string                `json:"vapidPublicKey"`
	HasVapidPrivate  bool                   `json:"hasVapidPrivate"`
	HasFcm           bool                   `json:"hasFcm"`
	HasApns          bool                   `json:"hasApns"`
	AllowedOrigins   []string               `json:"allowedOrigins"`
	PromptConfig     map[string]interface{} `json:"promptConfig,omitempty"`
	CreatedAt        string                 `json:"createdAt"`
	UpdatedAt        string                 `json:"updatedAt"`
}

// PushAppListResponse — GET /v1/push/apps
type PushAppListResponse struct {
	Success    bool         `json:"success"`
	Data       []PushAppItem `json:"data"`
	Pagination struct {
		Total      int `json:"total"`
		Page       int `json:"page"`
		Limit      int `json:"limit"`
		TotalPages int `json:"totalPages"`
	} `json:"pagination"`
}

// PushAppSingleResponse — GET/POST/PUT /v1/push/apps/:id
type PushAppSingleResponse struct {
	Success bool        `json:"success"`
	Data    PushAppItem `json:"data"`
}

// PushDeviceItem — item de dispositivo
type PushDeviceItem struct {
	ID              string  `json:"id"`
	AppID           string  `json:"appId"`
	Platform        string  `json:"platform"`
	ExternalUserID  *string `json:"externalUserId"`
	CreatedAt       string  `json:"createdAt"`
}

// PushDeviceListResponse — GET /v1/push/devices
type PushDeviceListResponse struct {
	Success    bool             `json:"success"`
	Data       []PushDeviceItem `json:"data"`
	Pagination struct {
		Total      int `json:"total"`
		Page       int `json:"page"`
		Limit      int `json:"limit"`
		TotalPages int `json:"totalPages"`
	} `json:"pagination"`
}

// PushDeviceSingleResponse — POST/GET /v1/push/devices
type PushDeviceSingleResponse struct {
	Success bool          `json:"success"`
	Data    PushDeviceItem `json:"data"`
}

// PushDeviceRegisterRequest — POST /v1/push/devices
type PushDeviceRegisterRequest struct {
	AppID           string                 `json:"appId"`
	Platform        string                 `json:"platform"` // web, android, ios
	Subscription    map[string]interface{} `json:"subscription,omitempty"`
	Token           string                 `json:"token,omitempty"`
	ExternalUserID  string                 `json:"externalUserId,omitempty"`
}

// SendPushParams — POST /v1/push/messages
type SendPushParams struct {
	To      []string               `json:"to"`
	Title   string                 `json:"title,omitempty"`
	Body    string                 `json:"body,omitempty"`
	URL     string                 `json:"url,omitempty"`
	Icon    string                 `json:"icon,omitempty"`
	Image   string                 `json:"image,omitempty"`
	Data    map[string]interface{} `json:"data,omitempty"`
	Schedule *struct {
		SendAt string `json:"sendAt"`
	} `json:"schedule,omitempty"`
	Options *struct {
		Priority string `json:"priority,omitempty"`
	} `json:"options,omitempty"`
}

// SendPushResponse — resposta do send push
type SendPushResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Status     string   `json:"status"`
		Count      int      `json:"count"`
		PushIDs    []string `json:"pushIds"`
		ScheduledAt string  `json:"scheduledAt,omitempty"`
	} `json:"data"`
}

// PushMessageItem — item de envio push (OpenAPI: PushMessageItem)
type PushMessageItem struct {
	ID           string  `json:"id"`
	DeviceID     string  `json:"deviceId"`
	AppID        string  `json:"appId"`
	Title        string  `json:"title"`
	Body         string  `json:"body"`
	Status       string  `json:"status"`
	ScheduledFor *string `json:"scheduledFor"`
	SentAt       *string `json:"sentAt"`
	DeliveredAt  *string `json:"deliveredAt"`
	FailedAt     *string `json:"failedAt"`
	ErrorMessage *string `json:"errorMessage"`
	ClickedAt    *string `json:"clickedAt"`
	CreatedAt    string  `json:"createdAt"`
}

// PushMessageListResponse — GET /v1/push/messages
type PushMessageListResponse struct {
	Success    bool               `json:"success"`
	Data       []PushMessageItem  `json:"data"`
	Pagination struct {
		Total      int `json:"total"`
		Page       int `json:"page"`
		Limit      int `json:"limit"`
		TotalPages int `json:"totalPages"`
	} `json:"pagination"`
}

// PushMessageSingleResponse — GET /v1/push/messages/:id
type PushMessageSingleResponse struct {
	Success bool             `json:"success"`
	Data    PushMessageItem  `json:"data"`
}

// CancelPushResponse — POST /v1/push/messages/:id/cancel (OpenAPI: data.push_id, data.status)
type CancelPushResponse struct {
	Success bool `json:"success"`
	Data    struct {
		PushID string `json:"pushId"`
		Status string `json:"status"`
	} `json:"data"`
}
