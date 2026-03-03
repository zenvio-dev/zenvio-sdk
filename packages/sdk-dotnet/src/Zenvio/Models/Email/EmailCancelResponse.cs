using System.Text.Json.Serialization;

namespace Zenvio.Models.Email;

public record EmailCancelResponse(
    [property: JsonPropertyName("success")] bool Success,
    [property: JsonPropertyName("data")] EmailCancelData Data
);

public record EmailCancelData(
    [property: JsonPropertyName("email_id")] string EmailId,
    [property: JsonPropertyName("status")] string Status
);
