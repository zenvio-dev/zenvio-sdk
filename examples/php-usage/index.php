<?php

require_once __DIR__ . '/vendor/autoload.php';

use Notifique\Notifique;
use Notifique\Exception\NotifiqueApiException;

$apiKey = getenv('NOTIFIQUE_API_KEY');
$phoneId = getenv('NOTIFIQUE_INSTANCE_ID');
$recipient = getenv('MY_PHONE');

if (!$apiKey || !$phoneId || !$recipient) {
    fwrite(STDERR, "Set NOTIFIQUE_API_KEY, NOTIFIQUE_INSTANCE_ID and MY_PHONE before running this example.\n");
    exit(1);
}

$notifique = new Notifique($apiKey);

echo "--- Notifique PHP SDK Example ---\n";

try {
    echo "\n1. Sending text...\n";
    $res1 = $notifique->whatsapp->sendText($phoneId, [$recipient], "Hello from PHP! 🐘");
    echo "Result: " . (($res1['success'] ?? false) ? "Success" : "Failed") . "\n";
    if (!empty($res1['data']['messageIds'])) {
        echo "Message IDs: " . implode(', ', $res1['data']['messageIds']) . "\n";
    }

    echo "\n2. Sending image...\n";
    $res2 = $notifique->whatsapp->send($phoneId, [
        'to' => [$recipient],
        'type' => 'image',
        'payload' => [
            'mediaUrl' => 'https://placehold.co/600x400/png',
            'fileName' => 'image.png',
            'mimetype' => 'image/png',
            'caption' => 'Notifique Logo',
        ]
    ]);
    echo "Result: " . (($res2['success'] ?? false) ? "Success" : "Failed") . "\n";
} catch (NotifiqueApiException $e) {
    echo "Error: " . $e->getDisplayMessage() . "\n";
    exit(1);
}
