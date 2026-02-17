package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

/** Body para POST /v1/whatsapp/send */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WhatsAppSendParams {
    private String instanceId;
    private List<String> to;
    private String type;
    private Object payload;
    private Schedule schedule;
    private Options options;

    public WhatsAppSendParams() {}

    public WhatsAppSendParams(String instanceId, List<String> to, String type, Object payload) {
        this.instanceId = instanceId;
        this.to = to;
        this.type = type;
        this.payload = payload;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("instance_id")
    public String getInstanceId() { return instanceId; }
    @com.fasterxml.jackson.annotation.JsonProperty("instance_id")
    public void setInstanceId(String instanceId) { this.instanceId = instanceId; }

    public List<String> getTo() { return to; }
    public void setTo(List<String> to) { this.to = to; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Object getPayload() { return payload; }
    public void setPayload(Object payload) { this.payload = payload; }

    public Schedule getSchedule() { return schedule; }
    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public Options getOptions() { return options; }
    public void setOptions(Options options) { this.options = options; }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Schedule {
        private String sendAt;
        public String getSendAt() { return sendAt; }
        public void setSendAt(String sendAt) { this.sendAt = sendAt; }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Options {
        private String priority;
        private Integer maxRetries;
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        public Integer getMaxRetries() { return maxRetries; }
        public void setMaxRetries(Integer maxRetries) { this.maxRetries = maxRetries; }
    }
}
