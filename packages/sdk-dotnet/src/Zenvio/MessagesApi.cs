using Zenvio.Models.Messages;

namespace Zenvio;

public sealed class MessagesApi
{
    private readonly ZenvioClient _client;

    internal MessagesApi(ZenvioClient client) => _client = client;

    public Task<MessagesSendResponse> SendAsync(MessagesSendParams parameters, CancellationToken cancellationToken = default)
    {
        return _client.RequestAsync<MessagesSendResponse>(HttpMethod.Post, "/templates/send", parameters, cancellationToken);
    }
}
