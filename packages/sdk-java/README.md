# Zenvio Java SDK

Official Zenvio SDK for Java.

## Installation

### Maven
Add this dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>com.zenvio</groupId>
    <artifactId>zenvio-sdk</artifactId>
    <version>0.1.0</version>
</dependency>
```

### Gradle
Add this to your `build.gradle`:

```gradle
implementation 'com.zenvio:zenvio-sdk:0.1.0'
```

## Quick Start

```java
import com.zenvio.sdk.Zenvio;
import com.zenvio.sdk.model.SendResponse;

public class Main {
    public static void main(String[] args) {
        // Initialize the client
        Zenvio zenvio = new Zenvio("your-api-key");

        String phoneId = "your-phone-id";

        // 1. Simple text message
        SendResponse response = zenvio.whatsapp.sendText(phoneId, "5511999999999", "Hello from Java!");
        System.out.println("Success: " + response.isSuccess());
    }
}
```

## Advanced Usage

```java
import com.zenvio.sdk.model.Payloads;
import com.zenvio.sdk.model.SendParams;

// Sending a Template
SendParams params = new SendParams();
params.setTo(List.of("5511999999999"));
params.setType("template");

Payloads.Template payload = new Payloads.Template("order_update", "en_US");
payload.setVariables(List.of("John", "Shipped"));
params.setPayload(payload);

SendResponse res = zenvio.whatsapp.send(phoneId, params);
```

## Requirements
- Java 11 or higher.
- Jackson Databind.
