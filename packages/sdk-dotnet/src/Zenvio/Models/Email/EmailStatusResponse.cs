using System.Text.Json.Serialization;

namespace Zenvio.Models.Email;

public record EmailStatusResponse(
    [property: JsonPropertyName("success")] bool Success,
    [property: JsonPropertyName("data")] EmailStatusData Data
);

public record EmailStatusData(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("to")] string? To,
    [property: JsonPropertyName("from")] string? From,
    [property: JsonPropertyName("fromName")] string? FromName,
    [property: JsonPropertyName("subject")] string? Subject,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("externalId")] string? ExternalId = null,
    [property: JsonPropertyName("scheduledFor")] string? ScheduledFor = null,
    [property: JsonPropertyName("sentAt")] string? SentAt = null,
    [property: JsonPropertyName("deliveredAt")] string? DeliveredAt = null,
    [property: JsonPropertyName("failedAt")] string? FailedAt = null,
    [property: JsonPropertyName("errorMessage")] string? ErrorMessage = null,
    [property: JsonPropertyName("createdAt")] string? CreatedAt = null
);
