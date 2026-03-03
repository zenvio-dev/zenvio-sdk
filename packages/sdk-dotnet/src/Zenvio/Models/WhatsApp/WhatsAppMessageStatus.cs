using System.Text.Json.Serialization;

namespace Zenvio.Models.WhatsApp;

public record WhatsAppMessageStatus(
    [property: JsonPropertyName("message_id")] string MessageId,
    [property: JsonPropertyName("to")] string? To,
    [property: JsonPropertyName("type")] string? Type,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("scheduled_at")] string? ScheduledAt = null,
    [property: JsonPropertyName("sent_at")] string? SentAt = null,
    [property: JsonPropertyName("delivered_at")] string? DeliveredAt = null,
    [property: JsonPropertyName("read_at")] string? ReadAt = null,
    [property: JsonPropertyName("failed_at")] string? FailedAt = null,
    [property: JsonPropertyName("error_message")] string? ErrorMessage = null,
    [property: JsonPropertyName("external_id")] string? ExternalId = null,
    [property: JsonPropertyName("created_at")] string? CreatedAt = null
);
