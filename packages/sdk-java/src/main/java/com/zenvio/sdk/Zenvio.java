package com.zenvio.sdk;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Cliente Zenvio — WhatsApp, SMS, Email e envio por template (messages).
 * Em 4xx/5xx lança {@link ZenvioApiException}.
 */
public class Zenvio {
    private final String apiKey;
    private final String baseUrl;
    private final HttpClient httpClient;
    final ObjectMapper objectMapper;

    public final WhatsAppNamespace whatsapp;
    public final SmsNamespace sms;
    public final EmailNamespace email;
    public final MessagesNamespace messages;

    public Zenvio(String apiKey) {
        this(apiKey, "https://api.zenvio.com/v1");
    }

    public Zenvio(String apiKey, String baseUrl) {
        this(apiKey, baseUrl, HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build());
    }

    public Zenvio(String apiKey, String baseUrl, HttpClient httpClient) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.httpClient = httpClient;
        this.objectMapper = new ObjectMapper();
        this.whatsapp = new WhatsAppNamespace(this);
        this.sms = new SmsNamespace(this);
        this.email = new EmailNamespace(this);
        this.messages = new MessagesNamespace(this);
    }

    /**
     * Executa uma requisição e retorna o body parseado. Em status >= 400 lança ZenvioApiException.
     */
    @SuppressWarnings("unchecked")
    protected <T> T request(String method, String path, Object body, Class<T> responseType) {
        try {
            String jsonBody = body != null ? objectMapper.writeValueAsString(body) : "";

            HttpRequest.Builder builder = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + path))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .header("User-Agent", "Zenvio-Java-SDK/0.2.0");

            if ("GET".equals(method) || "DELETE".equals(method)) {
                builder.method(method, HttpRequest.BodyPublishers.noBody());
            } else {
                builder.method(method, HttpRequest.BodyPublishers.ofString(jsonBody));
            }

            HttpRequest request = builder.build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                throw new ZenvioApiException(response.statusCode(), response.body());
            }

            if (responseType == Void.class || response.body() == null || response.body().isEmpty()) {
                return null;
            }
            return objectMapper.readValue(response.body(), responseType);
        } catch (ZenvioApiException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("SDK request failed: " + e.getMessage(), e);
        }
    }
}
