import axios from 'axios';
// Use dist so we test the built artifact (same as published package)
import { Zenvio } from '../dist';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Node.js SDK — WhatsApp (API-aligned)', () => {
  let zenvio: Zenvio;
  let mockPost: jest.Mock;
  let mockGet: jest.Mock;
  let mockDelete: jest.Mock;
  let mockPatch: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn();
    mockGet = jest.fn();
    mockDelete = jest.fn();
    mockPatch = jest.fn();
    (mockedAxios.create as jest.Mock).mockReturnValue({
      post: mockPost,
      get: mockGet,
      delete: mockDelete,
      patch: mockPatch,
    });
    zenvio = new Zenvio({ apiKey: 'test-api-key' });
  });

  it('sends via POST /whatsapp/send with instance_id in body', async () => {
    mockPost.mockResolvedValueOnce({
      data: { message_ids: ['msg-1'], status: 'queued' },
    });

    const result = await zenvio.whatsapp.send('instance-abc', {
      to: ['5511999999999'],
      type: 'text',
      payload: { message: 'Test message' },
    });

    expect(mockPost).toHaveBeenCalledWith(
      '/whatsapp/send',
      expect.objectContaining({
        instance_id: 'instance-abc',
        to: ['5511999999999'],
        type: 'text',
        payload: { message: 'Test message' },
      })
    );
    expect(result.message_ids).toEqual(['msg-1']);
    expect(result.status).toBe('queued');
  });

  it('sendText uses payload.message and POST /whatsapp/send', async () => {
    mockPost.mockResolvedValueOnce({
      data: { message_ids: ['m1'], status: 'queued' },
    });

    await zenvio.whatsapp.sendText('inst-1', '5511999999999', 'Hello');

    expect(mockPost).toHaveBeenCalledWith(
      '/whatsapp/send',
      expect.objectContaining({
        instance_id: 'inst-1',
        to: ['5511999999999'],
        type: 'text',
        payload: { message: 'Hello' },
      })
    );
  });

  it('sendText accepts array of recipients', async () => {
    mockPost.mockResolvedValueOnce({
      data: { message_ids: ['m1', 'm2'], status: 'queued' },
    });

    await zenvio.whatsapp.sendText('inst-1', ['5511999999999', '5521988887777'], 'Hi');

    expect(mockPost).toHaveBeenCalledWith(
      '/whatsapp/send',
      expect.objectContaining({
        to: ['5511999999999', '5521988887777'],
        payload: { message: 'Hi' },
      })
    );
  });

  it('sends image with payload.media_url, file_name, mimetype', async () => {
    mockPost.mockResolvedValueOnce({
      data: { message_ids: ['img-1'], status: 'queued' },
    });

    await zenvio.whatsapp.send('inst-1', {
      to: ['5511999999999'],
      type: 'image',
      payload: { media_url: 'https://example.com/image.png', file_name: 'image.png', mimetype: 'image/png' },
    });

    expect(mockPost).toHaveBeenCalledWith(
      '/whatsapp/send',
      expect.objectContaining({
        type: 'image',
        payload: { media_url: 'https://example.com/image.png', file_name: 'image.png', mimetype: 'image/png' },
      })
    );
  });

  it('sends video, audio, document with media_url, file_name, mimetype', async () => {
    mockPost.mockResolvedValue({ data: { message_ids: ['x'], status: 'queued' } });

    await zenvio.whatsapp.send('p', { to: ['1'], type: 'video', payload: { media_url: 'https://v.mp4', file_name: 'v.mp4', mimetype: 'video/mp4' } });
    expect(mockPost).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ type: 'video', payload: { media_url: 'https://v.mp4', file_name: 'v.mp4', mimetype: 'video/mp4' } }));

    await zenvio.whatsapp.send('p', { to: ['1'], type: 'audio', payload: { media_url: 'https://a.mp3', file_name: 'a.mp3', mimetype: 'audio/mpeg' } });
    expect(mockPost).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ type: 'audio' }));

    await zenvio.whatsapp.send('p', { to: ['1'], type: 'document', payload: { media_url: 'https://d.pdf', file_name: 'd.pdf', mimetype: 'application/pdf' } });
    expect(mockPost).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ type: 'document' }));
  });

  it('getMessage calls GET /whatsapp/:messageId', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        message_id: 'msg-1',
        to: '5511999999999',
        type: 'text',
        status: 'sent',
        created_at: '2025-01-01T00:00:00.000Z',
      },
    });

    const result = await zenvio.whatsapp.getMessage('msg-1');

    expect(mockGet).toHaveBeenCalledWith('/whatsapp/msg-1');
    expect(result.message_id).toBe('msg-1');
    expect(result.status).toBe('sent');
  });

  it('deleteMessage calls DELETE /whatsapp/:messageId', async () => {
    mockDelete.mockResolvedValueOnce({
      data: { success: true, message_ids: ['msg-1'], status: 'deleted' },
    });

    const result = await zenvio.whatsapp.deleteMessage('msg-1');

    expect(mockDelete).toHaveBeenCalledWith('/whatsapp/msg-1');
    expect(result.status).toBe('deleted');
  });

  it('editMessage calls PATCH /whatsapp/:messageId/edit', async () => {
    mockPatch.mockResolvedValueOnce({
      data: { success: true, message_ids: ['msg-1'], status: 'edited' },
    });

    const result = await zenvio.whatsapp.editMessage('msg-1', { text: 'New text' });

    expect(mockPatch).toHaveBeenCalledWith('/whatsapp/msg-1/edit', { text: 'New text' });
    expect(result.status).toBe('edited');
  });

  it('cancelMessage calls POST /whatsapp/:messageId/cancel', async () => {
    mockPost.mockResolvedValueOnce({
      data: { success: true, message_ids: ['msg-1'], status: 'cancelled' },
    });

    const result = await zenvio.whatsapp.cancelMessage('msg-1');

    expect(mockPost).toHaveBeenCalledWith('/whatsapp/msg-1/cancel');
    expect(result.status).toBe('cancelled');
  });

  it('listInstances calls GET /whatsapp/instances', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: [{ id: 'i1', name: 'My Instance', status: 'ACTIVE' }],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
    });

    const result = await zenvio.whatsapp.listInstances({ page: '1' });

    expect(mockGet).toHaveBeenCalledWith('/whatsapp/instances', { params: { page: '1' } });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('i1');
  });

  it('getInstance calls GET /whatsapp/instances/:id', async () => {
    mockGet.mockResolvedValueOnce({
      data: { success: true, data: { id: 'i1', name: 'One', status: 'ACTIVE', phoneNumber: '5511999999999', createdAt: '', updatedAt: '' } },
    });

    const result = await zenvio.whatsapp.getInstance('i1');

    expect(mockGet).toHaveBeenCalledWith('/whatsapp/instances/i1');
    expect(result.data.id).toBe('i1');
  });

  it('createInstance calls POST /whatsapp/instances', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          instance: { id: 'new-1', name: 'New', status: 'PENDING', phoneNumber: null, createdAt: '' },
          evolution: { base64: 'qr...' },
        },
      },
    });

    const result = await zenvio.whatsapp.createInstance({ name: 'My Instance' });

    expect(mockPost).toHaveBeenCalledWith('/whatsapp/instances', { name: 'My Instance' });
    expect(result.data.instance.name).toBe('New');
  });

  it('disconnectInstance calls POST /whatsapp/instances/:id/disconnect', async () => {
    mockPost.mockResolvedValueOnce({
      data: { success: true, data: { instance_id: 'i1', status: 'DISCONNECTED' } },
    });

    const result = await zenvio.whatsapp.disconnectInstance('i1');

    expect(mockPost).toHaveBeenCalledWith('/whatsapp/instances/i1/disconnect');
    expect(result.data.status).toBe('DISCONNECTED');
  });

  it('deleteInstance calls DELETE /whatsapp/instances/:id', async () => {
    mockDelete.mockResolvedValueOnce({
      data: { success: true, data: { instance_id: 'i1', status: 'deleted' }, message: 'Instance removed.' },
    });

    const result = await zenvio.whatsapp.deleteInstance('i1');

    expect(mockDelete).toHaveBeenCalledWith('/whatsapp/instances/i1');
    expect(result.data.status).toBe('deleted');
  });
});

