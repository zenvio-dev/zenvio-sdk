/* =====================================================
   WhatsApp API — Message types (match API exactly)
   ===================================================== */

export type WhatsAppMessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'location'
  | 'contact';

/* =====================================================
   Payloads per type (API contract)
   ===================================================== */

export interface TextPayload {
  message: string;
}

export interface MediaPayload {
  media_url: string;
  /** Nome do arquivo (obrigatório). */
  file_name: string;
  /** Mimetype (obrigatório), ex: application/pdf, image/png. */
  mimetype: string;
}

export interface LocationPayload {
  latitude: number;
  longitude: number;
  /** Nome do local (obrigatório). */
  name: string;
  /** Endereço do local (obrigatório). */
  address: string;
}

/** Objeto de contato para envio. fullName obrigatório; wuid ou phoneNumber obrigatório. */
export interface ContactPayload {
  fullName: string;
  /** Número só dígitos com DDI (ex.: 5528999999999). */
  wuid?: string;
  /** Número formatado (ex.: +55 28 99999-9999). */
  phoneNumber?: string;
  organization?: string;
  email?: string;
  url?: string;
}

/** Payload para type=contact: objeto contact ou contact_id do workspace. */
export type ContactMessagePayload =
  | { contact: ContactPayload }
  | { contact_id: string };

export type WhatsAppPayloadByType = {
  text: TextPayload;
  image: MediaPayload;
  video: MediaPayload;
  audio: MediaPayload;
  document: MediaPayload;
  location: LocationPayload;
  contact: ContactMessagePayload;
};

/* =====================================================
   Send request (POST /v1/whatsapp/send)
   ===================================================== */

export interface WhatsAppSendParams<T extends WhatsAppMessageType = WhatsAppMessageType> {
  /** Instance ID (WhatsApp connection). */
  instance_id: string;
  /** Recipients E.164 (1–100). One message per number. */
  to: string[];
  type: T;
  payload: WhatsAppPayloadByType[T];
  schedule?: {
    sendAt: string; // ISO 8601, 5 min to 30 days in future
  };
  options?: {
    priority?: 'high' | 'normal' | 'low';
    maxRetries?: number; // 0–5
  };
}

/* =====================================================
   Send response (202)
   ===================================================== */

export interface WhatsAppSendResponse {
  message_ids: string[];
  status: 'queued' | 'scheduled';
  scheduled_at?: string; // ISO 8601 when scheduled
}

/* =====================================================
   Message status (GET /v1/whatsapp/:messageId)
   ===================================================== */

export interface WhatsAppMessageStatus {
  message_id: string;
  to: string;
  type: string;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  failed_at: string | null;
  error_message: string | null;
  external_id: string | null;
  created_at: string;
}

/* =====================================================
   Message actions (delete, edit, cancel)
   ===================================================== */

export interface WhatsAppMessageActionResponse {
  success: boolean;
  message_ids: string[];
  status: 'deleted' | 'edited' | 'cancelled';
}

/* =====================================================
   Instances
   ===================================================== */

