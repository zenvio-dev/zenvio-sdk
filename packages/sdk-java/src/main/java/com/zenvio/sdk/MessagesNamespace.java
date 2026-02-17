package com.zenvio.sdk;

import com.zenvio.sdk.model.MessagesSendParams;
import com.zenvio.sdk.model.MessagesSendResponse;

/**
 * POST /v1/templates/send — envio por template (whatsapp, sms, email).
 */
public class MessagesNamespace {
    private final Zenvio client;

    public MessagesNamespace(Zenvio client) {
        this.client = client;
    }

    public MessagesSendResponse send(MessagesSendParams params) {
        return client.request("POST", "/templates/send", params, MessagesSendResponse.class);
    }
}
