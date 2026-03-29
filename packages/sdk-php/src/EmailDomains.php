<?php

namespace Notifique;

/**
 * Email Domains — GET/POST /v1/email/domains, GET /v1/email/domains/:id, POST /v1/email/domains/:id/verify
 */
class EmailDomains
{
    private Notifique $client;

    public function __construct(Notifique $client)
    {
        $this->client = $client;
    }

    /** GET /v1/email/domains */
    public function list(): array
    {
        return $this->client->request('GET', '/email/domains', null);
    }

    /** POST /v1/email/domains */
    public function create(array $params): array
    {
        return $this->client->request('POST', '/email/domains', $params);
    }

    /** GET /v1/email/domains/:id */
    public function get(string $id): array
    {
        return $this->client->request('GET', '/email/domains/' . Notifique::encodePathSegment($id), null);
    }

    /** POST /v1/email/domains/:id/verify */
    public function verify(string $id): array
    {
        return $this->client->request('POST', '/email/domains/' . Notifique::encodePathSegment($id) . '/verify', null);
    }
}
