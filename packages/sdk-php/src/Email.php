<?php

namespace Notifique;

/**
 * Email — POST /v1/email/messages, GET /v1/email/messages/:id, POST cancel + domains
 */
class Email
{
    private Notifique $client;
    private ?EmailDomains $domains = null;

    public function __construct(Notifique $client)
    {
        $this->client = $client;
    }

    /** GET/POST /v1/email/domains, GET /v1/email/domains/:id, POST verify */
    public function domains(): EmailDomains
    {
        if ($this->domains === null) {
            $this->domains = new EmailDomains($this->client);
        }
        return $this->domains;
    }

    /**
     * POST /v1/email/messages
     * Request conforme OpenAPI SendEmailRequest: from, fromName?, to, subject, text?, html?, schedule?, options?
     * @param array{from: string, fromName?: string, to: list<string>, subject: string, text?: string, html?: string, schedule?: array{sendAt?: string}, options?: array{priority?: string}} $params
     * @param string|null $idempotencyKey Chave única para evitar envio duplicado (header Idempotency-Key).
     */
    public function send(array $params, ?string $idempotencyKey = null): array
    {
        if (isset($params['from_name']) && !\array_key_exists('fromName', $params)) {
            $params['fromName'] = $params['from_name'];
            unset($params['from_name']);
        }
        $options = [];
        if ($idempotencyKey !== null && $idempotencyKey !== '') {
            $options['headers'] = ['Idempotency-Key' => $idempotencyKey];
        }
        return $this->client->request('POST', '/email/messages', $params, $options);
    }

    /** GET /v1/email/messages/:id */
    public function get(string $id): array
    {
        return $this->client->request('GET', '/email/messages/' . Notifique::encodePathSegment($id), null);
    }

    /** POST /v1/email/messages/:id/cancel */
    public function cancel(string $id): array
    {
        return $this->client->request('POST', '/email/messages/' . Notifique::encodePathSegment($id) . '/cancel', null);
    }
}
