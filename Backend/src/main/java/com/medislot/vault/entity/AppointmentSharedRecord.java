package com.medislot.vault.entity;

import com.medislot.appointment.entity.Appointment;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "appointment_shared_records")
public class AppointmentSharedRecord {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vault_file_id", nullable = false)
    private HealthVaultFile vaultFile;

    @Column(name = "shared_at", nullable = false, updatable = false)
    private Instant sharedAt = Instant.now();

    public AppointmentSharedRecord() {
    }

    public AppointmentSharedRecord(Appointment appointment, HealthVaultFile vaultFile) {
        this.appointment = appointment;
        this.vaultFile = vaultFile;
        this.sharedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public HealthVaultFile getVaultFile() {
        return vaultFile;
    }

    public void setVaultFile(HealthVaultFile vaultFile) {
        this.vaultFile = vaultFile;
    }

    public Instant getSharedAt() {
        return sharedAt;
    }

    public void setSharedAt(Instant sharedAt) {
        this.sharedAt = sharedAt;
    }
}
