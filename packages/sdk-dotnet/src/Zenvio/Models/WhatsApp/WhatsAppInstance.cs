using System.Text.Json.Serialization;

namespace Zenvio.Models.WhatsApp;

public record WhatsAppInstance(
    [property: JsonPropertyName("id")] string Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("phoneNumber")] string? PhoneNumber,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("createdAt")] string? CreatedAt,
    [property: JsonPropertyName("updatedAt")] string? UpdatedAt = null
);
