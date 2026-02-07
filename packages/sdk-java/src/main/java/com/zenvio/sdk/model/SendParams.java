package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SendParams {
    private List<String> to;
    private String type;
    private Object payload;
    private ScheduleParams schedule;
    private Map<String, Object> metadata;
    private OptionsParams options;
    private WebhookParams webhook;

    public SendParams() {}

    public SendParams(List<String> to, String type, Object payload) {
        this.to = to;
        this.type = type;
        this.payload = payload;
    }

    // Getters and Setters
    public List<String> getTo() { return to; }
    public void setTo(List<String> to) { this.to = to; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Object getPayload() { return payload; }
    public void setPayload(Object payload) { this.payload = payload; }
    
    public ScheduleParams getSchedule() { return schedule; }
    public void setSchedule(ScheduleParams schedule) { this.schedule = schedule; }
    
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    
    public OptionsParams getOptions() { return options; }
    public void setOptions(OptionsParams options) { this.options = options; }
    
    public WebhookParams getWebhook() { return webhook; }
    public void setWebhook(WebhookParams webhook) { this.webhook = webhook; }

    public static class ScheduleParams {
        private String sendAt;
        private String timezone;

        public String getSendAt() { return sendAt; }
        public void setSendAt(String sendAt) { this.sendAt = sendAt; }
        public String getTimezone() { return timezone; }
        public void setTimezone(String timezone) { this.timezone = timezone; }
    }

    public static class OptionsParams {
        private String priority;
        private Boolean retryOnFail;
        private Integer maxRetries;

        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        public Boolean getRetryOnFail() { return retryOnFail; }
        public void setRetryOnFail(Boolean retryOnFail) { this.retryOnFail = retryOnFail; }
        public Integer getMaxRetries() { return maxRetries; }
        public void setMaxRetries(Integer maxRetries) { this.maxRetries = maxRetries; }
    }

    public static class WebhookParams {
        private String url;
        private List<String> events;

        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        public List<String> getEvents() { return events; }
        public void setEvents(List<String> events) { this.events = events; }
    }
}
