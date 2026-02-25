<?php

namespace Zenvio;

/**
 * SMS — POST /v1/sms/messages, GET /v1/sms/messages/:id, POST /v1/sms/messages/:id/cancel
 */
class Sms
{
    private Zenvio $client;

    public function __construct(Zenvio $client)
    {
        $this->client = $client;
    }

    /**
     * POST /v1/sms/messages
     * @param array{to: list<string>, message: string, schedule?: array, options?: array} $params
     */
    public function send(array $params): array
    {
        return $this->client->request('POST', '/sms/messages', $params);
    }

    /** GET /v1/sms/messages/:id */
    public function get(string $id): array
    {
        return $this->client->request('GET', '/sms/messages/' . $id, null);
    }

    /** POST /v1/sms/messages/:id/cancel — cancela SMS agendado (status SCHEDULED). Escopo: sms:cancel. */
    public function cancel(string $id): array
    {
        return $this->client->request('POST', '/sms/messages/' . $id . '/cancel', null);
    }
}
