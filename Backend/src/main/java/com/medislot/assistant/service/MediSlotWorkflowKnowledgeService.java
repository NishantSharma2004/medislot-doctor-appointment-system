package com.medislot.assistant.service;

import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Optional;

/**
 * Deterministic service answering MediSlot application workflow and navigation questions
 * matching actual backend API functionality without requiring an external LLM call.
 */
@Service
public class MediSlotWorkflowKnowledgeService {

    public Optional<String> getWorkflowAnswer(String userMessage) {
        if (userMessage == null || userMessage.isBlank()) {
            return Optional.empty();
        }

        String lower = userMessage.toLowerCase(Locale.ROOT);

        if (lower.contains("how to book") || lower.contains("book an appointment") || lower.contains("book appointment")) {
            return Optional.of("To book an appointment on MediSlot: 1. Register or log in as a Patient. 2. Browse specializations or doctors. 3. Select an available doctor time slot. 4. Confirm your booking details.");
        }

        if (lower.contains("how to cancel") || lower.contains("cancel appointment") || lower.contains("cancel my appointment")) {
            return Optional.of("To cancel an appointment: Go to 'My Appointments' in your dashboard, select the active appointment, and click 'Cancel Appointment'. Slots can be cancelled up to 2 hours before the start time.");
        }

        if (lower.contains("how to reschedule") || lower.contains("reschedule appointment")) {
            return Optional.of("To reschedule an appointment: Go to 'My Appointments', choose your booking, select 'Reschedule', and pick a new available slot offered by the doctor.");
        }

        if (lower.contains("how to register") || lower.contains("create account") || lower.contains("sign up")) {
            return Optional.of("To register on MediSlot: Click 'Register' on the homepage, enter your full name, email address, phone number, choose your role (Patient or Doctor), and set a secure password.");
        }

        if (lower.contains("how to login") || lower.contains("log in") || lower.contains("sign in")) {
            return Optional.of("To log in: Click 'Login', enter your registered email and password. Your JWT session will authenticate your access based on your assigned role.");
        }

        if (lower.contains("search doctor") || lower.contains("find doctor") || lower.contains("doctor specialization")) {
            return Optional.of("You can search doctors by name, specialization (e.g. Cardiology, Dermatology), or city using the doctor search filters on the homepage.");
        }

        return Optional.empty();
    }
}
