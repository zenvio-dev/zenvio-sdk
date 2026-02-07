<?php

namespace Zenvio;

use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\Exception\GuzzleException;
use Zenvio\Models\SendResponse;

class Zenvio
{
    private string $apiKey;
    private string $baseUrl;
    private GuzzleClient $httpClient;
    public Whatsapp $whatsapp;

    public function __construct(string $apiKey, string $baseUrl = 'https://api.zenvio.com/v1', array $guzzleOptions = [])
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = rtrim($baseUrl, '/');

        $defaultOptions = [
            'base_uri' => $this->baseUrl,
            'timeout' => 10.0,
            'headers' => [
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
                'User-Agent' => 'Zenvio-PHP-SDK/0.1.0',
            ],
        ];

        $this->httpClient = new GuzzleClient(array_merge($defaultOptions, $guzzleOptions));
        $this->whatsapp = new Whatsapp($this);
    }

    public function request(string $method, string $path, array $body = []): SendResponse
    {
        try {
            $response = $this->httpClient->request($method, $path, [
                'json' => $body,
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            return new SendResponse($data);
        } catch (GuzzleException $e) {
            $errorBody = $e->getResponse() ? $e->getResponse()->getBody()->getContents() : $e->getMessage();
            $data = json_decode($errorBody, true);

            if (is_array($data)) {
                return new SendResponse($data);
            }

            return SendResponse::fromError("HTTP Error: {$e->getMessage()}");
        } catch (\Exception $e) {
            return SendResponse::fromError("SDK Error: {$e->getMessage()}");
        }
    }
}
