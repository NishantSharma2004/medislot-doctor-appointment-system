package com.medislot.prescription.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class PrescriptionDto {

    public static class MedicineItem {
        @NotBlank(message = "Medicine name is required")
        private String medicineName;

        private String dosage; // e.g. "500mg"
        private String frequency; // e.g. "1-0-1"
        private String timing; // e.g. "After Meals"
        private String durationDays; // e.g. "5 Days"

        public MedicineItem() {
        }

        public MedicineItem(String medicineName, String dosage, String frequency, String timing, String durationDays) {
            this.medicineName = medicineName;
            this.dosage = dosage;
            this.frequency = frequency;
            this.timing = timing;
            this.durationDays = durationDays;
        }

        public String getMedicineName() {
            return medicineName;
        }

        public void setMedicineName(String medicineName) {
            this.medicineName = medicineName;
        }

        public String getDosage() {
            return dosage;
        }

        public void setDosage(String dosage) {
            this.dosage = dosage;
        }

        public String getFrequency() {
            return frequency;
        }

        public void setFrequency(String frequency) {
            this.frequency = frequency;
        }

        public String getTiming() {
            return timing;
        }

        public void setTiming(String timing) {
            this.timing = timing;
        }

        public String getDurationDays() {
            return durationDays;
        }

        public void setDurationDays(String durationDays) {
            this.durationDays = durationDays;
        }
    }

    public static class CreateRequest {
        @NotNull(message = "Appointment ID is required")
        private UUID appointmentId;

        @NotBlank(message = "Diagnosis is required")
        private String diagnosis;

        private String symptoms;

        private List<MedicineItem> medicines;

        private String labTestsRecommended;

        private String clinicalAdvice;

        private LocalDate followUpDate;

        public CreateRequest() {
        }

        public UUID getAppointmentId() {
            return appointmentId;
        }

        public void setAppointmentId(UUID appointmentId) {
            this.appointmentId = appointmentId;
        }

        public String getDiagnosis() {
            return diagnosis;
        }

        public void setDiagnosis(String diagnosis) {
            this.diagnosis = diagnosis;
        }

        public String getSymptoms() {
            return symptoms;
        }

        public void setSymptoms(String symptoms) {
            this.symptoms = symptoms;
        }

        public List<MedicineItem> getMedicines() {
            return medicines;
        }

        public void setMedicines(List<MedicineItem> medicines) {
            this.medicines = medicines;
        }

        public String getLabTestsRecommended() {
            return labTestsRecommended;
        }

        public void setLabTestsRecommended(String labTestsRecommended) {
            this.labTestsRecommended = labTestsRecommended;
        }

        public String getClinicalAdvice() {
            return clinicalAdvice;
        }

        public void setClinicalAdvice(String clinicalAdvice) {
            this.clinicalAdvice = clinicalAdvice;
        }

        public LocalDate getFollowUpDate() {
            return followUpDate;
        }

        public void setFollowUpDate(LocalDate followUpDate) {
            this.followUpDate = followUpDate;
        }
    }

    public static class Response {
        private UUID id;
        private String rxNumber;
        private UUID appointmentId;
        private UUID doctorId;
        private String doctorName;
        private String doctorRegistrationNumber;
        private String doctorSpecialization;
        private String clinicName;
        private UUID patientId;
        private String patientName;
        private String diagnosis;
        private String symptoms;
        private List<MedicineItem> medicines;
        private String labTestsRecommended;
        private String clinicalAdvice;
        private LocalDate followUpDate;
        private Instant createdAt;

        public Response() {
        }

        public UUID getId() {
            return id;
        }

        public void setId(UUID id) {
            this.id = id;
        }

        public String getRxNumber() {
            return rxNumber;
        }

        public void setRxNumber(String rxNumber) {
            this.rxNumber = rxNumber;
        }

        public UUID getAppointmentId() {
            return appointmentId;
        }

        public void setAppointmentId(UUID appointmentId) {
            this.appointmentId = appointmentId;
        }

        public UUID getDoctorId() {
            return doctorId;
        }

        public void setDoctorId(UUID doctorId) {
            this.doctorId = doctorId;
        }

        public String getDoctorName() {
            return doctorName;
        }

        public void setDoctorName(String doctorName) {
            this.doctorName = doctorName;
        }

        public String getDoctorRegistrationNumber() {
            return doctorRegistrationNumber;
        }

        public void setDoctorRegistrationNumber(String doctorRegistrationNumber) {
            this.doctorRegistrationNumber = doctorRegistrationNumber;
        }

        public String getDoctorSpecialization() {
            return doctorSpecialization;
        }

        public void setDoctorSpecialization(String doctorSpecialization) {
            this.doctorSpecialization = doctorSpecialization;
        }

        public String getClinicName() {
            return clinicName;
        }

        public void setClinicName(String clinicName) {
            this.clinicName = clinicName;
        }

        public UUID getPatientId() {
            return patientId;
        }

        public void setPatientId(UUID patientId) {
            this.patientId = patientId;
        }

        public String getPatientName() {
            return patientName;
        }

        public void setPatientName(String patientName) {
            this.patientName = patientName;
        }

        public String getDiagnosis() {
            return diagnosis;
        }

        public void setDiagnosis(String diagnosis) {
            this.diagnosis = diagnosis;
        }

        public String getSymptoms() {
            return symptoms;
        }

        public void setSymptoms(String symptoms) {
            this.symptoms = symptoms;
        }

        public List<MedicineItem> getMedicines() {
            return medicines;
        }

        public void setMedicines(List<MedicineItem> medicines) {
            this.medicines = medicines;
        }

        public String getLabTestsRecommended() {
            return labTestsRecommended;
        }

        public void setLabTestsRecommended(String labTestsRecommended) {
            this.labTestsRecommended = labTestsRecommended;
        }

        public String getClinicalAdvice() {
            return clinicalAdvice;
        }

        public void setClinicalAdvice(String clinicalAdvice) {
            this.clinicalAdvice = clinicalAdvice;
        }

        public LocalDate getFollowUpDate() {
            return followUpDate;
        }

        public void setFollowUpDate(LocalDate followUpDate) {
            this.followUpDate = followUpDate;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
        }
    }
}
