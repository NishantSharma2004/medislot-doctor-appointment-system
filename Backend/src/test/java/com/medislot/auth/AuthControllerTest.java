package com.medislot.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medislot.auth.controller.AuthController;
import com.medislot.auth.dto.AuthResponse;
import com.medislot.auth.dto.LoginRequest;
import com.medislot.auth.dto.RegisterRequest;
import com.medislot.auth.security.CustomAccessDeniedHandler;
import com.medislot.auth.security.JwtAuthenticationEntryPoint;
import com.medislot.auth.security.JwtAuthenticationFilter;
import com.medislot.auth.security.SecurityConfig;
import com.medislot.auth.service.AuthService;
import com.medislot.auth.service.JwtService;
import com.medislot.common.config.CorsConfig;
import com.medislot.common.enums.Role;
import com.medislot.common.exception.ConflictException;
import com.medislot.common.exception.GlobalExceptionHandler;
import com.medislot.common.ratelimit.InMemoryBucketStore;
import com.medislot.common.ratelimit.RateLimitInterceptor;
import com.medislot.common.ratelimit.RateLimitProperties;
import com.medislot.common.ratelimit.RateLimitService;
import com.medislot.common.ratelimit.RateLimitWebConfig;
import com.medislot.user.dto.UserDto;
import com.medislot.user.entity.User;
import com.medislot.user.repository.UserRepository;
import com.medislot.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class)
@Import({
        SecurityConfig.class,
        CorsConfig.class,
        JwtAuthenticationFilter.class,
        JwtAuthenticationEntryPoint.class,
        CustomAccessDeniedHandler.class,
        GlobalExceptionHandler.class,
        RateLimitProperties.class,
        InMemoryBucketStore.class,
        RateLimitService.class,
        RateLimitInterceptor.class,
        RateLimitWebConfig.class
})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    private UserDto testUserDto;
    private AuthResponse testAuthResponse;
    private User testUser;

    @BeforeEach
    void setUp() {
        UUID userId = UUID.randomUUID();
        testUserDto = new UserDto(userId.toString(), "Test Patient", "patient@example.com", "+1234567890", Role.PATIENT);
        testAuthResponse = new AuthResponse("access_jwt_token", "refresh_token", "Bearer", 86400000L, testUserDto);
        testUser = new User(userId, "patient@example.com", "hash", "Test Patient", "+1234567890", Role.PATIENT);
    }

    @Test
    @DisplayName("POST /api/v1/auth/register returns 201 Created and AuthResponse")
    void register_Success_Returns201() throws Exception {
        RegisterRequest request = new RegisterRequest("Test Patient", "patient@example.com", "+1234567890", "Password123!");
        when(authService.registerPatient(any(RegisterRequest.class))).thenReturn(testAuthResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("access_jwt_token"))
                .andExpect(jsonPath("$.user.email").value("patient@example.com"))
                .andExpect(jsonPath("$.user.role").value("PATIENT"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/register returns 409 Conflict when email already exists")
    void register_DuplicateEmail_Returns409() throws Exception {
        RegisterRequest request = new RegisterRequest("Test Patient", "patient@example.com", "+1234567890", "Password123!");
        when(authService.registerPatient(any(RegisterRequest.class)))
                .thenThrow(new ConflictException("An account with this email address already exists."));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("CONFLICT"))
                .andExpect(jsonPath("$.message").value("An account with this email address already exists."));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login returns 200 OK and AuthResponse")
    void login_Success_Returns200() throws Exception {
        LoginRequest request = new LoginRequest("patient@example.com", "Password123!");
        when(authService.login(any(LoginRequest.class))).thenReturn(testAuthResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("access_jwt_token"))
                .andExpect(jsonPath("$.user.email").value("patient@example.com"));
    }

    @Test
    @DisplayName("GET /api/v1/auth/me returns 401 Unauthorized for unauthenticated request")
    void me_Unauthenticated_Returns401() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("GET /api/v1/auth/me returns 200 OK for authenticated user")
    void me_Authenticated_Returns200() throws Exception {
        when(authService.getCurrentUser(any())).thenReturn(testUserDto);

        mockMvc.perform(get("/api/v1/auth/me")
                        .with(user("patient@example.com").roles("PATIENT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("patient@example.com"))
                .andExpect(jsonPath("$.role").value("PATIENT"));
    }
}
