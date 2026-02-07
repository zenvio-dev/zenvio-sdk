package com.zenvio.sdk;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zenvio.sdk.model.SendResponse;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class Zenvio {
    private final String apiKey;
    private final String baseUrl;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    public final WhatsAppNamespace whatsapp;

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
    }

    protected SendResponse request(String method, String path, Object body) {
        try {
            String jsonBody = body != null ? objectMapper.writeValueAsString(body) : "";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + path))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .header("User-Agent", "Zenvio-Java-SDK/0.1.0")
                    .method(method, HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                try {
                    return objectMapper.readValue(response.body(), SendResponse.class);
                } catch (Exception e) {
                    return SendResponse.error("HTTP Error: " + response.statusCode() + " " + response.body());
                }
            }

            return objectMapper.readValue(response.body(), SendResponse.class);
        } catch (Exception e) {
            return SendResponse.error("SDK Error: " + e.getMessage());
        }
    }
}
