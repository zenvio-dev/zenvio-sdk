# n8n-nodes-notifique

Community n8n node to use Notifique with a no-code setup.

## Available resources

- WhatsApp Messages: list, send text, get status, edit, cancel, delete
- WhatsApp Groups: list groups, list participants, add/remove participants, send/revoke invite, get invite code
- WhatsApp Instances: list, create, get, delete, get QR code, disconnect
- SMS: send, get status, cancel scheduled message
- Email: send, get status, cancel scheduled message
- Templates: multichannel send
- Contacts: list, create, get, update, delete
- Tags: list, create, get, update, delete
- Email Domains: list, create, get, verify DNS
- Push Apps: list, create, get, update, delete
- Push Devices: register, list, get, delete
- Push Messages: send, list, get, cancel

## Installation

On self-hosted n8n:

```bash
npm install n8n-nodes-notifique
```

## Credentials

Create `Notifique API` credential with:

- `API Key`: your Notifique key
- `Base URL`: optional (default: `https://api.notifique.dev/v1`)

## Reliability features

- `Idempotency Key` for safe retries on send operations
- explicit confirmation guard for sensitive operations (`cancel` and `delete`)

## Example templates

Templates available in `templates/`:

- `whatsapp-from-webhook.json`
- `payment-failure-multichannel.json`

