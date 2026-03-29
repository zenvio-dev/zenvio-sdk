package com.notifique.sdk;

import com.notifique.sdk.model.EmailCancelResponse;
import com.notifique.sdk.model.EmailSendParams;
import com.notifique.sdk.model.EmailSendResponse;
import com.notifique.sdk.model.EmailStatusResponse;

/**
 * POST /v1/email/messages, GET /v1/email/messages/{id}, POST /v1/email/messages/{id}/cancel + domains
 */
public class EmailNamespace {
    private final Notifique client;
    private final EmailDomainsNamespace domainsNamespace;

    public EmailNamespace(Notifique client) {
        this.client = client;
        this.domainsNamespace = new EmailDomainsNamespace(client);
    }

    public EmailSendResponse send(EmailSendParams params) {
        return client.request("POST", "/email/messages", params, EmailSendResponse.class);
    }

    public EmailStatusResponse get(String messageId) {
        return client.request("GET", "/email/messages/" + Notifique.encodePathSegment(messageId), null, EmailStatusResponse.class);
    }

    public EmailCancelResponse cancel(String messageId) {
        return client.request("POST", "/email/messages/" + Notifique.encodePathSegment(messageId) + "/cancel", null, EmailCancelResponse.class);
    }

    /** GET/POST /v1/email/domains, GET /v1/email/domains/{id}, POST /v1/email/domains/{id}/verify */
    public EmailDomainsNamespace domains() {
        return domainsNamespace;
    }
}
