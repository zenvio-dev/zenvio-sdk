<?php

namespace Notifique\Exception;

use Exception;

class NotifiqueApiException extends Exception
{
    public function __construct(
        public readonly int $statusCode,
        public readonly string $responseBody,
        ?Exception $previous = null
    ) {
        parent::__construct(
            "Notifique API error {$statusCode}",
            0,
            $previous
        );
    }

    /** Mensagem curta para exibição (status + body). */
    public function getDisplayMessage(): string
    {
        return $this->statusCode . ' - ' . $this->responseBody;
    }
}
