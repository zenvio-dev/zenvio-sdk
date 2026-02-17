package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WhatsAppCreateInstanceResponse {
    private boolean success;
    private Data data;

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public Data getData() { return data; }
    public void setData(Data data) { this.data = data; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Data {
        private WhatsAppInstance instance;
        private Map<String, Object> evolution;
        public WhatsAppInstance getInstance() { return instance; }
        public void setInstance(WhatsAppInstance instance) { this.instance = instance; }
        public Map<String, Object> getEvolution() { return evolution; }
        public void setEvolution(Map<String, Object> evolution) { this.evolution = evolution; }
    }
}
