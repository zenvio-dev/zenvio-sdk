using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Notifique;

/// <summary>
/// Main client for the Notifique API. Create once and reuse as a singleton.
/// Implements <see cref="IDisposable"/>: call <c>Dispose()</c> when the client is no longer needed
/// (or use a <c>using</c> statement) to release the underlying <see cref="HttpClient"/>.
/// </summary>
public class NotifiqueClient : IDisposable
{
    protected const string DefaultBaseUrl = "https://api.notifique.dev/v1";
    private const string UserAgent = "Notifique-DotNet-SDK/0.1.0";

    protected readonly HttpClient _httpClient;
    private readonly bool _ownsHttpClient;
    protected readonly string _baseUrl;
    protected readonly string _apiKey;

    protected static readonly JsonSerializerOptions JsonOptions = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        PropertyNameCaseInsensitive = true
    };

    public WhatsAppApi WhatsApp { get; }
    public SmsApi Sms { get; }
    public EmailApi Email { get; }
    public MessagesApi Messages { get; }
    public EmailDomainsApi EmailDomains { get; }
    public PushApi Push { get; }

    public NotifiqueClient(string apiKey) : this(apiKey, DefaultBaseUrl)
    {
    }

    public NotifiqueClient(string apiKey, string baseUrl) : this(apiKey, baseUrl, null)
    {
    }

    public NotifiqueClient(string apiKey, string baseUrl, HttpClient? httpClient)
    {
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new ArgumentException("apiKey must be a non-empty string.", nameof(apiKey));
        if (!Uri.TryCreate(baseUrl ?? DefaultBaseUrl, UriKind.Absolute, out var parsedBaseUrl) || parsedBaseUrl.Scheme != Uri.UriSchemeHttps)
            throw new ArgumentException("baseUrl must be an absolute HTTPS URL.", nameof(baseUrl));
        _apiKey = apiKey;
        _baseUrl = parsedBaseUrl.ToString().TrimEnd('/');

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
        EmailDomains = new EmailDomainsApi(this);
        Push = new PushApi(this);
    }

    internal static string EscapePathSegment(string value) => Uri.EscapeDataString(value);

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
            throw new NotifiqueApiException((int)response.StatusCode, responseBody);
        }

        return responseBody;
    }

    /// <summary>
    /// Releases resources used by this client.
    /// Call this method (or use a <c>using</c> statement) when the client is no longer needed.
    /// </summary>
    public void Dispose()
    {
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }

    /// <summary>
    /// Finalizer — ensures the <see cref="HttpClient"/> is released even if
    /// the consumer forgets to call <see cref="Dispose()"/>.
    /// </summary>
    ~NotifiqueClient() => Dispose(disposing: false);

    /// <param name="disposing">
    /// <c>true</c> when called from <see cref="Dispose()"/>; <c>false</c> from the finalizer.
    /// </param>
    protected virtual void Dispose(bool disposing)
    {
        if (disposing && _ownsHttpClient)
        {
            _httpClient.Dispose();
        }
    }
}
