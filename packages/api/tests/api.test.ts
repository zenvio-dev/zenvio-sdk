import express from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());

// Matches real API: POST /v1/whatsapp/send (body: instance_id, to, type, payload)
app.post('/v1/whatsapp/send', (req, res) => {
  const { instance_id, to, type, payload } = req.body;

  if (!instance_id || !to || !type || !payload) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  if (type === 'text' && !payload.message) {
    return res.status(400).json({ success: false, error: 'Text payload requires message field' });
  }

  if (['image', 'video', 'audio', 'document'].includes(type)) {
    if (!payload.media_url) return res.status(400).json({ success: false, error: `${type} requires payload.media_url` });
    if (!payload.file_name) return res.status(400).json({ success: false, error: `${type} requires payload.file_name` });
    if (!payload.mimetype) return res.status(400).json({ success: false, error: `${type} requires payload.mimetype` });
  }

  res.status(202).json({
    message_ids: ['api-msg-999'],
    status: 'queued',
  });
});

describe('Backend API Contract (WhatsApp send)', () => {
  it('accepts POST /v1/whatsapp/send with instance_id in body', async () => {
    const response = await request(app)
      .post('/v1/whatsapp/send')
      .send({
        instance_id: 'instance-123',
        to: ['5511999999999'],
        type: 'text',
        payload: { message: 'Hello' },
      });

    expect(response.status).toBe(202);
    expect(response.body.message_ids).toEqual(['api-msg-999']);
    expect(response.body.status).toBe('queued');
  });

  it('rejects text type without payload.message', async () => {
    const response = await request(app)
      .post('/v1/whatsapp/send')
      .send({
        instance_id: 'instance-123',
        to: ['5511999999999'],
        type: 'text',
        payload: { url: 'http://wrong' },
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
