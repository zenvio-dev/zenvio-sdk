<?php

namespace Zenvio;

/**
 * SMS — POST /v1/sms/send, GET /v1/sms/:id
 */
class Sms
{
    private Zenvio $client;

    public function __construct(Zenvio $client)
    {
        $this->client = $client;
    }

    /**
     * POST /v1/sms/send
     * @param array{to: list<string>, message: string, schedule?: array, options?: array} $params
     */
    public function send(array $params): array
    {
        return $this->client->request('POST', '/sms/send', $params);
    }

    /** GET /v1/sms/:id */
    public function get(string $id): array
    {
        return $this->client->request('GET', '/sms/' . $id, null);
    }
}
