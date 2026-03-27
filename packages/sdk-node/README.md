# @notifique/sdk-node

SDK oficial Notifique para Node.js e TypeScript.

## Instalação

```bash
npm install @notifique/sdk-node
```

## Uso

```typescript
import { Notifique } from '@notifique/sdk-node';

const notifique = new Notifique({ apiKey: 'sua-api-key' });
const instanceId = 'id-da-instancia-whatsapp';

// Texto
await notifique.whatsapp.sendText(instanceId, '5511999999999', 'Olá!');

// Envio completo (texto)
await notifique.whatsapp.send(instanceId, {
  to: ['5511999999999'],
  type: 'text',
  payload: { message: 'Olá!' },
  options: {
    webhook: { url: 'https://seu-dominio.com/webhooks/notifique', secret: 'opcional' },
    autoReplyText: 'Obrigado pela resposta! Já vamos te atender.',
    fallback: { channel: 'sms' },
  },
});

// Imagem
await notifique.whatsapp.send(instanceId, {
  to: ['5511999999999'],
  type: 'image',
  payload: {
    mediaUrl: 'https://example.com/image.png',
    fileName: 'image.png',
    mimetype: 'image/png',
    caption: 'Legenda opcional',
  },
});

// SMS
await notifique.sms.send({ to: ['5511999999999'], message: 'SMS de teste' });

// E-mail
await notifique.email.send({
  from: 'noreply@seudominio.com',
  to: ['destino@email.com'],
  subject: 'Assunto',
  html: '<p>Corpo do e-mail</p>',
});

// Push
await notifique.push.messages.send({
  to: ['device-id'],
  title: 'Título',
  body: 'Corpo da notificação',
});
```

## Recursos

- Tipagem TypeScript com tipos do `@notifique/core`.
- Autenticação via API Key.
- API por namespaces: `whatsapp`, `sms`, `email`, `push`, `messages` (templates).
- WhatsApp: envio, listagem, status, edição, cancelamento, instâncias e QR.
- E-mail: envio, status, cancelamento e domínios (listar, criar, verificar).
- Push: apps, dispositivos e mensagens.
