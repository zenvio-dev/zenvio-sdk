using System.Text.Json.Serialization;

namespace Zenvio.Models.Messages;

public class MessagesSendParams
{
    [JsonPropertyName("to")]
    public List<string> To { get; init; } = default!;

    [JsonPropertyName("template")]
    public string Template { get; init; } = default!;

    [JsonPropertyName("variables")]
    public Dictionary<string, object>? Variables { get; init; }

    [JsonPropertyName("channels")]
    public List<string> Channels { get; init; } = default!;

    [JsonPropertyName("instance_id")]
    public string? InstanceId { get; set; }

    [JsonPropertyName("from")]
    public string? From { get; init; }

    [JsonPropertyName("fromName")]
    public string? FromName { get; init; }
}
