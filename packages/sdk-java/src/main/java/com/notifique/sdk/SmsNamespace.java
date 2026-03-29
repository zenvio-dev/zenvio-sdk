package com.notifique.sdk;

import com.notifique.sdk.model.SmsCancelResponse;
import com.notifique.sdk.model.SmsSendParams;
import com.notifique.sdk.model.SmsSendResponse;
import com.notifique.sdk.model.SmsStatusResponse;

/**
 * POST /v1/sms/messages, GET /v1/sms/messages/{id}, POST /v1/sms/messages/{id}/cancel
 */
public class SmsNamespace {
    private final Notifique client;

    public SmsNamespace(Notifique client) {
        this.client = client;
    }

    public SmsSendResponse send(SmsSendParams params) {
        return client.request("POST", "/sms/messages", params, SmsSendResponse.class);
    }

    public SmsStatusResponse get(String messageId) {
        return client.request("GET", "/sms/messages/" + Notifique.encodePathSegment(messageId), null, SmsStatusResponse.class);
    }

    public SmsCancelResponse cancel(String messageId) {
        return client.request("POST", "/sms/messages/" + Notifique.encodePathSegment(messageId) + "/cancel", null, SmsCancelResponse.class);
    }
}
