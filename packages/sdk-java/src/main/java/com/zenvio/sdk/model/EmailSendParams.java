package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmailSendParams {
    private String from;
    private String fromName;
    private List<String> to;
    private String subject;
    private String text;
    private String html;
    private Schedule schedule;
    private Options options;

    public EmailSendParams() {}

    /** Remetente (domínio verificado). Serializado como "from" na API. */
    @JsonProperty("from")
    public String getFrom() { return from; }
    @JsonProperty("from")
    public void setFrom(String from) { this.from = from; }

    public String getFromName() { return fromName; }
    public void setFromName(String fromName) { this.fromName = fromName; }
    public List<String> getTo() { return to; }
    public void setTo(List<String> to) { this.to = to; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getHtml() { return html; }
    public void setHtml(String html) { this.html = html; }
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
