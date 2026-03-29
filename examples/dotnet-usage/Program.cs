using Notifique;
using Notifique.Models.WhatsApp;
using Notifique.Models.Sms;
using Notifique.Models.Email;
using Notifique.Models.Messages;

var apiKey = Environment.GetEnvironmentVariable("NOTIFIQUE_API_KEY");
var instanceId = Environment.GetEnvironmentVariable("NOTIFIQUE_INSTANCE_ID");
var phoneNumber = Environment.GetEnvironmentVariable("MY_PHONE");
var email = Environment.GetEnvironmentVariable("MY_EMAIL");
if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(instanceId) || string.IsNullOrWhiteSpace(phoneNumber) || string.IsNullOrWhiteSpace(email))
{
    throw new InvalidOperationException("Set NOTIFIQUE_API_KEY, NOTIFIQUE_INSTANCE_ID, MY_PHONE and MY_EMAIL before running this example.");
}

using var client = new NotifiqueClient(apiKey);

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
catch (NotifiqueApiException ex)
{
    Console.WriteLine($"SMS Error: {ex.StatusCode} — {ex.ResponseBody}");
}

// --- WhatsApp: Send text ---
try
{
    Console.WriteLine("\n--- WhatsApp: Send Text ---");
    var textResponse = await client.WhatsApp.SendTextAsync(instanceId, phoneNumber, "Hello from .NET SDK!");
    Console.WriteLine($"Status: {textResponse.Data.Status}, IDs: {string.Join(", ", textResponse.Data.MessageIds)}");
}
catch (NotifiqueApiException ex)
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
    Console.WriteLine($"Status: {imageResponse.Data.Status}");
}
catch (NotifiqueApiException ex)
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
        FromName = "Notifique .NET SDK",
        To = new List<string> { email },
        Subject = "Hello from Notifique .NET SDK",
        Html = "<h1>Hello!</h1><p>This email was sent using the Notifique .NET SDK.</p>"
    };
    var emailResponse = await client.Email.SendAsync(emailParams);
    Console.WriteLine($"Status: {emailResponse.Data.Status}, IDs: {string.Join(", ", emailResponse.Data.EmailIds)}");
}
catch (NotifiqueApiException ex)
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
catch (NotifiqueApiException ex)
{
    Console.WriteLine($"Templates Error: {ex.StatusCode} — {ex.ResponseBody}");
}
