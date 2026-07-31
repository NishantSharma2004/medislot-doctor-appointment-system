package com.medislot.assistant.service;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * Utility component to redact PII and sensitive tokens before transmitting text to external LLM providers.
 */
@Component
public class SensitiveDataRedactor {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("(?i)[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}");
    private static final Pattern PHONE_PATTERN = Pattern.compile("(?:\\+?\\d{1,3}[- .]?)?\\(?\\d{3}\\)?[- .]?\\d{3}[- .]?\\d{4}");
    private static final Pattern JWT_PATTERN = Pattern.compile("eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+");
    private static final Pattern API_KEY_PATTERN = Pattern.compile("(?i)(gsk_[A-Za-z0-9_-]{20,}|AIzaSy[A-Za-z0-9_-]{33}|bearer\\s+[A-Za-z0-9._-]{20,})");
    private static final Pattern LONG_ID_PATTERN = Pattern.compile("\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\b");

    public String redact(String input) {
        if (input == null || input.isBlank()) {
            return input;
        }

        String redacted = input;
        redacted = EMAIL_PATTERN.matcher(redacted).replaceAll("[REDACTED_EMAIL]");
        redacted = PHONE_PATTERN.matcher(redacted).replaceAll("[REDACTED_PHONE]");
        redacted = JWT_PATTERN.matcher(redacted).replaceAll("[REDACTED_TOKEN]");
        redacted = API_KEY_PATTERN.matcher(redacted).replaceAll("[REDACTED_KEY]");
        redacted = LONG_ID_PATTERN.matcher(redacted).replaceAll("[REDACTED_ID]");

        return redacted;
    }
}
