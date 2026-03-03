namespace Zenvio;

public class ZenvioApiException : Exception
{
    public int StatusCode { get; }
    public string ResponseBody { get; }

    public ZenvioApiException(int statusCode, string responseBody)
        : base($"Zenvio API error {statusCode}: {responseBody}")
    {
        StatusCode = statusCode;
        ResponseBody = responseBody;
    }
}
