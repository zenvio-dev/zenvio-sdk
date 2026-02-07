package main.java.com.zenvio.example;

import com.zenvio.sdk.Zenvio;
import com.zenvio.sdk.model.Payloads;
import com.zenvio.sdk.model.SendParams;
import com.zenvio.sdk.model.SendResponse;

import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        // 1. Initialize the client
        Zenvio zenvio = new Zenvio("your_api_key_here");

        String phoneId = "your_phone_id_here";
        String recipient = "5511999999999";

        System.out.println("--- Starting Zenvio Java SDK Example ---");

        // 2. Simple text message
        System.out.println("\n1. Sending simplified text...");
        SendResponse res1 = zenvio.whatsapp.sendText(phoneId, recipient, "Hello from Java! ☕");
        System.out.println("Result: Success=" + res1.isSuccess());
        if (res1.getError() != null)
            System.out.println("Error: " + res1.getError());

        // 3. Full parameters example (Template)
        System.out.println("\n2. Sending template message...");
        SendParams params = new SendParams();
        params.setTo(Arrays.asList(recipient));
        params.setType("template");

        Payloads.Template template = new Payloads.Template("welcome_template", "en_US");
        template.setVariables(Arrays.asList("Java Developer"));
        params.setPayload(template);

        SendResponse res2 = zenvio.whatsapp.send(phoneId, params);
        System.out.println("Result: Success=" + res2.isSuccess());

        // 4. Image example
        System.out.println("\n3. Sending image...");
        SendParams imageParams = new SendParams();
        imageParams.setTo(Arrays.asList(recipient));
        imageParams.setType("image");
        imageParams.setPayload(new Payloads.Media("https://placehold.co/600x400/png"));

        SendResponse res3 = zenvio.whatsapp.send(phoneId, imageParams);
        System.out.println("Result: Success=" + res3.isSuccess());
    }
}
