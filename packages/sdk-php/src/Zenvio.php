<?php

namespace Zenvio;

use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\Exception\GuzzleException;
use Zenvio\Exception\ZenvioApiException;

class Zenvio
{
    private string $apiKey;
    private string $baseUrl;
    private GuzzleClient $httpClient;

    public Whatsapp $whatsapp;
    public Sms $sms;
    public Email $email;
    public Messages $messages;

    public function __construct(string $apiKey, string $baseUrl = 'https://api.zenvio.com/v1', array $guzzleOptions = [])
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = rtrim($baseUrl, '/');

        $defaultOptions = [
            'base_uri' => $this->baseUrl . '/',
            'timeout' => 30.0,
            'headers' => [
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
                'User-Agent' => 'Zenvio-PHP-SDK/0.2.0',
            ],
        ];

        $this->httpClient = new GuzzleClient(array_merge($defaultOptions, $guzzleOptions));
        $this->whatsapp = new Whatsapp($this);
        $this->sms = new Sms($this);
        $this->email = new Email($this);
        $this->messages = new Messages($this);
    }

    /**
     * Executa a requisição HTTP. Em status >= 400 lança ZenvioApiException.
     * @return array decoded JSON (vazio ou null em 204 sem body)
     * @throws ZenvioApiException
     */
    public function request(string $method, string $path, ?array $body = null): array
    {
        $path = ltrim($path, '/');
        $options = [];

        if ($body !== null && $body !== [] && !in_array($method, ['GET', 'DELETE'], true)) {
            $options['json'] = $body;
        }

        try {
            $response = $this->httpClient->request($method, $path, $options);
        } catch (GuzzleException $e) {
            $resp = $e->getResponse();
            $code = $resp ? $resp->getStatusCode() : 0;
            $bodyContent = $resp ? $resp->getBody()->getContents() : $e->getMessage();
            throw new ZenvioApiException($code, $bodyContent, $e);
        }

        $contents = $response->getBody()->getContents();
        if ($contents === '') {
            return [];
        }

        $decoded = json_decode($contents, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new ZenvioApiException($response->getStatusCode(), $contents);
        }

        return $decoded;
    }
}
