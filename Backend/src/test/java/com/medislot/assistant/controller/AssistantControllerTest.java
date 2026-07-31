package com.medislot.assistant.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medislot.assistant.dto.AssistantChatRequest;
import com.medislot.assistant.dto.AssistantChatResponse;
import com.medislot.assistant.service.AssistantService;
import com.medislot.common.enums.AiProvider;
import com.medislot.common.enums.Role;
import com.medislot.common.exception.GlobalExceptionHandler;
import com.medislot.user.entity.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AssistantControllerTest {

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private AssistantService assistantService;

    @InjectMocks
    private AssistantController assistantController;

    private User dummyUser;
    private UsernamePasswordAuthenticationToken auth;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(assistantController)
                .setCustomArgumentResolvers(new AuthenticationPrincipalArgumentResolver())
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        dummyUser = new User();
        dummyUser.setId(UUID.randomUUID());
        dummyUser.setEmail("patient@medislot.com");
        dummyUser.setRole(Role.PATIENT);
        auth = new UsernamePasswordAuthenticationToken(dummyUser, null, List.of());
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void chat_shouldRejectAnonymousUserWith401() throws Exception {
        SecurityContextHolder.clearContext();
        AssistantChatRequest request = new AssistantChatRequest("What are clinic hours?", null);

        mockMvc.perform(post("/api/v1/assistant/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    void chat_shouldAllowAuthenticatedUserAndReturn200Response() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(auth);

        UUID conversationId = UUID.randomUUID();
        UUID requestId = UUID.randomUUID();

        AssistantChatResponse response = new AssistantChatResponse(
                "Clinic is open 8am to 8pm.",
                conversationId,
                AiProvider.GROQ,
                false,
                true,
                true,
                List.of(),
                "Disclaimer text",
                requestId,
                Instant.now()
        );

        when(assistantService.processChat(any(), any())).thenReturn(response);

        AssistantChatRequest request = new AssistantChatRequest("What are clinic hours?", conversationId);

        mockMvc.perform(post("/api/v1/assistant/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").value("Clinic is open 8am to 8pm."))
                .andExpect(jsonPath("$.grounded").value(true))
                .andExpect(jsonPath("$.provider").value("GROQ"));
    }
}
