package com.zenvio.sdk;

import com.zenvio.sdk.model.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * POST/GET/DELETE/PATCH /v1/whatsapp/... e /v1/whatsapp/instances/...
 */
public class WhatsAppNamespace {
    private final Zenvio client;

    public WhatsAppNamespace(Zenvio client) {
        this.client = client;
    }

    /** POST /v1/whatsapp/send — instance_id no body */
    public WhatsAppSendResponse send(String instanceId, WhatsAppSendParams params) {
        params.setInstanceId(instanceId);
        return client.request("POST", "/whatsapp/send", params, WhatsAppSendResponse.class);
    }

    /** Atalho: texto (payload.message) */
    public WhatsAppSendResponse sendText(String instanceId, String to, String text) {
        return sendText(instanceId, Collections.singletonList(to), text);
    }

    public WhatsAppSendResponse sendText(String instanceId, List<String> to, String text) {
        WhatsAppSendParams params = new WhatsAppSendParams();
        params.setInstanceId(instanceId);
        params.setTo(to);
        params.setType("text");
        params.setPayload(new WhatsAppPayloads.TextPayload(text));
        return client.request("POST", "/whatsapp/send", params, WhatsAppSendResponse.class);
    }

    public WhatsAppMessageStatus getMessage(String messageId) {
        return client.request("GET", "/whatsapp/" + messageId, null, WhatsAppMessageStatus.class);
    }

    public WhatsAppMessageActionResponse deleteMessage(String messageId) {
        return client.request("DELETE", "/whatsapp/" + messageId, null, WhatsAppMessageActionResponse.class);
    }

    public WhatsAppMessageActionResponse editMessage(String messageId, String text) {
        return client.request("PATCH", "/whatsapp/" + messageId + "/edit",
                Map.of("text", text), WhatsAppMessageActionResponse.class);
    }

    public WhatsAppMessageActionResponse cancelMessage(String messageId) {
        return client.request("POST", "/whatsapp/" + messageId + "/cancel", null, WhatsAppMessageActionResponse.class);
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
        return client.request("GET", "/whatsapp/instances/" + instanceId, null, WhatsAppInstanceResponse.class);
    }

    public WhatsAppCreateInstanceResponse createInstance(String name) {
        return client.request("POST", "/whatsapp/instances", Map.of("name", name), WhatsAppCreateInstanceResponse.class);
    }

    public WhatsAppInstanceActionResponse disconnectInstance(String instanceId) {
        return client.request("POST", "/whatsapp/instances/" + instanceId + "/disconnect", null, WhatsAppInstanceActionResponse.class);
    }

    public WhatsAppInstanceActionResponse deleteInstance(String instanceId) {
        return client.request("DELETE", "/whatsapp/instances/" + instanceId, null, WhatsAppInstanceActionResponse.class);
    }
}
