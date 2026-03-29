import axios from 'axios';
import { Notifique } from '../src';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

/** Cria um client mock com interceptors; os handlers do SDK (camelCase + NotifiqueApiError) são aplicados. */
function createMockClient(mocks: { post: jest.Mock; get: jest.Mock; delete: jest.Mock; patch: jest.Mock; put?: jest.Mock }) {
  let onFulfilled: (r: unknown) => unknown = (r) => r;
  let onRejected: (e: unknown) => unknown = (e) => Promise.reject(e);
  return {
    post: (...args: unknown[]) => Promise.resolve(mocks.post(...args)).then(onFulfilled, onRejected),
    get: (...args: unknown[]) => Promise.resolve(mocks.get(...args)).then(onFulfilled, onRejected),
    delete: (...args: unknown[]) => Promise.resolve(mocks.delete(...args)).then(onFulfilled, onRejected),
    patch: (...args: unknown[]) => Promise.resolve(mocks.patch(...args)).then(onFulfilled, onRejected),
    put: (...args: unknown[]) => Promise.resolve((mocks.put ?? mocks.post)(...args)).then(onFulfilled, onRejected),
    interceptors: {
      response: {
        use: (fulfilled?: (r: unknown) => unknown, rejected?: (e: unknown) => unknown) => {
          if (fulfilled) onFulfilled = fulfilled;
          if (rejected) onRejected = rejected;
        },
      },
    },
  };
}

