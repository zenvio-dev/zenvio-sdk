/* =====================================================
   API Error — erros da API retornados pelo SDK em formato legível
   ===================================================== */

export class NotifiqueApiError extends Error {
  /** HTTP status (ex: 401, 404). */
  readonly statusCode: number;
  /** Código de erro (ex: ERR_BAD_REQUEST). */
  readonly code?: string;
  /** Corpo da resposta quando disponível. */
  readonly responseData?: unknown;

  constructor(
    message: string,
    statusCode: number,
    opts?: { code?: string; responseData?: unknown }
  ) {
    super(message);
    this.name = 'NotifiqueApiError';
    this.statusCode = statusCode;
    this.code = opts?.code;
    this.responseData = opts?.responseData;
    Object.setPrototypeOf(this, NotifiqueApiError.prototype);
  }
}

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
  mediaUrl: string;
  /** Nome do arquivo (obrigatório). */
  fileName: string;
  /** Mimetype (obrigatório), ex: application/pdf, image/png. */
  mimetype: string;
  /** Legenda opcional para image, video, audio ou document (OpenAPI). */
  caption?: string;
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

/** Payload para type=contact: objeto contact ou contactId do workspace. */
export type ContactMessagePayload =
  | { contact: ContactPayload }
  | { contactId: string };

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
   Send request (POST /v1/whatsapp/messages)
   ===================================================== */

export interface WhatsAppSendParams<T extends WhatsAppMessageType = WhatsAppMessageType> {
  /** Instance ID (WhatsApp connection). */
  instanceId: string;
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
    /**
     * Webhook dedicado por mensagem. Quando informado, TODOS os eventos desta mensagem
     * serão entregues somente para esta URL (ignorando webhooks do workspace).
     */
    webhook?: {
      url: string;
      /** Opcional. Se omitido, o backend usa secret vazio. */
      secret?: string;
    };
    /**
     * Texto de resposta automática. Quando a mensagem for marcada como RESPONDED internamente,
     * o backend enviará uma nova mensagem WhatsApp para o mesmo número com este texto (1x).
     */
    autoReplyText?: string;
    /**
     * Canal de fallback (máx. 1). Em falha final do WhatsApp, o backend tenta enviar pelo canal marcado.
     * v1: apenas SMS é suportado.
     */
    fallback?: { channel: 'sms' };
  };
}

/* =====================================================
   Send response (202)
   ===================================================== */

/** Resposta de POST /v1/whatsapp/messages (202). Status em MAIÚSCULO conforme OpenAPI. */
export interface WhatsAppSendResponse {
  messageIds: string[];
  status: 'QUEUED' | 'SCHEDULED';
  scheduledAt?: string | null;
}

/* =====================================================
   Message status (GET /v1/whatsapp/messages/:messageId)
   ===================================================== */

/** Dados de status da mensagem WhatsApp (camelCase). */
export interface WhatsAppMessageStatus {
  messageId: string;
  to: string;
  type: string;
  status: string;
  scheduledAt: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
}

/* =====================================================
   Message actions (delete, edit, cancel) — OpenAPI MessageActionResponse
   Resposta: envelope { success, data: { message_id, status } }
   ===================================================== */

export interface WhatsAppMessageActionResponse {
  success: boolean;
  data: {
    messageId: string;
    status: 'CANCELLED' | 'DELETED' | 'EDITED';
  };
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
    connection: Record<string, unknown>; // QR base64 / code / pairingCode / count
  };
}

export interface WhatsAppInstanceActionResponse {
  success: boolean;
  data: { instanceId: string; status: string };
  message?: string;
}

/** Params for GET /v1/whatsapp/messages (list messages). */
export interface WhatsAppListMessagesParams {
  page?: string;
  limit?: string;
  fromDate?: string;
  toDate?: string;
  instanceIds?: string;
  status?: string;
  type?: string;
  includeEvents?: string;
}

