using System.Text.Json.Serialization;
using Zenvio.Models.Shared;

namespace Zenvio.Models.Email;

public class EmailSendParams
{
    [JsonPropertyName("from")]
    public string From { get; init; } = default!;

    [JsonPropertyName("fromName")]
    public string? FromName { get; init; }

    [JsonPropertyName("to")]
    public List<string> To { get; init; } = default!;

    [JsonPropertyName("subject")]
    public string Subject { get; init; } = default!;

    [JsonPropertyName("text")]
    public string? Text { get; init; }

    [JsonPropertyName("html")]
    public string? Html { get; init; }

    [JsonPropertyName("schedule")]
    public Schedule? Schedule { get; init; }

    [JsonPropertyName("options")]
    public SendOptions? Options { get; init; }
}
