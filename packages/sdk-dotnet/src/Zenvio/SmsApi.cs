using Zenvio.Models.Sms;

namespace Zenvio;

public sealed class SmsApi
{
    private readonly ZenvioClient _client;

    internal SmsApi(ZenvioClient client) => _client = client;

    public Task<SmsSendResponse> SendAsync(SmsSendParams parameters, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<SmsSendResponse>(HttpMethod.Post, "/sms/messages", parameters, cancellationToken);
    }

    public Task<SmsStatusResponse> GetAsync(string messageId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<SmsStatusResponse>(HttpMethod.Get, $"/sms/messages/{messageId}", cancellationToken: cancellationToken);
    }

    public Task<SmsCancelResponse> CancelAsync(string messageId, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<SmsCancelResponse>(HttpMethod.Post, $"/sms/messages/{messageId}/cancel", cancellationToken: cancellationToken);
    }
}
