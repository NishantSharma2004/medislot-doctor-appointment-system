package com.medislot.user.service;

import com.medislot.audit.service.AuditLogService;
import com.medislot.auth.dto.ChangePasswordRequest;
import com.medislot.auth.dto.ForgotPasswordRequest;
import com.medislot.auth.dto.ResetPasswordRequest;
import com.medislot.auth.entity.PasswordResetToken;
import com.medislot.auth.repository.PasswordResetTokenRepository;
import com.medislot.auth.repository.RefreshTokenRepository;
import com.medislot.common.exception.BusinessException;
import com.medislot.common.exception.ResourceNotFoundException;
import com.medislot.notification.service.NotificationService;
import com.medislot.user.dto.UpdateUserProfileRequest;
import com.medislot.user.dto.UserProfileDto;
import com.medislot.user.entity.PatientProfile;
import com.medislot.user.entity.User;
import com.medislot.user.repository.PatientProfileRepository;
import com.medislot.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private static final long MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    public UserService(
            UserRepository userRepository,
            PatientProfileRepository patientProfileRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            AuditLogService auditLogService,
            NotificationService notificationService
    ) {
        this.userRepository = userRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(User currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found."));

        PatientProfile profile = patientProfileRepository.findById(user.getId()).orElse(null);

        return new UserProfileDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getCountryCode(),
                user.getPhone(),
                user.getProfileImageUrl(),
                user.getRole(),
                user.isEnabled(),
                profile != null ? profile.getDateOfBirth() : null,
                profile != null ? profile.getGender() : null,
                profile != null ? profile.getAddressLine1() : null,
                profile != null ? profile.getAddressLine2() : null,
                profile != null ? profile.getCity() : null,
                profile != null ? profile.getState() : null,
                profile != null ? profile.getPostalCode() : null,
                profile != null ? profile.getCountry() : null
        );
    }

    @Transactional
    public UserProfileDto updateProfile(User currentUser, UpdateUserProfileRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found."));

        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName().trim());
        }
        if (request.countryCode() != null) {
            user.setCountryCode(request.countryCode().trim());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone().trim());
        }
        if (request.profileImageUrl() != null) {
            user.setProfileImageUrl(request.profileImageUrl().trim());
        }
        userRepository.save(user);

        PatientProfile profile = patientProfileRepository.findById(user.getId())
                .orElseGet(() -> {
                    PatientProfile p = new PatientProfile(user);
                    return patientProfileRepository.saveAndFlush(p);
                });

        if (request.dateOfBirth() != null) profile.setDateOfBirth(request.dateOfBirth());
        if (request.gender() != null) profile.setGender(request.gender().trim());
        if (request.addressLine1() != null) profile.setAddressLine1(request.addressLine1().trim());
        if (request.addressLine2() != null) profile.setAddressLine2(request.addressLine2().trim());
        if (request.city() != null) profile.setCity(request.city().trim());
        if (request.state() != null) profile.setState(request.state().trim());
        if (request.postalCode() != null) profile.setPostalCode(request.postalCode().trim());
        if (request.country() != null) profile.setCountry(request.country().trim());

        patientProfileRepository.save(profile);

        auditLogService.record(user.getId(), user.getRole().name(), "PROFILE_UPDATE", "USER", user.getId(), "SUCCESS", "{}");

        return getProfile(user);
    }

    @Transactional
    public UserProfileDto uploadAvatar(User currentUser, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_FILE", "Avatar file is required.");
        }
        if (file.getSize() > MAX_AVATAR_SIZE) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "FILE_TOO_LARGE", "Avatar file size must not exceed 2MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png") && !contentType.equals("image/webp"))) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "UNSUPPORTED_TYPE", "Only JPG, PNG, and WEBP image formats are supported.");
        }

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        String safeFileName = "avatar_" + user.getId() + "_" + System.currentTimeMillis() + ".png";
        String avatarUrl = "/uploads/avatars/" + safeFileName;

        user.setProfileImageUrl(avatarUrl);
        userRepository.save(user);

        auditLogService.record(user.getId(), user.getRole().name(), "PROFILE_IMAGE_UPLOAD", "USER", user.getId(), "SUCCESS", "{}");

        return getProfile(user);
    }

    @Transactional
    public UserProfileDto deleteAvatar(User currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        user.setProfileImageUrl(null);
        userRepository.save(user);

        return getProfile(user);
    }

    @Transactional
    public void changePassword(User currentUser, ChangePasswordRequest request) {
        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "PASSWORD_MISMATCH", "New password and confirmation password do not match.");
        }

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_PASSWORD", "Current password is incorrect.");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "SAME_PASSWORD", "New password must be different from current password.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        refreshTokenRepository.revokeAllByUserId(user.getId(), Instant.now());

        auditLogService.record(user.getId(), user.getRole().name(), "PASSWORD_CHANGE", "USER", user.getId(), "SUCCESS", "{}");
        notificationService.sendEmailNotification(user.getId(), null, user.getEmail(), "PASSWORD_CHANGED", "Password Changed Notification", "Your MediSlot password has been changed successfully.");
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(request.email().trim());
        if (userOpt.isEmpty()) {
            return;
        }

        User user = userOpt.get();
        passwordResetTokenRepository.deleteByUser(user);

        SecureRandom random = new SecureRandom();
        int otpInt = 100000 + random.nextInt(900000);
        String rawToken = String.valueOf(otpInt);
        String tokenHash = hashToken(rawToken);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setTokenHash(tokenHash);
        resetToken.setExpiresAt(Instant.now().plus(10, ChronoUnit.MINUTES));
        resetToken.setAttemptCount(0);
        passwordResetTokenRepository.save(resetToken);

        auditLogService.record(user.getId(), user.getRole().name(), "PASSWORD_RESET_REQUEST", "USER", user.getId(), "SUCCESS", "{}");
        notificationService.sendEmailNotification(
            user.getId(),
            null,
            user.getEmail(),
            "PASSWORD_RESET",
            "Your MediSlot Password Reset OTP: " + rawToken,
            "Your MediSlot password reset OTP code is: " + rawToken + "\n\nThis OTP is valid for 10 minutes. Do not share this code with anyone."
        );
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "PASSWORD_MISMATCH", "New password and confirmation password do not match.");
        }

        String tokenHash = hashToken(request.token().trim());
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_TOKEN", "Invalid or expired password reset token."));

        if (resetToken.getUsedAt() != null) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "TOKEN_USED", "This password reset token has already been used.");
        }

        if (Instant.now().isAfter(resetToken.getExpiresAt())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "TOKEN_EXPIRED", "Password reset token has expired.");
        }

        if (resetToken.getAttemptCount() >= 5) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "TOO_MANY_ATTEMPTS", "Maximum reset attempts exceeded for this token.");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        resetToken.setUsedAt(Instant.now());
        passwordResetTokenRepository.save(resetToken);

        refreshTokenRepository.revokeAllByUserId(user.getId(), Instant.now());

        auditLogService.record(user.getId(), user.getRole().name(), "PASSWORD_RESET_SUCCESS", "USER", user.getId(), "SUCCESS", "{}");
        notificationService.sendEmailNotification(user.getId(), null, user.getEmail(), "PASSWORD_RESET_SUCCESS", "Password Reset Successful", "Your MediSlot password has been reset successfully.");
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
