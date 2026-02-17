package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class SmsSendParams {
    private List<String> to;
    private String message;
    private Schedule schedule;
    private Options options;

    public SmsSendParams() {}

    public SmsSendParams(List<String> to, String message) {
        this.to = to;
        this.message = message;
    }

    public List<String> getTo() { return to; }
    public void setTo(List<String> to) { this.to = to; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
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
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
    }
}
