using System.Text.Json.Serialization;

namespace Zenvio.Models.Shared;

public class Schedule
{
    [JsonPropertyName("sendAt")]
    public string SendAt { get; set; } = default!;
}
