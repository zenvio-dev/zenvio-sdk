using System.Text.Json.Serialization;

namespace Zenvio.Models.Sms;

public record SmsSendResponse(
    [property: JsonPropertyName("success")] bool Success,
    [property: JsonPropertyName("data")] SmsSendData Data
);

public record SmsSendData(
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("count")] int? Count,
    [property: JsonPropertyName("sms_ids")] List<string> SmsIds,
    [property: JsonPropertyName("scheduled_at")] string? ScheduledAt = null
);
