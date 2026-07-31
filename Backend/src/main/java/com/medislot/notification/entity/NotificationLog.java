package com.medislot.notification.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notification_logs")
public class NotificationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "appointment_id")
    private UUID appointmentId;

    @Column(name = "channel", nullable = false, length = 20)
    private String channel = "EMAIL";

    @Column(name = "template_name", nullable = false, length = 100)
    private String templateName;

    @Column(name = "recipient_masked", nullable = false, length = 255)
    private String recipientMasked;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "provider_message_id", length = 100)
    private String providerMessageId;

    @Column(name = "error_category", length = 100)
    private String errorCategory;

    @Column(name = "sent_at")
    private Instant sentAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "retry_count", nullable = false)
    private int retryCount = 0;

    public NotificationLog() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getAppointmentId() { return appointmentId; }
    public void setAppointmentId(UUID appointmentId) { this.appointmentId = appointmentId; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }

    public String getTemplateName() { return templateName; }
    public void setTemplateName(String templateName) { this.templateName = templateName; }

    public String getRecipientMasked() { return recipientMasked; }
    public void setRecipientMasked(String recipientMasked) { this.recipientMasked = recipientMasked; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getProviderMessageId() { return providerMessageId; }
    public void setProviderMessageId(String providerMessageId) { this.providerMessageId = providerMessageId; }

    public String getErrorCategory() { return errorCategory; }
    public void setErrorCategory(String errorCategory) { this.errorCategory = errorCategory; }

    public Instant getSentAt() { return sentAt; }
    public void setSentAt(Instant sentAt) { this.sentAt = sentAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public int getRetryCount() { return retryCount; }
    public void setRetryCount(int retryCount) { this.retryCount = retryCount; }
}
