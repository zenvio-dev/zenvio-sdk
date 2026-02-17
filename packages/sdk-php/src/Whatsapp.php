<?php

namespace Zenvio;

/**
 * WhatsApp — POST /v1/whatsapp/send, GET/DELETE/PATCH/POST /v1/whatsapp/:id, /v1/whatsapp/instances/...
 */
class Whatsapp
{
    private Zenvio $client;

    public function __construct(Zenvio $client)
    {
        $this->client = $client;
    }

    /**
     * POST /v1/whatsapp/send — instance_id no body
     * @param array{to: list<string>, type: string, payload: array, schedule?: array, options?: array} $params
     */
    public function send(string $instanceId, array $params): array
    {
        $params['instance_id'] = $instanceId;
        return $this->client->request('POST', '/whatsapp/send', $params);
    }

    /**
     * Atalho: texto (payload.message)
     * @param string|list<string> $to
     */
    public function sendText(string $instanceId, string|array $to, string $text): array
    {
        $to = is_array($to) ? $to : [$to];
        return $this->send($instanceId, [
            'to' => $to,
            'type' => 'text',
            'payload' => ['message' => $text],
        ]);
    }

    /** GET /v1/whatsapp/:messageId */
    public function getMessage(string $messageId): array
    {
        return $this->client->request('GET', '/whatsapp/' . $messageId, null);
    }

    /** DELETE /v1/whatsapp/:messageId */
    public function deleteMessage(string $messageId): array
    {
        return $this->client->request('DELETE', '/whatsapp/' . $messageId, null);
    }

    /** PATCH /v1/whatsapp/:messageId/edit */
    public function editMessage(string $messageId, string $text): array
    {
        return $this->client->request('PATCH', '/whatsapp/' . $messageId . '/edit', ['text' => $text]);
    }

    /** POST /v1/whatsapp/:messageId/cancel */
    public function cancelMessage(string $messageId): array
    {
        return $this->client->request('POST', '/whatsapp/' . $messageId . '/cancel', null);
    }

    /**
     * GET /v1/whatsapp/instances
     * @param array{page?: string, limit?: string, status?: string, search?: string} $params
     */
    public function listInstances(array $params = []): array
    {
        $path = '/whatsapp/instances';
        if ($params !== []) {
            $path .= '?' . http_build_query($params);
        }
        return $this->client->request('GET', $path, null);
    }

    /** GET /v1/whatsapp/instances/:instanceId */
    public function getInstance(string $instanceId): array
    {
        return $this->client->request('GET', '/whatsapp/instances/' . $instanceId, null);
    }

    /** POST /v1/whatsapp/instances */
    public function createInstance(string $name): array
    {
        return $this->client->request('POST', '/whatsapp/instances', ['name' => $name]);
    }

    /** POST /v1/whatsapp/instances/:instanceId/disconnect */
    public function disconnectInstance(string $instanceId): array
    {
        return $this->client->request('POST', '/whatsapp/instances/' . $instanceId . '/disconnect', null);
    }

    /** DELETE /v1/whatsapp/instances/:instanceId */
    public function deleteInstance(string $instanceId): array
    {
        return $this->client->request('DELETE', '/whatsapp/instances/' . $instanceId, null);
    }
}
