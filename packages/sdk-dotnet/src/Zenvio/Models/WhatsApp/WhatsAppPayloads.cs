using System.Text.Json.Serialization;

namespace Zenvio.Models.WhatsApp;

public record TextPayload(
    [property: JsonPropertyName("message")] string Message
);

public record MediaPayload(
    [property: JsonPropertyName("media_url")] string MediaUrl,
    [property: JsonPropertyName("file_name")] string FileName,
    [property: JsonPropertyName("mimetype")] string Mimetype
);

public record LocationPayload(
    [property: JsonPropertyName("latitude")] double Latitude,
    [property: JsonPropertyName("longitude")] double Longitude,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("address")] string Address
);

public record ContactInfo(
    [property: JsonPropertyName("fullName")] string FullName,
    [property: JsonPropertyName("wuid")] string? Wuid = null,
    [property: JsonPropertyName("phoneNumber")] string? PhoneNumber = null,
    [property: JsonPropertyName("organization")] string? Organization = null,
    [property: JsonPropertyName("email")] string? Email = null,
    [property: JsonPropertyName("url")] string? Url = null
);

public record ContactPayload(
    [property: JsonPropertyName("contact")] ContactInfo Contact
);

public record ContactIdPayload(
    [property: JsonPropertyName("contact_id")] string ContactId
);
