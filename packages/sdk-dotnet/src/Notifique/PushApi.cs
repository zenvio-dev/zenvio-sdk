using Notifique.Models.Push;

namespace Notifique;

public sealed class PushApi
{
    private readonly NotifiqueClient _client;

    internal PushApi(NotifiqueClient client) => _client = client;

    public Task<PushAppListResponse> ListAppsAsync(CancellationToken cancellationToken = default)
    {
        return ListAppsAsync(null, cancellationToken);
    }

    public Task<PushAppListResponse> ListAppsAsync(Dictionary<string, string>? queryParams, CancellationToken cancellationToken = default)
    {
        var path = "/push/apps";
        if (queryParams is { Count: > 0 })
        {
            var query = string.Join("&", queryParams.Select(kv => $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value)}"));
            path = $"{path}?{query}";
        }
        return _client.RequestAsync<PushAppListResponse>(HttpMethod.Get, path, cancellationToken: cancellationToken);
    }

    public Task<PushAppSingleResponse> GetAppAsync(string id, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<PushAppSingleResponse>(HttpMethod.Get, $"/push/apps/{NotifiqueClient.EscapePathSegment(id)}", cancellationToken: cancellationToken);
    }

    public Task<PushAppSingleResponse> CreateAppAsync(PushAppCreateRequest request, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<PushAppSingleResponse>(HttpMethod.Post, "/push/apps", request, cancellationToken);
    }

    public Task<PushAppSingleResponse> UpdateAppAsync(string id, PushAppUpdateRequest request, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<PushAppSingleResponse>(HttpMethod.Put, $"/push/apps/{NotifiqueClient.EscapePathSegment(id)}", request, cancellationToken);
    }

    public Task DeleteAppAsync(string id, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync(HttpMethod.Delete, $"/push/apps/{NotifiqueClient.EscapePathSegment(id)}", null, cancellationToken);
    }

    public Task<PushDeviceListResponse> ListDevicesAsync(CancellationToken cancellationToken = default)
    {
        return ListDevicesAsync(null, cancellationToken);
    }

    public Task<PushDeviceListResponse> ListDevicesAsync(Dictionary<string, string>? queryParams, CancellationToken cancellationToken = default)
    {
        var path = "/push/devices";
        if (queryParams is { Count: > 0 })
        {
            var query = string.Join("&", queryParams.Select(kv => $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value)}"));
            path = $"{path}?{query}";
        }
        return _client.RequestAsync<PushDeviceListResponse>(HttpMethod.Get, path, cancellationToken: cancellationToken);
    }

    public Task<PushDeviceSingleResponse> GetDeviceAsync(string id, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<PushDeviceSingleResponse>(HttpMethod.Get, $"/push/devices/{NotifiqueClient.EscapePathSegment(id)}", cancellationToken: cancellationToken);
    }

    public Task<PushDeviceSingleResponse> RegisterDeviceAsync(PushDeviceRegisterRequest request, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<PushDeviceSingleResponse>(HttpMethod.Post, "/push/devices", request, cancellationToken);
    }

    public Task DeleteDeviceAsync(string id, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync(HttpMethod.Delete, $"/push/devices/{NotifiqueClient.EscapePathSegment(id)}", null, cancellationToken);
    }

    public Task<SendPushResponse> SendMessageAsync(SendPushRequest request, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<SendPushResponse>(HttpMethod.Post, "/push/messages", request, cancellationToken);
    }

    public Task<PushMessageListResponse> ListMessagesAsync(CancellationToken cancellationToken = default)
    {
        return ListMessagesAsync(null, cancellationToken);
    }

    public Task<PushMessageListResponse> ListMessagesAsync(Dictionary<string, string>? queryParams, CancellationToken cancellationToken = default)
    {
        var path = "/push/messages";
        if (queryParams is { Count: > 0 })
        {
            var query = string.Join("&", queryParams.Select(kv => $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value)}"));
            path = $"{path}?{query}";
        }
        return _client.RequestAsync<PushMessageListResponse>(HttpMethod.Get, path, cancellationToken: cancellationToken);
    }

    public Task<PushMessageSingleResponse> GetMessageAsync(string id, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<PushMessageSingleResponse>(HttpMethod.Get, $"/push/messages/{NotifiqueClient.EscapePathSegment(id)}", cancellationToken: cancellationToken);
    }

    public Task<CancelPushResponse> CancelMessageAsync(string id, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<CancelPushResponse>(HttpMethod.Post, $"/push/messages/{NotifiqueClient.EscapePathSegment(id)}/cancel", null, cancellationToken);
    }
}
