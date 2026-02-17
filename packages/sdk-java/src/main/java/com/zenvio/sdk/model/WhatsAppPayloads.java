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

    /** Tipo image, video, audio, document: payload.media_url */
    public static class MediaPayload {
        private String mediaUrl;

        public MediaPayload(String mediaUrl) {
            this.mediaUrl = mediaUrl;
        }

        public MediaPayload() {}

        @com.fasterxml.jackson.annotation.JsonProperty("media_url")
        public String getMediaUrl() { return mediaUrl; }
        @com.fasterxml.jackson.annotation.JsonProperty("media_url")
        public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
    }

    /** Tipo location */
    public static class LocationPayload {
        private double latitude;
        private double longitude;

        public LocationPayload(double latitude, double longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        }

        public LocationPayload() {}

        public double getLatitude() { return latitude; }
        public void setLatitude(double latitude) { this.latitude = latitude; }
        public double getLongitude() { return longitude; }
        public void setLongitude(double longitude) { this.longitude = longitude; }
    }

    /** Tipo contact */
    public static class ContactPayload {
        private Object vcard;

        public ContactPayload(Object vcard) {
            this.vcard = vcard;
        }

        public ContactPayload() {}

        public Object getVcard() { return vcard; }
        public void setVcard(Object vcard) { this.vcard = vcard; }
    }
}
