package com.notifique.sdk;

import com.notifique.sdk.model.*;
import java.util.Map;

/**
 * GET/POST /v1/push/apps, GET/PUT/DELETE /v1/push/apps/{id}
 */
public class PushAppsNamespace {
    private final Notifique client;

    public PushAppsNamespace(Notifique client) {
        this.client = client;
    }

    public PushAppListResponse list() {
        return list(null);
    }

    public PushAppListResponse list(Map<String, String> params) {
        String path = "/push/apps";
        if (params != null && !params.isEmpty()) {
            String q = params.entrySet().stream()
                    .map(e -> e.getKey() + "=" + java.net.URLEncoder.encode(e.getValue(), java.nio.charset.StandardCharsets.UTF_8))
                    .collect(java.util.stream.Collectors.joining("&"));
            path = path + "?" + q;
        }
        return client.request("GET", path, null, PushAppListResponse.class);
    }

    public PushAppSingleResponse get(String appId) {
        return client.request("GET", "/push/apps/" + Notifique.encodePathSegment(appId), null, PushAppSingleResponse.class);
    }

    public PushAppSingleResponse create(String name) {
        return client.request("POST", "/push/apps", Map.of("name", name), PushAppSingleResponse.class);
    }

    public PushAppSingleResponse update(String appId, Map<String, Object> params) {
        return client.request("PUT", "/push/apps/" + Notifique.encodePathSegment(appId), params, PushAppSingleResponse.class);
    }

    public void delete(String appId) {
        client.request("DELETE", "/push/apps/" + Notifique.encodePathSegment(appId), null, Void.class);
    }
}
