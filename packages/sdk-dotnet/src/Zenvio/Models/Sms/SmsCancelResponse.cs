using System.Text.Json.Serialization;

namespace Zenvio.Models.Sms;

public record SmsCancelResponse(
    [property: JsonPropertyName("success")] bool Success,
    [property: JsonPropertyName("data")] SmsCancelData Data
);

public record SmsCancelData(
    [property: JsonPropertyName("sms_id")] string SmsId,
    [property: JsonPropertyName("status")] string Status
);
