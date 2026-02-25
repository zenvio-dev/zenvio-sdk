<?php

namespace Zenvio;

/**
 * Email — POST /v1/email/messages, GET /v1/email/messages/:id, POST /v1/email/messages/:id/cancel
 */
class Email
{
    private Zenvio $client;

    public function __construct(Zenvio $client)
    {
        $this->client = $client;
    }

    /**
     * POST /v1/email/messages (campo "from" na API)
     * @param array{from: string, from_name?: string, to: list<string>, subject: string, text?: string, html?: string, schedule?: array, options?: array} $params
     */
    public function send(array $params): array
    {
        return $this->client->request('POST', '/email/messages', $params);
    }

    /** GET /v1/email/messages/:id */
    public function get(string $id): array
    {
        return $this->client->request('GET', '/email/messages/' . $id, null);
    }

    /** POST /v1/email/messages/:id/cancel */
    public function cancel(string $id): array
    {
        return $this->client->request('POST', '/email/messages/' . $id . '/cancel', null);
    }
}
