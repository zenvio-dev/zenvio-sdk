<?php

namespace Zenvio\Models;

class SendParams
{
    public array $to;
    public string $type;
    public mixed $payload;
    public ?array $schedule = null;
    public ?array $metadata = null;
    public ?array $options = null;
    public ?array $webhook = null;

    public function __construct(array $to, string $type, mixed $payload)
    {
        $this->to = $to;
        $this->type = $type;
        $this->payload = $payload;
    }

    public function toArray(): array
    {
        return array_filter([
            'to' => $this->to,
            'type' => $this->type,
            'payload' => $this->payload,
            'schedule' => $this->schedule,
            'metadata' => $this->metadata,
            'options' => $this->options,
            'webhook' => $this->webhook,
        ], fn($value) => $value !== null);
    }
}
