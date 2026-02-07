<?php

namespace Zenvio;

use Zenvio\Models\SendParams;
use Zenvio\Models\SendResponse;

class Whatsapp
{
    private Zenvio $client;

    public function __construct(Zenvio $client)
    {
        $this->client = $client;
    }

    /**
     * Sends a WhatsApp message
     */
    public function send(string $phoneId, array|SendParams $params): SendResponse
    {
        $data = $params instanceof SendParams ? $params->toArray() : $params;
        return $this->client->request('POST', "/whatsapp/{$phoneId}/messages", $data);
    }

    /**
     * Shortcut to send a simple WhatsApp text message
     */
    public function sendText(string $phoneId, string|array $to, string $text): SendResponse
    {
        $params = new SendParams(
            is_array($to) ? $to : [$to],
            'text',
            ['text' => $text]
        );

        return $this->send($phoneId, $params);
    }
}
