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
     * POST /v1/templates/send — envio por template (whatsapp, sms, email).
     * Parâmetros (mesmos da API): to, template, variables?, channels, instance_id?, from?, fromName?
     *
     * @param array{to: list<string>, template: string, variables?: array<string, string|int>, channels: list<string>, instance_id?: string, from?: string, fromName?: string} $params
     */
    public function send(array $params): array
    {
        if (isset($params['from_name']) && !\array_key_exists('fromName', $params)) {
            $params['fromName'] = $params['from_name'];
            unset($params['from_name']);
        }
        return $this->client->request('POST', '/templates/send', $params);
    }
}
