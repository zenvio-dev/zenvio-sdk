package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WhatsAppSendResponse {
    private List<String> messageIds;
    private String status;
    private String scheduledAt;

    @com.fasterxml.jackson.annotation.JsonProperty("message_ids")
    public List<String> getMessageIds() { return messageIds; }
    @com.fasterxml.jackson.annotation.JsonProperty("message_ids")
    public void setMessageIds(List<String> messageIds) { this.messageIds = messageIds; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @com.fasterxml.jackson.annotation.JsonProperty("scheduled_at")
    public String getScheduledAt() { return scheduledAt; }
    @com.fasterxml.jackson.annotation.JsonProperty("scheduled_at")
    public void setScheduledAt(String scheduledAt) { this.scheduledAt = scheduledAt; }
}
