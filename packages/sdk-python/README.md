# Zenvio Python SDK

SDK oficial Zenvio para Python — **WhatsApp**, **SMS**, **Email** e envio por **template** (multi-canal). Tipado com `TypedDict`.

## Instalação

```bash
pip install zenvio-sdk
```

## Uso

```python
from zenvio import Zenvio

zenvio = Zenvio(api_key="sua_api_key")
```

### WhatsApp

- **POST /v1/whatsapp/send** — `instance_id` no body (não na URL).
- Texto: `payload.message`. Mídia: `payload.media_url`.

```python
# Texto
r = zenvio.whatsapp.send_text(instance_id, "5511999999999", "Olá!")

# Envio completo (text, image, video, audio, document, location, contact)
r = zenvio.whatsapp.send(instance_id, {
    "to": ["5511999999999"],
    "type": "text",
    "payload": {"message": "Oi"},
})

# Status, apagar, editar, cancelar
status = zenvio.whatsapp.get_message(message_id)
zenvio.whatsapp.delete_message(message_id)
zenvio.whatsapp.edit_message(message_id, "Novo texto")
zenvio.whatsapp.cancel_message(message_id)

# Instâncias
instances = zenvio.whatsapp.list_instances()
one = zenvio.whatsapp.get_instance(instance_id)
zenvio.whatsapp.create_instance({"name": "Minha Instância"})
zenvio.whatsapp.disconnect_instance(instance_id)
zenvio.whatsapp.delete_instance(instance_id)
```

### SMS

```python
r = zenvio.sms.send({"to": ["5511999999999"], "message": "SMS de teste"})
# r["data"]["sms_ids"], r["data"]["status"]

status = zenvio.sms.get(sms_id)
```

### Email

- Use **`from_address`** no dict (a API recebe `from`).

```python
r = zenvio.email.send({
    "from_address": "noreply@seudominio.com",
    "to": ["user@example.com"],
    "subject": "Assunto",
    "html": "<p>Corpo</p>",
})
# r["data"]["email_ids"]

status = zenvio.email.get(email_id)
zenvio.email.cancel(email_id)  # apenas agendados
```

### Mensagens por template (whatsapp + sms + email)

- **POST /v1/templates/send** — envia para os canais indicados.
- Se `channels` incluir `whatsapp`, informe `instance_id`. Se incluir `email`, informe `from_address` (ou `from` no dict).

```python
r = zenvio.messages.send({
    "to": ["5511999999999", "user@example.com"],
    "template": "welcome",
    "variables": {"name": "Trial", "credits": 300},
    "channels": ["whatsapp", "sms", "email"],
    "instance_id": "sua_instancia_id",
    "from_address": "noreply@seudominio.com",
})
# r["data"]["message_ids"], r["data"]["sms_ids"], r["data"]["email_ids"]
```

## Tipos

Todos os request/response estão tipados em `zenvio.types` (e reexportados em `zenvio`):

- `WhatsAppSendParams`, `WhatsAppSendResponse`, `WhatsAppMessageStatus`, …
- `SmsSendParams`, `SmsSendResponse`, `SmsStatusResponse`
- `EmailSendParams`, `EmailSendResponse`, `EmailStatusResponse`, `EmailCancelResponse`
- `MessagesSendParams`, `MessagesSendResponse`, `TemplateChannel`

## Erros

Em respostas 4xx/5xx o cliente chama `response.raise_for_status()`; use `try/except requests.HTTPError` para tratar.

## Requisitos

- Python 3.8+
- `requests`
