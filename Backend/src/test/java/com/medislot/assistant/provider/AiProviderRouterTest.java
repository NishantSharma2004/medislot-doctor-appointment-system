package com.medislot.assistant.provider;

import com.medislot.assistant.model.AiGenerationRequest;
import com.medislot.assistant.model.AiGenerationResult;
import com.medislot.assistant.service.AiProviderUsageLogService;
import com.medislot.common.enums.AiProvider;
import com.medislot.common.exception.ServiceUnavailableException;
import com.medislot.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class AiProviderRouterTest {

    @Mock
    private GroqAiProvider groqAiProvider;

    @Mock
    private GeminiAiProvider geminiAiProvider;

    @Mock
    private AiProviderUsageLogService usageLogService;

    @InjectMocks
    private AiProviderRouter providerRouter;

    private User dummyUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        dummyUser = new User();
        dummyUser.setId(UUID.randomUUID());
    }

    @Test
    void routeAndExecute_shouldReturnGroqSuccessDirectly() {
        AiGenerationRequest request = new AiGenerationRequest("sys", "usr", 0.2, 500);
        AiGenerationResult groqSuccess = AiGenerationResult.success(AiProvider.GROQ, "llama", "Groq answer", 200, 150, 20, 10);

        when(groqAiProvider.generate(request)).thenReturn(groqSuccess);

        AiProviderRouter.ExecutionOutcome outcome = providerRouter.routeAndExecute(UUID.randomUUID(), dummyUser, request);

        assertFalse(outcome.fallbackUsed());
        assertEquals("Groq answer", outcome.result().content());
        verify(geminiAiProvider, never()).generate(any());
        verify(usageLogService, times(1)).recordAttempt(any(), any(), eq(AiProvider.GROQ), eq(groqSuccess), eq(false));
    }

    @Test
    void routeAndExecute_shouldTriggerGeminiFallbackOnGroq5xxError() {
        AiGenerationRequest request = new AiGenerationRequest("sys", "usr", 0.2, 500);
        AiGenerationResult groqFailure = AiGenerationResult.failure(AiProvider.GROQ, "llama", 503, 300, "SERVER_ERROR", "Groq down");
        AiGenerationResult geminiSuccess = AiGenerationResult.success(AiProvider.GEMINI, "flash", "Gemini answer", 200, 200, 25, 12);

        when(groqAiProvider.generate(request)).thenReturn(groqFailure);
        when(geminiAiProvider.generate(request)).thenReturn(geminiSuccess);

        AiProviderRouter.ExecutionOutcome outcome = providerRouter.routeAndExecute(UUID.randomUUID(), dummyUser, request);

        assertTrue(outcome.fallbackUsed());
        assertEquals("Gemini answer", outcome.result().content());
        verify(groqAiProvider, times(1)).generate(request);
        verify(geminiAiProvider, times(1)).generate(request);
    }

    @Test
    void routeAndExecute_shouldTriggerGeminiFallbackOnMalformedResponse() {
        AiGenerationRequest request = new AiGenerationRequest("sys", "usr", 0.2, 500);
        AiGenerationResult groqMalformed = AiGenerationResult.failure(AiProvider.GROQ, "llama", 500, 300, "MALFORMED_RESPONSE", "Missing choices");
        AiGenerationResult geminiSuccess = AiGenerationResult.success(AiProvider.GEMINI, "flash", "Gemini answer", 200, 200, 25, 12);

        when(groqAiProvider.generate(request)).thenReturn(groqMalformed);
        when(geminiAiProvider.generate(request)).thenReturn(geminiSuccess);

        AiProviderRouter.ExecutionOutcome outcome = providerRouter.routeAndExecute(UUID.randomUUID(), dummyUser, request);

        assertTrue(outcome.fallbackUsed());
        assertEquals("Gemini answer", outcome.result().content());
    }

    @Test
    void routeAndExecute_shouldNotFallbackOn400BadRequest() {
        AiGenerationRequest request = new AiGenerationRequest("sys", "usr", 0.2, 500);
        AiGenerationResult groqBadRequest = AiGenerationResult.failure(AiProvider.GROQ, "llama", 400, 100, "BAD_REQUEST", "Invalid parameters");

        when(groqAiProvider.generate(request)).thenReturn(groqBadRequest);

        assertThrows(ServiceUnavailableException.class, () -> providerRouter.routeAndExecute(UUID.randomUUID(), dummyUser, request));
        verify(geminiAiProvider, never()).generate(any());
    }

    @Test
    void routeAndExecute_shouldNotFallbackOn401Unauthorized() {
        AiGenerationRequest request = new AiGenerationRequest("sys", "usr", 0.2, 500);
        AiGenerationResult groqAuthError = AiGenerationResult.failure(AiProvider.GROQ, "llama", 401, 50, "MISSING_API_KEY", "Unauthorized");

        when(groqAiProvider.generate(request)).thenReturn(groqAuthError);

        assertThrows(ServiceUnavailableException.class, () -> providerRouter.routeAndExecute(UUID.randomUUID(), dummyUser, request));
        verify(geminiAiProvider, never()).generate(any());
    }

    @Test
    void routeAndExecute_shouldThrowServiceUnavailableWhenBothProvidersFail() {
        AiGenerationRequest request = new AiGenerationRequest("sys", "usr", 0.2, 500);
        AiGenerationResult groqFailure = AiGenerationResult.failure(AiProvider.GROQ, "llama", 503, 300, "SERVER_ERROR", "Groq down");
        AiGenerationResult geminiFailure = AiGenerationResult.failure(AiProvider.GEMINI, "flash", 500, 400, "SERVER_ERROR", "Gemini down");

        when(groqAiProvider.generate(request)).thenReturn(groqFailure);
        when(geminiAiProvider.generate(request)).thenReturn(geminiFailure);

        assertThrows(ServiceUnavailableException.class, () -> providerRouter.routeAndExecute(UUID.randomUUID(), dummyUser, request));
    }
}
