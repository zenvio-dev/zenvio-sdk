package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WhatsAppInstanceListResponse {
    private boolean success;
    private List<WhatsAppInstance> data;
    private Pagination pagination;

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public List<WhatsAppInstance> getData() { return data; }
    public void setData(List<WhatsAppInstance> data) { this.data = data; }
    public Pagination getPagination() { return pagination; }
    public void setPagination(Pagination pagination) { this.pagination = pagination; }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Pagination {
        private int total;
        private int page;
        private int limit;
        private int totalPages;

        @com.fasterxml.jackson.annotation.JsonProperty("totalPages")
        public int getTotalPages() { return totalPages; }
        @com.fasterxml.jackson.annotation.JsonProperty("totalPages")
        public void setTotalPages(int totalPages) { this.totalPages = totalPages; }
        public int getTotal() { return total; }
        public void setTotal(int total) { this.total = total; }
        public int getPage() { return page; }
        public void setPage(int page) { this.page = page; }
        public int getLimit() { return limit; }
        public void setLimit(int limit) { this.limit = limit; }
    }
}
