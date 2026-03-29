import axios, { AxiosInstance } from 'axios';
import { NotifiqueApiError } from '@notifique/core';
import type {
  NotifiqueConfig,
  SendOptions,
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
  WhatsAppListMessagesParams,
  WhatsAppListMessagesResponse,
  WhatsAppInstanceQrResponse,
  SmsSendParams,
  SmsSendResponse,
  SmsStatusResponse,
  SmsCancelResponse,
  EmailSendParams,
  EmailSendResponse,
  EmailStatusResponse,
  EmailCancelResponse,
  ListEmailDomainsResponse,
  CreateEmailDomainRequest,
  CreateEmailDomainResponse,
  GetEmailDomainResponse,
  VerifyEmailDomainResponse,
  MessagesSendParams,
  MessagesSendResponse,
  PushAppCreateRequest,
  PushAppUpdateRequest,
  PushAppListParams,
  PushAppListResponse,
  PushAppSingleResponse,
  PushDeviceRegisterRequest,
  PushDeviceListParams,
  PushDeviceListResponse,
  PushDeviceSingleResponse,
  SendPushParams,
  SendPushResponse,
  PushMessageListParams,
  PushMessageListResponse,
  PushMessageSingleResponse,
  CancelPushResponse,
} from '@notifique/core';

export { NotifiqueApiError } from '@notifique/core';
export * from '@notifique/core';

function assertSecureBaseUrl(baseUrl: string): void {
  let parsed: URL;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error('Notifique: baseUrl must be a valid absolute URL');
  }
  if (parsed.protocol !== 'https:') {
    throw new Error('Notifique: baseUrl must use HTTPS');
  }
}

function pathSegment(value: string): string {
  return encodeURIComponent(value);
}

/** Converte chaves snake_case em camelCase (recursivo). A API retorna snake_case; o SDK expõe camelCase. */
function toCamelCase<T>(value: unknown): T {
  if (value === null || value === undefined) return value as T;
  if (Array.isArray(value)) return value.map((item) => toCamelCase(item)) as T;
  if (typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      out[camel] = toCamelCase(v);
    }
    return out as T;
  }
  return value as T;
}

function normalizeSendBody(
  instanceId: string,
  params: Omit<WhatsAppSendParams, 'instanceId'>
): Record<string, unknown> {
  return {
    instanceId,
    to: params.to,
    type: params.type,
    payload: params.payload,
    ...(params.schedule && { schedule: params.schedule }),
    ...(params.options && { options: params.options }),
  };
}

/** Returns axios request config with idempotency headers, or undefined if no key provided. */
function idempotencyConfig(opts?: SendOptions): { headers: Record<string, string> } | undefined {
  if (!opts?.idempotencyKey) return undefined;
  return {
    headers: {
      'Idempotency-Key': opts.idempotencyKey,
      'x-idempotency-key': opts.idempotencyKey,
    },
  };
}

export class Notifique {
  private client: AxiosInstance;
  private config: NotifiqueConfig;

