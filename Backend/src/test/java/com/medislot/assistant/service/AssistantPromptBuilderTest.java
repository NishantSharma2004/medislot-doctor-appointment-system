package com.medislot.assistant.service;

import com.medislot.assistant.entity.ClinicDocument;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AssistantPromptBuilderTest {

    private AssistantPromptBuilder promptBuilder;

    @BeforeEach
    void setUp() {
        promptBuilder = new AssistantPromptBuilder();
    }

    @Test
    void buildSystemPrompt_shouldContainStrictGroundingDirectives() {
        String systemPrompt = promptBuilder.buildSystemPrompt();
        assertNotNull(systemPrompt);
        assertTrue(systemPrompt.contains("MediSlot Clinic AI Assistant"));
        assertTrue(systemPrompt.contains("Strict Rules:"));
        assertTrue(systemPrompt.contains("Do NOT diagnose medical conditions"));
    }

    @Test
    void buildUserPrompt_shouldEmbedContextDocumentsAndUserQuery() {
        ClinicDocument doc = new ClinicDocument();
        doc.setTitle("Fasting Instructions");
        doc.setSection("Preparation");
        doc.setContent("Fast for 8 hours prior to blood tests.");

        String userPrompt = promptBuilder.buildUserPrompt("Can I drink water before test?", List.of(doc));

        assertTrue(userPrompt.contains("Approved Clinic Knowledge Context:"));
        assertTrue(userPrompt.contains("Fasting Instructions"));
        assertTrue(userPrompt.contains("Fast for 8 hours prior to blood tests."));
        assertTrue(userPrompt.contains("User Query: Can I drink water before test?"));
    }
}
