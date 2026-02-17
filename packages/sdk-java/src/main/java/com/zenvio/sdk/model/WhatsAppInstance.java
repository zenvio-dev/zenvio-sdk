package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WhatsAppInstance {
    private String id;
    private String name;
    private String phoneNumber;
    private String status;
    private String createdAt;
    private String updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @com.fasterxml.jackson.annotation.JsonProperty("phoneNumber")
    public String getPhoneNumber() { return phoneNumber; }
    @com.fasterxml.jackson.annotation.JsonProperty("phoneNumber")
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @com.fasterxml.jackson.annotation.JsonProperty("createdAt")
    public String getCreatedAt() { return createdAt; }
    @com.fasterxml.jackson.annotation.JsonProperty("createdAt")
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    @com.fasterxml.jackson.annotation.JsonProperty("updatedAt")
    public String getUpdatedAt() { return updatedAt; }
    @com.fasterxml.jackson.annotation.JsonProperty("updatedAt")
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
