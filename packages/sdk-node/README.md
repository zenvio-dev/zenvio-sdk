# @notifique/sdk-node

Official Notifique SDK for Node.js and TypeScript — WhatsApp, SMS, Email, Push, and template sends.

## Installation

```bash
npm install @notifique/sdk-node
```

## Quick Start

```typescript
import { Notifique } from '@notifique/sdk-node';

// Create once and reuse — do NOT create a new instance per request.
const notifique = new Notifique({ apiKey: 'your-api-key' });
const instanceId = 'your-whatsapp-instance-id';

// Send a text message
const result = await notifique.whatsapp.sendText(instanceId, '5511999999999', 'Hello!');
console.log(result.data.messageIds);
```

> **Singleton pattern:** Axios creates a persistent HTTP connection pool. Instantiating `Notifique` per request will accumulate interceptors and exhaust memory. Create it once at application startup.

## WhatsApp

```typescript
// Text (shortcut)
await notifique.whatsapp.sendText(instanceId, '5511999999999', 'Hello!');

// Full send — text, image, video, audio, document, location, contact
await notifique.whatsapp.send(instanceId, {
  to: ['5511999999999'],
  type: 'text',
  payload: { message: 'Hello!' },
  options: {
    webhook: { url: 'https://your-domain.com/hooks/notifique', secret: 'optional' },
    autoReplyText: 'Thanks! We will get back to you soon.',
    fallback: { channel: 'sms' },
  },
});

// Image
await notifique.whatsapp.send(instanceId, {
  to: ['5511999999999'],
  type: 'image',
  payload: { mediaUrl: 'https://example.com/image.png', fileName: 'image.png', mimetype: 'image/png', caption: 'Optional caption' },
});

// Idempotency key (prevents duplicate sends on retry)
await notifique.whatsapp.sendText(instanceId, '5511999999999', 'Hello!', { idempotencyKey: 'unique-key-123' });

// Message management
await notifique.whatsapp.listMessages({ page: '1', limit: '20' });
await notifique.whatsapp.getMessage(messageId);
await notifique.whatsapp.editMessage(messageId, { text: 'Updated text' });
await notifique.whatsapp.deleteMessage(messageId);
await notifique.whatsapp.cancelMessage(messageId);  // cancel scheduled

// Instance management
await notifique.whatsapp.listInstances();
await notifique.whatsapp.getInstance(instanceId);
await notifique.whatsapp.getInstanceQr(instanceId);
await notifique.whatsapp.createInstance({ name: 'My Instance' });
await notifique.whatsapp.disconnectInstance(instanceId);
await notifique.whatsapp.deleteInstance(instanceId);
```

## SMS

```typescript
await notifique.sms.send({ to: ['5511999999999'], message: 'SMS text' });
await notifique.sms.send({ to: ['5511999999999'], message: 'SMS text' }, { idempotencyKey: 'key' });
await notifique.sms.get(smsId);
await notifique.sms.cancel(smsId);
```

## Email

```typescript
await notifique.email.send({
  from: 'noreply@yourdomain.com',
  to: ['user@example.com'],
  subject: 'Subject',
  html: '<p>HTML body</p>',
});
await notifique.email.send({ ... }, { idempotencyKey: 'key' });
await notifique.email.get(emailId);
await notifique.email.cancel(emailId);

// Domain management
await notifique.email.domains.list();
await notifique.email.domains.create({ domain: 'yourdomain.com' });
await notifique.email.domains.get(domainId);
await notifique.email.domains.verify(domainId);
```

## Push

```typescript
// Apps
await notifique.push.apps.list();
await notifique.push.apps.get(appId);
await notifique.push.apps.create({ name: 'My App' });
await notifique.push.apps.update(appId, { name: 'New name' });
await notifique.push.apps.delete(appId);

// Devices
await notifique.push.devices.register({ appId, platform: 'web', subscription: { endpoint, keys: { p256dh, auth } } });
await notifique.push.devices.list({ appId });
await notifique.push.devices.get(deviceId);
await notifique.push.devices.delete(deviceId);

// Messages
await notifique.push.messages.send({ to: [deviceId], title: 'Title', body: 'Body' });
await notifique.push.messages.send({ ... }, { idempotencyKey: 'key' });
await notifique.push.messages.list({ status: 'SENT' });
await notifique.push.messages.get(messageId);
await notifique.push.messages.cancel(messageId);
```

## Multi-channel Template Send

```typescript
await notifique.messages.send({
  to: ['5511999999999', 'user@example.com'],
  template: 'welcome',
  variables: { name: 'Alice', credits: 300 },
  channels: ['whatsapp', 'sms', 'email'],
  instanceId: 'your-instance-id',
  from: 'noreply@yourdomain.com',
});
```

## Error Handling

```typescript
import { NotifiqueApiError } from '@notifique/sdk-node';

try {
  await notifique.whatsapp.sendText(instanceId, '5511999999999', 'Hello');
} catch (err) {
  if (err instanceof NotifiqueApiError) {
    console.error(err.statusCode, err.message, err.responseData);
  }
}
```

## TypeScript

All methods are fully typed via `@notifique/core`. Generic payload types are inferred from the `type` discriminator:

```typescript
// TypeScript infers the correct payload type for 'image'
await notifique.whatsapp.send(instanceId, {
  to: ['5511999999999'],
  type: 'image',
  payload: { mediaUrl: '...', fileName: '...', mimetype: 'image/png' }, // ✅ typed
});
```
