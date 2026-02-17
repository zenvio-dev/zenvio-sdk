# Zenvio PHP SDK

SDK oficial Zenvio para PHP — WhatsApp, SMS, Email e envio por template (messages).

## Instalação

```bash
composer require zenvio/zenvio-sdk
```

## Uso rápido

```php
<?php
require_once 'vendor/autoload.php';

use Zenvio\Zenvio;
use Zenvio\Exception\ZenvioApiException;

$zenvio = new Zenvio('sua-api-key');
$instanceId = 'sua-instancia-whatsapp';

try {
    $resp = $zenvio->whatsapp->sendText($instanceId, ['5511999999999'], 'Olá pelo PHP!');
    print_r($resp['message_ids']);
} catch (ZenvioApiException $e) {
    echo "API erro {$e->statusCode}: {$e->responseBody}";
}
```

## WhatsApp

- **POST /v1/whatsapp/send** — `send($instanceId, $params)` ou `sendText($instanceId, $to, $text)`
- **GET/DELETE/PATCH/POST** — `getMessage($id)`, `deleteMessage($id)`, `editMessage($id, $text)`, `cancelMessage($id)`
- **Instâncias** — `listInstances($params)`, `getInstance($id)`, `createInstance($name)`, `disconnectInstance($id)`, `deleteInstance($id)`

Todos os métodos retornam `array` (JSON decodificado). Em respostas 4xx/5xx é lançada `Zenvio\Exception\ZenvioApiException` (com `statusCode` e `responseBody`).

```php
// Texto
$resp = $zenvio->whatsapp->sendText($instanceId, '5511999999999', 'Oi');

// Com params completos
$resp = $zenvio->whatsapp->send($instanceId, [
    'to' => ['5511999999999'],
    'type' => 'image',
    'payload' => ['media_url' => 'https://exemplo.com/img.png'],
]);

// Status da mensagem
$status = $zenvio->whatsapp->getMessage('msg-123');
```

## SMS

```php
$resp = $zenvio->sms->send([
    'to' => ['5511999999999'],
    'message' => 'Seu código: 123',
]);
// $resp['data']['sms_ids']

$status = $zenvio->sms->get('sms-id');
```

## Email

```php
$resp = $zenvio->email->send([
    'from' => 'noreply@seudominio.com',
    'to' => ['cliente@email.com'],
    'subject' => 'Assunto',
    'text' => 'Corpo em texto',
    'html' => '<p>Corpo HTML</p>',
]);
// $resp['data']['email_ids']

$status = $zenvio->email->get('email-id');
$zenvio->email->cancel('email-id');
```

## Messages (template)

Envio por template em múltiplos canais (whatsapp, sms, email).

```php
$resp = $zenvio->messages->send([
    'to' => ['5511999999999'],
    'template' => 'welcome',
    'variables' => ['name' => 'João'],
    'channels' => ['whatsapp', 'sms'],
    'instance_id' => 'inst-whatsapp',
]);
// $resp['data']['message_ids'], $resp['data']['sms_ids'], etc.
```

## Erros

Em 4xx/5xx o SDK lança `Zenvio\Exception\ZenvioApiException`:

- `$e->statusCode` — código HTTP
- `$e->responseBody` — corpo da resposta
- `$e->getMessage()` — mensagem resumida

## Requisitos

- PHP 8.1+
- Guzzle HTTP ^7.8
