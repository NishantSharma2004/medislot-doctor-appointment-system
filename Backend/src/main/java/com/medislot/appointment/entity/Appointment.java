package com.medislot.appointment.entity;

import com.medislot.common.entity.AuditableEntity;
import com.medislot.common.enums.AppointmentStatus;
import com.medislot.common.security.AesMedicalDataConverter;
import com.medislot.availability.entity.AvailabilitySlot;
import com.medislot.doctor.entity.DoctorProfile;
import com.medislot.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "appointments")
public class Appointment extends AuditableEntity {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "doctor_id", nullable = false)
    private DoctorProfile doctor;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "slot_id", nullable = false)
    private AvailabilitySlot slot;

    @Column(name = "slot_start_at", nullable = false)
    private Instant slotStartAt;

    @Column(name = "slot_end_at", nullable = false)
    private Instant slotEndAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AppointmentStatus status = AppointmentStatus.PENDING;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Convert(converter = AesMedicalDataConverter.class)
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "medical_document_url", columnDefinition = "TEXT")
    private String medicalDocumentUrl;

    @Column(name = "medical_document_name")
    private String medicalDocumentName;

    @Convert(converter = AesMedicalDataConverter.class)
    @Column(name = "diagnosis", columnDefinition = "TEXT")
    private String diagnosis;

    @Convert(converter = AesMedicalDataConverter.class)
    @Column(name = "prescription_json", columnDefinition = "TEXT")
    private String prescriptionJson;

    @Convert(converter = AesMedicalDataConverter.class)
    @Column(name = "lab_tests", columnDefinition = "TEXT")
    private String labTests;

    @Column(name = "follow_up_date")
    private String followUpDate;

    @Column(name = "consultation_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    public Appointment() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getPatient() {
        return patient;
    }

    public void setPatient(User patient) {
        this.patient = patient;
    }

    public UUID getPatientId() {
        return patient != null ? patient.getId() : null;
    }

    public DoctorProfile getDoctor() {
        return doctor;
    }

    public void setDoctor(DoctorProfile doctor) {
        this.doctor = doctor;
    }

    public UUID getDoctorId() {
        return doctor != null ? doctor.getUserId() : null;
    }

    public AvailabilitySlot getSlot() {
        return slot;
    }

    public void setSlot(AvailabilitySlot slot) {
        this.slot = slot;
    }

    public UUID getSlotId() {
        return slot != null ? slot.getId() : null;
    }

    public Instant getSlotStartAt() {
        return slotStartAt;
    }

    public void setSlotStartAt(Instant slotStartAt) {
        this.slotStartAt = slotStartAt;
    }

    public Instant getSlotEndAt() {
        return slotEndAt;
    }

    public void setSlotEndAt(Instant slotEndAt) {
        this.slotEndAt = slotEndAt;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getMedicalDocumentUrl() {
        return medicalDocumentUrl;
    }

    public void setMedicalDocumentUrl(String medicalDocumentUrl) {
        this.medicalDocumentUrl = medicalDocumentUrl;
    }

    public String getMedicalDocumentName() {
        return medicalDocumentName;
    }

    public void setMedicalDocumentName(String medicalDocumentName) {
        this.medicalDocumentName = medicalDocumentName;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getPrescriptionJson() {
        return prescriptionJson;
    }

    public void setPrescriptionJson(String prescriptionJson) {
        this.prescriptionJson = prescriptionJson;
    }

    public String getLabTests() {
        return labTests;
    }

    public void setLabTests(String labTests) {
        this.labTests = labTests;
    }

    public String getFollowUpDate() {
        return followUpDate;
    }

    public void setFollowUpDate(String followUpDate) {
        this.followUpDate = followUpDate;
    }

    public BigDecimal getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(BigDecimal consultationFee) {
        this.consultationFee = consultationFee;
    }

    public Long getVersion() {
        return version;
    }
}
