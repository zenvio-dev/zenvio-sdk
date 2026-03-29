using Notifique.Models.WhatsApp;

namespace Notifique;

public sealed class WhatsAppApi
{
    private readonly NotifiqueClient _client;

    internal WhatsAppApi(NotifiqueClient client) => _client = client;

    public Task<WhatsAppSendEnvelope> SendAsync(string instanceId, WhatsAppSendParams parameters, CancellationToken cancellationToken = default)
    {
        parameters.InstanceId = instanceId;
        return _client.RequestAsync<WhatsAppSendEnvelope>(HttpMethod.Post, "/whatsapp/messages", parameters, cancellationToken);
    }

    public Task<WhatsAppSendEnvelope> SendTextAsync(string instanceId, string to, string text, CancellationToken cancellationToken = default)
    {
        return SendTextAsync(instanceId, new List<string> { to }, text, cancellationToken);
    }

    public Task<WhatsAppSendEnvelope> SendTextAsync(string instanceId, List<string> to, string text, CancellationToken cancellationToken = default)
    {
        var parameters = new WhatsAppSendParams
        {
            To = to,
            Type = "text",
            Payload = new TextPayload(text)
        };
        return SendAsync(instanceId, parameters, cancellationToken);
    }

    public Task<WhatsAppListMessagesResponse> ListMessagesAsync(CancellationToken cancellationToken = default)
    {
        return ListMessagesAsync(null, cancellationToken);
    }

    public Task<WhatsAppListMessagesResponse> ListMessagesAsync(Dictionary<string, string>? queryParams, CancellationToken cancellationToken = default)
    {
        var path = "/whatsapp/messages";
        if (queryParams is { Count: > 0 })
        {
            var query = string.Join("&", queryParams.Select(kv => $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value)}"));
            path = $"{path}?{query}";
        }
        return _client.RequestAsync<WhatsAppListMessagesResponse>(HttpMethod.Get, path, cancellationToken: cancellationToken);
    }

    public Task<WhatsAppMessageEnvelope> GetMessageAsync(string messageId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppMessageEnvelope>(HttpMethod.Get, $"/whatsapp/messages/{NotifiqueClient.EscapePathSegment(messageId)}", cancellationToken: cancellationToken);
    }

    public Task<WhatsAppInstanceQrResponse> GetInstanceQrAsync(string instanceId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppInstanceQrResponse>(HttpMethod.Get, $"/whatsapp/instances/{NotifiqueClient.EscapePathSegment(instanceId)}/qr", cancellationToken: cancellationToken);
    }

    public Task<WhatsAppMessageActionResponse> DeleteMessageAsync(string messageId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppMessageActionResponse>(HttpMethod.Delete, $"/whatsapp/messages/{NotifiqueClient.EscapePathSegment(messageId)}", cancellationToken: cancellationToken);
    }

    public Task<WhatsAppMessageActionResponse> EditMessageAsync(string messageId, string text, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppMessageActionResponse>(HttpMethod.Patch, $"/whatsapp/messages/{NotifiqueClient.EscapePathSegment(messageId)}/edit", new { text }, cancellationToken);
    }

    public Task<WhatsAppMessageActionResponse> CancelMessageAsync(string messageId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppMessageActionResponse>(HttpMethod.Post, $"/whatsapp/messages/{NotifiqueClient.EscapePathSegment(messageId)}/cancel", cancellationToken: cancellationToken);
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
        return _client.RequestAsync<WhatsAppInstanceResponse>(HttpMethod.Get, $"/whatsapp/instances/{NotifiqueClient.EscapePathSegment(instanceId)}", cancellationToken: cancellationToken);
    }

    public Task<WhatsAppCreateInstanceResponse> CreateInstanceAsync(string name, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppCreateInstanceResponse>(HttpMethod.Post, "/whatsapp/instances", new { name }, cancellationToken);
    }

    public Task<WhatsAppInstanceActionResponse> DisconnectInstanceAsync(string instanceId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppInstanceActionResponse>(HttpMethod.Post, $"/whatsapp/instances/{NotifiqueClient.EscapePathSegment(instanceId)}/disconnect", cancellationToken: cancellationToken);
    }

    public Task<WhatsAppInstanceActionResponse> DeleteInstanceAsync(string instanceId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<WhatsAppInstanceActionResponse>(HttpMethod.Delete, $"/whatsapp/instances/{NotifiqueClient.EscapePathSegment(instanceId)}", cancellationToken: cancellationToken);
    }
}
