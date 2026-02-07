package zenvio

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestWhatsAppSendExhaustive(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if auth := r.Header.Get("Authorization"); auth != "Bearer test-key" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(SendResponse{Success: true, MessageID: "go-msg-123"})
	}))
	defer server.Close()

	client := NewClientWithConfig(Config{APIKey: "test-key", BaseURL: server.URL})

	// 1. Text Shortcut
	resp, err := client.WhatsApp.SendText("p1", []string{"123"}, "Hello")
	if err != nil || !resp.Success {
		t.Errorf("SendText failed: %v", err)
	}

	// 2. Full Media
	resp, _ = client.WhatsApp.Send("p1", SendParams{
		Type: TypeVideo,
		Payload: MediaPayload{URL: "http://v.mp4", Caption: "Video"},
	})
	if !resp.Success {
		t.Error("Send Video failed")
	}

	// 3. Buttons
	resp, _ = client.WhatsApp.Send("p1", SendParams{
		Type: TypeButtons,
		Payload: ButtonsPayload{
			Body: "Choose",
			Buttons: []Button{{ID: "1", Label: "Ok"}},
		},
	})
	if !resp.Success {
		t.Error("Send Buttons failed")
	}

	// 4. List
	resp, _ = client.WhatsApp.Send("p1", SendParams{
		Type: TypeList,
		Payload: ListPayload{
			Body: "Pick",
			Sections: []interface{}{},
		},
	})
	if !resp.Success {
		t.Error("Send List failed")
	}

	// 5. Template
	resp, _ = client.WhatsApp.Send("p1", SendParams{
		Type: TypeTemplate,
		Payload: TemplatePayload{
			Key: "welcome",
			Language: "en",
		},
	})
	if !resp.Success {
		t.Error("Send Template failed")
	}

	// 6. Error Case
	serverErr := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(SendResponse{Success: false, Error: "API Error"})
	}))
	defer serverErr.Close()
	clientErr := NewClientWithConfig(Config{APIKey: "k", BaseURL: serverErr.URL})
	resp, _ = clientErr.WhatsApp.SendText("p", []string{"1"}, "hi")
	if resp.Success || resp.Error != "API Error" {
		t.Error("Error handling failed")
	}
}
