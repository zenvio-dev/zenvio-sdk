# Zenvio .NET SDK

Official Zenvio SDK for .NET — WhatsApp, SMS, Email, and Template messaging.

## Requirements

- .NET 8.0 or later
- Zero external dependencies (uses only `System.Text.Json`)

## Installation

### NuGet Package Manager
```
Install-Package Zenvio
```

### .NET CLI
```bash
dotnet add package Zenvio
```

### PackageReference
```xml
<PackageReference Include="Zenvio" Version="0.1.0" />
```

## Quick Start

```csharp
using Zenvio;

var client = new ZenvioClient("your-api-key");

// Send a WhatsApp text message
var response = await client.WhatsApp.SendTextAsync("instance-id", "5511999999999", "Hello from .NET!");

Console.WriteLine($"Status: {response.Status}");
Console.WriteLine($"Message IDs: {string.Join(", ", response.MessageIds)}");
```

## WhatsApp

### Send Text Message

```csharp
// Single recipient
var response = await client.WhatsApp.SendTextAsync("instance-id", "5511999999999", "Hello!");

// Multiple recipients
var response = await client.WhatsApp.SendTextAsync("instance-id",
    new List<string> { "5511111111111", "5522222222222" }, "Hello everyone!");
```

### Send Media Message

```csharp
using Zenvio.Models.WhatsApp;

var parameters = new WhatsAppSendParams
{
    To = new List<string> { "5511999999999" },
    Type = "image",
    Payload = new MediaPayload(
        MediaUrl: "https://example.com/image.png",
        FileName: "image.png",
        Mimetype: "image/png"
    )
};

var response = await client.WhatsApp.SendAsync("instance-id", parameters);
```

### Send Location

```csharp
var parameters = new WhatsAppSendParams
{
    To = new List<string> { "5511999999999" },
    Type = "location",
    Payload = new LocationPayload(
        Latitude: -23.5505,
        Longitude: -46.6333,
        Name: "Sao Paulo",
        Address: "Sao Paulo, Brazil"
    )
};

var response = await client.WhatsApp.SendAsync("instance-id", parameters);
```

### Send Contact

```csharp
var parameters = new WhatsAppSendParams
{
    To = new List<string> { "5511999999999" },
    Type = "contact",
    Payload = new ContactPayload(new ContactInfo(
        FullName: "John Doe",
        PhoneNumber: "+55 11 99999-9999"
    ))
};

var response = await client.WhatsApp.SendAsync("instance-id", parameters);
```

### Message Operations

```csharp
// Get message status
var status = await client.WhatsApp.GetMessageAsync("message-id");

// Edit a message
var edited = await client.WhatsApp.EditMessageAsync("message-id", "Updated text");

// Cancel a scheduled message
var cancelled = await client.WhatsApp.CancelMessageAsync("message-id");

// Delete a message
var deleted = await client.WhatsApp.DeleteMessageAsync("message-id");
```

### Instance Management

```csharp
// List all instances
var instances = await client.WhatsApp.ListInstancesAsync();

// List with pagination
var filtered = await client.WhatsApp.ListInstancesAsync(new Dictionary<string, string>
{
    { "page", "1" },
    { "limit", "10" }
});

// Get a specific instance
var instance = await client.WhatsApp.GetInstanceAsync("instance-id");

// Create a new instance
var created = await client.WhatsApp.CreateInstanceAsync("My Instance");

// Disconnect an instance
var disconnected = await client.WhatsApp.DisconnectInstanceAsync("instance-id");

// Delete an instance
var deleted = await client.WhatsApp.DeleteInstanceAsync("instance-id");
```

## SMS

### Send SMS

```csharp
using Zenvio.Models.Sms;

var parameters = new SmsSendParams
{
    To = new List<string> { "5511999999999" },
    Message = "Hello via SMS!"
};

var response = await client.Sms.SendAsync(parameters);
```

### Get SMS Status

```csharp
var status = await client.Sms.GetAsync("sms-id");
Console.WriteLine($"Status: {status.Data.Status}");
```

### Cancel SMS

```csharp
var cancelled = await client.Sms.CancelAsync("sms-id");
```

## Email

### Send Email

```csharp
using Zenvio.Models.Email;

var parameters = new EmailSendParams
{
    From = "noreply@yourdomain.com",
    FromName = "Your App",
    To = new List<string> { "user@example.com" },
    Subject = "Welcome!",
    Html = "<h1>Hello!</h1><p>Welcome to our platform.</p>"
};

var response = await client.Email.SendAsync(parameters);
```

### Get Email Status

```csharp
var status = await client.Email.GetAsync("email-id");
```

### Cancel Email

```csharp
var cancelled = await client.Email.CancelAsync("email-id");
```

## Messages (Templates)

### Send Template Message

```csharp
using Zenvio.Models.Messages;

var parameters = new MessagesSendParams
{
    To = new List<string> { "5511999999999" },
    Template = "welcome-template",
    Variables = new Dictionary<string, object> { { "name", "User" } },
    Channels = new List<string> { "whatsapp", "sms" },
    InstanceId = "instance-id"
};

var response = await client.Messages.SendAsync(parameters);
```

## Scheduling

All send operations support scheduling via the `Schedule` property:

```csharp
using Zenvio.Models.Shared;

var parameters = new SmsSendParams
{
    To = new List<string> { "5511999999999" },
    Message = "Scheduled message",
    Schedule = new Schedule { SendAt = "2025-12-31T23:59:00Z" }
};
```

## Error Handling

All API errors throw a `ZenvioApiException` with the HTTP status code and response body:

```csharp
try
{
    await client.WhatsApp.SendTextAsync("instance-id", "5511999999999", "Hello");
}
catch (ZenvioApiException ex)
{
    Console.WriteLine($"Status: {ex.StatusCode}");
    Console.WriteLine($"Body: {ex.ResponseBody}");
}
```

## Configuration

### Custom Base URL

```csharp
var client = new ZenvioClient("your-api-key", "https://custom-api.example.com/v1");
```

### Dependency Injection (IHttpClientFactory)

```csharp
// In your DI setup
services.AddHttpClient("Zenvio");

// In your service
var httpClient = httpClientFactory.CreateClient("Zenvio");
var client = new ZenvioClient("your-api-key", "https://api.zenvio.com/v1", httpClient);
```

### CancellationToken Support

All async methods accept an optional `CancellationToken`:

```csharp
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
var response = await client.WhatsApp.SendTextAsync("instance-id", "5511999999999", "Hello", cts.Token);
```

## License

MIT
