using System.Text.Json.Serialization;

namespace Zenvio.Models.WhatsApp;

public record WhatsAppMessageActionResponse(
    [property: JsonPropertyName("success")] bool Success,
    [property: JsonPropertyName("message_ids")] List<string>? MessageIds,
    [property: JsonPropertyName("status")] string Status
);
