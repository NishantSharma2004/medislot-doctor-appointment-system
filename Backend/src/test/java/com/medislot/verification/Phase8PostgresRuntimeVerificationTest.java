package com.medislot.verification;

import com.medislot.admin.dto.AdminDashboardDto;
import com.medislot.admin.service.AdminService;

import com.medislot.audit.repository.AuditLogRepository;
import com.medislot.auth.dto.RegisterRequest;
import com.medislot.auth.service.AuthService;
import com.medislot.notification.service.NotificationService;
import com.medislot.user.dto.UpdateUserProfileRequest;
import com.medislot.user.dto.UserProfileDto;
import com.medislot.user.entity.User;
import com.medislot.user.repository.UserRepository;
import com.medislot.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Transactional
class Phase8PostgresRuntimeVerificationTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    private User testPatient;

    @BeforeEach
    void setUp() {
        String email = "phase8_patient_" + UUID.randomUUID() + "@medislot.local";
        RegisterRequest registerRequest = new RegisterRequest(email, "Password123!", "Phase8 Patient", "+15550009999");
        authService.registerPatient(registerRequest);
        testPatient = userRepository.findByEmailIgnoreCase(email).map(user -> {
            user.setEnabled(true);
            return userRepository.save(user);
        }).orElseThrow();
    }

    @Test
    void verifyProfileManagementInPostgres() {
        User user = userRepository.findById(testPatient.getId()).orElseThrow();
        UpdateUserProfileRequest request = new UpdateUserProfileRequest("Phase8 Patient Updated", "+1", "+15550008888", null, null, "MALE", "456 Health Ave", "Suite 200", "Metro", "NY", "10001", "USA");
        UserProfileDto updated = userService.updateProfile(user, request);

        assertEquals("Phase8 Patient Updated", updated.fullName());
        assertEquals("456 Health Ave", updated.addressLine1());
        assertEquals("Metro", updated.city());
    }

    @Test
    void verifyAdminDashboardStatsInPostgres() {
        AdminDashboardDto stats = adminService.getDashboardStats();
        assertNotNull(stats);
        assertTrue(stats.totalPatients() >= 1);
    }

    @Test
    void verifyAuditLoggingInPostgres() {
        long initialCount = auditLogRepository.count();
        User user = userRepository.findById(testPatient.getId()).orElseThrow();
        userService.updateProfile(user, new UpdateUserProfileRequest("Audit Patient", "+1", null, null, null, null, null, null, null, null, null, null));
        long newCount = auditLogRepository.count();

        assertTrue(newCount > initialCount, "Audit log record must be persisted in PostgreSQL");
    }

    @Test
    void verifyNotificationLoggingInPostgres() {
        User user = userRepository.findById(testPatient.getId()).orElseThrow();
        notificationService.sendEmailNotification(user.getId(), null, user.getEmail(), "VERIFICATION_TEST", "Test Email", "Verification Body");
        long successCount = notificationService.getSuccessCount();
        assertTrue(successCount >= 1, "Notification log record must be persisted in PostgreSQL");
    }
}
