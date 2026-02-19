package zenvio

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestWhatsAppSendText(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Authorization") != "Bearer test-key" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		if r.URL.Path != "/whatsapp/send" || r.Method != "POST" {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(WhatsAppSendResponse{
			MessageIDs: []string{"msg-123"},
			Status:     "queued",
		})
	}))
	defer server.Close()

	client := NewClientWithConfig(Config{APIKey: "test-key", BaseURL: server.URL})
	resp, err := client.WhatsApp.SendText("instance-1", []string{"5511999999999"}, "Hello")
	if err != nil {
		t.Fatalf("SendText: %v", err)
	}
	if len(resp.MessageIDs) != 1 || resp.MessageIDs[0] != "msg-123" {
		t.Errorf("unexpected response: %+v", resp)
	}
}

func TestWhatsAppSendError(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid instance"})
	}))
	defer server.Close()

	client := NewClientWithConfig(Config{APIKey: "k", BaseURL: server.URL})
	_, err := client.WhatsApp.SendText("x", []string{"123"}, "hi")
	if err == nil {
		t.Fatal("expected APIError")
	}
	apiErr, ok := err.(*APIError)
	if !ok || apiErr.Code != 400 {
		t.Errorf("expected *APIError 400, got %T %v", err, err)
	}
}

func TestWhatsAppSendWithParams(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(WhatsAppSendResponse{MessageIDs: []string{"m1"}, Status: "queued"})
	}))
	defer server.Close()

	client := NewClientWithConfig(Config{APIKey: "k", BaseURL: server.URL})
	params := WhatsAppSendParams{
		To:   []string{"5511888888888"},
		Type: "text",
		Payload: WhatsAppTextPayload{Message: "Hi"},
	}
	resp, err := client.WhatsApp.Send("instance-1", params)
	if err != nil {
		t.Fatal(err)
	}
	if len(resp.MessageIDs) != 1 || resp.MessageIDs[0] != "m1" {
		t.Errorf("unexpected: %+v", resp)
	}
}

func TestWhatsAppGetMessage(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(WhatsAppMessageStatus{MessageID: "msg-1", Status: "delivered"})
	}))
	defer server.Close()

	client := NewClientWithConfig(Config{APIKey: "k", BaseURL: server.URL})
	status, err := client.WhatsApp.GetMessage("msg-1")
	if err != nil {
		t.Fatal(err)
	}
	if status.MessageID != "msg-1" || status.Status != "delivered" {
		t.Errorf("unexpected: %+v", status)
	}
}

func TestWhatsAppListInstances(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(WhatsAppInstanceListResponse{
			Success: true,
			Data:    []WhatsAppInstance{},
			Pagination: WhatsAppPagination{Total: 0, Page: 1, Limit: 10},
		})
	}))
	defer server.Close()

	client := NewClientWithConfig(Config{APIKey: "k", BaseURL: server.URL})
	list, err := client.WhatsApp.ListInstances(nil)
	if err != nil {
		t.Fatal(err)
	}
	if !list.Success {
		t.Error("expected success")
	}
}

func TestSmsSend(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/sms/send" {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		w.WriteHeader(http.StatusOK)
		r := SmsSendResponse{Success: true}
		r.Data.Status = "queued"
		r.Data.Count = 1
		r.Data.SmsIDs = []string{"sms-1"}
		json.NewEncoder(w).Encode(r)
	}))
	defer server.Close()

	client := NewClientWithConfig(Config{APIKey: "k", BaseURL: server.URL})
	resp, err := client.SMS.Send(SmsSendParams{To: []string{"5511999999999"}, Message: "Test"})
	if err != nil {
		t.Fatal(err)
	}
	if !resp.Success || len(resp.Data.SmsIDs) != 1 || resp.Data.SmsIDs[0] != "sms-1" {
		t.Errorf("unexpected: %+v", resp)
	}
}

func TestSmsGet(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		r := SmsStatusResponse{Success: true}
		r.Data.SmsID = "sms-1"
		r.Data.Status = "delivered"
		json.NewEncoder(w).Encode(r)
	}))
	defer server.Close()

	client := NewClientWithConfig(Config{APIKey: "k", BaseURL: server.URL})
	resp, err := client.SMS.Get("sms-1")
	if err != nil {
		t.Fatal(err)
	}
	if !resp.Success || resp.Data.SmsID != "sms-1" {
		t.Errorf("unexpected: %+v", resp)
	}
}

func TestSmsCancel(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/sms/sms-1/cancel" {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		w.WriteHeader(http.StatusOK)
		r2 := SmsCancelResponse{Success: true}
		r2.Data.SmsID = "sms-1"
		r2.Data.Status = "cancelled"
		json.NewEncoder(w).Encode(r2)
	}))
	defer server.Close()

	client := NewClientWithConfig(Config{APIKey: "k", BaseURL: server.URL})
	resp, err := client.SMS.Cancel("sms-1")
	if err != nil {
		t.Fatal(err)
	}
	if !resp.Success || resp.Data.SmsID != "sms-1" {
		t.Errorf("unexpected: %+v", resp)
	}
}

func TestEmailSend(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		r := EmailSendResponse{Success: true}
		r.Data.EmailIDs = []string{"email-1"}
		r.Data.Status = "queued"
		json.NewEncoder(w).Encode(r)
	}))
	defer server.Close()

	client := NewClientWithConfig(Config{APIKey: "k", BaseURL: server.URL})
	resp, err := client.Email.Send(EmailSendParams{
		From: "noreply@example.com", To: []string{"u@example.com"},
		Subject: "Test", Text: "Body",
	})
	if err != nil {
		t.Fatal(err)
	}
	if !resp.Success || len(resp.Data.EmailIDs) != 1 {
		t.Errorf("unexpected: %+v", resp)
	}
}

func TestEmailCancel(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		r := EmailCancelResponse{Success: true}
		r.Data.EmailID = "email-1"
		r.Data.Status = "cancelled"
		json.NewEncoder(w).Encode(r)
	}))
	defer server.Close()

	client := NewClientWithConfig(Config{APIKey: "k", BaseURL: server.URL})
	resp, err := client.Email.Cancel("email-1")
	if err != nil {
		t.Fatal(err)
	}
	if !resp.Success {
		t.Error("expected success")
	}
}

func TestMessagesSend(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/templates/send" {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		w.WriteHeader(http.StatusOK)
		r := MessagesSendResponse{Success: true}
		r.Data.MessageIDs = []string{"m1", "m2"}
		r.Data.Status = "queued"
		r.Data.Count = 2
		json.NewEncoder(w).Encode(r)
	}))
	defer server.Close()

	client := NewClientWithConfig(Config{APIKey: "k", BaseURL: server.URL})
	resp, err := client.Messages.Send(MessagesSendParams{
		To: []string{"5511999999999"}, Template: "welcome",
		Variables: map[string]interface{}{"name": "User"},
		Channels: []string{"whatsapp", "sms"}, InstanceID: "inst-1",
	})
	if err != nil {
		t.Fatal(err)
	}
	if !resp.Success || len(resp.Data.MessageIDs) != 2 {
		t.Errorf("unexpected: %+v", resp)
	}
}
