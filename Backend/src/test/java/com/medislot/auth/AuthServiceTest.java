package com.medislot.auth;

import com.medislot.auth.dto.AuthResponse;
import com.medislot.auth.dto.LoginRequest;
import com.medislot.auth.dto.LogoutRequest;
import com.medislot.auth.dto.RefreshTokenRequest;
import com.medislot.auth.dto.RegisterRequest;
import com.medislot.auth.entity.RefreshToken;
import com.medislot.auth.repository.RefreshTokenRepository;
import com.medislot.auth.service.AuthService;
import com.medislot.auth.service.JwtService;
import com.medislot.common.enums.Role;
import com.medislot.common.exception.ConflictException;
import com.medislot.common.exception.UnauthorizedException;
import com.medislot.user.entity.PatientProfile;
import com.medislot.user.entity.User;
import com.medislot.user.repository.PatientProfileRepository;
import com.medislot.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PatientProfileRepository patientProfileRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private com.medislot.notification.service.NotificationService notificationService;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        testUser = new User(userId, "patient@example.com", "$2a$10$encodedPasswordHash", "Test Patient", "+1234567890", Role.PATIENT);
    }

    @Test
    @DisplayName("Register patient successfully with hashed password and PATIENT role")
    void registerPatient_Success() {
        RegisterRequest request = new RegisterRequest("Test Patient", "PATIENT@EXAMPLE.COM", "+1234567890", "Password123!");

        when(userRepository.existsByEmailIgnoreCase("patient@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("$2a$10$encodedPasswordHash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            return new User(userId, u.getEmail(), u.getPasswordHash(), u.getFullName(), u.getPhone(), u.getRole());
        });
        when(jwtService.generateAccessToken(any(User.class))).thenReturn("access_token_jwt");
        when(jwtService.generateRawRefreshToken()).thenReturn("raw_refresh_token");
        when(jwtService.hashToken("raw_refresh_token")).thenReturn("hashed_refresh_token");
        when(jwtService.getAccessExpirationMs()).thenReturn(86400000L);
        when(jwtService.getRefreshExpirationMs()).thenReturn(604800000L);

        AuthResponse response = authService.registerPatient(request);

        assertNotNull(response);
        assertEquals("access_token_jwt", response.token());
        assertEquals("raw_refresh_token", response.refreshToken());
        assertEquals("patient@example.com", response.user().email());
        assertEquals(Role.PATIENT, response.user().role());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("$2a$10$encodedPasswordHash", userCaptor.getValue().getPasswordHash());
        assertEquals("patient@example.com", userCaptor.getValue().getEmail());
        assertEquals(Role.PATIENT, userCaptor.getValue().getRole());

        verify(patientProfileRepository).save(any(PatientProfile.class));
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    @DisplayName("Register patient throws 409 Conflict when email already exists")
    void registerPatient_DuplicateEmail_ThrowsConflictException() {
        RegisterRequest request = new RegisterRequest("Test Patient", "patient@example.com", "+1234567890", "Password123!");
        when(userRepository.existsByEmailIgnoreCase("patient@example.com")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.registerPatient(request));

        verify(userRepository, never()).save(any());
        verify(patientProfileRepository, never()).save(any());
    }

    @Test
    @DisplayName("Login succeeds with valid credentials")
    void login_Success() {
        LoginRequest request = new LoginRequest("PATIENT@EXAMPLE.COM", "Password123!");

        when(userRepository.findByEmailIgnoreCase("patient@example.com")).thenReturn(Optional.of(testUser));
        when(jwtService.generateAccessToken(testUser)).thenReturn("access_token_jwt");
        when(jwtService.generateRawRefreshToken()).thenReturn("raw_refresh_token");
        when(jwtService.hashToken("raw_refresh_token")).thenReturn("hashed_refresh_token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("access_token_jwt", response.token());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(refreshTokenRepository).revokeAllByUserId(eq(userId), any(Instant.class));
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    @DisplayName("Login fails when authentication manager throws BadCredentialsException")
    void login_InvalidPassword_ThrowsBadCredentials() {
        LoginRequest request = new LoginRequest("patient@example.com", "wrongpass");
        doThrow(new BadCredentialsException("Invalid credentials"))
                .when(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("Refresh token rotation revokes old token and issues new tokens")
    void refreshToken_Success_RotatesToken() {
        RefreshTokenRequest request = new RefreshTokenRequest("raw_old_refresh");
        RefreshToken oldToken = new RefreshToken();
        oldToken.setUser(testUser);
        oldToken.setTokenHash("hashed_old_refresh");

        when(jwtService.hashToken("raw_old_refresh")).thenReturn("hashed_old_refresh");
        when(refreshTokenRepository.findActiveByTokenHash(eq("hashed_old_refresh"), any(Instant.class)))
                .thenReturn(Optional.of(oldToken));
        when(jwtService.generateAccessToken(testUser)).thenReturn("new_access_token");
        when(jwtService.generateRawRefreshToken()).thenReturn("raw_new_refresh");
        when(jwtService.hashToken("raw_new_refresh")).thenReturn("hashed_new_refresh");

        AuthResponse response = authService.refreshToken(request);

        assertNotNull(response);
        assertEquals("new_access_token", response.token());
        assertEquals("raw_new_refresh", response.refreshToken());
        assertNotNull(oldToken.getRevokedAt());

        verify(refreshTokenRepository, times(2)).save(any(RefreshToken.class));
    }

    @Test
    @DisplayName("Refresh token throws UnauthorizedException when token is invalid or expired")
    void refreshToken_InvalidOrRevoked_ThrowsUnauthorizedException() {
        RefreshTokenRequest request = new RefreshTokenRequest("invalid_refresh");
        when(jwtService.hashToken("invalid_refresh")).thenReturn("hashed_invalid");
        when(refreshTokenRepository.findActiveByTokenHash(eq("hashed_invalid"), any(Instant.class)))
                .thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authService.refreshToken(request));
    }

    @Test
    @DisplayName("Logout revokes refresh token successfully")
    void logout_Success() {
        LogoutRequest request = new LogoutRequest("raw_refresh_token");
        RefreshToken token = new RefreshToken();
        token.setUser(testUser);

        when(jwtService.hashToken("raw_refresh_token")).thenReturn("hashed_token");
        when(refreshTokenRepository.findActiveByTokenHash(eq("hashed_token"), any(Instant.class)))
                .thenReturn(Optional.of(token));

        authService.logout(request);

        assertNotNull(token.getRevokedAt());
        verify(refreshTokenRepository).save(token);
    }
}
