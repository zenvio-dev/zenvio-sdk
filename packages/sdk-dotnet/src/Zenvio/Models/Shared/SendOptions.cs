using System.Text.Json.Serialization;

namespace Zenvio.Models.Shared;

public class SendOptions
{
    [JsonPropertyName("priority")]
    public string? Priority { get; set; }
}

public class WhatsAppSendOptions : SendOptions
{
    [JsonPropertyName("maxRetries")]
    public int? MaxRetries { get; set; }
}
