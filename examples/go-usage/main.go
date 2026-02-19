package main

import (
	"fmt"
	"github.com/zenvio/zenvio-sdk/packages/sdk-go"
)

func main() {
	// 1. Initialize the client
	client := zenvio.NewClient("your_api_key_here")

	phoneID := "your_phone_id_here"
	recipient := "5511999999999"

	fmt.Println("--- Starting Zenvio Go SDK Example ---")

	// 2. Simple text message
	fmt.Println("\n1. Sending simplified text...")
	resp, err := client.WhatsApp.SendText(phoneID, []string{recipient}, "Hello from Go! 🐹")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Result: Success=%v, Error=%s\n", resp.Success, resp.Error)
	}

	// 3. Full parameters example (Template)
	fmt.Println("\n2. Sending template message...")
	resp2, err := client.WhatsApp.Send(phoneID, zenvio.SendParams{
		To:   []string{recipient},
		Type: zenvio.TypeTemplate,
		Payload: zenvio.TemplatePayload{
			Key:       "welcome_template",
			Language:  "en_US",
			Variables: []string{"Go Developer"},
		},
	})
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Result: Success=%v, MessageID=%s\n", resp2.Success, resp2.MessageID)
	}

	// 4. Image example (media_url, file_name, mimetype obrigatórios)
	fmt.Println("\n3. Sending image...")
	resp3, err := client.WhatsApp.Send(phoneID, zenvio.WhatsAppSendParams{
		To:   []string{recipient},
		Type: "image",
		Payload: zenvio.WhatsAppMediaPayload{
			MediaURL: "https://placehold.co/600x400/png",
			FileName: "image.png",
			Mimetype: "image/png",
		},
	})
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Result: Success=%v\n", resp3.Success)
	}
}
