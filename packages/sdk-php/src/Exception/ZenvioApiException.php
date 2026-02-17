<?php

namespace Zenvio\Exception;

use Exception;

class ZenvioApiException extends Exception
{
    public function __construct(
        public readonly int $statusCode,
        public readonly string $responseBody,
        ?Exception $previous = null
    ) {
        parent::__construct(
            "Zenvio API error {$statusCode}: {$responseBody}",
            0,
            $previous
        );
    }
}
