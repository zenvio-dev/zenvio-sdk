# 🚀 Notifique SDK

Monorepo dos SDKs oficiais **Notifique** para comunicação multicanal: WhatsApp, SMS, Email e Push.

Todos os SDKs usam por padrão a base URL `https://api.notifique.dev/v1` e seguem a mesma arquitetura por namespaces.

---

## 📦 SDKs e pacotes

| Linguagem | Pacote | Status |
| :--- | :--- | :--- |
| **Node.js** | `@notifique/core`, `@notifique/sdk-node` | ✅ Estável |
| **n8n** | `n8n-nodes-notifique` | ✅ Estável |
| **Python** | `notifique-sdk` (classe `Notifique`) | ✅ Estável |
| **Java** | `com.notifique.sdk` (classe `Notifique`) | ✅ Estável |
| **Go** | `github.com/notifique/notifique-sdk-go` (pacote `notifique`) | ✅ Estável |
| **PHP** | `notifique/notifique-sdk-php` (classe `Notifique\Notifique`) | ✅ Estável |
| **Elixir** | `notifique` (módulo `Notifique`) | ✅ Estável |
| **.NET** | `Notifique` (classe `NotifiqueClient`) | ✅ Estável |

---

## 🛠️ Quick Start (API unificada)

Use o cliente **Notifique** (ou equivalente) e a mesma lógica em todas as linguagens.

### Node.js
```typescript
const notifique = new Notifique({ apiKey: '...' });
const { data } = await notifique.whatsapp.sendText(instanceId, '55119...', 'Hello! 🚀');
```

### Python
```python
notifique = Notifique(api_key='...')
resp = notifique.whatsapp.send_text(instance_id, '55119...', 'Hello! 🐍')
```

### Java
```java
Notifique notifique = new Notifique("...");
WhatsAppSendEnvelope r = notifique.getWhatsApp().sendText(instanceId, "55119...", "Hello! ☕");
```

### Go
```go
client := notifique.NewClient("...")
r, _ := client.WhatsApp.SendText(instanceID, []string{"55119..."}, "Hello! 🐹")
```

### PHP
```php
$notifique = new Notifique('...');
$notifique->whatsapp()->sendText($instanceId, '55119...', 'Hello! 🐘');
```

### C# (.NET)
```csharp
var client = new NotifiqueClient("...");
var response = await client.WhatsApp.SendTextAsync(instanceId, "55119...", "Hello! 🔷");
```

### Elixir
```elixir
client = Notifique.new("...")
{:ok, body} = Notifique.Whatsapp.send_text(client, instance_id, ["55119..."], "Hello!")
```

---

## O que está disponível em cada canal

### WhatsApp
- **Envio** — texto, imagem, vídeo, áudio, documento, localização, contato (com agendamento e opções).
- **Mensagens** — listar, obter status, editar, apagar, cancelar.
- **Instâncias** — listar, obter, criar, desconectar, excluir; obter QR da instância.

### SMS
- **Envio** — uma ou mais mensagens (1–100 números), com agendamento e opções.
- **Status** — consultar por ID.
- **Cancelar** — cancelar SMS agendado.

### Email
- **Envio** — um ou mais e-mails (remetente, assunto, texto/html), com agendamento.
- **Status** — consultar por ID.
- **Cancelar** — cancelar e-mail agendado.
- **Domínios** — listar, criar, obter, verificar (DNS).

### Push
- **Apps** — listar, obter, criar, atualizar, excluir.
- **Devices** — registrar (web/android/ios), listar, obter, excluir.
- **Mensagens** — enviar, listar, obter, cancelar.

### Messages (templates)
- **Envio** — por template em múltiplos canais (whatsapp, sms, email) com variáveis e `instance_id`.

---

## 🛡️ Robust & Tested

Every SDK in this repository undergoes rigorous automated testing:
- **Mocked HTTP interactions** for reliable unit tests.
- **Strictly typed contracts** to prevent runtime errors.
- **Comprehensive coverage** of all payload types.

---

## 📄 Documentation

For detailed installation and usage instructions, please refer to the individual package directories:

- [Node.js SDK](./packages/sdk-node)
- [n8n Node](./packages/n8n-nodes-notifique)
- [Python SDK](./packages/sdk-python)
- [Java SDK](./packages/sdk-java)
- [Go SDK](./packages/sdk-go)
- [PHP SDK](./packages/sdk-php)
- [Elixir SDK](./packages/sdk-elixir)
- [.NET SDK](./packages/sdk-dotnet)

---

## 🏗️ Development

This project uses a monorepo structure. 

```text
notifique-sdk/
├── packages/      # Pacotes dos SDKs
└── examples/      # Exemplos em várias linguagens
```

---

## 📄 Licença

MIT © [Notifique](https://notifique.com)

