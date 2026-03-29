# Notifique PHP SDK

SDK oficial Notifique para PHP — WhatsApp, SMS, Email, Push e envio por template.

## Instalação

```bash
composer require notifique/notifique-sdk-php
```

## Uso rápido

```php
<?php
require_once 'vendor/autoload.php';

use Notifique\Notifique;
use Notifique\Exception\NotifiqueApiException;

$notifique = new Notifique('sua-api-key'); // baseUrl padrão: https://api.notifique.dev/v1
$instanceId = 'sua-instancia-whatsapp';

try {
    $resp = $notifique->whatsapp->sendText($instanceId, ['5511999999999'], 'Olá!');
    // API retorna envelope: $resp['success'], $resp['data']['messageIds']
    print_r($resp['data']['messageIds']);
} catch (NotifiqueApiException $e) {
    echo "API erro {$e->statusCode}: {$e->responseBody}";
}
```

## WhatsApp

- `send($instanceId, $params)`, `sendText($instanceId, $to, $text)` — retornam envelope `success`/`data`
- `listMessages($params)` — GET /v1/whatsapp/messages
- `getMessage($id)` — retorna envelope `data` com status da mensagem
- `getInstanceQr($instanceId)` — GET /v1/whatsapp/instances/:id/qr
- `deleteMessage`, `editMessage`, `cancelMessage`
- `listInstances`, `getInstance`, `createInstance`, `disconnectInstance`, `deleteInstance`

## SMS

- `send($params)`, `get($id)`, `cancel($id)`

## Email

- `send($params)`, `get($id)`, `cancel($id)`
- **Domínios** — `$notifique->email->domains()->list()`, `create(['domain' => '...'])`, `get($id)`, `verify($id)`

## Push

- **Apps** — `$notifique->push->apps->list()`, `get($id)`, `create(['name' => '...'])`, `update($id, $params)`, `delete($id)`
- **Devices** — `$notifique->push->devices->register($params)`, `list()`, `get($id)`, `delete($id)`
- **Messages** — `$notifique->push->messages->send($params)`, `list()`, `get($id)`, `cancel($id)`

## Messages (template)

- `$notifique->messages->send($params)` — canais whatsapp, sms, email

## Requisitos

- PHP 8.1+, Guzzle ^7.8.
- Em 4xx/5xx: `Notifique\Exception\NotifiqueApiException` com `statusCode` e `responseBody`.
