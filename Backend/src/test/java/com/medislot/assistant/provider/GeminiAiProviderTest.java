package com.medislot.assistant.provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medislot.assistant.model.AiGenerationRequest;
import com.medislot.assistant.model.AiGenerationResult;
import com.medislot.common.enums.AiProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class GeminiAiProviderTest {

    private GeminiAiProvider geminiAiProvider;
    private MockRestServiceServer mockServer;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(builder).build();
        geminiAiProvider = new GeminiAiProvider(objectMapper, builder);
        ReflectionTestUtils.setField(geminiAiProvider, "apiKey", "AIzaSyTestKey123");
        ReflectionTestUtils.setField(geminiAiProvider, "baseUrl", "https://generativelanguage.googleapis.com/v1beta");
        ReflectionTestUtils.setField(geminiAiProvider, "model", "gemini-1.5-flash");
    }

    @Test
    void getProvider_shouldReturnGemini() {
        assertEquals(AiProvider.GEMINI, geminiAiProvider.getProvider());
    }

    @Test
    void generate_shouldReturnSuccessfulResultOn200() {
        String mockResponseJson = """
                {
                  "candidates": [
                    {
                      "content": {
                        "parts": [
                          { "text": "Please bring a government photo ID." }
                        ]
                      }
                    }
                  ],
                  "usageMetadata": {
                    "promptTokenCount": 25,
                    "candidatesTokenCount": 15
                  }
                }
                """;

        mockServer.expect(requestTo("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyTestKey123"))
                .andExpect(method(POST))
                .andRespond(withSuccess(mockResponseJson, APPLICATION_JSON));

        AiGenerationRequest request = new AiGenerationRequest("System prompt", "User prompt", 0.2, 500);
        AiGenerationResult result = geminiAiProvider.generate(request);

        assertTrue(result.success());
        assertEquals("Please bring a government photo ID.", result.content());
        assertEquals(200, result.statusCode());
        assertEquals(25, result.inputTokens());
        assertEquals(15, result.outputTokens());
    }
}
