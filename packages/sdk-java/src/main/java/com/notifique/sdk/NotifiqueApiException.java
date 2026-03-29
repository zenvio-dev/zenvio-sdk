package com.notifique.sdk;

/**
 * Lançada quando a API retorna 4xx ou 5xx.
 */
public class NotifiqueApiException extends RuntimeException {
    private final int statusCode;
    private final String responseBody;

    public NotifiqueApiException(int statusCode, String responseBody) {
        super("Notifique API error: " + statusCode);
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public String getResponseBody() {
        return responseBody;
    }
}
