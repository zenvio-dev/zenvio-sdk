package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MessagesSendResponse {
    private boolean success;
    private Data data;

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public Data getData() { return data; }
    public void setData(Data data) { this.data = data; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Data {
        private List<String> messageIds;
        private List<String> smsIds;
        private List<String> emailIds;
        private String status;
        private int count;

        @com.fasterxml.jackson.annotation.JsonProperty("message_ids")
        public List<String> getMessageIds() { return messageIds; }
        @com.fasterxml.jackson.annotation.JsonProperty("message_ids")
        public void setMessageIds(List<String> messageIds) { this.messageIds = messageIds; }

        @com.fasterxml.jackson.annotation.JsonProperty("sms_ids")
        public List<String> getSmsIds() { return smsIds; }
        @com.fasterxml.jackson.annotation.JsonProperty("sms_ids")
        public void setSmsIds(List<String> smsIds) { this.smsIds = smsIds; }

        @com.fasterxml.jackson.annotation.JsonProperty("email_ids")
        public List<String> getEmailIds() { return emailIds; }
        @com.fasterxml.jackson.annotation.JsonProperty("email_ids")
        public void setEmailIds(List<String> emailIds) { this.emailIds = emailIds; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }
    }
}
