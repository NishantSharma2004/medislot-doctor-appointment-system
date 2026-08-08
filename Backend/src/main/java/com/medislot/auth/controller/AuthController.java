package com.medislot.auth.controller;

import com.medislot.auth.dto.AuthResponse;
import com.medislot.auth.dto.ChangePasswordRequest;
import com.medislot.auth.dto.ForgotPasswordRequest;
import com.medislot.auth.dto.LoginRequest;
import com.medislot.auth.dto.LogoutRequest;
import com.medislot.auth.dto.RefreshTokenRequest;
import com.medislot.auth.dto.RegisterRequest;
import com.medislot.auth.dto.ResetPasswordRequest;
import com.medislot.auth.service.AuthService;
import com.medislot.common.ratelimit.RateLimited;
import com.medislot.user.dto.UserDto;
import com.medislot.user.entity.User;
import com.medislot.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Endpoints for registration, login, token refresh, logout, password reset, and profile access")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new patient account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registerPatient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user credentials and obtain JWT access & refresh tokens")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            jakarta.servlet.http.HttpServletRequest servletRequest
    ) {
        String clientIp = servletRequest.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isBlank()) {
            clientIp = servletRequest.getRemoteAddr();
        } else {
            clientIp = clientIp.split(",")[0].trim();
        }

        AuthResponse response = authService.login(request, clientIp);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Obtain a new access token using a valid refresh token (Token Rotation)")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke refresh token and blacklist access token upon logout")
    public ResponseEntity<Void> logout(
            @RequestBody(required = false) LogoutRequest request,
            @RequestHeader(name = "Authorization", required = false) String authHeader
    ) {
        String accessToken = (authHeader != null && authHeader.startsWith("Bearer ")) ? authHeader.substring(7).trim() : null;
        authService.logout(request, accessToken);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Retrieve currently authenticated user's public profile")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        UserDto userDto = authService.getCurrentUser(currentUser);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/forgot-password")
    @RateLimited(policy = "forgot-password")
    @Operation(summary = "Request password reset token")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String resetToken = userService.forgotPassword(request);
        if (resetToken != null) {
            return ResponseEntity.ok(Map.of(
                    "message", "If an account with that email exists, password reset instructions have been sent.",
                    "resetToken", resetToken
            ));
        }
        return ResponseEntity.ok(Map.of("message", "If an account with that email exists, password reset instructions have been sent."));
    }

    @PostMapping("/reset-password")
    @RateLimited(policy = "reset-password")
    @Operation(summary = "Reset password using reset token")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Your password has been reset successfully. Please sign in with your new password."));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password for currently authenticated user")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(currentUser, request);
        return ResponseEntity.ok(Map.of("message", "Your password has been changed successfully."));
    }
}
