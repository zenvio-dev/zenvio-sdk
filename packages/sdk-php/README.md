# Zenvio PHP SDK

Official Zenvio SDK for PHP.

## Installation

You can install the package via composer:

```bash
composer require zenvio/zenvio-sdk
```

## Quick Start

```php
require_once 'vendor/autoload.php';

use Zenvio\Zenvio;

// Initialize the client
$zenvio = new Zenvio('your-api-key');

$phoneId = 'your-phone-id';

// 1. Simple text message
$response = $zenvio->whatsapp->sendText($phoneId, '5511999999999', 'Hello from PHP! 🐘');

if ($response->success) {
    echo "Message sent! ID: " . $response->messageId;
} else {
    echo "Error: " . $response->error;
}

// 2. Template message with full parameters
$response = $zenvio->whatsapp->send($phoneId, [
    'to' => ['5511999999999'],
    'type' => 'template',
    'payload' => [
        'key' => 'order_update',
        'language' => 'pt_BR',
        'variables' => ['Matheus', 'Delivered']
    ]
]);
```

## Features

- Uses Guzzle for robust HTTP requests.
- Fully namespaced and PSR-4 compliant.
- Supports all WhatsApp message types.
- Shortcut for text messages.