  constructor(config: NotifiqueConfig) {
    if (!config?.apiKey || typeof config.apiKey !== 'string' || config.apiKey.trim() === '') {
      throw new Error('Notifique: apiKey must be a non-empty string');
    }
    const candidateBaseUrl = config.baseUrl ?? 'https://api.notifique.dev/v1';
    assertSecureBaseUrl(candidateBaseUrl);
    this.config = {
      baseUrl: candidateBaseUrl,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: 30_000,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.response.use(
      (response) => {
        if (response.data !== undefined) {
          response.data = toCamelCase(response.data);
        }
        return response;
      },
      (error) => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status ?? 0;
          const data = error.response?.data as Record<string, unknown> | undefined;
          let message =
            (typeof data === 'object' && data !== null && 'message' in data && typeof (data as { message?: unknown }).message === 'string')
              ? (data as { message: string }).message
              : error.message;
          const details = typeof data === 'object' && data !== null && Array.isArray(data.details) ? data.details : undefined;
          if (details && details.length > 0) {
            const parts = (details as Array<{ field?: string; message?: string }>).map((d) => (d.field ? `${d.field}: ${d.message ?? ''}` : String(d.message ?? '')));
            if (parts.length) message = `${message} (${parts.join('; ')})`;
          }
          throw new NotifiqueApiError(message, status, {
            code: error.code,
            responseData: data,
          });
        }
        throw error;
      }
    );
  }

  /**
   * WhatsApp API — POST/GET/DELETE/PATCH /v1/whatsapp/messages e /v1/whatsapp/instances
   */
  public whatsapp = {
    /** POST /v1/whatsapp/messages — Envia uma ou mais mensagens (1–100 destinatários). opts.idempotencyKey envia header Idempotency-Key. */
    send: async <T extends WhatsAppSendParams['type']>(
      instanceId: string,
      params: Omit<WhatsAppSendParams<T>, 'instanceId'>,
      opts?: SendOptions
    ): Promise<{ success: boolean; data: WhatsAppSendResponse }> => {
      const response = await this.client.post<{ success: boolean; data: WhatsAppSendResponse }>(
        '/whatsapp/messages',
        normalizeSendBody(instanceId, params as Omit<WhatsAppSendParams, 'instanceId'>),
        idempotencyConfig(opts)
      );
      return response.data;
    },

    /** Atalho: envia mensagem de texto. opts.idempotencyKey envia header Idempotency-Key. */
    sendText: async (
      instanceId: string,
      to: string | string[],
      text: string,
      opts?: SendOptions
    ): Promise<{ success: boolean; data: WhatsAppSendResponse }> => {
      return this.whatsapp.send(
        instanceId,
        { to: Array.isArray(to) ? to : [to], type: 'text', payload: { message: text } },
        opts
      );
    },

    /** GET /v1/whatsapp/messages — Lista mensagens com paginação. */
    listMessages: async (
      params?: WhatsAppListMessagesParams
    ): Promise<WhatsAppListMessagesResponse> => {
      const response = await this.client.get<WhatsAppListMessagesResponse>(
        '/whatsapp/messages',
        { params }
      );
      return response.data;
    },

    /** GET /v1/whatsapp/messages/:messageId — Status de uma mensagem. */
    getMessage: async (
      messageId: string
    ): Promise<{ success: boolean; data: WhatsAppMessageStatus }> => {
      const response = await this.client.get<{ success: boolean; data: WhatsAppMessageStatus }>(
        `/whatsapp/messages/${pathSegment(messageId)}`
      );
      return response.data;
    },

    /** DELETE /v1/whatsapp/messages/:messageId — Apaga mensagem para todos. */
    deleteMessage: async (
      messageId: string
    ): Promise<WhatsAppMessageActionResponse> => {
      const response = await this.client.delete<WhatsAppMessageActionResponse>(
        `/whatsapp/messages/${pathSegment(messageId)}`
      );
      return response.data;
    },

    /** PATCH /v1/whatsapp/messages/:messageId/edit — Edita texto de mensagem enviada. */
    editMessage: async (
      messageId: string,
      body: { text: string }
    ): Promise<WhatsAppMessageActionResponse> => {
      const response = await this.client.patch<WhatsAppMessageActionResponse>(
        `/whatsapp/messages/${pathSegment(messageId)}/edit`,
        body
      );
      return response.data;
    },

    /** POST /v1/whatsapp/messages/:messageId/cancel — Cancela mensagem agendada. */
    cancelMessage: async (
      messageId: string
    ): Promise<WhatsAppMessageActionResponse> => {
      const response = await this.client.post<WhatsAppMessageActionResponse>(
        `/whatsapp/messages/${pathSegment(messageId)}/cancel`
      );
      return response.data;
    },

    /** GET /v1/whatsapp/instances — Lista instâncias (paginado). */
    listInstances: async (
      params?: WhatsAppInstanceListParams
    ): Promise<WhatsAppInstanceListResponse> => {
      const response = await this.client.get<WhatsAppInstanceListResponse>(
        '/whatsapp/instances',
        { params }
      );
      return response.data;
    },

    /** GET /v1/whatsapp/instances/:instanceId — Obtém uma instância. */
    getInstance: async (
      instanceId: string
    ): Promise<{ success: boolean; data: WhatsAppInstance }> => {
      const response = await this.client.get<{
        success: boolean;
        data: WhatsAppInstance;
      }>(`/whatsapp/instances/${pathSegment(instanceId)}`);
      return response.data;
    },

    /** GET /v1/whatsapp/instances/:instanceId/qr — Obtém QR code atual da instância. */
    getInstanceQr: async (
      instanceId: string
    ): Promise<WhatsAppInstanceQrResponse> => {
      const response = await this.client.get<WhatsAppInstanceQrResponse>(
        `/whatsapp/instances/${pathSegment(instanceId)}/qr`
      );
      return response.data;
    },

    /** POST /v1/whatsapp/instances — Cria instância (retorna instance + connection QR). */
    createInstance: async (
      params: WhatsAppCreateInstanceParams
    ): Promise<WhatsAppCreateInstanceResponse> => {
      const response = await this.client.post<WhatsAppCreateInstanceResponse>(
        '/whatsapp/instances',
        params
      );
      return response.data;
    },

    /** POST /v1/whatsapp/instances/:instanceId/disconnect — Desconecta instância. */
    disconnectInstance: async (
      instanceId: string
    ): Promise<WhatsAppInstanceActionResponse> => {
      const response = await this.client.post<WhatsAppInstanceActionResponse>(
        `/whatsapp/instances/${pathSegment(instanceId)}/disconnect`
      );
      return response.data;
    },

    /** DELETE /v1/whatsapp/instances/:instanceId — Remove instância (não pode estar ACTIVE). */
    deleteInstance: async (
      instanceId: string
    ): Promise<WhatsAppInstanceActionResponse> => {
      const response = await this.client.delete<WhatsAppInstanceActionResponse>(
        `/whatsapp/instances/${pathSegment(instanceId)}`
      );
      return response.data;
    },
  };

  /**
   * Envio por template — POST /v1/templates/send (whatsapp, sms, email).
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
   * SMS API — POST /v1/sms/messages, GET /v1/sms/messages/:id, POST /v1/sms/messages/:id/cancel
   */
  public sms = {
    /** opts.idempotencyKey envia header Idempotency-Key. */
    send: async (params: SmsSendParams, opts?: SendOptions): Promise<SmsSendResponse> => {
      const response = await this.client.post<SmsSendResponse>(
        '/sms/messages',
        params,
        idempotencyConfig(opts)
      );
      return response.data;
    },
    get: async (id: string): Promise<SmsStatusResponse> => {
      const response = await this.client.get<SmsStatusResponse>(`/sms/messages/${pathSegment(id)}`);
      return response.data;
    },
    cancel: async (id: string): Promise<SmsCancelResponse> => {
      const response = await this.client.post<SmsCancelResponse>(`/sms/messages/${pathSegment(id)}/cancel`);
      return response.data;
    },
  };

  /**
   * Email API — mensagens e domínios
   */
  public email = {
    /** opts.idempotencyKey envia header Idempotency-Key. */
    send: async (params: EmailSendParams, opts?: SendOptions): Promise<EmailSendResponse> => {
      const response = await this.client.post<EmailSendResponse>(
        '/email/messages',
        params,
        idempotencyConfig(opts)
      );
      return response.data;
    },
    get: async (id: string): Promise<EmailStatusResponse> => {
      const response = await this.client.get<EmailStatusResponse>(`/email/messages/${pathSegment(id)}`);
      return response.data;
    },
    cancel: async (id: string): Promise<EmailCancelResponse> => {
      const response = await this.client.post<EmailCancelResponse>(`/email/messages/${pathSegment(id)}/cancel`);
      return response.data;
    },
    /** GET /v1/email/domains — Lista domínios de e-mail. */
    domains: {
      list: async (): Promise<ListEmailDomainsResponse> => {
        const response = await this.client.get<ListEmailDomainsResponse>('/email/domains');
        return response.data;
      },
      create: async (
        params: CreateEmailDomainRequest
      ): Promise<CreateEmailDomainResponse> => {
        const response = await this.client.post<CreateEmailDomainResponse>(
          '/email/domains',
          params
        );
        return response.data;
      },
      get: async (id: string): Promise<GetEmailDomainResponse> => {
        const response = await this.client.get<GetEmailDomainResponse>(
          `/email/domains/${pathSegment(id)}`
        );
        return response.data;
      },
      verify: async (id: string): Promise<VerifyEmailDomainResponse> => {
        const response = await this.client.post<VerifyEmailDomainResponse>(
          `/email/domains/${pathSegment(id)}/verify`
        );
        return response.data;
      },
    },
  };

  /**
   * Push API — apps, dispositivos e mensagens
   */
  public push = {
    apps: {
      list: async (params?: PushAppListParams): Promise<PushAppListResponse> => {
        const response = await this.client.get<PushAppListResponse>(
          '/push/apps',
          { params }
        );
        return response.data;
      },
      get: async (id: string): Promise<PushAppSingleResponse> => {
        const response = await this.client.get<PushAppSingleResponse>(
          `/push/apps/${pathSegment(id)}`
        );
        return response.data;
      },
      create: async (
        params: PushAppCreateRequest
      ): Promise<PushAppSingleResponse> => {
        const response = await this.client.post<PushAppSingleResponse>(
          '/push/apps',
          params
        );
        return response.data;
      },
      update: async (
        id: string,
        params: PushAppUpdateRequest
      ): Promise<PushAppSingleResponse> => {
        const response = await this.client.put<PushAppSingleResponse>(
          `/push/apps/${pathSegment(id)}`,
          params
        );
        return response.data;
      },
      delete: async (id: string): Promise<{ success: boolean }> => {
        const response = await this.client.delete<{ success: boolean }>(
          `/push/apps/${pathSegment(id)}`
        );
        return response.data;
      },
    },
    devices: {
      register: async (
        params: PushDeviceRegisterRequest
      ): Promise<PushDeviceSingleResponse> => {
        const response = await this.client.post<PushDeviceSingleResponse>(
          '/push/devices',
          params
        );
        return response.data;
      },
      list: async (params?: PushDeviceListParams): Promise<PushDeviceListResponse> => {
        const response = await this.client.get<PushDeviceListResponse>(
          '/push/devices',
          { params }
        );
        return response.data;
      },
      get: async (id: string): Promise<PushDeviceSingleResponse> => {
        const response = await this.client.get<PushDeviceSingleResponse>(
          `/push/devices/${pathSegment(id)}`
        );
        return response.data;
      },
      delete: async (id: string): Promise<{ success: boolean }> => {
        const response = await this.client.delete<{ success: boolean }>(
          `/push/devices/${pathSegment(id)}`
        );
        return response.data;
      },
    },
    messages: {
      /** opts.idempotencyKey envia header Idempotency-Key. */
      send: async (params: SendPushParams, opts?: SendOptions): Promise<SendPushResponse> => {
        const response = await this.client.post<SendPushResponse>(
          '/push/messages',
          params,
          idempotencyConfig(opts)
        );
        return response.data;
      },
      list: async (params?: PushMessageListParams): Promise<PushMessageListResponse> => {
        const response = await this.client.get<PushMessageListResponse>(
          '/push/messages',
          { params }
        );
        return response.data;
      },
      get: async (id: string): Promise<PushMessageSingleResponse> => {
        const response = await this.client.get<PushMessageSingleResponse>(
          `/push/messages/${pathSegment(id)}`
        );
        return response.data;
      },
      cancel: async (id: string): Promise<CancelPushResponse> => {
        const response = await this.client.post<CancelPushResponse>(
          `/push/messages/${pathSegment(id)}/cancel`
        );
        return response.data;
      },
    },
  };

  /**
   * @internal — For testing only. Do NOT call in production: exposes raw AxiosInstance
   * including the Authorization header (API key). Accidental logging = key leak.
   * @deprecated Use the typed methods (whatsapp, sms, email, push, messages) instead.
   */
  public getClient(): AxiosInstance {
    return this.client;
  }
}

export default Notifique;

/** @deprecated Use Notifique */
