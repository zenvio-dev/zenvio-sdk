package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.Map;

/** Body para POST /v1/templates/send — envio por template (whatsapp, sms, email). Mesmos campos em todos os SDKs: to, template, variables, channels, instance_id, from, fromName. */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MessagesSendParams {
    private List<String> to;
    private String template;
    private Map<String, Object> variables;
    private List<String> channels;
    private String instanceId;
    private String from;
    private String fromName;

    public List<String> getTo() { return to; }
    public void setTo(List<String> to) { this.to = to; }
    public String getTemplate() { return template; }
    public void setTemplate(String template) { this.template = template; }
    public Map<String, Object> getVariables() { return variables; }
    public void setVariables(Map<String, Object> variables) { this.variables = variables; }
    public List<String> getChannels() { return channels; }
    public void setChannels(List<String> channels) { this.channels = channels; }

    @com.fasterxml.jackson.annotation.JsonProperty("instance_id")
    public String getInstanceId() { return instanceId; }
    @com.fasterxml.jackson.annotation.JsonProperty("instance_id")
    public void setInstanceId(String instanceId) { this.instanceId = instanceId; }

    @JsonProperty("from")
    public String getFrom() { return from; }
    @JsonProperty("from")
    public void setFrom(String from) { this.from = from; }

    @JsonProperty("fromName")
    public String getFromName() { return fromName; }
    @JsonProperty("fromName")
    public void setFromName(String fromName) { this.fromName = fromName; }
}
