using Zenvio;
using Zenvio.Models.WhatsApp;
using Zenvio.Models.Sms;
using Zenvio.Models.Email;
using Zenvio.Models.Messages;

var apiKey = Environment.GetEnvironmentVariable("ZENVIO_API_KEY") ?? "your-api-key";
var instanceId = Environment.GetEnvironmentVariable("ZENVIO_INSTANCE_ID") ?? "your-instance-id";
var phoneNumber = "5511967741929";
var email = "user@example.com";

using var client = new ZenvioClient(apiKey, "https://api.zenvio.dev");

// --- SMS ---
try
{
    Console.WriteLine("--- SMS ---");
    var smsParams = new SmsSendParams
    {
        To = new List<string> { phoneNumber },
        Message = "Hello via SMS from .NET!"
    };
    var smsResponse = await client.Sms.SendAsync(smsParams);
    Console.WriteLine($"Status: {smsResponse.Data.Status}, IDs: {string.Join(", ", smsResponse.Data.SmsIds)}");
}
catch (ZenvioApiException ex)
{
    Console.WriteLine($"SMS Error: {ex.StatusCode} — {ex.ResponseBody}");
}

// --- WhatsApp: Send text ---
try
{
    Console.WriteLine("\n--- WhatsApp: Send Text ---");
    var textResponse = await client.WhatsApp.SendTextAsync(instanceId, phoneNumber, "Hello from .NET SDK!");
    Console.WriteLine($"Status: {textResponse.Status}, IDs: {string.Join(", ", textResponse.MessageIds)}");
}
catch (ZenvioApiException ex)
{
    Console.WriteLine($"WhatsApp Text Error: {ex.StatusCode} — {ex.ResponseBody}");
}

// --- WhatsApp: Send image ---
try
{
    Console.WriteLine("\n--- WhatsApp: Send Image ---");
    var imageParams = new WhatsAppSendParams
    {
        To = new List<string> { phoneNumber },
        Type = "image",
        Payload = new MediaPayload(
            MediaUrl: "https://example.com/photo.jpg",
            FileName: "photo.jpg",
            Mimetype: "image/jpeg"
        )
    };
    var imageResponse = await client.WhatsApp.SendAsync(instanceId, imageParams);
    Console.WriteLine($"Status: {imageResponse.Status}");
}
catch (ZenvioApiException ex)
{
    Console.WriteLine($"WhatsApp Image Error: {ex.StatusCode} — {ex.ResponseBody}");
}

// --- Email ---
try
{
    Console.WriteLine("\n--- Email ---");
    var emailParams = new EmailSendParams
    {
        From = "noreply@yourdomain.com",
        FromName = "Zenvio .NET SDK",
        To = new List<string> { email },
        Subject = "Hello from Zenvio .NET SDK",
        Html = "<h1>Hello!</h1><p>This email was sent using the Zenvio .NET SDK.</p>"
    };
    var emailResponse = await client.Email.SendAsync(emailParams);
    Console.WriteLine($"Status: {emailResponse.Data.Status}, IDs: {string.Join(", ", emailResponse.Data.EmailIds)}");
}
catch (ZenvioApiException ex)
{
    Console.WriteLine($"Email Error: {ex.StatusCode} — {ex.ResponseBody}");
}

// --- Messages (Templates) ---
try
{
    Console.WriteLine("\n--- Messages (Templates) ---");
    var templateParams = new MessagesSendParams
    {
        To = new List<string> { phoneNumber },
        Template = "welcome",
        Variables = new Dictionary<string, object> { { "name", "User" } },
        Channels = new List<string> { "whatsapp" },
        InstanceId = instanceId
    };
    var templateResponse = await client.Messages.SendAsync(templateParams);
    Console.WriteLine($"Status: {templateResponse.Data.Status}");
}
catch (ZenvioApiException ex)
{
    Console.WriteLine($"Templates Error: {ex.StatusCode} — {ex.ResponseBody}");
}
