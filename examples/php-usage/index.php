<?php

require_once __DIR__ . '/vendor/autoload.php';

use Zenvio\Zenvio;

// 1. Initialize the client
$zenvio = new Zenvio('your_api_key_here');

$phoneId = 'your_phone_id_here';
$recipient = '5511999999999';

echo "--- Starting Zenvio PHP SDK Example ---\n";

// 2. Simple text message
echo "\n1. Sending simplified text...\n";
$res1 = $zenvio->whatsapp->sendText($phoneId, $recipient, "Hello from PHP! 🐘");
echo "Result: " . ($res1->success ? "Success" : "Failed") . "\n";
if ($res1->error)
    echo "Error: {$res1->error}\n";

// 3. Template message
echo "\n2. Sending template message...\n";
$res2 = $zenvio->whatsapp->send($phoneId, [
    'to' => [$recipient],
    'type' => 'template',
    'payload' => [
        'key' => 'welcome_template',
        'language' => 'pt_BR',
        'variables' => ['PHP Developer']
    ]
]);
echo "Result: " . ($res2->success ? "Success" : "Failed") . "\n";

// 4. Image message
echo "\n3. Sending image message...\n";
$res3 = $zenvio->whatsapp->send($phoneId, [
    'to' => [$recipient],
    'type' => 'image',
    'payload' => [
        'url' => 'https://placehold.co/600x400/png',
        'caption' => 'Zenvio Logo'
    ]
]);
echo "Result: " . ($res3->success ? "Success" : "Failed") . "\n";