describe('Node.js SDK — WhatsApp (API-aligned)', () => {
  let notifique: Notifique;
  let mockPost: jest.Mock;
  let mockGet: jest.Mock;
  let mockDelete: jest.Mock;
  let mockPatch: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn();
    mockGet = jest.fn();
    mockDelete = jest.fn();
    mockPatch = jest.fn();
    (mockedAxios.create as jest.Mock).mockReturnValue(
      createMockClient({ post: mockPost, get: mockGet, delete: mockDelete, patch: mockPatch })
    );
    notifique = new Notifique({ apiKey: 'test-api-key' });
  });

  it('configures a default 30s timeout', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith(expect.objectContaining({ timeout: 30000 }));
  });

  it('rejects non-HTTPS baseUrl', () => {
    expect(() => new Notifique({ apiKey: 'test-api-key', baseUrl: 'http://localhost:3000/v1' }))
      .toThrow('baseUrl must use HTTPS');
  });

  it('sends via POST /whatsapp/messages with instanceId in body', async () => {
    mockPost.mockResolvedValueOnce({
      data: { success: true, data: { messageIds: ['msg-1'], status: 'QUEUED' } },
    });

    const result = await notifique.whatsapp.send('instance-abc', {
      to: ['5511999999999'],
      type: 'text',
      payload: { message: 'Test message' },
      options: {
        webhook: { url: 'https://example.com/hook', secret: 's' },
        autoReplyText: 'Obrigado!',
        fallback: { channel: 'sms' },
      },
    });

    expect(mockPost).toHaveBeenCalledWith(
      '/whatsapp/messages',
      expect.objectContaining({
        instanceId: 'instance-abc',
        to: ['5511999999999'],
        type: 'text',
        payload: { message: 'Test message' },
        options: expect.objectContaining({
          webhook: { url: 'https://example.com/hook', secret: 's' },
          autoReplyText: 'Obrigado!',
          fallback: { channel: 'sms' },
        }),
      }),
      undefined
    );
    expect(result.data.messageIds).toEqual(['msg-1']);
    expect(result.data.status).toBe('QUEUED');
  });

  it('sendText uses payload.message and POST /whatsapp/messages', async () => {
    mockPost.mockResolvedValueOnce({
      data: { success: true, data: { messageIds: ['m1'], status: 'QUEUED' } },
    });

    await notifique.whatsapp.sendText('inst-1', '5511999999999', 'Hello');

    expect(mockPost).toHaveBeenCalledWith(
      '/whatsapp/messages',
      expect.objectContaining({
        instanceId: 'inst-1',
        to: ['5511999999999'],
        type: 'text',
        payload: { message: 'Hello' },
      }),
      undefined
    );
  });

  it('sendText accepts array of recipients', async () => {
    mockPost.mockResolvedValueOnce({
      data: { success: true, data: { messageIds: ['m1', 'm2'], status: 'QUEUED' } },
    });

    await notifique.whatsapp.sendText('inst-1', ['5511999999999', '5521988887777'], 'Hi');

    expect(mockPost).toHaveBeenCalledWith(
      '/whatsapp/messages',
      expect.objectContaining({
        to: ['5511999999999', '5521988887777'],
        payload: { message: 'Hi' },
      }),
      undefined
    );
  });

  it('sends image with payload.mediaUrl, fileName, mimetype', async () => {
    mockPost.mockResolvedValueOnce({
      data: { success: true, data: { messageIds: ['img-1'], status: 'QUEUED' } },
    });

    await notifique.whatsapp.send('inst-1', {
      to: ['5511999999999'],
      type: 'image',
      payload: { mediaUrl: 'https://example.com/image.png', fileName: 'image.png', mimetype: 'image/png' },
    });

    expect(mockPost).toHaveBeenCalledWith(
      '/whatsapp/messages',
      expect.objectContaining({
        type: 'image',
        payload: { mediaUrl: 'https://example.com/image.png', fileName: 'image.png', mimetype: 'image/png' },
      }),
      undefined
    );
  });

  it('sends video, audio, document with mediaUrl, fileName, mimetype', async () => {
    mockPost.mockResolvedValue({ data: { success: true, data: { messageIds: ['x'], status: 'QUEUED' } } });

    await notifique.whatsapp.send('p', { to: ['1'], type: 'video', payload: { mediaUrl: 'https://v.mp4', fileName: 'v.mp4', mimetype: 'video/mp4' } });
    await notifique.whatsapp.send('p', { to: ['1'], type: 'audio', payload: { mediaUrl: 'https://a.mp3', fileName: 'a.mp3', mimetype: 'audio/mpeg' } });
    await notifique.whatsapp.send('p', { to: ['1'], type: 'document', payload: { mediaUrl: 'https://d.pdf', fileName: 'd.pdf', mimetype: 'application/pdf' } });

    expect(mockPost).toHaveBeenNthCalledWith(1, '/whatsapp/messages', expect.objectContaining({ type: 'video', payload: { mediaUrl: 'https://v.mp4', fileName: 'v.mp4', mimetype: 'video/mp4' } }), undefined);
    expect(mockPost).toHaveBeenNthCalledWith(2, '/whatsapp/messages', expect.objectContaining({ type: 'audio', payload: { mediaUrl: 'https://a.mp3', fileName: 'a.mp3', mimetype: 'audio/mpeg' } }), undefined);
    expect(mockPost).toHaveBeenNthCalledWith(3, '/whatsapp/messages', expect.objectContaining({ type: 'document', payload: { mediaUrl: 'https://d.pdf', fileName: 'd.pdf', mimetype: 'application/pdf' } }), undefined);
  });

  it('getMessage calls GET /whatsapp/messages/:messageId', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          messageId: 'msg-1',
          to: '5511999999999',
          type: 'text',
          status: 'SENT',
          created_at: '2025-01-01T00:00:00.000Z',
        },
      },
    });

    const result = await notifique.whatsapp.getMessage('msg-1');

    expect(mockGet).toHaveBeenCalledWith('/whatsapp/messages/msg-1');
    expect(result.data.messageId).toBe('msg-1');
    expect(result.data.status).toBe('SENT');
  });

  it('deleteMessage calls DELETE /whatsapp/messages/:messageId', async () => {
    mockDelete.mockResolvedValueOnce({
      data: { success: true, data: { messageId: 'msg-1', status: 'DELETED' } },
    });

    const result = await notifique.whatsapp.deleteMessage('msg-1');

    expect(mockDelete).toHaveBeenCalledWith('/whatsapp/messages/msg-1');
    expect(result.success).toBe(true);
    expect(result.data.messageId).toBe('msg-1');
    expect(result.data.status).toBe('DELETED');
  });

  it('editMessage calls PATCH /whatsapp/messages/:messageId/edit', async () => {
    mockPatch.mockResolvedValueOnce({
      data: { success: true, data: { messageId: 'msg-1', status: 'EDITED' } },
    });

    const result = await notifique.whatsapp.editMessage('msg-1', { text: 'New text' });

    expect(mockPatch).toHaveBeenCalledWith('/whatsapp/messages/msg-1/edit', { text: 'New text' });
    expect(result.success).toBe(true);
    expect(result.data.messageId).toBe('msg-1');
    expect(result.data.status).toBe('EDITED');
  });

  it('cancelMessage calls POST /whatsapp/messages/:messageId/cancel', async () => {
    mockPost.mockResolvedValueOnce({
      data: { success: true, data: { messageId: 'msg-1', status: 'CANCELLED' } },
    });

    const result = await notifique.whatsapp.cancelMessage('msg-1');

    expect(mockPost).toHaveBeenCalledWith('/whatsapp/messages/msg-1/cancel');
    expect(result.success).toBe(true);
    expect(result.data.messageId).toBe('msg-1');
    expect(result.data.status).toBe('CANCELLED');
  });

  it('listInstances calls GET /whatsapp/instances', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: [{ id: 'i1', name: 'My Instance', phoneNumber: '5511999999999', status: 'ACTIVE', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' }],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
    });

    const result = await notifique.whatsapp.listInstances({ page: '1' });

    expect(mockGet).toHaveBeenCalledWith('/whatsapp/instances', { params: { page: '1' } });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('i1');
    expect(result.data[0].status).toBe('ACTIVE');
  });

  it('getInstanceQr calls GET /whatsapp/instances/:id/qr', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: { status: 'PENDING', base64: 'data:image/png;base64,...' },
      },
    });

    const result = await notifique.whatsapp.getInstanceQr('i1');

    expect(mockGet).toHaveBeenCalledWith('/whatsapp/instances/i1/qr');
    expect(result.success).toBe(true);
    expect(result.data.status).toBe('PENDING');
    expect((result.data as any).base64).toBe('data:image/png;base64,...');
  });

  it('getInstance calls GET /whatsapp/instances/:id', async () => {
    mockGet.mockResolvedValueOnce({
      data: { success: true, data: { id: 'i1', name: 'One', status: 'ACTIVE', phoneNumber: '5511999999999', createdAt: '', updatedAt: '' } },
    });

    const result = await notifique.whatsapp.getInstance('i1');

    expect(mockGet).toHaveBeenCalledWith('/whatsapp/instances/i1');
    expect(result.data.id).toBe('i1');
  });

  it('createInstance calls POST /whatsapp/instances', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          instance: { id: 'new-1', name: 'New', status: 'PENDING', phoneNumber: null, createdAt: '' },
          connection: { base64: 'qr...' },
        },
      },
    });

    const result = await notifique.whatsapp.createInstance({ name: 'My Instance' });

    expect(mockPost).toHaveBeenCalledWith('/whatsapp/instances', { name: 'My Instance' });
    expect(result.data.instance.name).toBe('New');
  });

  it('disconnectInstance calls POST /whatsapp/instances/:id/disconnect', async () => {
    mockPost.mockResolvedValueOnce({
      data: { success: true, data: { instanceId: 'i1', status: 'DISCONNECTED' } },
    });

    const result = await notifique.whatsapp.disconnectInstance('i1');

    expect(mockPost).toHaveBeenCalledWith('/whatsapp/instances/i1/disconnect');
    expect(result.data.status).toBe('DISCONNECTED');
  });

  it('deleteInstance calls DELETE /whatsapp/instances/:id', async () => {
    mockDelete.mockResolvedValueOnce({
      data: { success: true, data: { instanceId: 'i1', status: 'deleted' }, message: 'Instance removed.' },
    });

    const result = await notifique.whatsapp.deleteInstance('i1');

    expect(mockDelete).toHaveBeenCalledWith('/whatsapp/instances/i1');
    expect(result.data.status).toBe('deleted');
  });
});

