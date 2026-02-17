package com.zenvio.sdk;

/**
 * Lançada quando a API retorna 4xx ou 5xx.
 */
public class ZenvioApiException extends RuntimeException {
    private final int statusCode;
    private final String responseBody;

    public ZenvioApiException(int statusCode, String responseBody) {
        super("API error: " + statusCode + " " + responseBody);
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
