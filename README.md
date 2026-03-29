# 🚀 Notifique SDK

Monorepo oficial de SDKs multilíngues para a API de mensageria multicanal da Notifique: WhatsApp, SMS, Email e Push.

Todos os SDKs utilizam `https://api.notifique.dev/v1` e compartilham a mesma arquitetura de namespaces.

---

## 📦 Pacotes

| Linguagem | Pacote | Documentação |
| :--- | :--- | :--- |
| **Node.js / TypeScript** | `@notifique/core`, `@notifique/sdk-node` | [README](./packages/sdk-node/README.md) |
| **n8n** | `n8n-nodes-notifique` | [README](./packages/n8n-nodes-notifique/README.md) |
| **Python** | `notifique-sdk` | [README](./packages/sdk-python/README.md) |
| **Java** | `com.notifique.sdk` | [README](./packages/sdk-java/README.md) |
| **Go** | `github.com/notifique/notifique-sdk-go` | [README](./packages/sdk-go/README.md) |
| **PHP** | `notifique/notifique-sdk-php` | [README](./packages/sdk-php/README.md) |
| **Elixir** | `notifique` | [README](./packages/sdk-elixir/README.md) |
| **.NET** | `Notifique` | [README](./packages/sdk-dotnet/README.md) |

---

## 🛠️ Início Rápido

### Node.js / TypeScript

```typescript
import { Notifique } from '@notifique/sdk-node';

// Crie uma única vez ao iniciar a aplicação — NÃO instancie por requisição.
const client = new Notifique({ apiKey: 'YOUR_API_KEY' });

const { data } = await client.whatsapp.sendText(instanceId, '5511999999999', 'Olá! 🚀');
console.log(data.messageIds);
```

### Python

```python
from notifique import Notifique

client = Notifique(api_key='YOUR_API_KEY')
result = client.whatsapp.send_text(instance_id, '5511999999999', 'Olá! 🐍')
```

### Java

```java
Notifique client = new Notifique("YOUR_API_KEY");
client.getWhatsApp().sendText(instanceId, "5511999999999", "Olá! ☕");
```

### Go

```go
client := notifique.NewClient("YOUR_API_KEY")
resp, err := client.WhatsApp.SendText(instanceID, []string{"5511999999999"}, "Olá! 🐹")
```

### PHP

```php
$client = new Notifique\Notifique('YOUR_API_KEY');
$client->whatsapp()->sendText($instanceId, '5511999999999', 'Olá! 🐘');
```

### C# (.NET)

```csharp
using var client = new NotifiqueClient("YOUR_API_KEY");
await client.WhatsApp.SendTextAsync(instanceId, "5511999999999", "Olá! 🔷");
```

### Elixir

```elixir
client = Notifique.new("YOUR_API_KEY")
{:ok, body} = Notifique.Whatsapp.send_text(client, instance_id, ["5511999999999"], "Olá!")
```

---

## ✅ Canais e Recursos

### WhatsApp
- **Envio** — texto, imagem, vídeo, áudio, documento, localização, contato (com agendamento e opções)
- **Mensagens** — listar, consultar status, editar, excluir, cancelar
- **Instâncias** — listar, consultar, criar, desconectar, excluir; obter QR
- **Opções** — webhook por mensagem, texto de resposta automática, fallback para SMS, chave de idempotência

### SMS
- **Envio** — uma ou mais mensagens (1–100 números), com agendamento
- **Status** — consultar por ID
- **Cancelamento** — cancelar SMS agendado

### Email
- **Envio** — um ou mais emails (`from`, `subject`, `text/html`), com agendamento
- **Status** — consultar por ID
- **Cancelamento** — cancelar email agendado
- **Domínios** — listar, criar, consultar, verificar (DNS)

### Push
- **Apps** — listar, consultar, criar, atualizar, excluir
- **Dispositivos** — registrar (web/android/ios), listar, consultar, excluir
- **Mensagens** — enviar, listar, consultar, cancelar

### Mensagens (templates)
- Envio via template em múltiplos canais (whatsapp, sms, email) com variáveis

---

## 🛡️ Segurança

Todos os SDKs:
- Validam a API key no momento da inicialização (falha rápida em vez de falhar na requisição)
- Definem timeout de 30 segundos por padrão nas requisições
- Utilizam HTTPS exclusivamente
- Suportam chaves de idempotência em operações de envio (WhatsApp, SMS, Email, Push)
- Lançam um erro tipado `NotifiqueApiError` / equivalente para respostas 4xx/5xx

---

## 🏗️ Estrutura do Monorepo

```
notifique-sdk/
├── packages/
│   ├── core/                  # Tipos TypeScript compartilhados
│   ├── sdk-node/              # SDK Node.js / TypeScript
│   ├── sdk-python/            # SDK Python
│   ├── sdk-go/                # SDK Go
│   ├── sdk-java/              # SDK Java
│   ├── sdk-php/               # SDK PHP
│   ├── sdk-elixir/            # SDK Elixir
│   ├── sdk-dotnet/            # SDK .NET
│   └── n8n-nodes-notifique/   # Node de comunidade do n8n
└── examples/                  # Exemplos de uso por linguagem
```

---

## 🧪 Testes

```bash
# Node.js (Jest — executa todos os testes TypeScript)
npm test

# Python
cd packages/sdk-python && pytest

# Go
cd packages/sdk-go && go test ./...

# .NET
cd packages/sdk-dotnet && dotnet test

# Java
cd packages/sdk-java && mvn test
```

---

## 📄 Licença

MIT © [Notifique](https://notifique.com)
