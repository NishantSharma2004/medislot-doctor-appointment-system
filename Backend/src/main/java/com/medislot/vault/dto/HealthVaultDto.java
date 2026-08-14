package com.medislot.vault.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public class HealthVaultDto {

    public static class UploadRequest {
        @NotBlank(message = "File name is required")
        private String fileName;

        private String fileType;
        private Long fileSizeBytes;
        private String category; // LAB_REPORT, X_RAY, DISCHARGE_SUMMARY, PRESCRIPTION, OTHER

        @NotBlank(message = "File URL or data is required")
        private String fileUrl;

        private String notes;

        public UploadRequest() {
        }

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public String getFileType() {
            return fileType;
        }

        public void setFileType(String fileType) {
            this.fileType = fileType;
        }

        public Long getFileSizeBytes() {
            return fileSizeBytes;
        }

        public void setFileSizeBytes(Long fileSizeBytes) {
            this.fileSizeBytes = fileSizeBytes;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getFileUrl() {
            return fileUrl;
        }

        public void setFileUrl(String fileUrl) {
            this.fileUrl = fileUrl;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }

    public static class ShareRequest {
        @NotNull(message = "Appointment ID is required")
        private UUID appointmentId;

        @NotNull(message = "Vault file ID is required")
        private UUID vaultFileId;

        public ShareRequest() {
        }

        public UUID getAppointmentId() {
            return appointmentId;
        }

        public void setAppointmentId(UUID appointmentId) {
            this.appointmentId = appointmentId;
        }

        public UUID getVaultFileId() {
            return vaultFileId;
        }

        public void setVaultFileId(UUID vaultFileId) {
            this.vaultFileId = vaultFileId;
        }
    }

    public static class Response {
        private UUID id;
        private UUID patientId;
        private String fileName;
        private String fileType;
        private Long fileSizeBytes;
        private String category;
        private String fileUrl;
        private String notes;
        private Instant createdAt;

        public Response() {
        }

        public UUID getId() {
            return id;
        }

        public void setId(UUID id) {
            this.id = id;
        }

        public UUID getPatientId() {
            return patientId;
        }

        public void setPatientId(UUID patientId) {
            this.patientId = patientId;
        }

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public String getFileType() {
            return fileType;
        }

        public void setFileType(String fileType) {
            this.fileType = fileType;
        }

        public Long getFileSizeBytes() {
            return fileSizeBytes;
        }

        public void setFileSizeBytes(Long fileSizeBytes) {
            this.fileSizeBytes = fileSizeBytes;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getFileUrl() {
            return fileUrl;
        }

        public void setFileUrl(String fileUrl) {
            this.fileUrl = fileUrl;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Instant createdAt) {
            this.createdAt = createdAt;
        }
    }
}