describe('Node.js SDK — Messages (template)', () => {
  let notifique: Notifique;
  let mockPost: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn();
    (mockedAxios.create as jest.Mock).mockReturnValue(
      createMockClient({ post: mockPost, get: jest.fn(), delete: jest.fn(), patch: jest.fn() })
    );
    notifique = new Notifique({ apiKey: 'test-key' });
  });

  it('messages.send calls POST /templates/send with to, template, variables, channels', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          messageIds: ['msg-1'],
          smsIds: ['sms-1'],
          emailIds: ['em-1'],
          status: 'queued',
          count: 3,
        },
      },
    });

    const result = await notifique.messages.send({
      to: ['5511999999999', 'user@example.com'],
      template: 'welcome',
      variables: { name: 'Trial', credits: 300 },
      channels: ['whatsapp', 'sms', 'email'],
      instanceId: 'inst-1',
      from: 'noreply@example.com',
    });

    expect(mockPost).toHaveBeenCalledWith('/templates/send', {
      to: ['5511999999999', 'user@example.com'],
      template: 'welcome',
      variables: { name: 'Trial', credits: 300 },
      channels: ['whatsapp', 'sms', 'email'],
      instanceId: 'inst-1',
      from: 'noreply@example.com',
    });
    expect(result.success).toBe(true);
    expect(result.data.status).toBe('queued');
    expect(result.data.count).toBe(3);
    expect(result.data.messageIds).toEqual(['msg-1']);
    expect(result.data.smsIds).toEqual(['sms-1']);
    expect(result.data.emailIds).toEqual(['em-1']);
  });
});

