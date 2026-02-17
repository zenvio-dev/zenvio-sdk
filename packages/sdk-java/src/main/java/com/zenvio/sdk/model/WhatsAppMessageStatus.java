package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WhatsAppMessageStatus {
    private String messageId;
    private String to;
    private String type;
    private String status;
    private String scheduledAt;
    private String sentAt;
    private String deliveredAt;
    private String readAt;
    private String failedAt;
    private String errorMessage;
    private String externalId;
    private String createdAt;

    @com.fasterxml.jackson.annotation.JsonProperty("message_id")
    public String getMessageId() { return messageId; }
    @com.fasterxml.jackson.annotation.JsonProperty("message_id")
    public void setMessageId(String messageId) { this.messageId = messageId; }

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @com.fasterxml.jackson.annotation.JsonProperty("scheduled_at")
    public String getScheduledAt() { return scheduledAt; }
    @com.fasterxml.jackson.annotation.JsonProperty("scheduled_at")
    public void setScheduledAt(String scheduledAt) { this.scheduledAt = scheduledAt; }

    @com.fasterxml.jackson.annotation.JsonProperty("sent_at")
    public String getSentAt() { return sentAt; }
    @com.fasterxml.jackson.annotation.JsonProperty("sent_at")
    public void setSentAt(String sentAt) { this.sentAt = sentAt; }

    @com.fasterxml.jackson.annotation.JsonProperty("delivered_at")
    public String getDeliveredAt() { return deliveredAt; }
    @com.fasterxml.jackson.annotation.JsonProperty("delivered_at")
    public void setDeliveredAt(String deliveredAt) { this.deliveredAt = deliveredAt; }

    @com.fasterxml.jackson.annotation.JsonProperty("read_at")
    public String getReadAt() { return readAt; }
    @com.fasterxml.jackson.annotation.JsonProperty("read_at")
    public void setReadAt(String readAt) { this.readAt = readAt; }

    @com.fasterxml.jackson.annotation.JsonProperty("failed_at")
    public String getFailedAt() { return failedAt; }
    @com.fasterxml.jackson.annotation.JsonProperty("failed_at")
    public void setFailedAt(String failedAt) { this.failedAt = failedAt; }

    @com.fasterxml.jackson.annotation.JsonProperty("error_message")
    public String getErrorMessage() { return errorMessage; }
    @com.fasterxml.jackson.annotation.JsonProperty("error_message")
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    @com.fasterxml.jackson.annotation.JsonProperty("external_id")
    public String getExternalId() { return externalId; }
    @com.fasterxml.jackson.annotation.JsonProperty("external_id")
    public void setExternalId(String externalId) { this.externalId = externalId; }

    @com.fasterxml.jackson.annotation.JsonProperty("created_at")
    public String getCreatedAt() { return createdAt; }
    @com.fasterxml.jackson.annotation.JsonProperty("created_at")
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
