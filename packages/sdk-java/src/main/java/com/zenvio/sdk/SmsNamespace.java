package com.zenvio.sdk;

import com.zenvio.sdk.model.SmsCancelResponse;
import com.zenvio.sdk.model.SmsSendParams;
import com.zenvio.sdk.model.SmsSendResponse;
import com.zenvio.sdk.model.SmsStatusResponse;

/**
 * POST /v1/sms/send, GET /v1/sms/{id}, POST /v1/sms/{id}/cancel
 */
public class SmsNamespace {
    private final Zenvio client;

    public SmsNamespace(Zenvio client) {
        this.client = client;
    }

    public SmsSendResponse send(SmsSendParams params) {
        return client.request("POST", "/sms/send", params, SmsSendResponse.class);
    }

    public SmsStatusResponse get(String messageId) {
        return client.request("GET", "/sms/" + messageId, null, SmsStatusResponse.class);
    }

    public SmsCancelResponse cancel(String messageId) {
        return client.request("POST", "/sms/" + messageId + "/cancel", null, SmsCancelResponse.class);
    }
}