describe('Node.js SDK — SMS', () => {
  let notifique: Notifique;
  let mockPost: jest.Mock;
  let mockGet: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn();
    mockGet = jest.fn();
    (mockedAxios.create as jest.Mock).mockReturnValue(
      createMockClient({ post: mockPost, get: mockGet, delete: jest.fn(), patch: jest.fn() })
    );
    notifique = new Notifique({ apiKey: 'test-key' });
  });

  it('sms.send calls POST /sms/messages with to, message, schedule?, options?', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { status: 'QUEUED', count: 1, smsIds: ['sms-1'] },
      },
    });

    const result = await notifique.sms.send({
      to: ['5511999999999'],
      message: 'Olá!',
    });

    expect(mockPost).toHaveBeenCalledWith('/sms/messages', {
      to: ['5511999999999'],
      message: 'Olá!',
    }, undefined);
    expect(result.success).toBe(true);
    expect(result.data.smsIds).toEqual(['sms-1']);
    expect(result.data.status).toBe('QUEUED');
  });

  it('sms.get calls GET /sms/messages/:id', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          smsId: 'sms-1',
          to: '5511999999999',
          message: 'Hi',
          status: 'DELIVERED',
          sent_at: '2025-01-01T12:00:00.000Z',
          delivered_at: '2025-01-01T12:00:05.000Z',
          failed_at: null,
          scheduled_for: null,
          error_message: null,
          created_at: '2025-01-01T11:59:00.000Z',
        },
      },
    });

    const result = await notifique.sms.get('sms-1');

    expect(mockGet).toHaveBeenCalledWith('/sms/messages/sms-1');
    expect(result.data.smsId).toBe('sms-1');
    expect(result.data.status).toBe('DELIVERED');
  });

  it('sms.cancel calls POST /sms/messages/:id/cancel', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { smsId: 'sms-1', status: 'CANCELLED' },
      },
    });

    const result = await notifique.sms.cancel('sms-1');

    expect(mockPost).toHaveBeenCalledWith('/sms/messages/sms-1/cancel');
    expect(result.success).toBe(true);
    expect(result.data.smsId).toBe('sms-1');
    expect(result.data.status).toBe('CANCELLED');
  });
});

