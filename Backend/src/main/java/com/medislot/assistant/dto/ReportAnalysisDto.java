package com.medislot.assistant.dto;

import java.util.List;
import java.util.UUID;

public class ReportAnalysisDto {

    public static class LabParameterDto {
        private String name;
        private String value;
        private String normalRange;
        private String status; // HIGH, LOW, NORMAL

        public LabParameterDto() {
        }

        public LabParameterDto(String name, String value, String normalRange, String status) {
            this.name = name;
            this.value = value;
            this.normalRange = normalRange;
            this.status = status;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public String getNormalRange() {
            return normalRange;
        }

        public void setNormalRange(String normalRange) {
            this.normalRange = normalRange;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class RecommendedDoctorDto {
        private UUID doctorId;
        private String doctorName;
        private String specialization;
        private String qualifications;
        private Integer consultationFee;
        private String reason;

        public RecommendedDoctorDto() {
        }

        public RecommendedDoctorDto(UUID doctorId, String doctorName, String specialization, String qualifications, Integer consultationFee, String reason) {
            this.doctorId = doctorId;
            this.doctorName = doctorName;
            this.specialization = specialization;
            this.qualifications = qualifications;
            this.consultationFee = consultationFee;
            this.reason = reason;
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

        public String getSpecialization() {
            return specialization;
        }

        public void setSpecialization(String specialization) {
            this.specialization = specialization;
        }

        public String getQualifications() {
            return qualifications;
        }

        public void setQualifications(String qualifications) {
            this.qualifications = qualifications;
        }

        public Integer getConsultationFee() {
            return consultationFee;
        }

        public void setConsultationFee(Integer consultationFee) {
            this.consultationFee = consultationFee;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }
    }

    public static class Request {
        private String fileName;
        private String fileContentBase64;
        private String reportText;

        public Request() {
        }

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public String getFileContentBase64() {
            return fileContentBase64;
        }

        public void setFileContentBase64(String fileContentBase64) {
            this.fileContentBase64 = fileContentBase64;
        }

        public String getReportText() {
            return reportText;
        }

        public void setReportText(String reportText) {
            this.reportText = reportText;
        }
    }

    public static class Response {
        private String fileName;
        private String summaryEnglish;
        private String summaryHindi;
        private List<LabParameterDto> parameters;
        private List<String> dietAdvice;
        private RecommendedDoctorDto recommendedDoctor;

        public Response() {
        }

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public String getSummaryEnglish() {
            return summaryEnglish;
        }

        public void setSummaryEnglish(String summaryEnglish) {
            this.summaryEnglish = summaryEnglish;
        }

        public String getSummaryHindi() {
            return summaryHindi;
        }

        public void setSummaryHindi(String summaryHindi) {
            this.summaryHindi = summaryHindi;
        }

        public List<LabParameterDto> getParameters() {
            return parameters;
        }

        public void setParameters(List<LabParameterDto> parameters) {
            this.parameters = parameters;
        }

        public List<String> getDietAdvice() {
            return dietAdvice;
        }

        public void setDietAdvice(List<String> dietAdvice) {
            this.dietAdvice = dietAdvice;
        }

        public RecommendedDoctorDto getRecommendedDoctor() {
            return recommendedDoctor;
        }

        public void setRecommendedDoctor(RecommendedDoctorDto recommendedDoctor) {
            this.recommendedDoctor = recommendedDoctor;
        }
    }
}
