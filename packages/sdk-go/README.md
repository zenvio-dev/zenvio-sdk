# Zenvio Go SDK

SDK oficial Zenvio para Go — WhatsApp, SMS, Email e envio por template (messages).

## Instalação

```bash
go get github.com/zenvio/zenvio-sdk/packages/sdk-go
```

## Uso rápido

```go
package main

import (
	"fmt"
	"github.com/zenvio/zenvio-sdk/packages/sdk-go"
)

func main() {
	client := zenvio.NewClient("sua-api-key")
	instanceID := "sua-instancia-whatsapp"
	to := []string{"5511999999999"}

	// WhatsApp — texto
	resp, err := client.WhatsApp.SendText(instanceID, to, "Olá pelo Go!")
	if err != nil {
		if apiErr, ok := err.(*zenvio.APIError); ok {
			fmt.Printf("API erro %d: %s\n", apiErr.Code, apiErr.Body)
			return
		}
		panic(err)
	}
	fmt.Printf("Enviado: %v\n", resp.MessageIDs)
}
```

## WhatsApp

- **POST /v1/whatsapp/send** — `Send(instanceID, params)` ou `SendText(instanceID, to, text)`
- **GET/DELETE/PATCH/POST** — `GetMessage(id)`, `DeleteMessage(id)`, `EditMessage(id, text)`, `CancelMessage(id)`
- **Instâncias** — `ListInstances(params)`, `GetInstance(id)`, `CreateInstance(name)`, `DisconnectInstance(id)`, `DeleteInstance(id)`

```go
// Texto
resp, _ := client.WhatsApp.SendText(instanceID, []string{"5511999999999"}, "Oi")

// Mídia (image, video, audio, document)
params := zenvio.WhatsAppSendParams{
	InstanceID: instanceID,
	To:         []string{"5511999999999"},
	Type:       "image",
	Payload:    zenvio.WhatsAppMediaPayload{MediaURL: "https://exemplo.com/img.png", FileName: "img.png", Mimetype: "image/png"},
}
resp, _ := client.WhatsApp.Send(instanceID, params)

// Status da mensagem
status, _ := client.WhatsApp.GetMessage("msg-123")
```

## SMS

```go
resp, err := client.SMS.Send(zenvio.SmsSendParams{
	To:      []string{"5511999999999"},
	Message: "Seu código: 123",
})
// resp.Data.SmsIDs

status, _ := client.SMS.Get("sms-id")
```

## Email

```go
resp, err := client.Email.Send(zenvio.EmailSendParams{
	From:    "noreply@seudominio.com",
	To:      []string{"cliente@email.com"},
	Subject: "Assunto",
	Text:    "Corpo em texto",
	HTML:    "<p>Corpo HTML</p>",
})
// resp.Data.EmailIDs

status, _ := client.Email.Get("email-id")
client.Email.Cancel("email-id")
```

## Messages (template)

Envio por template em múltiplos canais (whatsapp, sms, email).

```go
resp, err := client.Messages.Send(zenvio.MessagesSendParams{
	To:         []string{"5511999999999"},
	Template:   "welcome",
	Variables:  map[string]interface{}{"name": "João"},
	Channels:   []string{"whatsapp", "sms"},
	InstanceID: "inst-whatsapp",
})
// resp.Data.MessageIDs, resp.Data.SmsIDs, etc.
```

## Erros

Em respostas 4xx/5xx o SDK retorna `*zenvio.APIError` com `Code` (int) e `Body` (string).

```go
resp, err := client.WhatsApp.SendText(inst, to, "Hi")
if err != nil {
	var apiErr *zenvio.APIError
	if errors.As(err, &apiErr) {
		log.Printf("API %d: %s", apiErr.Code, apiErr.Body)
	}
	return
}
```

## Requisitos

- Go 1.20+