describe('Node.js SDK — Email', () => {
  let notifique: Notifique;
  let mockPost: jest.Mock;
  let mockGet: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn();
    mockGet = jest.fn();
    (mockedAxios.create as jest.Mock).mockReturnValue(
      createMockClient({ post: mockPost, get: mockGet, delete: jest.fn(), patch: jest.fn() })
    );
    notifique = new Notifique({ apiKey: 'test-key' });
  });

  it('email.send calls POST /email/messages with from, to, subject, text/html', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { emailIds: ['em-1'], status: 'QUEUED', count: 1 },
      },
    });

    const result = await notifique.email.send({
      from: 'noreply@example.com',
      to: ['user@example.com'],
      subject: 'Test',
      html: '<p>Hello</p>',
    });

    expect(mockPost).toHaveBeenCalledWith('/email/messages', {
      from: 'noreply@example.com',
      to: ['user@example.com'],
      subject: 'Test',
      html: '<p>Hello</p>',
    }, undefined);
    expect(result.data.emailIds).toEqual(['em-1']);
    expect(result.data.status).toBe('QUEUED');
  });

  it('email.get calls GET /email/messages/:id', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
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
      },
    });

    const result = await notifique.email.get('em-1');

    expect(mockGet).toHaveBeenCalledWith('/email/messages/em-1');
    expect(result.data.id).toBe('em-1');
    expect(result.data.status).toBe('SENT');
  });

  it('email.cancel calls POST /email/messages/:id/cancel', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { email_id: 'em-1', status: 'CANCELLED' },
      },
    });

    const result = await notifique.email.cancel('em-1');

    expect(mockPost).toHaveBeenCalledWith('/email/messages/em-1/cancel');
    expect(result.data.status).toBe('CANCELLED');
  });

  it('email.domains.list calls GET /email/domains', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: [
          { id: 'dom-1', domain: 'example.com', status: 'VERIFIED', dnsRecords: [], verifiedAt: '2025-01-01T00:00:00.000Z', createdAt: '2025-01-01T00:00:00.000Z' },
        ],
      },
    });

    const result = await notifique.email.domains.list();

    expect(mockGet).toHaveBeenCalledWith('/email/domains');
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].domain).toBe('example.com');
    expect(result.data[0].status).toBe('VERIFIED');
  });

  it('email.domains.create calls POST /email/domains', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { id: 'dom-1', domain: 'new.com', status: 'PENDING', dnsRecords: [], verifiedAt: null, createdAt: '2025-01-01T00:00:00.000Z' },
        message: 'Add the DNS record(s) above.',
      },
    });

    const result = await notifique.email.domains.create({ domain: 'new.com' });

    expect(mockPost).toHaveBeenCalledWith('/email/domains', { domain: 'new.com' });
    expect(result.data.domain).toBe('new.com');
    expect(result.data.status).toBe('PENDING');
  });

  it('email.domains.get calls GET /email/domains/:id', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: { id: 'dom-1', domain: 'example.com', status: 'VERIFIED', dnsRecords: [], verifiedAt: '2025-01-01T00:00:00.000Z', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
      },
    });

    const result = await notifique.email.domains.get('dom-1');

    expect(mockGet).toHaveBeenCalledWith('/email/domains/dom-1');
    expect(result.data.id).toBe('dom-1');
  });

  it('email.domains.verify calls POST /email/domains/:id/verify', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { id: 'dom-1', domain: 'example.com', status: 'VERIFIED', dnsRecords: [], verifiedAt: '2025-01-01T00:00:00.000Z', createdAt: '2025-01-01T00:00:00.000Z' },
        verified: true,
      },
    });

    const result = await notifique.email.domains.verify('dom-1');

    expect(mockPost).toHaveBeenCalledWith('/email/domains/dom-1/verify');
    expect(result.verified).toBe(true);
    expect(result.data.status).toBe('VERIFIED');
  });
});

