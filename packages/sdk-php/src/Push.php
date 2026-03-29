<?php

namespace Notifique;

/**
 * Push API — apps, devices, messages
 */
class Push
{
    private Notifique $client;

    public PushApps $apps;
    public PushDevices $devices;
    public PushMessages $messages;

    public function __construct(Notifique $client)
    {
        $this->client = $client;
        $this->apps = new PushApps($client);
        $this->devices = new PushDevices($client);
        $this->messages = new PushMessages($client);
    }
}

/**
 * GET/POST /v1/push/apps, GET/PUT/DELETE /v1/push/apps/:id
 */
class PushApps
{
    private Notifique $client;

    public function __construct(Notifique $client)
    {
        $this->client = $client;
    }

    public function list(array $params = []): array
    {
        $path = '/push/apps';
        if ($params !== []) {
            $path .= '?' . http_build_query($params);
        }
        return $this->client->request('GET', $path, null);
    }

    public function get(string $id): array
    {
        return $this->client->request('GET', '/push/apps/' . Notifique::encodePathSegment($id), null);
    }

    public function create(array $params): array
    {
        return $this->client->request('POST', '/push/apps', $params);
    }

    public function update(string $id, array $params): array
    {
        return $this->client->request('PUT', '/push/apps/' . Notifique::encodePathSegment($id), $params);
    }

    public function delete(string $id): array
    {
        return $this->client->request('DELETE', '/push/apps/' . Notifique::encodePathSegment($id), null);
    }
}

/**
 * POST/GET /v1/push/devices, GET/DELETE /v1/push/devices/:id
 */
class PushDevices
{
    private Notifique $client;

    public function __construct(Notifique $client)
    {
        $this->client = $client;
    }

    public function register(array $params): array
    {
        return $this->client->request('POST', '/push/devices', $params);
    }

    public function list(array $params = []): array
    {
        $path = '/push/devices';
        if ($params !== []) {
            $path .= '?' . http_build_query($params);
        }
        return $this->client->request('GET', $path, null);
    }

    public function get(string $id): array
    {
        return $this->client->request('GET', '/push/devices/' . Notifique::encodePathSegment($id), null);
    }

    public function delete(string $id): array
    {
        return $this->client->request('DELETE', '/push/devices/' . Notifique::encodePathSegment($id), null);
    }
}

/**
 * POST/GET /v1/push/messages, GET /v1/push/messages/:id, POST /v1/push/messages/:id/cancel
 * SendPushRequest: to (array), title?, body?, url?, icon?, image?, data?, schedule.sendAt (camelCase), options?
 */
class PushMessages
{
    private Notifique $client;

    public function __construct(Notifique $client)
    {
        $this->client = $client;
    }

    /**
     * @param array{to: list<string>, title?: string, body?: string, url?: string, schedule?: array{sendAt?: string}, options?: array} $params
     * @param string|null $idempotencyKey Chave única para evitar envio duplicado (header Idempotency-Key).
     */
    public function send(array $params, ?string $idempotencyKey = null): array
    {
        $options = [];
        if ($idempotencyKey !== null && $idempotencyKey !== '') {
            $options['headers'] = ['Idempotency-Key' => $idempotencyKey];
        }
        return $this->client->request('POST', '/push/messages', $params, $options);
    }

    public function list(array $params = []): array
    {
        $path = '/push/messages';
        if ($params !== []) {
            $path .= '?' . http_build_query($params);
        }
        return $this->client->request('GET', $path, null);
    }

    public function get(string $id): array
    {
        return $this->client->request('GET', '/push/messages/' . Notifique::encodePathSegment($id), null);
    }

    public function cancel(string $id): array
    {
        return $this->client->request('POST', '/push/messages/' . Notifique::encodePathSegment($id) . '/cancel', null);
    }
}
