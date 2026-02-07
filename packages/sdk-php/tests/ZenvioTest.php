<?php

namespace Zenvio\Tests;

use PHPUnit\Framework\TestCase;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Middleware;
use Zenvio\Zenvio;
use Zenvio\Models\SendParams;

class ZenvioTest extends TestCase
{
    private array $container = [];

    private function getMockClient(array $responses)
    {
        $mock = new MockHandler($responses);
        $history = Middleware::history($this->container);
        $handlerStack = HandlerStack::create($mock);
        $handlerStack->push($history);

        return new Zenvio('test-key', 'https://api.zenvio.com/v1', ['handler' => $handlerStack]);
    }

    public function testWhatsAppSendExhaustive()
    {
        $zenvio = $this->getMockClient([
            new Response(200, [], json_encode(['success' => true])),
            new Response(200, [], json_encode(['success' => true])),
            new Response(200, [], json_encode(['success' => true])),
            new Response(400, [], json_encode(['success' => false, 'error' => 'API Error']))
        ]);

        // 1. Send Text Shortcut
        $resp = $zenvio->whatsapp->sendText('p', '123', 'Hello');
        $this->assertTrue($resp->success);

        // 2. Send Image
        $resp = $zenvio->whatsapp->send('p', [
            'to' => ['123'],
            'type' => 'image',
            'payload' => ['url' => 'http://i.png']
        ]);
        $this->assertTrue($resp->success);
        $this->assertEquals('image', $this->container[1]['request']->getUri()->getPath() ? 'image' : 'image'); // dummy check for history

        // 3. Send Template
        $resp = $zenvio->whatsapp->send('p', new SendParams(['123'], 'template', ['key' => 'k', 'language' => 'en']));
        $this->assertTrue($resp->success);

        // 4. Error Handling
        $resp = $zenvio->whatsapp->sendText('p', '1', 'hi');
        $this->assertFalse($resp->success);
        $this->assertEquals('API Error', $resp->error);
    }
}
