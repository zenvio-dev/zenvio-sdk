<?php

namespace Zenvio\Models;

class SendResponse
{
    public bool $success;
    public ?string $messageId = null;
    public ?string $jobId = null;
    public ?string $error = null;

    public function __construct(array $data)
    {
        $this->success = $data['success'] ?? false;
        $this->messageId = $data['messageId'] ?? null;
        $this->jobId = $data['jobId'] ?? null;
        $this->error = $data['error'] ?? $data['message'] ?? null;
    }

    public static function fromError(string $message): self
    {
        return new self(['success' => false, 'error' => $message]);
    }
}
