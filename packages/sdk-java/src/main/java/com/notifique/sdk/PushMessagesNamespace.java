package com.notifique.sdk;

import com.notifique.sdk.model.*;
import java.util.Map;

/**
 * POST/GET /v1/push/messages, GET /v1/push/messages/{id}, POST /v1/push/messages/{id}/cancel
 */
public class PushMessagesNamespace {
    private final Notifique client;

    public PushMessagesNamespace(Notifique client) {
        this.client = client;
    }

    public SendPushResponse send(SendPushParams params) {
        return client.request("POST", "/push/messages", params, SendPushResponse.class);
    }

    public PushMessageListResponse list() {
        return list(null);
    }

    public PushMessageListResponse list(Map<String, String> params) {
        String path = "/push/messages";
        if (params != null && !params.isEmpty()) {
            String q = params.entrySet().stream()
                    .map(e -> e.getKey() + "=" + java.net.URLEncoder.encode(e.getValue(), java.nio.charset.StandardCharsets.UTF_8))
                    .collect(java.util.stream.Collectors.joining("&"));
            path = path + "?" + q;
        }
        return client.request("GET", path, null, PushMessageListResponse.class);
    }

    public PushMessageSingleResponse get(String messageId) {
        return client.request("GET", "/push/messages/" + Notifique.encodePathSegment(messageId), null, PushMessageSingleResponse.class);
    }

    public CancelPushResponse cancel(String messageId) {
        return client.request("POST", "/push/messages/" + Notifique.encodePathSegment(messageId) + "/cancel", null, CancelPushResponse.class);
    }
}
