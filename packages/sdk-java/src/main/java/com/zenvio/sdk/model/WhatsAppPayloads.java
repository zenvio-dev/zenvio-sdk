package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Payloads para POST /v1/whatsapp/send (API usa "message" para texto, "media_url" para mídia).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public final class WhatsAppPayloads {

    private WhatsAppPayloads() {}

    /** Tipo text: payload.message */
    public static class TextPayload {
        private String message;

        public TextPayload(String message) {
            this.message = message;
        }

        public TextPayload() {}

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    /** Tipo image, video, audio, document: media_url, file_name e mimetype obrigatórios */
    public static class MediaPayload {
        private String mediaUrl;
        private String fileName;
        private String mimetype;

        public MediaPayload(String mediaUrl, String fileName, String mimetype) {
            this.mediaUrl = mediaUrl;
            this.fileName = fileName;
            this.mimetype = mimetype;
        }

        public MediaPayload() {}

        @com.fasterxml.jackson.annotation.JsonProperty("media_url")
        public String getMediaUrl() { return mediaUrl; }
        @com.fasterxml.jackson.annotation.JsonProperty("media_url")
        public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
        @com.fasterxml.jackson.annotation.JsonProperty("file_name")
        public String getFileName() { return fileName; }
        @com.fasterxml.jackson.annotation.JsonProperty("file_name")
        public void setFileName(String fileName) { this.fileName = fileName; }
        public String getMimetype() { return mimetype; }
        public void setMimetype(String mimetype) { this.mimetype = mimetype; }
    }

    /** Tipo location (latitude, longitude, name e address obrigatórios) */
    public static class LocationPayload {
        private double latitude;
        private double longitude;
        private String name;
        private String address;

        public LocationPayload(double latitude, double longitude, String name, String address) {
            this.latitude = latitude;
            this.longitude = longitude;
            this.name = name;
            this.address = address;
        }

        public LocationPayload() {}

        public double getLatitude() { return latitude; }
        public void setLatitude(double latitude) { this.latitude = latitude; }
        public double getLongitude() { return longitude; }
        public void setLongitude(double longitude) { this.longitude = longitude; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }

    /** Objeto de contato: fullName obrigatório; wuid ou phoneNumber obrigatório. */
    public static class ContactPayload {
        private String fullName;
        private String wuid;
        private String phoneNumber;
        private String organization;
        private String email;
        private String url;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getWuid() { return wuid; }
        public void setWuid(String wuid) { this.wuid = wuid; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        public String getOrganization() { return organization; }
        public void setOrganization(String organization) { this.organization = organization; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }
}
