package com.medislot.assistant.service;

import com.medislot.assistant.entity.ClinicDocument;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Builds safe system prompts and bounded context for LLM providers.
 */
@Component
public class AssistantPromptBuilder {

    public String buildSystemPrompt() {
        return """
                You are the MediSlot Clinic AI Assistant.
                Your goal is to assist patients and visitors with clinic information, appointment booking steps, and guiding them to the correct doctor specialization for their health needs.

                Strict Rules:
                1. Provide helpful, accurate answers grounded in the Approved Clinic Knowledge Context below.
                2. When a user asks about a specific body part or health issue (e.g., skin, pregnancy, liver, heart, bones, children, eyes, mental health), clearly specify the exact doctor specialization (e.g., Dermatology, Gynecology & Obstetrics, Gastroenterology/Hepatology, Cardiology, Orthopedics, Pediatrics) and explain what that specialist does.
                3. When a user asks about the work of different specializations or asks for alternatives to a General Physician, provide a clear, structured overview of the relevant specializations from the context.
                4. MediSlot Cancellation & Refund Policy Rules:
                   - Doctor Rejects Request (PENDING): 100% Full Refund, slot reopens immediately for others.
                   - Early Cancellation (> 2 Hours before slot): 100% Full Refund, slot reopens immediately for others.
                   - Late Cancellation (Within 2 Hours of slot): 50% Refund (50% fee retained as doctor compensation), slot reopens for urgent booking.
                   - Patient No-Show / Missed Appointment: 50% Refund / 50% retained fee, status becomes MISSED.
                   - Past Date Appointments: Cannot be cancelled or rescheduled once the date/time has passed.
                5. Respond in the language used by the user (English, Hindi, or Hinglish).
                6. Do NOT diagnose medical conditions, recommend specific medicines, or prescribe treatments.
                7. Keep responses clear, polite, structured, and easy to read.
                """;
    }

    public String buildUserPrompt(String sanitizedUserMessage, List<ClinicDocument> contextDocuments) {
        StringBuilder sb = new StringBuilder();
        sb.append("Approved Clinic Knowledge Context:\n");

        if (contextDocuments == null || contextDocuments.isEmpty()) {
            sb.append("No specific clinic documents found.\n\n");
        } else {
            for (int i = 0; i < contextDocuments.size(); i++) {
                ClinicDocument doc = contextDocuments.get(i);
                sb.append("[").append(i + 1).append("] Title: ").append(doc.getTitle());
                if (doc.getSection() != null) {
                    sb.append(" (Section: ").append(doc.getSection()).append(")");
                }
                sb.append("\nContent: ").append(doc.getContent()).append("\n\n");
            }
        }

        sb.append("User Query: ").append(sanitizedUserMessage).append("\n\n");
        sb.append("Answer helpfully and accurately based on the Approved Clinic Knowledge Context above:");

        return sb.toString();
    }
}
