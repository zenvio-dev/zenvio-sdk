package main

import (
	"fmt"
	"github.com/notifique/notifique-sdk-go"
	"os"
)

func main() {
	apiKey := os.Getenv("NOTIFIQUE_API_KEY")
	phoneID := os.Getenv("NOTIFIQUE_INSTANCE_ID")
	recipient := os.Getenv("MY_PHONE")
	if apiKey == "" || phoneID == "" || recipient == "" {
		panic("set NOTIFIQUE_API_KEY, NOTIFIQUE_INSTANCE_ID and MY_PHONE before running this example")
	}
	client := notifique.NewClient(apiKey)

	fmt.Println("--- Notifique Go SDK Example ---")

	fmt.Println("\n1. Sending text...")
	resp, err := client.WhatsApp.SendText(phoneID, []string{recipient}, "Hello from Go! 🐹")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Result: Success=%v, MessageIDs=%v\n", resp.Success, resp.Data.MessageIDs)
	}

	fmt.Println("\n2. Sending image...")
	resp2, err := client.WhatsApp.Send(phoneID, notifique.WhatsAppSendParams{
		To:   []string{recipient},
		Type: "image",
		Payload: notifique.WhatsAppMediaPayload{
			MediaURL: "https://placehold.co/600x400/png",
			FileName: "image.png",
			Mimetype: "image/png",
		},
	})
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Printf("Result: Success=%v\n", resp2.Success)
	}
}
