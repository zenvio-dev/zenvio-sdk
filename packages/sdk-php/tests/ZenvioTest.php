<?php

namespace Zenvio\Tests;

use PHPUnit\Framework\TestCase;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\Middleware;
use Zenvio\Zenvio;
use Zenvio\Exception\ZenvioApiException;

class ZenvioTest extends TestCase
{
    private array $container = [];

    private function getMockClient(array $responses): Zenvio
    {
        $mock = new MockHandler($responses);
        $history = Middleware::history($this->container);
        $handlerStack = HandlerStack::create($mock);
        $handlerStack->push($history);
        return new Zenvio('test-key', 'https://api.zenvio.com/v1', ['handler' => $handlerStack]);
    }

    public function testWhatsAppSendText(): void
    {
        $zenvio = $this->getMockClient([
            new Response(200, [], json_encode(['message_ids' => ['msg-123'], 'status' => 'queued'])),
        ]);
        $resp = $zenvio->whatsapp->sendText('instance-1', ['5511999999999'], 'Hello');
        $this->assertIsArray($resp);
        $this->assertSame(['msg-123'], $resp['message_ids']);
        $this->assertSame('queued', $resp['status']);
    }

    public function testWhatsAppSendErrorThrows(): void
    {
        $zenvio = $this->getMockClient([
            new Response(400, [], json_encode(['error' => 'Invalid instance'])),
        ]);
        $this->expectException(ZenvioApiException::class);
        $zenvio->whatsapp->sendText('x', ['123'], 'hi');
    }

    public function testWhatsAppSendWithParams(): void
    {
        $zenvio = $this->getMockClient([
            new Response(200, [], json_encode(['message_ids' => ['m1'], 'status' => 'queued'])),
        ]);
        $resp = $zenvio->whatsapp->send('instance-1', [
            'to' => ['5511888888888'],
            'type' => 'text',
            'payload' => ['message' => 'Hi'],
        ]);
        $this->assertSame(['m1'], $resp['message_ids']);
    }

    public function testWhatsAppGetMessage(): void
    {
        $zenvio = $this->getMockClient([
            new Response(200, [], json_encode(['message_id' => 'msg-1', 'status' => 'delivered'])),
        ]);
        $resp = $zenvio->whatsapp->getMessage('msg-1');
        $this->assertSame('msg-1', $resp['message_id']);
        $this->assertSame('delivered', $resp['status']);
    }

    public function testWhatsAppListInstances(): void
    {
        $zenvio = $this->getMockClient([
            new Response(200, [], json_encode(['success' => true, 'data' => [], 'pagination' => ['total' => 0]])),
        ]);
        $resp = $zenvio->whatsapp->listInstances();
        $this->assertTrue($resp['success']);
    }

    public function testSmsSend(): void
    {
        $zenvio = $this->getMockClient([
            new Response(200, [], json_encode([
                'success' => true,
                'data' => ['status' => 'queued', 'count' => 1, 'sms_ids' => ['sms-1']],
            ])),
        ]);
        $resp = $zenvio->sms->send(['to' => ['5511999999999'], 'message' => 'Test']);
        $this->assertTrue($resp['success']);
        $this->assertSame(['sms-1'], $resp['data']['sms_ids']);
    }

    public function testSmsGet(): void
    {
        $zenvio = $this->getMockClient([
            new Response(200, [], json_encode([
                'success' => true,
                'data' => ['sms_id' => 'sms-1', 'status' => 'delivered'],
            ])),
        ]);
        $resp = $zenvio->sms->get('sms-1');
        $this->assertSame('sms-1', $resp['data']['sms_id']);
    }

    public function testSmsCancel(): void
    {
        $zenvio = $this->getMockClient([
            new Response(200, [], json_encode([
                'success' => true,
                'data' => ['sms_id' => 'sms-1', 'status' => 'cancelled'],
            ])),
        ]);
        $resp = $zenvio->sms->cancel('sms-1');
        $this->assertTrue($resp['success']);
        $this->assertSame('cancelled', $resp['data']['status']);
    }

    public function testEmailSend(): void
    {
        $zenvio = $this->getMockClient([
            new Response(200, [], json_encode([
                'success' => true,
                'data' => ['email_ids' => ['email-1'], 'status' => 'queued'],
            ])),
        ]);
        $resp = $zenvio->email->send([
            'from' => 'noreply@example.com',
            'to' => ['u@example.com'],
            'subject' => 'Test',
            'text' => 'Body',
        ]);
        $this->assertSame(['email-1'], $resp['data']['email_ids']);
    }

    public function testEmailCancel(): void
    {
        $zenvio = $this->getMockClient([
            new Response(200, [], json_encode([
                'success' => true,
                'data' => ['email_id' => 'email-1', 'status' => 'cancelled'],
            ])),
        ]);
        $resp = $zenvio->email->cancel('email-1');
        $this->assertTrue($resp['success']);
    }

    public function testMessagesSend(): void
    {
        $zenvio = $this->getMockClient([
            new Response(200, [], json_encode([
                'success' => true,
                'data' => ['message_ids' => ['m1', 'm2'], 'status' => 'queued', 'count' => 2],
            ])),
        ]);
        $resp = $zenvio->messages->send([
            'to' => ['5511999999999'],
            'template' => 'welcome',
            'variables' => ['name' => 'User'],
            'channels' => ['whatsapp', 'sms'],
            'instance_id' => 'inst-1',
        ]);
        $this->assertSame(['m1', 'm2'], $resp['data']['message_ids']);
    }
}
