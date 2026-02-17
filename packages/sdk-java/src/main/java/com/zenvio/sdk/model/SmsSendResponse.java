package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SmsSendResponse {
    private boolean success;
    private Data data;

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public Data getData() { return data; }
    public void setData(Data data) { this.data = data; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Data {
        private String status;
        private int count;
        private java.util.List<String> smsIds;
        private String scheduledAt;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }

        @com.fasterxml.jackson.annotation.JsonProperty("sms_ids")
        public java.util.List<String> getSmsIds() { return smsIds; }
        @com.fasterxml.jackson.annotation.JsonProperty("sms_ids")
        public void setSmsIds(java.util.List<String> smsIds) { this.smsIds = smsIds; }

        @com.fasterxml.jackson.annotation.JsonProperty("scheduled_at")
        public String getScheduledAt() { return scheduledAt; }
        @com.fasterxml.jackson.annotation.JsonProperty("scheduled_at")
        public void setScheduledAt(String scheduledAt) { this.scheduledAt = scheduledAt; }
    }
}
