import express from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());

// Matches real API: POST /v1/whatsapp/messages (body: instanceId, to, type, payload)
app.post('/v1/whatsapp/messages', (req, res) => {
  const instanceId = req.body.instanceId ?? req.body.instance_id;
  const { to, type, payload } = req.body;

  if (!instanceId || !to || !type || !payload) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  if (type === 'text' && !payload.message) {
    return res.status(400).json({ success: false, error: 'Text payload requires message field' });
  }

  if (['image', 'video', 'audio', 'document'].includes(type)) {
    const mediaUrl = payload.mediaUrl ?? payload.media_url;
    const fileName = payload.fileName ?? payload.file_name;
    if (!mediaUrl) return res.status(400).json({ success: false, error: `${type} requires payload.mediaUrl` });
    if (!fileName) return res.status(400).json({ success: false, error: `${type} requires payload.fileName` });
    if (!payload.mimetype) return res.status(400).json({ success: false, error: `${type} requires payload.mimetype` });
  }

  res.status(202).json({
    messageIds: ['api-msg-999'],
    status: 'queued',
  });
});

describe('Backend API Contract (WhatsApp send)', () => {
  it('accepts POST /v1/whatsapp/messages with instanceId in body', async () => {
    const response = await request(app)
      .post('/v1/whatsapp/messages')
      .send({
        instanceId: 'instance-123',
        to: ['5511999999999'],
        type: 'text',
        payload: { message: 'Hello' },
      });

    expect(response.status).toBe(202);
    expect(response.body.messageIds).toEqual(['api-msg-999']);
    expect(response.body.status).toBe('queued');
  });

  it('rejects text type without payload.message', async () => {
    const response = await request(app)
      .post('/v1/whatsapp/messages')
      .send({
        instanceId: 'instance-123',
        to: ['5511999999999'],
        type: 'text',
        payload: { url: 'http://wrong' },
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
