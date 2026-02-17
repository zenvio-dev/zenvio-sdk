package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class EmailCancelResponse {
    private boolean success;
    private Data data;

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public Data getData() { return data; }
    public void setData(Data data) { this.data = data; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Data {
        private String emailId;
        private String status;

        @com.fasterxml.jackson.annotation.JsonProperty("email_id")
        public String getEmailId() { return emailId; }
        @com.fasterxml.jackson.annotation.JsonProperty("email_id")
        public void setEmailId(String emailId) { this.emailId = emailId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
