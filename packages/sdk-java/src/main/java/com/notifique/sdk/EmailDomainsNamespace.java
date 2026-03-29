package com.notifique.sdk;

import com.notifique.sdk.model.*;

/**
 * GET/POST /v1/email/domains, GET /v1/email/domains/{id}, POST /v1/email/domains/{id}/verify
 */
public class EmailDomainsNamespace {
    private final Notifique client;

    public EmailDomainsNamespace(Notifique client) {
        this.client = client;
    }

    public ListEmailDomainsResponse list() {
        return client.request("GET", "/email/domains", null, ListEmailDomainsResponse.class);
    }

    public CreateEmailDomainResponse create(CreateEmailDomainRequest params) {
        return client.request("POST", "/email/domains", params, CreateEmailDomainResponse.class);
    }

    public CreateEmailDomainResponse create(String domain) {
        return create(new CreateEmailDomainRequest(domain));
    }

    public GetEmailDomainResponse get(String domainId) {
        return client.request("GET", "/email/domains/" + Notifique.encodePathSegment(domainId), null, GetEmailDomainResponse.class);
    }

    public VerifyEmailDomainResponse verify(String domainId) {
        return client.request("POST", "/email/domains/" + Notifique.encodePathSegment(domainId) + "/verify", null, VerifyEmailDomainResponse.class);
    }
}
