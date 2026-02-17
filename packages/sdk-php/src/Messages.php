<?php

namespace Zenvio;

/**
 * Messages (templates) — POST /v1/templates/send
 */
class Messages
{
    private Zenvio $client;

    public function __construct(Zenvio $client)
    {
        $this->client = $client;
    }

    /**
     * POST /v1/templates/send — envio por template (whatsapp, sms, email)
     * @param array{to: list<string>, template: string, variables?: array, channels: list<string>, instance_id?: string, from?: string, from_name?: string} $params
     */
    public function send(array $params): array
    {
        return $this->client->request('POST', '/templates/send', $params);
    }
}
