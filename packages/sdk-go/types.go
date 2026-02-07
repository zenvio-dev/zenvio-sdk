package zenvio

// MessageType represents the various types of messages supported by Zenvio.
type MessageType string

const (
	TypeText     MessageType = "text"
	TypeImage    MessageType = "image"
	TypeDocument MessageType = "document"
	TypeAudio    MessageType = "audio"
	TypeVideo    MessageType = "video"
	TypeButtons  MessageType = "buttons"
	TypeList     MessageType = "list"
	TypeTemplate MessageType = "template"
)

// TextPayload refers to a simple text message.
type TextPayload struct {
	Text string `json:"text"`
}

// MediaPayload refers to image, document, audio, or video messages.
type MediaPayload struct {
	URL      string `json:"url"`
	Caption  string `json:"caption,omitempty"`
	Filename string `json:"filename,omitempty"`
}

// Button represents an interactive button for WhatsApp messages.
type Button struct {
	ID    string `json:"id"`
	Label string `json:"label"`
}

// ButtonsPayload refers to interactive button messages.
type ButtonsPayload struct {
	Body    string   `json:"body"`
	Buttons []Button `json:"buttons"`
}

// ListPayload refers to interactive list messages.
type ListPayload struct {
	Body     string        `json:"body"`
	Title    string        `json:"title,omitempty"`
	Sections []interface{} `json:"sections"`
}

// TemplatePayload refers to WhatsApp message templates.
type TemplatePayload struct {
	Key       string   `json:"key"`
	Language  string   `json:"language"`
	Variables []string `json:"variables,omitempty"`
}

// ScheduleParams defines optional scheduling details.
type ScheduleParams struct {
	SendAt   string `json:"sendAt"`   // ISO-8601
	Timezone string `json:"timezone,omitempty"` // e.g. "America/Sao_Paulo"
}

// OptionsParams defines processing options for the message.
type OptionsParams struct {
	Priority    string `json:"priority,omitempty"` // low, normal, high
	RetryOnFail bool   `json:"retryOnFail,omitempty"`
	MaxRetries  int    `json:"maxRetries,omitempty"`
}

// WebhookParams defines optional per-message webhook settings.
type WebhookParams struct {
	URL    string   `json:"url"`
	Events []string `json:"events,omitempty"`
}

// SendParams defines the full contract for sending a message.
type SendParams struct {
	To       []string               `json:"to"`
	Type     MessageType            `json:"type"`
	Payload  interface{}            `json:"payload"`
	Schedule *ScheduleParams        `json:"schedule,omitempty"`
	Metadata map[string]interface{} `json:"metadata,omitempty"`
	Options  *OptionsParams         `json:"options,omitempty"`
	Webhook  *WebhookParams         `json:"webhook,omitempty"`
}

// SendResponse defines the structure of the API response.
type SendResponse struct {
	Success   bool   `json:"success"`
	MessageID string `json:"messageId,omitempty"`
	JobID     string `json:"jobId,omitempty"`
	Error     string `json:"error,omitempty"`
}
