package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SmsStatusResponse {
    private boolean success;
    private SmsStatus data;

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public SmsStatus getData() { return data; }
    public void setData(SmsStatus data) { this.data = data; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SmsStatus {
        private String smsId;
        private String to;
        private String message;
        private String status;
        private String provider;
        private String externalId;
        private String sentAt;
        private String deliveredAt;
        private String failedAt;
        private String scheduledFor;
        private String errorMessage;
        private String createdAt;

        @com.fasterxml.jackson.annotation.JsonProperty("sms_id")
        public String getSmsId() { return smsId; }
        @com.fasterxml.jackson.annotation.JsonProperty("sms_id")
        public void setSmsId(String smsId) { this.smsId = smsId; }
        public String getTo() { return to; }
        public void setTo(String to) { this.to = to; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }

        @com.fasterxml.jackson.annotation.JsonProperty("external_id")
        public String getExternalId() { return externalId; }
        @com.fasterxml.jackson.annotation.JsonProperty("external_id")
        public void setExternalId(String externalId) { this.externalId = externalId; }

        @com.fasterxml.jackson.annotation.JsonProperty("sent_at")
        public String getSentAt() { return sentAt; }
        @com.fasterxml.jackson.annotation.JsonProperty("sent_at")
        public void setSentAt(String sentAt) { this.sentAt = sentAt; }

        @com.fasterxml.jackson.annotation.JsonProperty("delivered_at")
        public String getDeliveredAt() { return deliveredAt; }
        @com.fasterxml.jackson.annotation.JsonProperty("delivered_at")
        public void setDeliveredAt(String deliveredAt) { this.deliveredAt = deliveredAt; }

        @com.fasterxml.jackson.annotation.JsonProperty("failed_at")
        public String getFailedAt() { return failedAt; }
        @com.fasterxml.jackson.annotation.JsonProperty("failed_at")
        public void setFailedAt(String failedAt) { this.failedAt = failedAt; }

        @com.fasterxml.jackson.annotation.JsonProperty("scheduled_for")
        public String getScheduledFor() { return scheduledFor; }
        @com.fasterxml.jackson.annotation.JsonProperty("scheduled_for")
        public void setScheduledFor(String scheduledFor) { this.scheduledFor = scheduledFor; }

        @com.fasterxml.jackson.annotation.JsonProperty("error_message")
        public String getErrorMessage() { return errorMessage; }
        @com.fasterxml.jackson.annotation.JsonProperty("error_message")
        public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

        @com.fasterxml.jackson.annotation.JsonProperty("created_at")
        public String getCreatedAt() { return createdAt; }
        @com.fasterxml.jackson.annotation.JsonProperty("created_at")
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }
}
