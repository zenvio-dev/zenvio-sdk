package com.notifique.example;

import com.notifique.sdk.Notifique;
import com.notifique.sdk.model.*;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        String apiKey = System.getenv("NOTIFIQUE_API_KEY");
        String instanceId = System.getenv("NOTIFIQUE_INSTANCE_ID");
        String recipient = System.getenv("MY_PHONE");
        if (apiKey == null || instanceId == null || recipient == null) {
            throw new IllegalStateException("Set NOTIFIQUE_API_KEY, NOTIFIQUE_INSTANCE_ID and MY_PHONE before running this example.");
        }
        Notifique notifique = new Notifique(apiKey);

        System.out.println("--- Notifique Java SDK Example ---");

        System.out.println("\n1. Sending text...");
        WhatsAppSendEnvelope res1 = notifique.whatsapp.sendText(instanceId, recipient, "Hello from Java! ☕");
        System.out.println("Result: Success=" + res1.isSuccess() + ", MessageIDs=" + res1.getData().getMessageIds());

        System.out.println("\n2. Sending image...");
        WhatsAppSendParams imageParams = new WhatsAppSendParams();
        imageParams.setTo(List.of(recipient));
        imageParams.setType("image");
        imageParams.setPayload(new WhatsAppPayloads.MediaPayload("https://placehold.co/600x400/png", "image.png", "image/png"));
        WhatsAppSendEnvelope res2 = notifique.whatsapp.send(instanceId, imageParams);
        System.out.println("Result: Success=" + res2.isSuccess());
    }
}