export interface WhatsAppListMessagesResponse {
  success: boolean;
  data: Record<string, unknown>[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** Response for GET /v1/whatsapp/instances/:instanceId/qr. */
export interface WhatsAppInstanceQrResponse {
  success: boolean;
  data: {
    status: string;
    base64: string | null;
  };
}

/* =====================================================
   Config & legacy aliases (for backwards compat)
   ===================================================== */

export interface NotifiqueConfig {
  apiKey: string;
  baseUrl?: string;
}

/** Opções para requisições de envio. IdempotencyKey envia o header Idempotency-Key (e x-idempotency-key) conforme OpenAPI (email, sms, push, whatsapp). */
export interface SendOptions {
  /** Chave única para evitar envio duplicado (header Idempotency-Key / x-idempotency-key). */
  idempotencyKey?: string;
}

/** OpenAPI ErrorResponse — 4xx/5xx; usado quando a API retorna success: false. */
export interface ErrorResponse {
  success: false;
  error?: string;
  message?: string;
  code?: string;
  details?: Array<{ field?: string; message?: string }>;
  data?: Record<string, unknown>;
}

/** @deprecated Use WhatsAppMessageType */
export type MessageType = WhatsAppMessageType;

/** @deprecated Use WhatsAppSendParams */
export type SendParams<T extends WhatsAppMessageType = WhatsAppMessageType> = WhatsAppSendParams<T>;

/** @deprecated Use WhatsAppSendResponse */
export interface SendResponse {
  success?: boolean;
  messageIds?: string[];
  messageId?: string;
  status?: string;
  scheduledAt?: string;
  error?: string;
}

/* =====================================================
   SMS API (POST /v1/sms/messages, GET /v1/sms/messages/:id)
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

/** Resposta de envio SMS (202). Padrão: status MAIÚSCULO, demais campos camelCase. */
export interface SmsSendResponse {
  success: boolean;
  data: {
    status: 'QUEUED' | 'SCHEDULED';
    count: number;
    smsIds: string[];
    scheduledAt?: string;
  };
}

/** Dados de status de SMS (camelCase). */
export interface SmsStatus {
  smsId: string;
  to: string;
  message: string;
  status: 'SCHEDULED' | 'QUEUED' | 'SENT' | 'PROCESSING' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
  sentAt: string | null;
  deliveredAt: string | null;
  failedAt: string | null;
  scheduledFor: string | null;
  errorMessage: string | null;
  createdAt: string;
}

export interface SmsStatusResponse {
  success: boolean;
  data: SmsStatus;
}

/** Resposta de cancelamento SMS (camelCase). */
export interface SmsCancelResponse {
  success: boolean;
  data: {
    smsId: string;
    status: 'CANCELLED';
  };
}

/* =====================================================
   Email API (POST /v1/email/messages, GET /v1/email/messages/:id, POST /v1/email/messages/:id/cancel)
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

/** Resposta de envio e-mail (202). Padrão: status MAIÚSCULO, demais camelCase. */
export interface EmailSendResponse {
  success: boolean;
  data: {
    emailIds: string[];
    status: 'QUEUED' | 'SCHEDULED';
    count: number;
    scheduledAt?: string;
  };
}

export interface EmailStatus {
  id: string;
  to: string;
  from: string;
  fromName: string | null;
  subject: string;
  status: 'SCHEDULED' | 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED' | 'CANCELLED';
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

/** Resposta de cancelamento e-mail (camelCase). */
export interface EmailCancelResponse {
  success: boolean;
  data: {
    emailId: string;
    status: 'CANCELLED';
  };
}

/* =====================================================
   Email Domains (GET/POST /v1/email/domains, GET /v1/email/domains/:id, POST /v1/email/domains/:id/verify)
   ===================================================== */

export interface EmailDomainItem {
  id: string;
  domain: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  dnsRecords?: { type: string; name: string; value: string }[];
  verifiedAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ListEmailDomainsResponse {
  success: boolean;
  data: EmailDomainItem[];
}

export interface CreateEmailDomainRequest {
  domain: string;
}

export interface CreateEmailDomainResponse {
  success: boolean;
  data: EmailDomainItem;
  message?: string;
}

export interface GetEmailDomainResponse {
  success: boolean;
  data: EmailDomainItem;
}

export interface VerifyEmailDomainResponse {
  success: boolean;
  data: EmailDomainItem;
  verified: boolean;
}

/* =====================================================
   Messages (template) — POST /v1/templates/send
   Envio genérico por template em múltiplos canais.
   ===================================================== */

export type TemplateChannel = 'whatsapp' | 'sms' | 'email';

/** Parâmetros iguais em todos os SDKs: to, template, variables?, channels, instanceId?, from?, fromName? */
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
  instanceId?: string;
  /** Obrigatório se channels incluir 'email'. Remetente (domínio verificado). */
  from?: string;
  /** Nome do remetente (opcional, para email). */
  fromName?: string;
}

export interface MessagesSendResponse {
  success: boolean;
  data: {
    /** IDs das mensagens WhatsApp (se canal whatsapp). */
    messageIds?: string[];
    /** IDs dos SMS (se canal sms). */
    smsIds?: string[];
    /** IDs dos e-mails (se canal email). */
    emailIds?: string[];
    status: 'queued';
    /** Total de envios (mensagens + SMS + e-mails). */
    count: number;
  };
}

/* =====================================================
   Push API — Apps, Devices, Messages
   ===================================================== */

export interface PushAppCreateRequest {
  name: string;
}

export interface PushAppUpdateRequest {
  name?: string;
  vapid_public_key?: string;
  vapid_private_key?: string;
  allowed_origins?: string[];
  prompt_config?: Record<string, unknown>;
  fcm_project_id?: string;
  fcm_service_account_json?: string;
  apns_key_id?: string;
  apns_team_id?: string;
  apns_bundle_id?: string;
  apns_key_p8?: string;
}

export interface PushAppItem {
  id: string;
  name: string;
  workspaceId: string;
  vapidPublicKey: string | null;
  hasVapidPrivate: boolean;
  hasFcm: boolean;
  hasApns: boolean;
  allowedOrigins: string[];
  promptConfig: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

/** Params for GET /v1/push/apps — OpenAPI page (default 1), limit (default 20, max 100). */
export interface PushAppListParams {
  page?: number;
  limit?: number;
}

export interface PushAppListResponse {
  success: boolean;
  data: PushAppItem[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export interface PushAppSingleResponse {
  success: boolean;
  data: PushAppItem;
}

export interface PushDeviceRegisterRequest {
  appId: string;
  platform: 'web' | 'android' | 'ios';
  subscription?: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };
  token?: string;
  externalUserId?: string;
}

export interface PushDeviceItem {
  id: string;
  appId: string;
  platform: string;
  externalUserId: string | null;
  createdAt: string;
}

/** Params for GET /v1/push/devices (camelCase). */
export interface PushDeviceListParams {
  page?: number;
  limit?: number;
  appId?: string;
  platform?: 'web' | 'android' | 'ios';
}

export interface PushDeviceListResponse {
  success: boolean;
  data: PushDeviceItem[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export interface PushDeviceSingleResponse {
  success: boolean;
  data: PushDeviceItem;
}

export interface SendPushParams {
  to: string[];
  title?: string;
  body?: string;
  url?: string;
  icon?: string;
  image?: string;
  data?: Record<string, unknown>;
  schedule?: { sendAt: string };
  options?: { priority?: 'high' | 'normal' | 'low' };
}

export interface SendPushResponse {
  success: boolean;
  data: {
    status: 'QUEUED' | 'SCHEDULED';
    count: number;
    pushIds: string[];
    scheduledAt?: string;
  };
}

/** Status do envio push — OpenAPI GET /v1/push/messages (query). */
export type PushMessageStatus =
  | 'QUEUED'
  | 'SCHEDULED'
  | 'SENT'
  | 'DELIVERED'
  | 'CLICKED'
  | 'FAILED'
  | 'CANCELLED';

/** Params for GET /v1/push/messages (camelCase). */
export interface PushMessageListParams {
  page?: number;
  limit?: number;
  status?: PushMessageStatus;
  appId?: string;
}

export interface PushMessageItem {
  id: string;
  deviceId: string;
  appId: string;
  title: string;
  body: string;
  status: string;
  scheduledFor: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  failedAt: string | null;
  errorMessage: string | null;
  clickedAt: string | null;
  createdAt: string;
}

export interface PushMessageListResponse {
  success: boolean;
  data: PushMessageItem[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export interface PushMessageSingleResponse {
  success: boolean;
  data: PushMessageItem;
}

export interface CancelPushResponse {
  success: boolean;
  data: { pushId: string; status: 'CANCELLED' };
}
