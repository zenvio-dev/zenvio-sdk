<?php

namespace Notifique;

/**
 * SMS — POST /v1/sms/messages, GET /v1/sms/messages/:id, POST /v1/sms/messages/:id/cancel
 */
class Sms
{
    private Notifique $client;

    public function __construct(Notifique $client)
    {
        $this->client = $client;
    }

    /**
     * POST /v1/sms/messages
     * @param array{to: list<string>, message: string, schedule?: array, options?: array} $params
     * @param string|null $idempotencyKey Chave única para evitar envio duplicado (header Idempotency-Key).
     */
    public function send(array $params, ?string $idempotencyKey = null): array
    {
        $options = [];
        if ($idempotencyKey !== null && $idempotencyKey !== '') {
            $options['headers'] = ['Idempotency-Key' => $idempotencyKey];
        }
        return $this->client->request('POST', '/sms/messages', $params, $options);
    }

    /** GET /v1/sms/messages/:id */
    public function get(string $id): array
    {
        return $this->client->request('GET', '/sms/messages/' . Notifique::encodePathSegment($id), null);
    }

    /** POST /v1/sms/messages/:id/cancel — cancela SMS agendado (status SCHEDULED). Escopo: sms:cancel. */
    public function cancel(string $id): array
    {
        return $this->client->request('POST', '/sms/messages/' . Notifique::encodePathSegment($id) . '/cancel', null);
    }
}
