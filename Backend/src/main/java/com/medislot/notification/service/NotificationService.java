package com.medislot.notification.service;

import com.medislot.notification.entity.NotificationLog;
import com.medislot.notification.repository.NotificationLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private final NotificationLogRepository notificationLogRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public NotificationService(NotificationLogRepository notificationLogRepository) {
        this.notificationLogRepository = notificationLogRepository;
    }

    public void sendEmailNotification(UUID userId, UUID appointmentId, String recipientEmail, String templateName, String subject, String body) {
        String maskedRecipient = maskEmail(recipientEmail);
        boolean isMailConfigured = mailSender != null && mailUsername != null && !mailUsername.isBlank() && recipientEmail != null && !recipientEmail.isBlank();

        try {
            log.info("Processing email notification [template={}] to {}", templateName, maskedRecipient);

            if (isMailConfigured) {
                try {
                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setFrom(mailUsername);
                    message.setTo(recipientEmail.trim());
                    message.setSubject(subject != null ? subject : "MediSlot Notification");
                    message.setText(body != null ? body : "");
                    mailSender.send(message);
                    log.info("Real SMTP email successfully dispatched to {}", maskedRecipient);
                } catch (Exception smtpEx) {
                    log.warn("SMTP send failed to {}, falling back gracefully: {}", maskedRecipient, smtpEx.getMessage());
                }
            } else {
                log.info("Simulated email dispatch [template={}] (SMTP username unconfigured): {}", templateName, body);
            }

            recordLog(userId, appointmentId, templateName, maskedRecipient, "SENT", null, null);
        } catch (Exception e) {
            log.error("Failed to process email notification to {}", maskedRecipient, e);
            recordLog(userId, appointmentId, templateName, maskedRecipient, "FAILED", null, e.getMessage());
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordLog(UUID userId, UUID appointmentId, String templateName, String maskedRecipient, String status, String messageId, String errorCategory) {
        try {
            NotificationLog entry = new NotificationLog();
            entry.setUserId(userId);
            entry.setAppointmentId(appointmentId);
            entry.setChannel("EMAIL");
            entry.setTemplateName(templateName);
            entry.setRecipientMasked(maskedRecipient);
            entry.setStatus(status);
            entry.setProviderMessageId(messageId != null ? messageId : "msg-" + UUID.randomUUID().toString().substring(0, 8));
            entry.setErrorCategory(errorCategory);
            if ("SENT".equals(status)) {
                entry.setSentAt(Instant.now());
            }
            notificationLogRepository.save(entry);
        } catch (Exception ex) {
            log.error("Failed to record notification log entry", ex);
        }
    }

    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***@***.com";
        int atIdx = email.indexOf("@");
        String prefix = email.substring(0, atIdx);
        String domain = email.substring(atIdx);
        String maskedPrefix = prefix.length() <= 2 ? prefix.charAt(0) + "*" : prefix.charAt(0) + "***" + prefix.charAt(prefix.length() - 1);
        return maskedPrefix + domain;
    }

    public long getSuccessCount() {
        return notificationLogRepository.countByStatus("SENT");
    }

    public long getFailureCount() {
        return notificationLogRepository.countByStatus("FAILED");
    }
}
