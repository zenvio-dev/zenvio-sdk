package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WhatsAppMessageActionResponse {
    private boolean success;
    private List<String> messageIds;
    private String status;

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    @com.fasterxml.jackson.annotation.JsonProperty("message_ids")
    public List<String> getMessageIds() { return messageIds; }
    @com.fasterxml.jackson.annotation.JsonProperty("message_ids")
    public void setMessageIds(List<String> messageIds) { this.messageIds = messageIds; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
