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
        PROMPT_INJECTION_OR_PRIVATE_DATA,
        CONFIDENTIALITY_PROBE,
        OUT_OF_SCOPE
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
            "want to die", "cutting myself", "hanging myself", "atmaghatya", "jaan de dunga"
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

    private static final List<String> TECH_CONFIDENTIALITY_KEYWORDS = List.of(
            "what api", "which api", "konsi api", "koun si api", "what model", "which llm",
            "are you chatgpt", "are you grok", "are you gemini", "tech stack", "backend tech",
            "internal prompt", "source code"
    );

    private static final List<String> OUT_OF_SCOPE_KEYWORDS = List.of(
            "coding", "code", "c++", "cpp", "python", "javascript", "program", "programming",
            "programmer", "write code", "recipe", "cook", "cooking", "cricket", "match score",
            "who won", "football", "ipl", "stock market", "crypto", "bitcoin", "politics",
            "election", "math homework", "solve equation", "hello world"
    );

    public SafetyResult evaluate(String userMessage) {
        if (userMessage == null || userMessage.isBlank()) {
            return SafetyResult.blocked(SafetyCategory.PROMPT_INJECTION_OR_PRIVATE_DATA,
                    "Message must not be empty.");
        }

        String lower = userMessage.toLowerCase(Locale.ROOT);

        // 1. Prompt injection / private data request check
        for (String kw : INJECTION_KEYWORDS) {
            if (lower.contains(kw)) {
                return SafetyResult.blocked(
                        SafetyCategory.PROMPT_INJECTION_OR_PRIVATE_DATA,
                        "I can only help with approved Durrmi mental health services, therapist scheduling, and platform policies."
                );
            }
        }

        // 2. Tech stack and API confidentiality probe check
        for (String kw : TECH_CONFIDENTIALITY_KEYWORDS) {
            if (lower.contains(kw)) {
                return SafetyResult.blocked(
                        SafetyCategory.CONFIDENTIALITY_PROBE,
                        "Durrmi platform policies and proprietary technology architecture are confidential and not disclosed. I am here solely to support your emotional wellbeing and assist with finding the right therapist."
                );
            }
        }

        // 3. Out-of-scope non-mental health query check (Saves 100% LLM tokens)
        for (String kw : OUT_OF_SCOPE_KEYWORDS) {
            if (lower.contains(kw)) {
                return SafetyResult.blocked(
                        SafetyCategory.OUT_OF_SCOPE,
                        "I am Durrmi's emotional wellbeing and mental health companion. I cannot assist with programming, recipes, general sports, or non-health queries. Please feel free to ask about stress, anxiety, relationships, or booking a therapist consultation."
                );
            }
        }

        // 4. Emergency symptoms check
        for (String kw : EMERGENCY_KEYWORDS) {
            if (lower.contains(kw)) {
                return SafetyResult.blocked(
                        SafetyCategory.EMERGENCY,
                        "This may require urgent medical attention. Please contact your local emergency services or go to the nearest emergency department immediately."
                );
            }
        }

        // 5. Self-harm / crisis check
        for (String kw : SELF_HARM_KEYWORDS) {
            if (lower.contains(kw)) {
                return SafetyResult.blocked(
                        SafetyCategory.SELF_HARM,
                        "If you or someone you know is struggling or in crisis, help is available. Please reach out to local emergency services or a crisis helpline immediately. Tele-MANAS (Govt of India): Dial 14416 or 1800-891-4416. KIRAN Helpline: 1800-599-0019. Vandrevala Foundation: +91 9999 666 555. You do not have to carry this alone."
                );
            }
        }

        // 6. Prescription / dosage check
        for (String kw : DOSAGE_KEYWORDS) {
            if (lower.contains(kw)) {
                return SafetyResult.blocked(
                        SafetyCategory.DOSAGE_PRESCRIPTION,
                        "I can help with Durrmi emotional wellbeing, clinic policies, and therapist booking. I cannot recommend medication or prescribe dosages. Please consult a qualified psychiatrist or doctor."
                );
            }
        }

        return SafetyResult.safe();
    }
}
