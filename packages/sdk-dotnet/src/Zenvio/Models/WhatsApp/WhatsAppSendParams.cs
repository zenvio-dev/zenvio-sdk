using System.Text.Json.Serialization;
using Zenvio.Models.Shared;

namespace Zenvio.Models.WhatsApp;

public class WhatsAppSendParams
{
    [JsonPropertyName("instance_id")]
    public string InstanceId { get; set; } = default!;

    [JsonPropertyName("to")]
    public List<string> To { get; init; } = default!;

    [JsonPropertyName("type")]
    public string Type { get; init; } = default!;

    [JsonPropertyName("payload")]
    public object Payload { get; init; } = default!;

    [JsonPropertyName("schedule")]
    public Schedule? Schedule { get; init; }

    [JsonPropertyName("options")]
    public WhatsAppSendOptions? Options { get; init; }
}
