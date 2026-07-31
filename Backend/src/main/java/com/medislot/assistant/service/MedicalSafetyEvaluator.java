package com.medislot.assistant.service;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;

/**
 * Deterministic safety evaluation performed BEFORE any document retrieval or LLM execution.
 */
@Component
public class MedicalSafetyEvaluator {

    public enum SafetyCategory {
        SAFE,
        EMERGENCY,
        SELF_HARM,
        DIAGNOSIS_REQUEST,
        DOSAGE_PRESCRIPTION,
        PROMPT_INJECTION_OR_PRIVATE_DATA
    }

    public record SafetyResult(
            SafetyCategory category,
            boolean blocked,
            String responseMessage
    ) {
        public static SafetyResult safe() {
            return new SafetyResult(SafetyCategory.SAFE, false, null);
        }

        public static SafetyResult blocked(SafetyCategory category, String message) {
            return new SafetyResult(category, true, message);
        }
    }

    private static final List<String> EMERGENCY_KEYWORDS = List.of(
            "chest pain", "difficulty breathing", "shortness of breath", "unconscious",
            "stroke", "paralysis", "uncontrolled bleeding", "poisoning", "overdose",
            "severe head injury", "anaphylaxis", "choking", "heart attack", "blue lips"
    );

    private static final List<String> SELF_HARM_KEYWORDS = List.of(
            "suicide", "suicidal", "kill myself", "end my life", "self harm",
            "want to die", "cutting myself", "hanging myself"
    );

    private static final List<String> DIAGNOSIS_KEYWORDS = List.of(
            "diagnose", "do i have", "what disease", "symptoms mean", "is this cancer",
            "what is wrong with my", "read my lab report", "interpret my test results",
            "do i have diabetes", "do i have covid"
    );

    private static final List<String> DOSAGE_KEYWORDS = List.of(
            "prescribe", "medication dosage", "how many mg of", "how much paracetamol",
            "what antibiotic should i take", "can i take ibuprofen with", "recommend a drug",
            "recommend medicine", "dosage for"
    );

    private static final List<String> INJECTION_KEYWORDS = List.of(
            "ignore previous instructions", "reveal system prompt", "show your prompt",
            "what is your api key", "give me patient records", "show other user data",
            "pretend you are a doctor", "override rules"
    );

    public SafetyResult evaluate(String userMessage) {
        if (userMessage == null || userMessage.isBlank()) {
            return SafetyResult.blocked(SafetyCategory.PROMPT_INJECTION_OR_PRIVATE_DATA,
                    "Message must not be empty.");
        }

        String lower = userMessage.toLowerCase(Locale.ROOT);

        // 1. Emergency symptoms check
        for (String kw : EMERGENCY_KEYWORDS) {
            if (lower.contains(kw)) {
                return SafetyResult.blocked(
                        SafetyCategory.EMERGENCY,
                        "This may require urgent medical attention. Please contact your local emergency services or go to the nearest emergency department immediately."
                );
            }
        }

        // 2. Self-harm / crisis check
        for (String kw : SELF_HARM_KEYWORDS) {
            if (lower.contains(kw)) {
                return SafetyResult.blocked(
                        SafetyCategory.SELF_HARM,
                        "If you or someone you know is struggling or in crisis, help is available. Please reach out to local emergency services or a crisis helpline immediately. You are not alone."
                );
            }
        }

        // 3. Medical diagnosis check
        for (String kw : DIAGNOSIS_KEYWORDS) {
            if (lower.contains(kw)) {
                return SafetyResult.blocked(
                        SafetyCategory.DIAGNOSIS_REQUEST,
                        "I can help with MediSlot, clinic policies, appointments, and approved clinic information. I cannot diagnose conditions or interpret diagnostic reports. Please consult a qualified healthcare professional."
                );
            }
        }

        // 4. Prescription / dosage check
        for (String kw : DOSAGE_KEYWORDS) {
            if (lower.contains(kw)) {
                return SafetyResult.blocked(
                        SafetyCategory.DOSAGE_PRESCRIPTION,
                        "I can help with MediSlot, clinic policies, appointments, and approved clinic information. I cannot recommend medication or prescribe dosages. Please consult a qualified doctor or pharmacist."
                );
            }
        }

        // 5. Prompt injection / private data request check
        for (String kw : INJECTION_KEYWORDS) {
            if (lower.contains(kw)) {
                return SafetyResult.blocked(
                        SafetyCategory.PROMPT_INJECTION_OR_PRIVATE_DATA,
                        "I can only help with approved MediSlot clinic services, appointment scheduling, and clinic policies."
                );
            }
        }

        return SafetyResult.safe();
    }
}
