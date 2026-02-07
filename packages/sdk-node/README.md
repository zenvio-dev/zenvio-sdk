# @zenvio/sdk-node

Official Zenvio SDK for Node.js and TypeScript.

## Installation

```bash
npm install @zenvio/sdk-node
```

## Usage

```typescript
import { Zenvio } from '@zenvio/sdk-node';

const zenvio = new Zenvio({ apiKey: 'your-api-key' });
const phoneId = 'your-phone-id';

// Simplified Text
await zenvio.whatsapp.sendText(phoneId, '...', 'Hello!');

// Full Send Method (Text)
await zenvio.whatsapp.send(phoneId, {
  to: ['...'],
  type: 'text',
  payload: { text: 'Hello!' }
});

// Image Message
await zenvio.whatsapp.send(phoneId, {
  to: ['...'],
  type: 'image',
  payload: { 
    url: 'https://example.com/image.png',
    caption: 'Check this out!'
  }
});

// Template Message
await zenvio.whatsapp.send(phoneId, {
  to: ['...'],
  type: 'template',
  payload: {
    key: 'order_status',
    language: 'en_US',
    variables: ['John', 'Shipped']
  }
});

// Buttons (Interactive)
await zenvio.whatsapp.send(phoneId, {
  to: ['...'],
  type: 'buttons',
  payload: {
    body: 'Did you like it?',
    buttons: [
      { id: 'yes', label: 'Yes' },
      { id: 'no', label: 'No' }
    ]
  }
});
```

## Features

- Strong TypeScript support with strictly typed payloads.
- Automatic API key authorization.
- Simple, namespaced API (`zenvio.whatsapp`).
- Future-proof design for multiple communication channels.
