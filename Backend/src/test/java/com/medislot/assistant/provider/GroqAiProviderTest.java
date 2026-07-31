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

class GroqAiProviderTest {

    private GroqAiProvider groqAiProvider;
    private MockRestServiceServer mockServer;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        mockServer = MockRestServiceServer.bindTo(builder).build();
        groqAiProvider = new GroqAiProvider(objectMapper, builder);
        ReflectionTestUtils.setField(groqAiProvider, "apiKey", "gsk_testkey123");
        ReflectionTestUtils.setField(groqAiProvider, "baseUrl", "https://api.groq.com/openai/v1");
        ReflectionTestUtils.setField(groqAiProvider, "model", "llama-3.3-70b-versatile");
    }

    @Test
    void getProvider_shouldReturnGroq() {
        assertEquals(AiProvider.GROQ, groqAiProvider.getProvider());
    }

    @Test
    void generate_shouldReturnSuccessfulResultOn200() {
        String mockResponseJson = """
                {
                  "choices": [
                    {
                      "message": {
                        "content": "Clinic is open from 8am to 8pm."
                      }
                    }
                  ],
                  "usage": {
                    "prompt_tokens": 20,
                    "completion_tokens": 10
                  }
                }
                """;

        mockServer.expect(requestTo("https://api.groq.com/openai/v1/chat/completions"))
                .andExpect(method(POST))
                .andRespond(withSuccess(mockResponseJson, APPLICATION_JSON));

        AiGenerationRequest request = new AiGenerationRequest("System prompt", "User prompt", 0.2, 500);
        AiGenerationResult result = groqAiProvider.generate(request);

        assertTrue(result.success());
        assertEquals("Clinic is open from 8am to 8pm.", result.content());
        assertEquals(200, result.statusCode());
        assertEquals(20, result.inputTokens());
        assertEquals(10, result.outputTokens());
    }
}
