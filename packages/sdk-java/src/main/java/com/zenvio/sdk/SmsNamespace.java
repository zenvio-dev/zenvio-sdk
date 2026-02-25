package com.zenvio.sdk;

import com.zenvio.sdk.model.SmsCancelResponse;
import com.zenvio.sdk.model.SmsSendParams;
import com.zenvio.sdk.model.SmsSendResponse;
import com.zenvio.sdk.model.SmsStatusResponse;

/**
 * POST /v1/sms/messages, GET /v1/sms/messages/{id}, POST /v1/sms/messages/{id}/cancel
 */
public class SmsNamespace {
    private final Zenvio client;

    public SmsNamespace(Zenvio client) {
        this.client = client;
    }

    public SmsSendResponse send(SmsSendParams params) {
        return client.request("POST", "/sms/messages", params, SmsSendResponse.class);
    }

    public SmsStatusResponse get(String messageId) {
        return client.request("GET", "/sms/messages/" + messageId, null, SmsStatusResponse.class);
    }

    public SmsCancelResponse cancel(String messageId) {
        return client.request("POST", "/sms/messages/" + messageId + "/cancel", null, SmsCancelResponse.class);
    }
}