describe('Node.js SDK — Push', () => {
  let notifique: Notifique;
  let mockPost: jest.Mock;
  let mockGet: jest.Mock;
  let mockPut: jest.Mock;
  let mockDelete: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn();
    mockGet = jest.fn();
    mockPut = jest.fn();
    mockDelete = jest.fn();
    (mockedAxios.create as jest.Mock).mockReturnValue(
      createMockClient({ post: mockPost, get: mockGet, put: mockPut, delete: mockDelete, patch: jest.fn() })
    );
    notifique = new Notifique({ apiKey: 'test-key' });
  });

  it('push.apps.list calls GET /push/apps with page, limit', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: [{ id: 'app-1', name: 'My App', workspace_id: 'ws-1', vapid_public_key: null, has_vapid_private: false, has_fcm: false, has_apns: false, allowed_origins: [], prompt_config: null, created_at: '2025-01-01T00:00:00.000Z', updated_at: '2025-01-01T00:00:00.000Z' }],
        pagination: { total: 1, page: 1, limit: 20, totalPages: 1 },
      },
    });

    const result = await notifique.push.apps.list({ page: 1, limit: 20 });

    expect(mockGet).toHaveBeenCalledWith('/push/apps', { params: { page: 1, limit: 20 } });
    expect(result.data[0].id).toBe('app-1');
  });

  it('push.apps.get calls GET /push/apps/:id', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: { id: 'app-1', name: 'App', workspace_id: 'ws-1', vapid_public_key: 'key', has_vapid_private: true, has_fcm: false, has_apns: false, allowed_origins: [], prompt_config: null, created_at: '', updated_at: '' },
      },
    });

    const result = await notifique.push.apps.get('app-1');

    expect(mockGet).toHaveBeenCalledWith('/push/apps/app-1');
    expect(result.data.id).toBe('app-1');
  });

  it('push.apps.create calls POST /push/apps', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { id: 'app-new', name: 'New App', workspace_id: 'ws-1', vapid_public_key: null, has_vapid_private: false, has_fcm: false, has_apns: false, allowed_origins: [], prompt_config: null, created_at: '', updated_at: '' },
      },
    });

    const result = await notifique.push.apps.create({ name: 'New App' });

    expect(mockPost).toHaveBeenCalledWith('/push/apps', { name: 'New App' });
    expect(result.data.name).toBe('New App');
  });

  it('push.apps.update calls PUT /push/apps/:id', async () => {
    mockPut.mockResolvedValueOnce({
      data: {
        success: true,
        data: { id: 'app-1', name: 'Updated', workspace_id: 'ws-1', vapid_public_key: null, has_vapid_private: false, has_fcm: false, has_apns: false, allowed_origins: [], prompt_config: null, created_at: '', updated_at: '' },
      },
    });

    const result = await notifique.push.apps.update('app-1', { name: 'Updated' });

    expect(mockPut).toHaveBeenCalledWith('/push/apps/app-1', { name: 'Updated' });
    expect(result.data.name).toBe('Updated');
  });

  it('push.apps.delete calls DELETE /push/apps/:id', async () => {
    mockDelete.mockResolvedValueOnce({ data: { success: true } });

    const result = await notifique.push.apps.delete('app-1');

    expect(mockDelete).toHaveBeenCalledWith('/push/apps/app-1');
    expect(result.success).toBe(true);
  });

  it('push.devices.register calls POST /push/devices', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { id: 'dev-1', app_id: 'app-1', platform: 'web', external_user_id: null, created_at: '2025-01-01T00:00:00.000Z' },
      },
    });

    const result = await notifique.push.devices.register({
      appId: 'app-1',
      platform: 'web',
      subscription: { endpoint: 'https://...', keys: { p256dh: 'x', auth: 'y' } },
    });

    expect(mockPost).toHaveBeenCalledWith('/push/devices', expect.objectContaining({ appId: 'app-1', platform: 'web' }));
    expect(result.data.id).toBe('dev-1');
  });

  it('push.devices.list calls GET /push/devices with params', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: [{ id: 'dev-1', app_id: 'app-1', platform: 'web', external_user_id: null, created_at: '' }],
        pagination: { total: 1, page: 1, limit: 20, totalPages: 1 },
      },
    });

    const result = await notifique.push.devices.list({ appId: 'app-1', platform: 'web' });

    expect(mockGet).toHaveBeenCalledWith('/push/devices', { params: { appId: 'app-1', platform: 'web' } });
    expect(result.data).toHaveLength(1);
  });

  it('push.devices.get calls GET /push/devices/:id', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: { id: 'dev-1', app_id: 'app-1', platform: 'web', external_user_id: null, created_at: '' },
      },
    });

    const result = await notifique.push.devices.get('dev-1');

    expect(mockGet).toHaveBeenCalledWith('/push/devices/dev-1');
    expect(result.data.id).toBe('dev-1');
  });

  it('push.devices.delete calls DELETE /push/devices/:id', async () => {
    mockDelete.mockResolvedValueOnce({ data: { success: true } });

    const result = await notifique.push.devices.delete('dev-1');

    expect(mockDelete).toHaveBeenCalledWith('/push/devices/dev-1');
    expect(result.success).toBe(true);
  });

  it('push.messages.send calls POST /push/messages', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { status: 'QUEUED', count: 1, pushIds: ['push-1'] },
      },
    });

    const result = await notifique.push.messages.send({
      to: ['dev-1'],
      title: 'Hi',
      body: 'Body',
    });

    expect(mockPost).toHaveBeenCalledWith('/push/messages', expect.objectContaining({ to: ['dev-1'], title: 'Hi', body: 'Body' }), undefined);
    expect(result.data.status).toBe('QUEUED');
    expect(result.data.pushIds).toEqual(['push-1']);
  });

  it('push.messages.list calls GET /push/messages with params', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: [{ id: 'push-1', device_id: 'dev-1', app_id: 'app-1', title: 'T', body: 'B', status: 'SENT', scheduled_for: null, sent_at: '', delivered_at: null, failed_at: null, error_message: null, clicked_at: null, created_at: '' }],
        pagination: { total: 1, page: 1, limit: 20, totalPages: 1 },
      },
    });

    const result = await notifique.push.messages.list({ status: 'SENT', appId: 'app-1' });

    expect(mockGet).toHaveBeenCalledWith('/push/messages', { params: { status: 'SENT', appId: 'app-1' } });
    expect(result.data).toHaveLength(1);
  });

  it('push.messages.get calls GET /push/messages/:id', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: { id: 'push-1', device_id: 'dev-1', app_id: 'app-1', title: 'T', body: 'B', status: 'DELIVERED', scheduled_for: null, sent_at: '', delivered_at: '', failed_at: null, error_message: null, clicked_at: null, created_at: '' },
      },
    });

    const result = await notifique.push.messages.get('push-1');

    expect(mockGet).toHaveBeenCalledWith('/push/messages/push-1');
    expect(result.data.status).toBe('DELIVERED');
  });

  it('push.messages.cancel calls POST /push/messages/:id/cancel', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { push_id: 'push-1', status: 'CANCELLED' },
      },
    });

    const result = await notifique.push.messages.cancel('push-1');

    expect(mockPost).toHaveBeenCalledWith('/push/messages/push-1/cancel');
    expect(result.data.status).toBe('CANCELLED');
  });
});
