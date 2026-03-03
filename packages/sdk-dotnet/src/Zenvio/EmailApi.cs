using Zenvio.Models.Email;

namespace Zenvio;

public sealed class EmailApi
{
    private readonly ZenvioClient _client;

    internal EmailApi(ZenvioClient client) => _client = client;

    public Task<EmailSendResponse> SendAsync(EmailSendParams parameters, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<EmailSendResponse>(HttpMethod.Post, "/email/messages", parameters, cancellationToken);
    }

    public Task<EmailStatusResponse> GetAsync(string messageId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<EmailStatusResponse>(HttpMethod.Get, $"/email/messages/{messageId}", cancellationToken: cancellationToken);
    }

    public Task<EmailCancelResponse> CancelAsync(string messageId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<EmailCancelResponse>(HttpMethod.Post, $"/email/messages/{messageId}/cancel", cancellationToken: cancellationToken);
    }
}
