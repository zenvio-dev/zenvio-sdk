using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Zenvio;

public sealed class ZenvioClient : IDisposable
{
    private const string DefaultBaseUrl = "https://api.zenvio.com/v1";
    private const string UserAgent = "Zenvio-DotNet-SDK/0.1.0";

    private readonly HttpClient _httpClient;
    private readonly bool _ownsHttpClient;
    private readonly string _baseUrl;
    private readonly string _apiKey;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        PropertyNameCaseInsensitive = true
    };

    public WhatsAppApi WhatsApp { get; }
    public SmsApi Sms { get; }
    public EmailApi Email { get; }
    public MessagesApi Messages { get; }

    public ZenvioClient(string apiKey) : this(apiKey, DefaultBaseUrl)
    {
    }

    public ZenvioClient(string apiKey, string baseUrl) : this(apiKey, baseUrl, null)
    {
    }

    public ZenvioClient(string apiKey, string baseUrl, HttpClient? httpClient)
    {
        _apiKey = apiKey ?? throw new ArgumentNullException(nameof(apiKey));
        _baseUrl = (baseUrl ?? DefaultBaseUrl).TrimEnd('/');

        if (httpClient is not null)
        {
            _httpClient = httpClient;
            _ownsHttpClient = false;
        }
        else
        {
            _httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(30) };
            _ownsHttpClient = true;
        }

        WhatsApp = new WhatsAppApi(this);
        Sms = new SmsApi(this);
        Email = new EmailApi(this);
        Messages = new MessagesApi(this);
    }

    internal async Task<T> RequestAsync<T>(HttpMethod method, string path, object? body = null, CancellationToken cancellationToken = default)
    {
        var responseBody = await SendAsync(method, path, body, cancellationToken).ConfigureAwait(false);
        return JsonSerializer.Deserialize<T>(responseBody, JsonOptions)
               ?? throw new InvalidOperationException("Failed to deserialize response.");
    }

    internal async Task RequestAsync(HttpMethod method, string path, object? body = null, CancellationToken cancellationToken = default)
    {
        await SendAsync(method, path, body, cancellationToken).ConfigureAwait(false);
    }

    private async Task<string> SendAsync(HttpMethod method, string path, object? body, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(method, _baseUrl + path);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        request.Headers.UserAgent.ParseAdd(UserAgent);

        if (body is not null && method != HttpMethod.Get && method != HttpMethod.Delete)
        {
            var json = JsonSerializer.Serialize(body, JsonOptions);
            request.Content = new StringContent(json, Encoding.UTF8, "application/json");
        }

        var response = await _httpClient.SendAsync(request, cancellationToken).ConfigureAwait(false);
        var responseBody = await response.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);

        if ((int)response.StatusCode >= 400)
        {
            throw new ZenvioApiException((int)response.StatusCode, responseBody);
        }

        return responseBody;
    }

    public void Dispose()
    {
        if (_ownsHttpClient)
        {
            _httpClient.Dispose();
        }
    }
}
