using Zenvio.Models.WhatsApp;

namespace Zenvio;

public sealed class WhatsAppApi
{
    private readonly ZenvioClient _client;

    internal WhatsAppApi(ZenvioClient client) => _client = client;

    public Task<WhatsAppSendResponse> SendAsync(string instanceId, WhatsAppSendParams parameters, CancellationToken cancellationToken = default)
    {
        parameters.InstanceId = instanceId;
        return _client.RequestAsync<WhatsAppSendResponse>(HttpMethod.Post, "/whatsapp/messages", parameters, cancellationToken);
    }

    public Task<WhatsAppSendResponse> SendTextAsync(string instanceId, string to, string text, CancellationToken cancellationToken = default)
    {
        return SendTextAsync(instanceId, new List<string> { to }, text, cancellationToken);
    }

    public Task<WhatsAppSendResponse> SendTextAsync(string instanceId, List<string> to, string text, CancellationToken cancellationToken = default)
    {
        var parameters = new WhatsAppSendParams
        {
            To = to,
            Type = "text",
            Payload = new TextPayload(text)
        };
        return SendAsync(instanceId, parameters, cancellationToken);
    }

    public Task<WhatsAppMessageStatus> GetMessageAsync(string messageId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppMessageStatus>(HttpMethod.Get, $"/whatsapp/messages/{messageId}", cancellationToken: cancellationToken);
    }

    public Task<WhatsAppMessageActionResponse> DeleteMessageAsync(string messageId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppMessageActionResponse>(HttpMethod.Delete, $"/whatsapp/messages/{messageId}", cancellationToken: cancellationToken);
    }

    public Task<WhatsAppMessageActionResponse> EditMessageAsync(string messageId, string text, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppMessageActionResponse>(HttpMethod.Patch, $"/whatsapp/messages/{messageId}/edit", new { text }, cancellationToken);
    }

    public Task<WhatsAppMessageActionResponse> CancelMessageAsync(string messageId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppMessageActionResponse>(HttpMethod.Post, $"/whatsapp/messages/{messageId}/cancel", cancellationToken: cancellationToken);
    }

    public Task<WhatsAppInstanceListResponse> ListInstancesAsync(CancellationToken cancellationToken = default)
    {
        return ListInstancesAsync(null, cancellationToken);
    }

    public Task<WhatsAppInstanceListResponse> ListInstancesAsync(Dictionary<string, string>? queryParams, CancellationToken cancellationToken = default)
    {
        var path = "/whatsapp/instances";
        if (queryParams is { Count: > 0 })
        {
            var query = string.Join("&", queryParams.Select(kv => $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value)}"));
            path = $"{path}?{query}";
        }
        return _client.RequestAsync<WhatsAppInstanceListResponse>(HttpMethod.Get, path, cancellationToken: cancellationToken);
    }

    public Task<WhatsAppInstanceResponse> GetInstanceAsync(string instanceId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppInstanceResponse>(HttpMethod.Get, $"/whatsapp/instances/{instanceId}", cancellationToken: cancellationToken);
    }

    public Task<WhatsAppCreateInstanceResponse> CreateInstanceAsync(string name, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppCreateInstanceResponse>(HttpMethod.Post, "/whatsapp/instances", new { name }, cancellationToken);
    }

    public Task<WhatsAppInstanceActionResponse> DisconnectInstanceAsync(string instanceId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppInstanceActionResponse>(HttpMethod.Post, $"/whatsapp/instances/{instanceId}/disconnect", cancellationToken: cancellationToken);
    }

    public Task<WhatsAppInstanceActionResponse> DeleteInstanceAsync(string instanceId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppInstanceActionResponse>(HttpMethod.Delete, $"/whatsapp/instances/{instanceId}", cancellationToken: cancellationToken);
    }
}
