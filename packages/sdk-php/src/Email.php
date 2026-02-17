<?php

namespace Zenvio;

/**
 * Email — POST /v1/email/send, GET /v1/email/:id, POST /v1/email/:id/cancel
 */
class Email
{
    private Zenvio $client;

    public function __construct(Zenvio $client)
    {
        $this->client = $client;
    }

    /**
     * POST /v1/email/send (campo "from" na API)
     * @param array{from: string, from_name?: string, to: list<string>, subject: string, text?: string, html?: string, schedule?: array, options?: array} $params
     */
    public function send(array $params): array
    {
        return $this->client->request('POST', '/email/send', $params);
    }

    /** GET /v1/email/:id */
    public function get(string $id): array
    {
        return $this->client->request('GET', '/email/' . $id, null);
    }

    /** POST /v1/email/:id/cancel */
    public function cancel(string $id): array
    {
        return $this->client->request('POST', '/email/' . $id . '/cancel', null);
    }
}
