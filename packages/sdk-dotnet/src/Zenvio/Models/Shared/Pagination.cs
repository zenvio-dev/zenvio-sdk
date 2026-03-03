using System.Text.Json.Serialization;

namespace Zenvio.Models.Shared;

public record Pagination(
    [property: JsonPropertyName("total")] int Total,
    [property: JsonPropertyName("page")] int Page,
    [property: JsonPropertyName("limit")] int Limit,
    [property: JsonPropertyName("totalPages")] int TotalPages
);
