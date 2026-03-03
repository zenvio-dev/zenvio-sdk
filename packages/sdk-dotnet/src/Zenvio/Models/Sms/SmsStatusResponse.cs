using System.Text.Json.Serialization;

namespace Zenvio.Models.Sms;

public record SmsStatusResponse(
    [property: JsonPropertyName("success")] bool Success,
    [property: JsonPropertyName("data")] SmsStatusData Data
);

public record SmsStatusData(
    [property: JsonPropertyName("sms_id")] string SmsId,
    [property: JsonPropertyName("to")] string? To,
    [property: JsonPropertyName("message")] string? Message,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("provider")] string? Provider = null,
    [property: JsonPropertyName("external_id")] string? ExternalId = null,
    [property: JsonPropertyName("sent_at")] string? SentAt = null,
    [property: JsonPropertyName("delivered_at")] string? DeliveredAt = null,
    [property: JsonPropertyName("failed_at")] string? FailedAt = null,
    [property: JsonPropertyName("scheduled_for")] string? ScheduledFor = null,
    [property: JsonPropertyName("error_message")] string? ErrorMessage = null,
    [property: JsonPropertyName("created_at")] string? CreatedAt = null
);
