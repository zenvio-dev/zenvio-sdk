using System.Text.Json.Serialization;

namespace Zenvio.Models.Email;

public record EmailSendResponse(
    [property: JsonPropertyName("success")] bool Success,
    [property: JsonPropertyName("data")] EmailSendData Data
);

public record EmailSendData(
    [property: JsonPropertyName("email_ids")] List<string> EmailIds,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("count")] int? Count,
    [property: JsonPropertyName("scheduled_at")] string? ScheduledAt = null
);
