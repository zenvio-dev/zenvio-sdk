using Notifique.Models.Email;

namespace Notifique;

public sealed class EmailApi
{
    private readonly NotifiqueClient _client;

    internal EmailApi(NotifiqueClient client) => _client = client;

    public Task<EmailSendResponse> SendAsync(EmailSendParams parameters, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<EmailSendResponse>(HttpMethod.Post, "/email/messages", parameters, cancellationToken);
    }

    public Task<EmailStatusResponse> GetAsync(string messageId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<EmailStatusResponse>(HttpMethod.Get, $"/email/messages/{NotifiqueClient.EscapePathSegment(messageId)}", cancellationToken: cancellationToken);
    }

    public Task<EmailCancelResponse> CancelAsync(string messageId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<EmailCancelResponse>(HttpMethod.Post, $"/email/messages/{NotifiqueClient.EscapePathSegment(messageId)}/cancel", cancellationToken: cancellationToken);
    }
}
