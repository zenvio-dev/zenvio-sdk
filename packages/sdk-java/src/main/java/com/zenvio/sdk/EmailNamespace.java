package com.zenvio.sdk;

import com.zenvio.sdk.model.EmailCancelResponse;
import com.zenvio.sdk.model.EmailSendParams;
import com.zenvio.sdk.model.EmailSendResponse;
import com.zenvio.sdk.model.EmailStatusResponse;

/**
 * POST /v1/email/messages, GET /v1/email/messages/{id}, POST /v1/email/messages/{id}/cancel
 */
public class EmailNamespace {
    private final Zenvio client;

    public EmailNamespace(Zenvio client) {
        this.client = client;
    }

    public EmailSendResponse send(EmailSendParams params) {
        return client.request("POST", "/email/messages", params, EmailSendResponse.class);
    }

    public EmailStatusResponse get(String messageId) {
        return client.request("GET", "/email/messages/" + messageId, null, EmailStatusResponse.class);
    }

    public EmailCancelResponse cancel(String messageId) {
        return client.request("POST", "/email/messages/" + messageId + "/cancel", null, EmailCancelResponse.class);
    }
}
