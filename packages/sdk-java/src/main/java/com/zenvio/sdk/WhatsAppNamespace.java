package com.zenvio.sdk;

import com.zenvio.sdk.model.Payloads;
import com.zenvio.sdk.model.SendParams;
import com.zenvio.sdk.model.SendResponse;

import java.util.Collections;
import java.util.List;

public class WhatsAppNamespace {
    private final Zenvio client;

    public WhatsAppNamespace(Zenvio client) {
        this.client = client;
    }

    /**
     * Sends a WhatsApp message
     * 
     * @param phoneId The ID of the phone instance to send from
     * @param params  Message parameters
     * @return SendResponse
     */
    public SendResponse send(String phoneId, SendParams params) {
        String path = "/whatsapp/" + phoneId + "/messages";
        return client.request("POST", path, params);
    }

    /**
     * Shortcut to send a simple WhatsApp text message
     * 
     * @param phoneId The ID of the phone instance
     * @param to      Recipient phone number
     * @param text    The text message content
     * @return SendResponse
     */
    public SendResponse sendText(String phoneId, String to, String text) {
        return sendText(phoneId, Collections.singletonList(to), text);
    }

    /**
     * Shortcut to send a simple WhatsApp text message to multiple recipients
     * 
     * @param phoneId The ID of the phone instance
     * @param to      List of recipient phone numbers
     * @param text    The text message content
     * @return SendResponse
     */
    public SendResponse sendText(String phoneId, List<String> to, String text) {
        SendParams params = new SendParams(to, "text", new Payloads.Text(text));
        return send(phoneId, params);
    }
}
