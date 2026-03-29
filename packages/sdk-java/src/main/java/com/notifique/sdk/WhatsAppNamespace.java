package com.notifique.sdk;

import com.notifique.sdk.model.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * POST/GET/DELETE/PATCH /v1/whatsapp/... e /v1/whatsapp/instances/...
 */
public class WhatsAppNamespace {
    private final Notifique client;

    public WhatsAppNamespace(Notifique client) {
        this.client = client;
    }

    /** POST /v1/whatsapp/messages — instanceId no body. Retorna envelope success/data. */
    public WhatsAppSendEnvelope send(String instanceId, WhatsAppSendParams params) {
        params.setInstanceId(instanceId);
        return client.request("POST", "/whatsapp/messages", params, WhatsAppSendEnvelope.class);
    }

    /** Atalho: texto (payload.message) */
    public WhatsAppSendEnvelope sendText(String instanceId, String to, String text) {
        return sendText(instanceId, Collections.singletonList(to), text);
    }

    public WhatsAppSendEnvelope sendText(String instanceId, List<String> to, String text) {
        WhatsAppSendParams params = new WhatsAppSendParams();
        params.setInstanceId(instanceId);
        params.setTo(to);
        params.setType("text");
        params.setPayload(new WhatsAppPayloads.TextPayload(text));
        return client.request("POST", "/whatsapp/messages", params, WhatsAppSendEnvelope.class);
    }

    /** GET /v1/whatsapp/messages — lista mensagens com paginação */
    public WhatsAppListMessagesResponse listMessages() {
        return listMessages(null);
    }

    public WhatsAppListMessagesResponse listMessages(Map<String, String> params) {
        String path = "/whatsapp/messages";
        if (params != null && !params.isEmpty()) {
            String q = params.entrySet().stream()
                    .map(e -> e.getKey() + "=" + java.net.URLEncoder.encode(e.getValue(), java.nio.charset.StandardCharsets.UTF_8))
                    .collect(Collectors.joining("&"));
            path = path + "?" + q;
        }
        return client.request("GET", path, null, WhatsAppListMessagesResponse.class);
    }

    /** GET /v1/whatsapp/messages/:id — envelope success/data */
    public WhatsAppMessageEnvelope getMessage(String messageId) {
        return client.request("GET", "/whatsapp/messages/" + Notifique.encodePathSegment(messageId), null, WhatsAppMessageEnvelope.class);
    }

    public WhatsAppMessageActionResponse deleteMessage(String messageId) {
        return client.request("DELETE", "/whatsapp/messages/" + Notifique.encodePathSegment(messageId), null, WhatsAppMessageActionResponse.class);
    }

    public WhatsAppMessageActionResponse editMessage(String messageId, String text) {
        return client.request("PATCH", "/whatsapp/messages/" + Notifique.encodePathSegment(messageId) + "/edit",
                Map.of("text", text), WhatsAppMessageActionResponse.class);
    }

    public WhatsAppMessageActionResponse cancelMessage(String messageId) {
        return client.request("POST", "/whatsapp/messages/" + Notifique.encodePathSegment(messageId) + "/cancel", null, WhatsAppMessageActionResponse.class);
    }

    public WhatsAppInstanceListResponse listInstances() {
        return listInstances(null);
    }

    public WhatsAppInstanceListResponse listInstances(Map<String, String> params) {
        String path = "/whatsapp/instances";
        if (params != null && !params.isEmpty()) {
            String q = params.entrySet().stream()
                    .map(e -> e.getKey() + "=" + java.net.URLEncoder.encode(e.getValue(), java.nio.charset.StandardCharsets.UTF_8))
                    .collect(Collectors.joining("&"));
            path = path + "?" + q;
        }
        return client.request("GET", path, null, WhatsAppInstanceListResponse.class);
    }

    public WhatsAppInstanceResponse getInstance(String instanceId) {
        return client.request("GET", "/whatsapp/instances/" + Notifique.encodePathSegment(instanceId), null, WhatsAppInstanceResponse.class);
    }

    /** GET /v1/whatsapp/instances/:id/qr */
    public WhatsAppInstanceQrResponse getInstanceQr(String instanceId) {
        return client.request("GET", "/whatsapp/instances/" + Notifique.encodePathSegment(instanceId) + "/qr", null, WhatsAppInstanceQrResponse.class);
    }

    public WhatsAppCreateInstanceResponse createInstance(String name) {
        return client.request("POST", "/whatsapp/instances", Map.of("name", name), WhatsAppCreateInstanceResponse.class);
    }

    public WhatsAppInstanceActionResponse disconnectInstance(String instanceId) {
        return client.request("POST", "/whatsapp/instances/" + Notifique.encodePathSegment(instanceId) + "/disconnect", null, WhatsAppInstanceActionResponse.class);
    }

    public WhatsAppInstanceActionResponse deleteInstance(String instanceId) {
        return client.request("DELETE", "/whatsapp/instances/" + Notifique.encodePathSegment(instanceId), null, WhatsAppInstanceActionResponse.class);
    }
}
