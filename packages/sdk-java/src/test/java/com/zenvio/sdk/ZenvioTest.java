package com.zenvio.sdk;

import com.zenvio.sdk.model.SendResponse;
import com.zenvio.sdk.model.SendParams;
import com.zenvio.sdk.model.Payloads;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

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

    @Test
    @SuppressWarnings("unchecked")
    void testSendTextSuccess() throws Exception {
        String jsonResponse = "{\"success\": true, \"messageId\": \"msg-java-123\"}";
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn(jsonResponse);
        doReturn(mockResponse).when(mockHttpClient).send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class));

        SendResponse response = zenvio.whatsapp.sendText("phone-abc", "5511999999999", "Hello Test");

        assertTrue(response.isSuccess());
        assertEquals("msg-java-123", response.getMessageId());

        ArgumentCaptor<HttpRequest> requestCaptor = ArgumentCaptor.forClass(HttpRequest.class);
        verify(mockHttpClient).send(requestCaptor.capture(), any());

        HttpRequest capturedRequest = requestCaptor.getValue();
        assertEquals("POST", capturedRequest.method());
        assertEquals("https://api.zenvio.com/v1/whatsapp/phone-abc/messages", capturedRequest.uri().toString());
    }

    @Test
    @SuppressWarnings("unchecked")
    void testSendErrorHandling() throws Exception {
        String errorResponse = "{\"success\": false, \"error\": \"Invalid phone ID\"}";
        when(mockResponse.statusCode()).thenReturn(400);
        when(mockResponse.body()).thenReturn(errorResponse);
        doReturn(mockResponse).when(mockHttpClient).send(any(HttpRequest.class), any(HttpResponse.BodyHandler.class));

        SendResponse response = zenvio.whatsapp.sendText("wrong-id", "123", "hi");

        assertFalse(response.isSuccess());
        assertEquals("Invalid phone ID", response.getError());
    }

    @Test
    void testSendTemplateSuccess() throws Exception {
        String jsonResponse = "{\"success\": true}";
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn(jsonResponse);
        doReturn(mockResponse).when(mockHttpClient).send(any(), any());

        SendParams params = new SendParams();
        params.setTo(List.of("123"));
        params.setType("template");
        params.setPayload(new Payloads.Template("k", "en"));

        assertTrue(zenvio.whatsapp.send("p", params).isSuccess());
    }

    @Test
    void testSendMediaSuccess() throws Exception {
        String jsonResponse = "{\"success\": true}";
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn(jsonResponse);
        doReturn(mockResponse).when(mockHttpClient).send(any(), any());

        SendParams params = new SendParams();
        params.setType("image");
        params.setPayload(new Payloads.Media("http://test.com/i.png"));

        assertTrue(zenvio.whatsapp.send("p", params).isSuccess());
    }

    @Test
    void testSendButtonsSuccess() throws Exception {
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn("{\"success\": true}");
        doReturn(mockResponse).when(mockHttpClient).send(any(), any());

        SendParams params = new SendParams();
        params.setType("buttons");
        params.setPayload(new Payloads.Buttons("Body", List.of(new Payloads.Button("1", "Ok"))));

        assertTrue(zenvio.whatsapp.send("p", params).isSuccess());
    }

    @Test
    void testSendListSuccess() throws Exception {
        when(mockResponse.statusCode()).thenReturn(200);
        when(mockResponse.body()).thenReturn("{\"success\": true}");
        doReturn(mockResponse).when(mockHttpClient).send(any(), any());

        SendParams params = new SendParams();
        params.setType("list");
        params.setPayload(new Payloads.ListPayload("Body", List.of()));

        assertTrue(zenvio.whatsapp.send("p", params).isSuccess());
    }
}
