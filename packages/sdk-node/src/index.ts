import axios, { AxiosInstance } from 'axios';
import type {
  ZenvioConfig,
  WhatsAppSendParams,
  WhatsAppSendResponse,
  WhatsAppMessageStatus,
  WhatsAppMessageActionResponse,
  WhatsAppInstanceListParams,
  WhatsAppInstanceListResponse,
  WhatsAppCreateInstanceParams,
  WhatsAppCreateInstanceResponse,
  WhatsAppInstanceActionResponse,
  WhatsAppInstance,
  SmsSendParams,
  SmsSendResponse,
  SmsStatusResponse,
  SmsCancelResponse,
  EmailSendParams,
  EmailSendResponse,
  EmailStatusResponse,
  EmailCancelResponse,
  MessagesSendParams,
  MessagesSendResponse,
} from '@zenvio/core';

export * from '@zenvio/core';

function normalizeSendBody(
  instanceId: string,
  params: Omit<WhatsAppSendParams, 'instance_id'>
): Record<string, unknown> {
  return {
    instance_id: instanceId,
    to: params.to,
    type: params.type,
    payload: params.payload,
    ...(params.schedule && { schedule: params.schedule }),
    ...(params.options && { options: params.options }),
  };
}

export class Zenvio {
  private client: AxiosInstance;
  private config: ZenvioConfig;

