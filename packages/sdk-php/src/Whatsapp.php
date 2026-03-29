<?php

namespace Notifique;

/**
 * WhatsApp — POST /v1/whatsapp/messages, GET/DELETE/PATCH/POST /v1/whatsapp/messages/:id, /v1/whatsapp/instances/...
 */
class Whatsapp
{
    private Notifique $client;

    public function __construct(Notifique $client)
    {
        $this->client = $client;
    }

    /**
     * POST /v1/whatsapp/messages — instanceId no body
     * Tipos: text (payload.message), image|video|audio|document (payload.mediaUrl, fileName, mimetype — todos obrigatórios), location (payload.latitude, longitude, name, address), contact (payload.contact com fullName, wuid/phoneNumber e opcionalmente organization, email, url; ou payload.contactId = ID do contato do workspace)
     * @param array{to: list<string>, type: string, payload: array, schedule?: array, options?: array} $params
     * @param string|null $idempotencyKey Chave única para evitar envio duplicado (header Idempotency-Key).
     */
    public function send(string $instanceId, array $params, ?string $idempotencyKey = null): array
    {
        $params['instanceId'] = $instanceId;
        $options = [];
        if ($idempotencyKey !== null && $idempotencyKey !== '') {
            $options['headers'] = ['Idempotency-Key' => $idempotencyKey];
        }
        return $this->client->request('POST', '/whatsapp/messages', $params, $options);
    }

    /**
     * Atalho: texto (payload.message)
     * @param string|list<string> $to
     * @param string|null $idempotencyKey Chave única para evitar envio duplicado (header Idempotency-Key).
     */
    public function sendText(string $instanceId, string|array $to, string $text, ?string $idempotencyKey = null): array
    {
        $to = is_array($to) ? $to : [$to];
        return $this->send($instanceId, [
            'to' => $to,
            'type' => 'text',
            'payload' => ['message' => $text],
        ], $idempotencyKey);
    }

    /**
     * GET /v1/whatsapp/messages — lista mensagens (params: page, limit, fromDate, toDate, instanceIds, status, type, includeEvents)
     */
    public function listMessages(array $params = []): array
    {
        $path = '/whatsapp/messages';
        if ($params !== []) {
            $path .= '?' . http_build_query($params);
        }
        return $this->client->request('GET', $path, null);
    }

    /** GET /v1/whatsapp/messages/:messageId — retorna envelope success/data */
    public function getMessage(string $messageId): array
    {
        return $this->client->request('GET', '/whatsapp/messages/' . Notifique::encodePathSegment($messageId), null);
    }

    /** DELETE /v1/whatsapp/messages/:messageId */
    public function deleteMessage(string $messageId): array
    {
        return $this->client->request('DELETE', '/whatsapp/messages/' . Notifique::encodePathSegment($messageId), null);
    }

    /** PATCH /v1/whatsapp/messages/:messageId/edit */
    public function editMessage(string $messageId, string $text): array
    {
        return $this->client->request('PATCH', '/whatsapp/messages/' . Notifique::encodePathSegment($messageId) . '/edit', ['text' => $text]);
    }

    /** POST /v1/whatsapp/messages/:messageId/cancel */
    public function cancelMessage(string $messageId): array
    {
        return $this->client->request('POST', '/whatsapp/messages/' . Notifique::encodePathSegment($messageId) . '/cancel', null);
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
        return $this->client->request('GET', '/whatsapp/instances/' . Notifique::encodePathSegment($instanceId), null);
    }

    /** GET /v1/whatsapp/instances/:instanceId/qr */
    public function getInstanceQr(string $instanceId): array
    {
        return $this->client->request('GET', '/whatsapp/instances/' . Notifique::encodePathSegment($instanceId) . '/qr', null);
    }

    /**
     * POST /v1/whatsapp/instances — cria instância.
     * Resposta: ['success' => true, 'data' => ['instance' => [...], 'connection' => ['base64' => qr_data_url, 'code' => ..., 'pairingCode' => ..., 'count' => ...]]].
     * Use $resp['data']['connection']['base64'] para exibir o QR code.
     */
    public function createInstance(string $name): array
    {
        return $this->client->request('POST', '/whatsapp/instances', ['name' => $name]);
    }

    /** POST /v1/whatsapp/instances/:instanceId/disconnect */
    public function disconnectInstance(string $instanceId): array
    {
        return $this->client->request('POST', '/whatsapp/instances/' . Notifique::encodePathSegment($instanceId) . '/disconnect', null);
    }

    /** DELETE /v1/whatsapp/instances/:instanceId */
    public function deleteInstance(string $instanceId): array
    {
        return $this->client->request('DELETE', '/whatsapp/instances/' . Notifique::encodePathSegment($instanceId), null);
    }
}