describe('Node.js SDK — Messages (template)', () => {
  let zenvio: Zenvio;
  let mockPost: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn();
    (mockedAxios.create as jest.Mock).mockReturnValue({
      post: mockPost,
      get: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
    });
    zenvio = new Zenvio({ apiKey: 'test-key' });
  });

  it('messages.send calls POST /templates/send with to, template, variables, channels', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          message_ids: ['msg-1'],
          sms_ids: ['sms-1'],
          email_ids: ['em-1'],
          status: 'queued',
          count: 3,
        },
      },
    });

    const result = await zenvio.messages.send({
      to: ['5511999999999', 'user@example.com'],
      template: 'welcome',
      variables: { name: 'Trial', credits: 300 },
      channels: ['whatsapp', 'sms', 'email'],
      instance_id: 'inst-1',
      from: 'noreply@example.com',
    });

    expect(mockPost).toHaveBeenCalledWith('/templates/send', {
      to: ['5511999999999', 'user@example.com'],
      template: 'welcome',
      variables: { name: 'Trial', credits: 300 },
      channels: ['whatsapp', 'sms', 'email'],
      instance_id: 'inst-1',
      from: 'noreply@example.com',
    });
    expect(result.success).toBe(true);
    expect(result.data.status).toBe('queued');
    expect(result.data.count).toBe(3);
    expect(result.data.message_ids).toEqual(['msg-1']);
    expect(result.data.sms_ids).toEqual(['sms-1']);
    expect(result.data.email_ids).toEqual(['em-1']);
  });
});

