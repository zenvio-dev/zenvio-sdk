import type {
  WhatsAppSendParams,
  SendParams,
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
  VerifyEmailDomainResponse,
  SendPushParams,
  SendPushResponse,
  PushMessageListParams,
  PushMessageStatus,
  CancelPushResponse,
  ErrorResponse,
} from '../src';

describe('Core Type Contracts — WhatsApp (OpenAPI-aligned)', () => {
  it('allows valid text message params (payload.message)', () => {
    const params: WhatsAppSendParams<'text'> = {
      instanceId: 'inst-1',
      to: ['5511999999999'],
      type: 'text',
      payload: { message: 'Hello World' },
    };
    expect(params.type).toBe('text');
    expect(params.payload.message).toBe('Hello World');
  });

  it('allows valid media message params (payload.mediaUrl, fileName, mimetype)', () => {
    const params: WhatsAppSendParams<'image'> = {
      instanceId: 'inst-1',
      to: ['5511999999999'],
      type: 'image',
      payload: { mediaUrl: 'https://example.com/image.png', fileName: 'image.png', mimetype: 'image/png' },
    };
    expect(params.type).toBe('image');
    expect(params.payload.mediaUrl).toBe('https://example.com/image.png');
    expect(params.payload.fileName).toBe('image.png');
    expect(params.payload.mimetype).toBe('image/png');
  });

  it('allows location payload', () => {
    const params: WhatsAppSendParams<'location'> = {
      instanceId: 'inst-1',
      to: ['5511999999999'],
      type: 'location',
      payload: { latitude: -23.5, longitude: -46.6, name: 'São Paulo', address: 'São Paulo, SP' },
    };
    expect(params.payload.latitude).toBe(-23.5);
    expect(params.payload.name).toBe('São Paulo');
    expect(params.payload.address).toBe('São Paulo, SP');
  });

  it('legacy SendParams alias maps to WhatsAppSendParams', () => {
    const params: SendParams<'text'> = {
      instanceId: 'inst-1',
      to: ['5511999999999'],
      type: 'text',
      payload: { message: 'Hi' },
    };
    expect(params.payload.message).toBe('Hi');
  });
});

describe('Core Type Contracts — SMS (OpenAPI SendSmsRequest / SendSmsResponse)', () => {
  it('SmsSendParams has to, message and optional schedule, options', () => {
    const params: SmsSendParams = {
      to: ['5511999999999'],
      message: 'Olá!',
      schedule: { sendAt: '2025-12-31T14:00:00.000Z' },
      options: { priority: 'high' },
    };
    expect(params.to).toHaveLength(1);
    expect(params.message).toBe('Olá!');
    expect(params.schedule?.sendAt).toBeDefined();
    expect(params.options?.priority).toBe('high');
  });

  it('SmsSendResponse.data.status is QUEUED | SCHEDULED', () => {
    const res: SmsSendResponse = {
      success: true,
      data: { status: 'QUEUED', count: 1, smsIds: ['sms-1'] },
    };
    expect(res.data.status).toBe('QUEUED');
    const scheduled: SmsSendResponse = {
      success: true,
      data: { status: 'SCHEDULED', count: 1, smsIds: ['sms-1'], scheduledAt: '2025-12-31T14:00:00.000Z' },
    };
    expect(scheduled.data.status).toBe('SCHEDULED');
  });

  it('SmsStatusResponse and SmsCancelResponse match OpenAPI', () => {
    const statusRes: SmsStatusResponse = {
      success: true,
      data: {
        smsId: 's1',
        to: '5511999999999',
        message: 'Hi',
        status: 'DELIVERED',
        sentAt: '2025-01-01T12:00:00.000Z',
        deliveredAt: '2025-01-01T12:00:05.000Z',
        failedAt: null,
        scheduledFor: null,
        errorMessage: null,
        createdAt: '2025-01-01T11:59:00.000Z',
      },
    };
    expect(statusRes.data.status).toBe('DELIVERED');
    const cancelRes: SmsCancelResponse = {
      success: true,
      data: { smsId: 's1', status: 'CANCELLED' },
    };
    expect(cancelRes.data.status).toBe('CANCELLED');
  });
});

