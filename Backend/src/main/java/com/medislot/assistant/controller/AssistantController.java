package com.medislot.assistant.controller;

import com.medislot.assistant.dto.AssistantChatRequest;
import com.medislot.assistant.dto.AssistantChatResponse;
import com.medislot.assistant.service.AssistantService;
import com.medislot.common.exception.UnauthorizedException;
import com.medislot.common.ratelimit.RateLimited;
import com.medislot.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/assistant")
@Tag(name = "Clinic AI Assistant", description = "Grounding-backed clinic AI chatbot assistant")
@SecurityRequirement(name = "bearerAuth")
public class AssistantController {

    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping("/chat")
    @RateLimited(policy = "assistant-chat")
    @Operation(
            summary = "Send a message to the Clinic AI Assistant",
            description = "Informational chatbot grounded in approved clinic documents. Does not diagnose or prescribe medication. Supported by Groq primary with Gemini fallback."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful assistant reply or safe refusal",
                    content = @Content(schema = @Schema(implementation = AssistantChatResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation error or invalid message payload"),
            @ApiResponse(responseCode = "401", description = "Unauthenticated user request"),
            @ApiResponse(responseCode = "429", description = "Rate limit exceeded (10 requests per minute)"),
            @ApiResponse(responseCode = "503", description = "Both AI providers are currently unavailable")
    })
    public ResponseEntity<AssistantChatResponse> chat(
            @Valid @RequestBody AssistantChatRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        AssistantChatResponse response = assistantService.processChat(request, currentUser);
        return ResponseEntity.ok(response);
    }
}
