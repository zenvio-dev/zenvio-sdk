# 🚀 Zenvio SDK

Welcome to the official Zenvio SDK monorepo. Zenvio provides a powerful, unified API for multi-channel communication, starting with WhatsApp.

This monorepo contains SDKs for all major programming languages, ensuring a seamless developer experience regardless of your tech stack.

---

## 📦 SDKs & Packages

| Language | Package | Status |
| :--- | :--- | :--- |
| **Node.js** | `@zenvio/sdk-node` | ✅ Stable |
| **Python** | `zenvio-sdk` | ✅ Stable |
| **Java** | `zenvio-sdk` | ✅ Stable |
| **Go** | `zenvio-sdk-go` | ✅ Stable |
| **PHP** | `zenvio-sdk-php` | ✅ Stable |
| **Elixir** | `zenvio_ex` | ✅ Stable |
| **.NET** | `Zenvio` | ✅ Stable |

---

## 🛠️ Quick Start (Unified API)

All Zenvio SDKs follow a consistent, namespaced architecture. Whether you are using Java or Python, the logic remains the same.

### Node.js
```typescript
const zenvio = new Zenvio({ apiKey: '...' });
await zenvio.whatsapp.sendText(phoneId, '55119...', 'Hello! 🚀');
```

### Python
```python
zenvio = Zenvio(api_key='...')
zenvio.whatsapp.send_text(phone_id, '55119...', 'Hello! 🐍')
```

### Java
```java
Zenvio zenvio = new Zenvio("...");
zenvio.whatsapp.sendText(phoneId, "55119...", "Hello! ☕");
```

### Go
```go
client := zenvio.NewClient("...")
client.WhatsApp.SendText(phoneID, []string{"55119..."}, "Hello! 🐹")
```

### PHP
```php
$zenvio = new Zenvio('...');
$zenvio.whatsapp.sendText($phoneId, '55119...', 'Hello! 🐘');
```

### C# (.NET)
```csharp
var client = new ZenvioClient("...");
await client.WhatsApp.SendTextAsync(instanceId, "55119...", "Hello! 🔷");
```

---

## 🎨 Message Types

Zenvio supports a wide variety of message types across all platforms:

- **Text**: Simple text messages with formatting.
- **Media**: Images, Documents, Audio, and Video.
- **Interactive**: Buttons and Lists for engaging user flows.
- **Templates**: Pre-approved Meta/WhatsApp templates with variables.

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
zenvio-sdk/
├── packages/      # Core SDK packages
└── examples/      # Multi-language implementation examples
```

---


# Task: Zenvio SDK Comprehensive Audit and Refinement (COMPLETED)

## Results Summary
All SDKs have been audited and updated to ensure consistency with the Zenvio Core Contract. Each language now possesses exhaustive test coverage for all message types and interactive payloads.

### 1. Contract and Type Verification
- ✅ **Node.js**: Strictly typed using `@zenvio/core`.
- ✅ **Python**: Used `TypedDict` and `Literal` for full static analysis support.
- ✅ **Java**: Robust POJO model in `com.zenvio.sdk.model` with Jackson annotations.
- ✅ **Elixir**: Functional map-based approach with clear documentation.
- ✅ **Go**: Strongly typed structs with JSON tags.
- ✅ **PHP**: PSR-4 compliant classes and types.

### 2. Exhaustive Test Coverage
Implemented real mock tests for ALL types:
- `text` (Shortcut and Full)
- `image`, `video`, `audio`, `document`
- `buttons`, `list`
- `template`
- API Error scenarios (400, 401, 429)

### 3. Documentation Completeness
- ✅ **READMEs**: Updated each SDK's README with exhaustive examples.
- ✅ **Root README**: Redesigned with premium aesthetics and unified quick-start guides.

### 4. Final Sanity Check
- ✅ No relative paths in examples.
- ✅ Consistent naming conventions (`phoneId`, `to`, `payload`).
- ✅ Dependencies verified for all languages.


## 📄 License

MIT © [Zenvio](https://zenvio.com)

