package com.zenvio.sdk;

import com.zenvio.sdk.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ZenvioTest {
    private Zenvio zenvio;
    private HttpClient mockHttpClient;
    private HttpResponse<String> mockResponse;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() throws Exception {
        mockHttpClient = mock(HttpClient.class);
        mockResponse = mock(HttpResponse.class);
        zenvio = new Zenvio("test-api-key", "https://api.zenvio.com/v1", mockHttpClient);
    }

    // --- WhatsApp ---

    @Test
    @SuppressWarnings("unchecked")
    void testWhatsAppSendTextSuccess() throws Exception {
        String jsonResponse = "{\"message_ids\": [\"msg-123\"], \"status\": \"queued\"}";
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn(jsonResponse);
        doReturn(mockResponse).when(mockHttpClient).send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class));

        WhatsAppSendResponse response = zenvio.whatsapp.sendText("instance-1", "5511999999999", "Hello");

        assertEquals(List.of("msg-123"), response.getMessageIds());
        assertEquals("queued", response.getStatus());

        ArgumentCaptor<HttpRequest> requestCaptor = ArgumentCaptor.forClass(HttpRequest.class);
        verify(mockHttpClient).send(requestCaptor.capture(), any());
        HttpRequest req = requestCaptor.getValue();
        assertEquals("POST", req.method());
        assertEquals("https://api.zenvio.com/v1/whatsapp/send", req.uri().toString());
        assertTrue(req.bodyPublisher().isPresent());
    }

    @Test
    @SuppressWarnings("unchecked")
    void testWhatsAppSendErrorThrows() throws Exception {
        when(mockResponse.statusCode()).thenReturn(400);
        when(mockResponse.body()).thenReturn("{\"error\": \"Invalid instance\"}");
        doReturn(mockResponse).when(mockHttpClient).send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class));

        assertThrows(ZenvioApiException.class, () ->
                zenvio.whatsapp.sendText("wrong", "123", "hi"));
    }

    @Test
    @SuppressWarnings("unchecked")
    void testWhatsAppSendWithParams() throws Exception {
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn("{\"message_ids\": [\"m1\"], \"status\": \"queued\"}");
        doReturn(mockResponse).when(mockHttpClient).send(any(), any());

        WhatsAppSendParams params = new WhatsAppSendParams();
        params.setTo(List.of("5511888888888"));
        params.setType("text");
        params.setPayload(new WhatsAppPayloads.TextPayload("Hi"));
        WhatsAppSendResponse res = zenvio.whatsapp.send("instance-1", params);
        assertEquals(List.of("m1"), res.getMessageIds());
    }

    @Test
    @SuppressWarnings("unchecked")
    void testWhatsAppGetMessage() throws Exception {
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn("{\"message_id\": \"msg-1\", \"status\": \"delivered\"}");
        doReturn(mockResponse).when(mockHttpClient).send(any(), any());

        WhatsAppMessageStatus status = zenvio.whatsapp.getMessage("msg-1");
        assertEquals("msg-1", status.getMessageId());
        assertEquals("delivered", status.getStatus());
    }

    @Test
    @SuppressWarnings("unchecked")
    void testWhatsAppListInstances() throws Exception {
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn("{\"success\": true, \"data\": [], \"pagination\": {\"total\": 0, \"page\": 1, \"limit\": 10}}");
        doReturn(mockResponse).when(mockHttpClient).send(any(), any());

        WhatsAppInstanceListResponse list = zenvio.whatsapp.listInstances();
        assertNotNull(list);
    }

    // --- SMS ---

    @Test
    @SuppressWarnings("unchecked")
    void testSmsSend() throws Exception {
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn("{\"success\": true, \"data\": {\"status\": \"queued\", \"count\": 1, \"sms_ids\": [\"sms-1\"]}}");
        doReturn(mockResponse).when(mockHttpClient).send(any(), any());

        SmsSendParams params = new SmsSendParams(List.of("5511999999999"), "Test SMS");
        SmsSendResponse res = zenvio.sms.send(params);
        assertTrue(res.isSuccess());
        assertEquals(List.of("sms-1"), res.getData().getSmsIds());
    }

    @Test
    @SuppressWarnings("unchecked")
    void testSmsGet() throws Exception {
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn("{\"success\": true, \"data\": {\"sms_id\": \"sms-1\", \"status\": \"delivered\"}}");
        doReturn(mockResponse).when(mockHttpClient).send(any(), any());

        SmsStatusResponse status = zenvio.sms.get("sms-1");
        assertEquals("sms-1", status.getData().getSmsId());
    }

    // --- Email ---

    @Test
    @SuppressWarnings("unchecked")
    void testEmailSend() throws Exception {
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn("{\"success\": true, \"data\": {\"email_ids\": [\"email-1\"], \"status\": \"queued\"}}");
        doReturn(mockResponse).when(mockHttpClient).send(any(), any());

        EmailSendParams params = new EmailSendParams();
        params.setFrom("noreply@example.com");
        params.setTo(List.of("user@example.com"));
        params.setSubject("Test");
        params.setText("Body");
        EmailSendResponse res = zenvio.email.send(params);
        assertEquals(List.of("email-1"), res.getData().getEmailIds());
    }

    @Test
    @SuppressWarnings("unchecked")
    void testEmailCancel() throws Exception {
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn("{\"success\": true, \"data\": {\"email_id\": \"email-1\", \"status\": \"cancelled\"}}");
        doReturn(mockResponse).when(mockHttpClient).send(any(), any());

        EmailCancelResponse res = zenvio.email.cancel("email-1");
        assertTrue(res.isSuccess());
    }

    // --- Messages (templates) ---

    @Test
    @SuppressWarnings("unchecked")
    void testMessagesSend() throws Exception {
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn("{\"success\": true, \"data\": {\"message_ids\": [\"m1\", \"m2\"], \"status\": \"queued\"}}");
        doReturn(mockResponse).when(mockHttpClient).send(any(), any());

        MessagesSendParams params = new MessagesSendParams();
        params.setTo(List.of("5511999999999"));
        params.setTemplate("welcome");
        params.setVariables(Map.of("name", "User"));
        params.setChannels(List.of("whatsapp", "sms"));
        params.setInstanceId("inst-1");
        MessagesSendResponse res = zenvio.messages.send(params);
        assertEquals(List.of("m1", "m2"), res.getData().getMessageIds());
    }
}