describe('Core Type Contracts — Email (OpenAPI SendEmailRequest / responses)', () => {
  it('EmailSendParams has from, to, subject and optional text/html, schedule, options', () => {
    const params: EmailSendParams = {
      from: 'noreply@example.com',
      to: ['user@example.com'],
      subject: 'Test',
      html: '<p>Hi</p>',
    };
    expect(params.from).toBe('noreply@example.com');
    expect(params.to).toHaveLength(1);
    expect(params.subject).toBe('Test');
  });

  it('EmailSendResponse.data.status is QUEUED | SCHEDULED', () => {
    const res: EmailSendResponse = {
      success: true,
      data: { emailIds: ['em-1'], status: 'QUEUED', count: 1 },
    };
    expect(res.data.status).toBe('QUEUED');
  });

  it('EmailStatusResponse and EmailCancelResponse match OpenAPI', () => {
    const statusRes: EmailStatusResponse = {
      success: true,
      data: {
        id: 'em-1',
        to: 'user@example.com',
        from: 'noreply@example.com',
        fromName: null,
        subject: 'Test',
        status: 'SENT',
        scheduledFor: null,
        sentAt: '2025-01-01T12:00:00.000Z',
        deliveredAt: null,
        failedAt: null,
        errorMessage: null,
        createdAt: '2025-01-01T11:59:00.000Z',
      },
    };
    expect(statusRes.data.status).toBe('SENT');
    const cancelRes: EmailCancelResponse = {
      success: true,
      data: { emailId: 'em-1', status: 'CANCELLED' },
    };
    expect(cancelRes.data.status).toBe('CANCELLED');
  });

  it('ListEmailDomainsResponse and CreateEmailDomainRequest match OpenAPI', () => {
    const listRes: ListEmailDomainsResponse = {
      success: true,
      data: [{ id: 'd1', domain: 'example.com', status: 'VERIFIED', verifiedAt: null, createdAt: '' }],
    };
    expect(listRes.data[0].status).toBe('VERIFIED');
    const createReq: CreateEmailDomainRequest = { domain: 'new.com' };
    expect(createReq.domain).toBe('new.com');
    const verifyRes: VerifyEmailDomainResponse = {
      success: true,
      data: listRes.data[0],
      verified: true,
    };
    expect(verifyRes.verified).toBe(true);
  });
});

describe('Core Type Contracts — Push (OpenAPI SendPushRequest / responses)', () => {
  it('SendPushParams has to and optional title, body, schedule.sendAt, options', () => {
    const params: SendPushParams = {
      to: ['dev-1'],
      title: 'Hi',
      body: 'Body',
      schedule: { sendAt: '2025-12-31T14:00:00.000Z' },
      options: { priority: 'normal' },
    };
    expect(params.to).toEqual(['dev-1']);
    expect(params.schedule?.sendAt).toBeDefined();
  });

  it('SendPushResponse.data.status is QUEUED | SCHEDULED', () => {
    const res: SendPushResponse = {
      success: true,
      data: { status: 'QUEUED', count: 1, pushIds: ['push-1'] },
    };
    expect(res.data.status).toBe('QUEUED');
  });

  it('PushMessageListParams accepts status enum (PushMessageStatus)', () => {
    const params: PushMessageListParams = {
      page: 1,
      limit: 20,
      status: 'SENT' as PushMessageStatus,
      appId: 'app-1',
    };
    expect(params.status).toBe('SENT');
  });

  it('CancelPushResponse.data.status is CANCELLED', () => {
    const res: CancelPushResponse = {
      success: true,
      data: { pushId: 'push-1', status: 'CANCELLED' },
    };
    expect(res.data.status).toBe('CANCELLED');
  });
});

describe('Core Type Contracts — ErrorResponse (OpenAPI)', () => {
  it('ErrorResponse has success: false and optional error, message, code, details', () => {
    const err: ErrorResponse = {
      success: false,
      error: 'Bad Request',
      message: 'Validation failed',
      code: 'DOMAIN_NOT_VERIFIED',
      details: [{ field: 'from', message: 'from is required' }],
    };
    expect(err.success).toBe(false);
    expect(err.code).toBe('DOMAIN_NOT_VERIFIED');
  });
});
