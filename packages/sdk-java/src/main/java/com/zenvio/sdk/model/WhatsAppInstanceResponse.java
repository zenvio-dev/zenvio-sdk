package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WhatsAppInstanceResponse {
    private boolean success;
    private WhatsAppInstance data;

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public WhatsAppInstance getData() { return data; }
    public void setData(WhatsAppInstance data) { this.data = data; }
}
