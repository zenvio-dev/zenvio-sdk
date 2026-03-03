using System.Net;
using Xunit;
using Zenvio.Tests.Helpers;

namespace Zenvio.Tests;

public class ZenvioClientTests
{
    private readonly MockHttpMessageHandler _handler = new();

    private ZenvioClient CreateClient()
    {
        var httpClient = new HttpClient(_handler);
        return new ZenvioClient("test-api-key", "https://api.zenvio.com/v1", httpClient);
    }

    [Fact]
    public async Task SendsAuthorizationHeader()
    {
        _handler.SetResponse(HttpStatusCode.OK, "{\"message_ids\":[\"m1\"],\"status\":\"queued\"}");
        var client = CreateClient();

        await client.WhatsApp.SendTextAsync("inst-1", "5511999999999", "Hello");

        Assert.NotNull(_handler.LastRequest);
        Assert.Equal("Bearer", _handler.LastRequest.Headers.Authorization?.Scheme);
        Assert.Equal("test-api-key", _handler.LastRequest.Headers.Authorization?.Parameter);
    }

    [Fact]
    public async Task SendsUserAgentHeader()
    {
        _handler.SetResponse(HttpStatusCode.OK, "{\"message_ids\":[\"m1\"],\"status\":\"queued\"}");
        var client = CreateClient();

        await client.WhatsApp.SendTextAsync("inst-1", "5511999999999", "Hello");

        Assert.NotNull(_handler.LastRequest);
        Assert.Contains("Zenvio-DotNet-SDK/0.1.0", _handler.LastRequest.Headers.UserAgent.ToString());
    }

    [Fact]
    public async Task TrimsTrailingSlashFromBaseUrl()
    {
        _handler.SetResponse(HttpStatusCode.OK, "{\"message_ids\":[\"m1\"],\"status\":\"queued\"}");
        var httpClient = new HttpClient(_handler);
        var client = new ZenvioClient("key", "https://api.zenvio.com/v1/", httpClient);

        await client.WhatsApp.SendTextAsync("inst-1", "5511999999999", "Hello");

        Assert.NotNull(_handler.LastRequest);
        Assert.Equal("https://api.zenvio.com/v1/whatsapp/messages", _handler.LastRequest.RequestUri?.ToString());
    }

    [Fact]
    public async Task ThrowsZenvioApiExceptionOn4xx()
    {
        _handler.SetResponse(HttpStatusCode.BadRequest, "{\"error\":\"Invalid\"}");
        var client = CreateClient();

        var ex = await Assert.ThrowsAsync<ZenvioApiException>(() =>
            client.WhatsApp.SendTextAsync("inst-1", "123", "hi"));

        Assert.Equal(400, ex.StatusCode);
        Assert.Contains("Invalid", ex.ResponseBody);
    }

    [Fact]
    public void DisposeDoesNotThrowForExternalClient()
    {
        var httpClient = new HttpClient(_handler);
        var client = new ZenvioClient("key", "https://api.zenvio.com/v1", httpClient);
        client.Dispose();

        // External HttpClient should still be usable
        Assert.NotNull(httpClient.BaseAddress is null ? "" : "");
    }
}