describe('Node.js SDK — SMS', () => {
  let zenvio: Zenvio;
  let mockPost: jest.Mock;
  let mockGet: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn();
    mockGet = jest.fn();
    (mockedAxios.create as jest.Mock).mockReturnValue({
      post: mockPost,
      get: mockGet,
      delete: jest.fn(),
      patch: jest.fn(),
    });
    zenvio = new Zenvio({ apiKey: 'test-key' });
  });

  it('sms.send calls POST /sms/send with to, message, schedule?, options?', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { status: 'queued', count: 1, sms_ids: ['sms-1'] },
      },
    });

    const result = await zenvio.sms.send({
      to: ['5511999999999'],
      message: 'Olá!',
    });

    expect(mockPost).toHaveBeenCalledWith('/sms/send', {
      to: ['5511999999999'],
      message: 'Olá!',
    });
    expect(result.success).toBe(true);
    expect(result.data.sms_ids).toEqual(['sms-1']);
    expect(result.data.status).toBe('queued');
  });

  it('sms.get calls GET /sms/:id', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          sms_id: 'sms-1',
          to: '5511999999999',
          message: 'Hi',
          status: 'DELIVERED',
          provider: null,
          external_id: null,
          sent_at: '2025-01-01T12:00:00.000Z',
          delivered_at: '2025-01-01T12:00:05.000Z',
          failed_at: null,
          scheduled_for: null,
          error_message: null,
          created_at: '2025-01-01T11:59:00.000Z',
        },
      },
    });

    const result = await zenvio.sms.get('sms-1');

    expect(mockGet).toHaveBeenCalledWith('/sms/sms-1');
    expect(result.data.sms_id).toBe('sms-1');
    expect(result.data.status).toBe('DELIVERED');
  });

  it('sms.cancel calls POST /sms/:id/cancel', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { sms_id: 'sms-1', status: 'cancelled' },
      },
    });

    const result = await zenvio.sms.cancel('sms-1');

    expect(mockPost).toHaveBeenCalledWith('/sms/sms-1/cancel');
    expect(result.success).toBe(true);
    expect(result.data.sms_id).toBe('sms-1');
    expect(result.data.status).toBe('cancelled');
  });
});

describe('Node.js SDK — Email', () => {
  let zenvio: Zenvio;
  let mockPost: jest.Mock;
  let mockGet: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn();
    mockGet = jest.fn();
    (mockedAxios.create as jest.Mock).mockReturnValue({
      post: mockPost,
      get: mockGet,
      delete: jest.fn(),
      patch: jest.fn(),
    });
    zenvio = new Zenvio({ apiKey: 'test-key' });
  });

  it('email.send calls POST /email/send with from, to, subject, text/html', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { email_ids: ['em-1'], status: 'queued', count: 1 },
      },
    });

    const result = await zenvio.email.send({
      from: 'noreply@example.com',
      to: ['user@example.com'],
      subject: 'Test',
      html: '<p>Hello</p>',
    });

    expect(mockPost).toHaveBeenCalledWith('/email/send', {
      from: 'noreply@example.com',
      to: ['user@example.com'],
      subject: 'Test',
      html: '<p>Hello</p>',
    });
    expect(result.data.email_ids).toEqual(['em-1']);
    expect(result.data.status).toBe('queued');
  });

  it('email.get calls GET /email/:id', async () => {
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
          externalId: null,
          scheduledFor: null,
          sentAt: '2025-01-01T12:00:00.000Z',
          deliveredAt: null,
          failedAt: null,
          errorMessage: null,
          createdAt: '2025-01-01T11:59:00.000Z',
        },
      },
    });

    const result = await zenvio.email.get('em-1');

    expect(mockGet).toHaveBeenCalledWith('/email/em-1');
    expect(result.data.id).toBe('em-1');
    expect(result.data.status).toBe('SENT');
  });

  it('email.cancel calls POST /email/:id/cancel', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: { email_id: 'em-1', status: 'cancelled' },
      },
    });

    const result = await zenvio.email.cancel('em-1');

    expect(mockPost).toHaveBeenCalledWith('/email/em-1/cancel');
    expect(result.data.status).toBe('cancelled');
  });
});
