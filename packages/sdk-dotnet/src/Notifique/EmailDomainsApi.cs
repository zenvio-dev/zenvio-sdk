using Notifique.Models.Email;

namespace Notifique;

public sealed class EmailDomainsApi
{
    private readonly NotifiqueClient _client;

    internal EmailDomainsApi(NotifiqueClient client) => _client = client;

    public Task<EmailDomainListResponse> ListAsync(CancellationToken cancellationToken = default)
    {
        return ListAsync(null, cancellationToken);
    }

    public Task<EmailDomainListResponse> ListAsync(Dictionary<string, string>? queryParams, CancellationToken cancellationToken = default)
    {
        var path = "/email/domains";
        if (queryParams is { Count: > 0 })
        {
            var query = string.Join("&", queryParams.Select(kv => $"{Uri.EscapeDataString(kv.Key)}={Uri.EscapeDataString(kv.Value)}"));
            path = $"{path}?{query}";
        }
        return _client.RequestAsync<EmailDomainListResponse>(HttpMethod.Get, path, cancellationToken: cancellationToken);
    }

    public Task<EmailDomainCreateResponse> CreateAsync(CreateEmailDomainRequest request, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<EmailDomainCreateResponse>(HttpMethod.Post, "/email/domains", request, cancellationToken);
    }

    public Task<EmailDomainGetResponse> GetAsync(string id, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<EmailDomainGetResponse>(HttpMethod.Get, $"/email/domains/{NotifiqueClient.EscapePathSegment(id)}", cancellationToken: cancellationToken);
    }

    public Task<EmailDomainVerifyResponse> VerifyAsync(string id, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<EmailDomainVerifyResponse>(HttpMethod.Post, $"/email/domains/{NotifiqueClient.EscapePathSegment(id)}/verify", cancellationToken: cancellationToken);
    }
}
