package com.notifique.sdk;

import com.notifique.sdk.model.*;
import java.util.Map;

/**
 * POST/GET /v1/push/devices, GET/DELETE /v1/push/devices/{id}
 */
public class PushDevicesNamespace {
    private final Notifique client;

    public PushDevicesNamespace(Notifique client) {
        this.client = client;
    }

    public PushDeviceSingleResponse register(PushDeviceRegisterRequest params) {
        return client.request("POST", "/push/devices", params, PushDeviceSingleResponse.class);
    }

    public PushDeviceListResponse list() {
        return list(null);
    }

    public PushDeviceListResponse list(Map<String, String> params) {
        String path = "/push/devices";
        if (params != null && !params.isEmpty()) {
            String q = params.entrySet().stream()
                    .map(e -> e.getKey() + "=" + java.net.URLEncoder.encode(e.getValue(), java.nio.charset.StandardCharsets.UTF_8))
                    .collect(java.util.stream.Collectors.joining("&"));
            path = path + "?" + q;
        }
        return client.request("GET", path, null, PushDeviceListResponse.class);
    }

    public PushDeviceSingleResponse get(String deviceId) {
        return client.request("GET", "/push/devices/" + Notifique.encodePathSegment(deviceId), null, PushDeviceSingleResponse.class);
    }

    public void delete(String deviceId) {
        client.request("DELETE", "/push/devices/" + Notifique.encodePathSegment(deviceId), null, Void.class);
    }
}
