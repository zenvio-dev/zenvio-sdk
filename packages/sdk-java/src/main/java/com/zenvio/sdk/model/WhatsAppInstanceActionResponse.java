package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WhatsAppInstanceActionResponse {
    private boolean success;
    private Data data;
    private String message;

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public Data getData() { return data; }
    public void setData(Data data) { this.data = data; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Data {
        private String instanceId;
        private String status;

        @com.fasterxml.jackson.annotation.JsonProperty("instance_id")
        public String getInstanceId() { return instanceId; }
        @com.fasterxml.jackson.annotation.JsonProperty("instance_id")
        public void setInstanceId(String instanceId) { this.instanceId = instanceId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