export interface WhatsAppInstance {
  id: string;
  name: string;
  phoneNumber: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppInstanceListParams {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
}

export interface WhatsAppInstanceListResponse {
  success: boolean;
  data: WhatsAppInstance[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface WhatsAppCreateInstanceParams {
  name: string; // 3–1024 chars
}

export interface WhatsAppCreateInstanceResponse {
  success: boolean;
  data: {
    instance: Pick<WhatsAppInstance, 'id' | 'name' | 'status' | 'phoneNumber' | 'createdAt'>;
    evolution: Record<string, unknown>; // QR / pairingCode / status
  };
}

export interface WhatsAppInstanceActionResponse {
  success: boolean;
  data: { instance_id: string; status: string };
  message?: string;
}

/* =====================================================
   Config & legacy aliases (for backwards compat)
   ===================================================== */

export interface ZenvioConfig {
  apiKey: string;
  baseUrl?: string;
}

/** @deprecated Use WhatsAppMessageType */
export type MessageType = WhatsAppMessageType;

/** @deprecated Use WhatsAppSendParams */
export type SendParams<T extends WhatsAppMessageType = WhatsAppMessageType> = WhatsAppSendParams<T>;

/** @deprecated Use WhatsAppSendResponse */
export interface SendResponse {
  success?: boolean;
  message_ids?: string[];
  messageId?: string;
  status?: string;
  scheduled_at?: string;
  error?: string;
}

/* =====================================================
   SMS API (POST /v1/sms/send, GET /v1/sms/:id)
   ===================================================== */

export interface SmsSendParams {
  /** Números E.164 (1–100). Um SMS por número. */
  to: string[];
  /** Texto do SMS (máx. 160 caracteres). */
  message: string;
  schedule?: {
    sendAt: string; // ISO 8601
  };
  options?: {
    priority?: 'high' | 'normal' | 'low';
  };
}

export interface SmsSendResponse {
  success: boolean;
  data: {
    status: 'queued' | 'scheduled';
    count: number;
    sms_ids: string[];
    scheduled_at?: string; // ISO 8601 quando agendado
  };
}

export interface SmsStatus {
  sms_id: string;
  to: string;
  message: string;
  status: 'SCHEDULED' | 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED';
  provider: string | null;
  external_id: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  failed_at: string | null;
  scheduled_for: string | null;
  error_message: string | null;
  created_at: string;
}

export interface SmsStatusResponse {
  success: boolean;
  data: SmsStatus;
}

export interface SmsCancelResponse {
  success: boolean;
  data: {
    sms_id: string;
    status: 'cancelled';
  };
}

/* =====================================================
   Email API (POST /v1/email/send, GET /v1/email/:id, POST /v1/email/:id/cancel)
   ===================================================== */

export interface EmailSendParams {
  /** Remetente (domínio deve estar verificado no workspace). */
  from: string;
  fromName?: string;
  /** Destinatários (1–100). Um e-mail por endereço. */
  to: string[];
  subject: string;
  /** Pelo menos um de text ou html. */
  text?: string;
  html?: string;
  schedule?: {
    sendAt: string; // ISO 8601
  };
  options?: {
    priority?: 'high' | 'normal' | 'low';
  };
}

export interface EmailSendResponse {
  success: boolean;
  data: {
    email_ids: string[];
    status: 'queued' | 'scheduled';
    count: number;
    scheduled_at?: string; // ISO 8601 quando agendado
  };
}

export interface EmailStatus {
  id: string;
  to: string;
  from: string;
  fromName: string | null;
  subject: string;
  status: 'SCHEDULED' | 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
  externalId: string | null;
  scheduledFor: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  failedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
}

export interface EmailStatusResponse {
  success: boolean;
  data: EmailStatus;
}

export interface EmailCancelResponse {
  success: boolean;
  data: {
    email_id: string;
    status: 'cancelled';
  };
}

/* =====================================================
   Messages (template) — POST /v1/templates/send
   Envio genérico por template em múltiplos canais.
   ===================================================== */

export type TemplateChannel = 'whatsapp' | 'sms' | 'email';

/** Parâmetros iguais em todos os SDKs: to, template, variables?, channels, instance_id?, from?, fromName? */
export interface MessagesSendParams {
  /** Destinatários: números E.164 (WhatsApp/SMS) e/ou e-mails (Email). Máx. 100. */
  to: string[];
  /** Nome ou ID (cuid) do template. */
  template: string;
  /** Variáveis do template (ex.: { name: 'Trial', credits: 300 }). Valores podem ser string ou number. */
  variables?: Record<string, string | number>;
  /** Canais para envio: whatsapp (números), sms (números), email (e-mails). */
  channels: TemplateChannel[];
  /** Obrigatório se channels incluir 'whatsapp'. ID da instância WhatsApp. */
  instance_id?: string;
  /** Obrigatório se channels incluir 'email'. Remetente (domínio verificado). */
  from?: string;
  /** Nome do remetente (opcional, para email). */
  fromName?: string;
}

export interface MessagesSendResponse {
  success: boolean;
  data: {
    /** IDs das mensagens WhatsApp (se canal whatsapp). */
    message_ids?: string[];
    /** IDs dos SMS (se canal sms). */
    sms_ids?: string[];
    /** IDs dos e-mails (se canal email). */
    email_ids?: string[];
    status: 'queued';
    /** Total de envios (mensagens + SMS + e-mails). */
    count: number;
  };
}
