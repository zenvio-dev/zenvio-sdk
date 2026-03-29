namespace Notifique;

public class NotifiqueApiException : Exception
{
    public int StatusCode { get; }
    public string ResponseBody { get; }

    public NotifiqueApiException(int statusCode, string responseBody)
        : base($"Notifique API error {statusCode}")
    {
        StatusCode = statusCode;
        ResponseBody = responseBody;
    }
}
