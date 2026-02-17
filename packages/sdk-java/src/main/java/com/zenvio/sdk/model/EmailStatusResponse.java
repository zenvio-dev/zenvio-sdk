package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class EmailStatusResponse {
    private boolean success;
    private EmailStatus data;

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public EmailStatus getData() { return data; }
    public void setData(EmailStatus data) { this.data = data; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EmailStatus {
        private String id;
        private String to;
        private String from;
        private String fromName;
        private String subject;
        private String status;
        private String externalId;
        private String scheduledFor;
        private String sentAt;
        private String deliveredAt;
        private String failedAt;
        private String errorMessage;
        private String createdAt;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTo() { return to; }
        public void setTo(String to) { this.to = to; }
        public String getFrom() { return from; }
        public void setFrom(String from) { this.from = from; }
        public String getFromName() { return fromName; }
        public void setFromName(String fromName) { this.fromName = fromName; }
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        @com.fasterxml.jackson.annotation.JsonProperty("externalId")
        public String getExternalId() { return externalId; }
        @com.fasterxml.jackson.annotation.JsonProperty("externalId")
        public void setExternalId(String externalId) { this.externalId = externalId; }

        @com.fasterxml.jackson.annotation.JsonProperty("scheduledFor")
        public String getScheduledFor() { return scheduledFor; }
        @com.fasterxml.jackson.annotation.JsonProperty("scheduledFor")
        public void setScheduledFor(String scheduledFor) { this.scheduledFor = scheduledFor; }

        @com.fasterxml.jackson.annotation.JsonProperty("sentAt")
        public String getSentAt() { return sentAt; }
        @com.fasterxml.jackson.annotation.JsonProperty("sentAt")
        public void setSentAt(String sentAt) { this.sentAt = sentAt; }

        @com.fasterxml.jackson.annotation.JsonProperty("deliveredAt")
        public String getDeliveredAt() { return deliveredAt; }
        @com.fasterxml.jackson.annotation.JsonProperty("deliveredAt")
        public void setDeliveredAt(String deliveredAt) { this.deliveredAt = deliveredAt; }

        @com.fasterxml.jackson.annotation.JsonProperty("failedAt")
        public String getFailedAt() { return failedAt; }
        @com.fasterxml.jackson.annotation.JsonProperty("failedAt")
        public void setFailedAt(String failedAt) { this.failedAt = failedAt; }

        @com.fasterxml.jackson.annotation.JsonProperty("errorMessage")
        public String getErrorMessage() { return errorMessage; }
        @com.fasterxml.jackson.annotation.JsonProperty("errorMessage")
        public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

        @com.fasterxml.jackson.annotation.JsonProperty("createdAt")
        public String getCreatedAt() { return createdAt; }
        @com.fasterxml.jackson.annotation.JsonProperty("createdAt")
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }
}
