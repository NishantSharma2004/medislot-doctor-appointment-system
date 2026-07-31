package com.medislot.user.service;

import com.medislot.audit.service.AuditLogService;
import com.medislot.auth.dto.ChangePasswordRequest;
import com.medislot.auth.dto.ForgotPasswordRequest;
import com.medislot.auth.entity.PasswordResetToken;
import com.medislot.auth.repository.PasswordResetTokenRepository;
import com.medislot.auth.repository.RefreshTokenRepository;
import com.medislot.common.enums.Role;
import com.medislot.common.exception.BusinessException;
import com.medislot.notification.service.NotificationService;
import com.medislot.user.dto.UpdateUserProfileRequest;
import com.medislot.user.dto.UserProfileDto;
import com.medislot.user.entity.PatientProfile;
import com.medislot.user.entity.User;
import com.medislot.user.repository.PatientProfileRepository;
import com.medislot.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PatientProfileRepository patientProfileRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuditLogService auditLogService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private UserService userService;

    private User dummyUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        dummyUser = new User();
        dummyUser.setId(UUID.randomUUID());
        dummyUser.setEmail("patient@test.com");
        dummyUser.setFullName("John Doe");
        dummyUser.setRole(Role.PATIENT);
        dummyUser.setPasswordHash("hashed_old_password");
    }

    @Test
    void getProfile_shouldReturnProfileDto() {
        when(userRepository.findById(dummyUser.getId())).thenReturn(Optional.of(dummyUser));
        when(patientProfileRepository.findById(dummyUser.getId())).thenReturn(Optional.of(new PatientProfile(dummyUser)));

        UserProfileDto profile = userService.getProfile(dummyUser);

        assertNotNull(profile);
        assertEquals("John Doe", profile.fullName());
        assertEquals("patient@test.com", profile.email());
    }

    @Test
    void updateProfile_shouldUpdateAndReturnDto() {
        when(userRepository.findById(dummyUser.getId())).thenReturn(Optional.of(dummyUser));
        when(userRepository.save(any())).thenReturn(dummyUser);
        when(patientProfileRepository.findById(dummyUser.getId())).thenReturn(Optional.of(new PatientProfile(dummyUser)));

        UpdateUserProfileRequest request = new UpdateUserProfileRequest("John Updated", "+1", "555-0199", null, null, "MALE", "123 Main St", null, "Springfield", "IL", "62701", "USA");

        UserProfileDto profile = userService.updateProfile(dummyUser, request);

        assertNotNull(profile);
        verify(userRepository, times(1)).save(dummyUser);
        verify(auditLogService, times(1)).record(any(), any(), eq("PROFILE_UPDATE"), any(), any(), eq("SUCCESS"), any());
    }

    @Test
    void changePassword_shouldFailOnIncorrectCurrentPassword() {
        when(userRepository.findById(dummyUser.getId())).thenReturn(Optional.of(dummyUser));
        when(passwordEncoder.matches("wrong_pass", "hashed_old_password")).thenReturn(false);

        ChangePasswordRequest request = new ChangePasswordRequest("wrong_pass", "new_password_123", "new_password_123");

        assertThrows(BusinessException.class, () -> userService.changePassword(dummyUser, request));
    }

    @Test
    void forgotPassword_shouldReturnGenericResponseWithoutExceptionWhenUserNotFound() {
        when(userRepository.findByEmailIgnoreCase("unknown@test.com")).thenReturn(Optional.empty());

        ForgotPasswordRequest request = new ForgotPasswordRequest("unknown@test.com");

        assertDoesNotThrow(() -> userService.forgotPassword(request));
        verify(passwordResetTokenRepository, never()).save(any());
    }

    @Test
    void forgotPassword_shouldCreateTokenAndSendEmailWhenUserExists() {
        when(userRepository.findByEmailIgnoreCase("patient@test.com")).thenReturn(Optional.of(dummyUser));

        ForgotPasswordRequest request = new ForgotPasswordRequest("patient@test.com");

        userService.forgotPassword(request);

        verify(passwordResetTokenRepository, times(1)).save(any(PasswordResetToken.class));
        verify(notificationService, times(1)).sendEmailNotification(any(), any(), eq("patient@test.com"), eq("PASSWORD_RESET"), any(), any());
    }
}
