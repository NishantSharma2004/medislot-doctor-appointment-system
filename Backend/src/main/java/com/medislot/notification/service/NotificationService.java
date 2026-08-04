package com.medislot.notification.service;

import com.medislot.notification.entity.NotificationLog;
import com.medislot.notification.repository.NotificationLogRepository;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
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

    @Value("${spring.mail.password:}")
    private String mailPassword;

    public NotificationService(NotificationLogRepository notificationLogRepository) {
        this.notificationLogRepository = notificationLogRepository;
    }

    public void sendEmailNotification(UUID userId, UUID appointmentId, String recipientEmail, String templateName, String subject, String body) {
        String maskedRecipient = maskEmail(recipientEmail);

        String effectiveUsername = mailUsername;
        if ((effectiveUsername == null || effectiveUsername.isBlank()) && mailSender instanceof JavaMailSenderImpl mailImpl) {
            effectiveUsername = mailImpl.getUsername();
        }

        boolean hasMailCredentials = (effectiveUsername != null && !effectiveUsername.isBlank())
                && (mailPassword != null && !mailPassword.isBlank());
        boolean isMailConfigured = mailSender != null && recipientEmail != null && !recipientEmail.isBlank() && hasMailCredentials;

        try {
            log.info("Processing email notification [template={}] to {}", templateName, maskedRecipient);

            if (isMailConfigured) {
                try {
                    String senderEmail = (effectiveUsername != null && !effectiveUsername.isBlank()) ? effectiveUsername.trim() : "nishantbansiya@gmail.com";
                    MimeMessage mimeMessage = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                    helper.setFrom(senderEmail, "MediSlot Healthcare");
                    helper.setTo(recipientEmail.trim());
                    helper.setSubject(subject != null ? subject : "MediSlot Notification");

                    String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;'>"
                            + "<h2 style='color: #0d9488; margin-bottom: 16px;'>MediSlot Healthcare</h2>"
                            + "<div style='background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px;'>"
                            + "<p style='margin: 0; font-size: 15px; color: #1e293b;'>" + (body != null ? body.replace("\n", "<br>") : "") + "</p>"
                            + "</div>"
                            + "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>"
                            + "<p style='font-size: 12px; color: #64748b;'>This is an automated notification from MediSlot. Please do not reply to this email.</p>"
                            + "</div>";
                    helper.setText(htmlContent, true);

                    mailSender.send(mimeMessage);
                    log.info("Real SMTP email successfully dispatched to {}", maskedRecipient);
                } catch (Exception smtpEx) {
                    log.warn("HTML MimeMessage send failed to {}, attempting SimpleMailMessage fallback: {}", maskedRecipient, smtpEx.getMessage());
                    try {
                        String senderEmail = (effectiveUsername != null && !effectiveUsername.isBlank()) ? effectiveUsername.trim() : "nishantbansiya@gmail.com";
                        SimpleMailMessage simpleMsg = new SimpleMailMessage();
                        simpleMsg.setFrom(senderEmail);
                        simpleMsg.setTo(recipientEmail.trim());
                        simpleMsg.setSubject(subject != null ? subject : "MediSlot Notification");
                        simpleMsg.setText(body != null ? body : "");
                        mailSender.send(simpleMsg);
                        log.info("SimpleMailMessage successfully dispatched to {}", maskedRecipient);
                    } catch (Exception fallbackEx) {
                        log.error("All SMTP attempts failed to {}: {}", maskedRecipient, fallbackEx.getMessage(), fallbackEx);
                    }
                }
            } else {
                log.info("Simulated email dispatch [template={}] (MailSender unconfigured): {}", templateName, body);
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