  constructor(config: ZenvioConfig) {
    this.config = {
      baseUrl: 'https://api.zenvio.com/v1',
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * WhatsApp API (matches POST/GET/DELETE/PATCH /v1/whatsapp/... and /v1/whatsapp/instances/...)
   */
  public whatsapp = {
    /**
     * POST /v1/whatsapp/send — Send one or more messages (1–100 recipients).
     * @param instanceId Instance ID (WhatsApp connection).
     * @param params instance_id is omitted; it is taken from the first argument.
     */
    send: async <T extends WhatsAppSendParams['type']>(
      instanceId: string,
      params: Omit<WhatsAppSendParams<T>, 'instance_id'>
    ): Promise<WhatsAppSendResponse> => {
      const response = await this.client.post<WhatsAppSendResponse>(
        '/whatsapp/send',
        normalizeSendBody(instanceId, params as Omit<WhatsAppSendParams, 'instance_id'>)
      );
      return response.data;
    },

    /**
     * Shortcut: send a text message. Uses payload.message.
     */
    sendText: async (
      instanceId: string,
      to: string | string[],
      text: string
    ): Promise<WhatsAppSendResponse> => {
      return this.whatsapp.send(instanceId, {
        to: Array.isArray(to) ? to : [to],
        type: 'text',
        payload: { message: text },
      });
    },

    /**
     * GET /v1/whatsapp/:messageId — Message status (no success/data wrapper).
     */
    getMessage: async (messageId: string): Promise<WhatsAppMessageStatus> => {
      const response = await this.client.get<WhatsAppMessageStatus>(
        `/whatsapp/${messageId}`
      );
      return response.data;
    },

    /**
     * DELETE /v1/whatsapp/:messageId — Delete message for everyone (revoke).
     */
    deleteMessage: async (
      messageId: string
    ): Promise<WhatsAppMessageActionResponse> => {
      const response = await this.client.delete<WhatsAppMessageActionResponse>(
        `/whatsapp/${messageId}`
      );
      return response.data;
    },

    /**
     * PATCH /v1/whatsapp/:messageId/edit — Edit text of a sent message (text type only).
     */
    editMessage: async (
      messageId: string,
      body: { text: string }
    ): Promise<WhatsAppMessageActionResponse> => {
      const response = await this.client.patch<WhatsAppMessageActionResponse>(
        `/whatsapp/${messageId}/edit`,
        body
      );
      return response.data;
    },

    /**
     * POST /v1/whatsapp/:messageId/cancel — Cancel a queued/scheduled message.
     */
    cancelMessage: async (
      messageId: string
    ): Promise<WhatsAppMessageActionResponse> => {
      const response = await this.client.post<WhatsAppMessageActionResponse>(
        `/whatsapp/${messageId}/cancel`
      );
      return response.data;
    },

    /**
     * GET /v1/whatsapp/instances — List instances (paginated).
     */
    listInstances: async (
      params?: WhatsAppInstanceListParams
    ): Promise<WhatsAppInstanceListResponse> => {
      const response = await this.client.get<WhatsAppInstanceListResponse>(
        '/whatsapp/instances',
        { params }
      );
      return response.data;
    },

    /**
     * GET /v1/whatsapp/instances/:instanceId — Get one instance.
     */
    getInstance: async (
      instanceId: string
    ): Promise<{ success: boolean; data: WhatsAppInstance }> => {
      const response = await this.client.get<{
        success: boolean;
        data: WhatsAppInstance;
      }>(`/whatsapp/instances/${instanceId}`);
      return response.data;
    },

    /**
     * POST /v1/whatsapp/instances — Create instance (returns instance + evolution QR/status).
     */
    createInstance: async (
      params: WhatsAppCreateInstanceParams
    ): Promise<WhatsAppCreateInstanceResponse> => {
      const response = await this.client.post<WhatsAppCreateInstanceResponse>(
        '/whatsapp/instances',
        params
      );
      return response.data;
    },

    /**
     * POST /v1/whatsapp/instances/:instanceId/disconnect — Disconnect (logout).
     */
    disconnectInstance: async (
      instanceId: string
    ): Promise<WhatsAppInstanceActionResponse> => {
      const response = await this.client.post<WhatsAppInstanceActionResponse>(
        `/whatsapp/instances/${instanceId}/disconnect`
      );
      return response.data;
    },

    /**
     * DELETE /v1/whatsapp/instances/:instanceId — Delete instance (must not be ACTIVE).
     */
    deleteInstance: async (
      instanceId: string
    ): Promise<WhatsAppInstanceActionResponse> => {
      const response = await this.client.delete<WhatsAppInstanceActionResponse>(
        `/whatsapp/instances/${instanceId}`
      );
      return response.data;
    },
  };

  /**
   * Envio genérico por template — POST /v1/templates/send.
   * Envia para os canais indicados (whatsapp, sms, email). to pode ser números e/ou e-mails.
   * Se channels incluir 'whatsapp', informe instance_id. Se incluir 'email', informe from.
   */
  public messages = {
    send: async (params: MessagesSendParams): Promise<MessagesSendResponse> => {
      const response = await this.client.post<MessagesSendResponse>(
        '/templates/send',
        params
      );
      return response.data;
    },
  };

  /**
   * SMS API — POST /v1/sms/send, GET /v1/sms/:id, POST /v1/sms/:id/cancel
   */
  public sms = {
    /**
     * POST /v1/sms/send — Envia um ou mais SMS (1–100 números). Escopo: sms:send.
     */
    send: async (params: SmsSendParams): Promise<SmsSendResponse> => {
      const response = await this.client.post<SmsSendResponse>('/sms/send', params);
      return response.data;
    },

    /**
     * GET /v1/sms/:id — Status de um SMS. Escopo: sms:read.
     */
    get: async (id: string): Promise<SmsStatusResponse> => {
      const response = await this.client.get<SmsStatusResponse>(`/sms/${id}`);
      return response.data;
    },

    /**
     * POST /v1/sms/:id/cancel — Cancela SMS agendado (status SCHEDULED). Escopo: sms:cancel.
     */
    cancel: async (id: string): Promise<SmsCancelResponse> => {
      const response = await this.client.post<SmsCancelResponse>(`/sms/${id}/cancel`);
      return response.data;
    },
  };

  /**
   * Email API — POST /v1/email/send, GET /v1/email/:id, POST /v1/email/:id/cancel
   */
  public email = {
    /**
     * POST /v1/email/send — Envia um ou mais e-mails (1–100 destinatários). Domínio do from deve estar verificado. Escopo: email:send.
     */
    send: async (params: EmailSendParams): Promise<EmailSendResponse> => {
      const response = await this.client.post<EmailSendResponse>('/email/send', params);
      return response.data;
    },

    /**
     * GET /v1/email/:id — Status de um e-mail. Escopo: email:read.
     */
    get: async (id: string): Promise<EmailStatusResponse> => {
      const response = await this.client.get<EmailStatusResponse>(`/email/${id}`);
      return response.data;
    },

    /**
     * POST /v1/email/:id/cancel — Cancela e-mail agendado (status SCHEDULED). Escopo: email:cancel.
     */
    cancel: async (id: string): Promise<EmailCancelResponse> => {
      const response = await this.client.post<EmailCancelResponse>(`/email/${id}/cancel`);
      return response.data;
    },
  };

  /**
   * Re-throw axios errors; use in try/catch if you need raw errors.
   * By default methods return data and throw on HTTP errors.
   */
  public getClient(): AxiosInstance {
    return this.client;
  }
}

export default Zenvio;
