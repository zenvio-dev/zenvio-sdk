package zenvio

// ========== WhatsApp — POST /v1/whatsapp/send, GET/DELETE/PATCH/POST /v1/whatsapp/:id, instances ==========

// WhatsAppTextPayload — tipo text: payload.message
type WhatsAppTextPayload struct {
	Message string `json:"message"`
}

// WhatsAppMediaPayload — tipo image, video, audio, document: payload.media_url
type WhatsAppMediaPayload struct {
	MediaURL string `json:"media_url"`
}

// WhatsAppLocationPayload — tipo location
type WhatsAppLocationPayload struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

// WhatsAppSendParams — body para POST /v1/whatsapp/send
type WhatsAppSendParams struct {
	InstanceID string      `json:"instance_id"`
	To         []string    `json:"to"`
	Type       string      `json:"type"` // text, image, video, audio, document, location, contact
	Payload    interface{} `json:"payload"`
	Schedule   *struct {
		SendAt string `json:"send_at"`
	} `json:"schedule,omitempty"`
	Options *struct {
		Priority   string `json:"priority,omitempty"`
		MaxRetries int    `json:"max_retries,omitempty"`
	} `json:"options,omitempty"`
}

// WhatsAppSendResponse — resposta do send
type WhatsAppSendResponse struct {
	MessageIDs  []string `json:"message_ids"`
	Status      string   `json:"status"`
	ScheduledAt string   `json:"scheduled_at,omitempty"`
}

// WhatsAppMessageStatus — GET /v1/whatsapp/:messageId
type WhatsAppMessageStatus struct {
	MessageID   string  `json:"message_id"`
	To          string  `json:"to"`
	Type        string  `json:"type"`
	Status      string  `json:"status"`
	ScheduledAt *string `json:"scheduled_at"`
	SentAt      *string `json:"sent_at"`
	DeliveredAt *string `json:"delivered_at"`
	ReadAt      *string `json:"read_at"`
	FailedAt    *string `json:"failed_at"`
	ErrorMessage *string `json:"error_message"`
	ExternalID  *string `json:"external_id"`
	CreatedAt   string  `json:"created_at"`
}

// WhatsAppMessageActionResponse — delete, edit, cancel
type WhatsAppMessageActionResponse struct {
	Success    bool     `json:"success"`
	MessageIDs []string `json:"message_ids"`
	Status     string   `json:"status"`
}

// WhatsAppInstance — item da listagem
type WhatsAppInstance struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	PhoneNumber *string `json:"phone_number"`
	Status      string  `json:"status"`
	CreatedAt   string  `json:"created_at"`
	UpdatedAt   string  `json:"updated_at"`
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
		Instance WhatsAppInstance      `json:"instance"`
		Evolution map[string]interface{} `json:"evolution"`
	} `json:"data"`
}

// WhatsAppInstanceActionResponse — disconnect, delete instance
type WhatsAppInstanceActionResponse struct {
	Success bool   `json:"success"`
	Data    struct {
		InstanceID string `json:"instance_id"`
		Status     string `json:"status"`
	} `json:"data"`
	Message string `json:"message,omitempty"`
}

// ========== SMS — POST /v1/sms/send, GET /v1/sms/:id ==========

// SmsSendParams — body para POST /v1/sms/send
type SmsSendParams struct {
	To      []string `json:"to"`
	Message string   `json:"message"`
	Schedule *struct {
		SendAt string `json:"send_at"`
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
		SmsIDs     []string `json:"sms_ids"`
		ScheduledAt string  `json:"scheduled_at,omitempty"`
	} `json:"data"`
}

// SmsStatusResponse — GET /v1/sms/:id
type SmsStatusResponse struct {
	Success bool `json:"success"`
	Data    struct {
		SmsID       string  `json:"sms_id"`
		To          string  `json:"to"`
		Message     string  `json:"message"`
		Status      string  `json:"status"`
		Provider    *string `json:"provider"`
		ExternalID  *string `json:"external_id"`
		SentAt      *string `json:"sent_at"`
		DeliveredAt *string `json:"delivered_at"`
		FailedAt    *string `json:"failed_at"`
		ScheduledFor *string `json:"scheduled_for"`
		ErrorMessage *string `json:"error_message"`
		CreatedAt   string  `json:"created_at"`
	} `json:"data"`
}

// ========== Email — POST /v1/email/send, GET /v1/email/:id, POST /v1/email/:id/cancel ==========

// EmailSendParams — body para POST /v1/email/send (campo "from" na API)
type EmailSendParams struct {
	From     string   `json:"from"`
	FromName string   `json:"from_name,omitempty"`
	To       []string `json:"to"`
	Subject  string   `json:"subject"`
	Text     string   `json:"text,omitempty"`
	HTML     string   `json:"html,omitempty"`
	Schedule *struct {
		SendAt string `json:"send_at"`
	} `json:"schedule,omitempty"`
	Options *struct {
		Priority string `json:"priority,omitempty"`
	} `json:"options,omitempty"`
}

// EmailSendResponse — resposta do send
type EmailSendResponse struct {
	Success bool `json:"success"`
	Data    struct {
		EmailIDs    []string `json:"email_ids"`
		Status      string   `json:"status"`
		Count       int      `json:"count"`
		ScheduledAt string   `json:"scheduled_at,omitempty"`
	} `json:"data"`
}

// EmailStatusResponse — GET /v1/email/:id
type EmailStatusResponse struct {
	Success bool `json:"success"`
	Data    struct {
		ID           string  `json:"id"`
		To           string  `json:"to"`
		From         string  `json:"from"`
		FromName     *string `json:"from_name"`
		Subject      string  `json:"subject"`
		Status       string  `json:"status"`
		ExternalID   *string `json:"external_id"`
		ScheduledFor  *string `json:"scheduled_for"`
		SentAt       *string `json:"sent_at"`
		DeliveredAt  *string `json:"delivered_at"`
		FailedAt     *string `json:"failed_at"`
		ErrorMessage *string `json:"error_message"`
		CreatedAt    string  `json:"created_at"`
	} `json:"data"`
}

// EmailCancelResponse — POST /v1/email/:id/cancel
type EmailCancelResponse struct {
	Success bool `json:"success"`
	Data    struct {
		EmailID string `json:"email_id"`
		Status  string `json:"status"`
	} `json:"data"`
}

// ========== Messages (templates) — POST /v1/templates/send ==========

// MessagesSendParams — body para POST /v1/templates/send
type MessagesSendParams struct {
	To         []string               `json:"to"`
	Template   string                 `json:"template"`
	Variables  map[string]interface{} `json:"variables,omitempty"`
	Channels   []string               `json:"channels"` // whatsapp, sms, email
	InstanceID string                 `json:"instance_id,omitempty"`
	From       string                 `json:"from,omitempty"`
	FromName   string                 `json:"from_name,omitempty"`
}

// MessagesSendResponse — resposta do templates/send
type MessagesSendResponse struct {
	Success bool `json:"success"`
	Data    struct {
		MessageIDs []string `json:"message_ids,omitempty"`
		SmsIDs     []string `json:"sms_ids,omitempty"`
		EmailIDs   []string `json:"email_ids,omitempty"`
		Status     string   `json:"status"`
		Count      int      `json:"count"`
	} `json:"data"`
}
