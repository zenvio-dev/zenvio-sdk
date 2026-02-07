package com.zenvio.sdk.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;

public class Payloads {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Text {
        private String text;

        public Text(String text) {
            this.text = text;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Media {
        private String url;
        private String caption;
        private String filename;

        public Media(String url) {
            this.url = url;
        }

        public Media(String url, String caption) {
            this.url = url;
            this.caption = caption;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getCaption() {
            return caption;
        }

        public void setCaption(String caption) {
            this.caption = caption;
        }

        public String getFilename() {
            return filename;
        }

        public void setFilename(String filename) {
            this.filename = filename;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Template {
        private String key;
        private String language;
        private List<String> variables;

        public Template(String key, String language) {
            this.key = key;
            this.language = language;
        }

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }

        public List<String> getVariables() {
            return variables;
        }

        public void setVariables(List<String> variables) {
            this.variables = variables;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class Buttons {
        private String body;
        private List<Button> buttons;

        public Buttons() {
        }

        public Buttons(String body, List<Button> buttons) {
            this.body = body;
            this.buttons = buttons;
        }

        public String getBody() {
            return body;
        }

        public void setBody(String body) {
            this.body = body;
        }

        public List<Button> getButtons() {
            return buttons;
        }

        public void setButtons(List<Button> buttons) {
            this.buttons = buttons;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ListPayload {
        private String body;
        private String title;
        private List<Object> sections;

        public ListPayload(String body, List<Object> sections) {
            this.body = body;
            this.sections = sections;
        }

        public String getBody() {
            return body;
        }

        public void setBody(String body) {
            this.body = body;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public List<Object> getSections() {
            return sections;
        }

        public void setSections(List<Object> sections) {
            this.sections = sections;
        }
    }

    public static class Button {
        private String id;
        private String label;

        public Button(String id, String label) {
            this.id = id;
            this.label = label;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }
    }
}
