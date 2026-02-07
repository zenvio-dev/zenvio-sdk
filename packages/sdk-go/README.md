# Zenvio Go SDK

Official Zenvio SDK for Go.

## Installation

```bash
go get github.com/zenvio/zenvio-sdk/packages/sdk-go
```

## Quick Start

```go
package main

import (
	"fmt"
	"github.com/zenvio/zenvio-sdk/packages/sdk-go"
)

func main() {
	// Initialize the client
	client := zenvio.NewClient("your-api-key")

	phoneID := "your-phone-id"
	to := []string{"5511999999999"}

	// 1. Simple text message
	resp, err := client.WhatsApp.SendText(phoneID, to, "Hello from Go! 🐹")
	if err != nil {
		panic(err)
	}
	fmt.Printf("Success: %v, MessageID: %s\n", resp.Success, resp.MessageID)
}
```

## Advanced Usage

```go
// Sending a Template
resp, err := client.WhatsApp.Send(phoneID, zenvio.SendParams{
    To:   []string{"5511999999999"},
    Type: zenvio.TypeTemplate,
    Payload: zenvio.TemplatePayload{
        Key:      "order_update",
        Language: "en_US",
        Variables: []string{"John", "Shipped"},
    },
})
```

## Requirements
- Go 1.20 or higher.
