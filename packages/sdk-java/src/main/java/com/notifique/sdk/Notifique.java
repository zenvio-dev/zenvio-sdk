package com.notifique.sdk;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

/**
 * Cliente Notifique — WhatsApp, SMS, Email, Push e envio por template (messages).
 * Em 4xx/5xx lança {@link NotifiqueApiException}.
 */
public class Notifique {
    private final String apiKey;
    private final String baseUrl;
    private final HttpClient httpClient;
    final ObjectMapper objectMapper;

    public final WhatsAppNamespace whatsapp;
    public final SmsNamespace sms;
    public final EmailNamespace email;
    public final MessagesNamespace messages;
    public final PushNamespace push;

    public Notifique(String apiKey) {
        this(apiKey, "https://api.notifique.dev/v1");
    }

    public Notifique(String apiKey, String baseUrl) {
        this(apiKey, baseUrl, HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build());
    }

    public Notifique(String apiKey, String baseUrl, HttpClient httpClient) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalArgumentException("apiKey must be a non-empty string");
        }
        String effectiveBaseUrl = (baseUrl == null || baseUrl.isBlank()) ? "https://api.notifique.dev/v1" : baseUrl;
        URI parsedBase = URI.create(effectiveBaseUrl);
        if (!"https".equalsIgnoreCase(parsedBase.getScheme()) || parsedBase.getHost() == null || parsedBase.getHost().isBlank()) {
            throw new IllegalArgumentException("baseUrl must be an absolute HTTPS URL");
        }
        this.apiKey = apiKey;
        this.baseUrl = effectiveBaseUrl.endsWith("/") ? effectiveBaseUrl.substring(0, effectiveBaseUrl.length() - 1) : effectiveBaseUrl;
        this.httpClient = httpClient;
        this.objectMapper = new ObjectMapper();
        this.whatsapp = new WhatsAppNamespace(this);
        this.sms = new SmsNamespace(this);
        this.email = new EmailNamespace(this);
        this.messages = new MessagesNamespace(this);
        this.push = new PushNamespace(this);
    }

    /**
     * Executa uma requisição e retorna o body parseado. Em status >= 400 lança NotifiqueApiException.
     */
    @SuppressWarnings("unchecked")
    protected <T> T request(String method, String path, Object body, Class<T> responseType) {
        try {
            String jsonBody = body != null ? objectMapper.writeValueAsString(body) : "";

            HttpRequest.Builder builder = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + path))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .header("User-Agent", "Notifique-Java-SDK/0.2.0")
                    .timeout(Duration.ofSeconds(30));

            if ("GET".equals(method) || "DELETE".equals(method)) {
                builder.method(method, HttpRequest.BodyPublishers.noBody());
            } else {
                builder.method(method, HttpRequest.BodyPublishers.ofString(jsonBody));
            }

            HttpRequest request = builder.build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                throw new NotifiqueApiException(response.statusCode(), response.body());
            }

            if (responseType == Void.class || response.body() == null || response.body().isEmpty()) {
                return null;
            }
            return objectMapper.readValue(response.body(), responseType);
        } catch (NotifiqueApiException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("SDK request failed: " + e.getMessage(), e);
        }
    }

    static String encodePathSegment(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
    }
}
