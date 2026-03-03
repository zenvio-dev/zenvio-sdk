using System.Text.Json.Serialization;

namespace Zenvio.Models.Messages;

public record MessagesSendResponse(
    [property: JsonPropertyName("success")] bool Success,
    [property: JsonPropertyName("data")] MessagesSendData Data
);

public record MessagesSendData(
    [property: JsonPropertyName("message_ids")] List<string>? MessageIds,
    [property: JsonPropertyName("sms_ids")] List<string>? SmsIds,
    [property: JsonPropertyName("email_ids")] List<string>? EmailIds,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("count")] int? Count
);
