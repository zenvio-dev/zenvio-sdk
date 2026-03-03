using System.Text.Json.Serialization;

namespace Zenvio.Models.WhatsApp;

public record WhatsAppSendResponse(
    [property: JsonPropertyName("message_ids")] List<string> MessageIds,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("scheduled_at")] string? ScheduledAt = null
);
