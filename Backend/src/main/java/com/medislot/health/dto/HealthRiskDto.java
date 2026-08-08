package com.medislot.health.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class HealthRiskDto {

    public static class Request {
        @NotNull(message = "Fasting glucose is required")
        @Min(value = 40, message = "Fasting glucose must be at least 40 mg/dL")
        @Max(value = 500, message = "Fasting glucose must be under 500 mg/dL")
        private Integer fastingGlucose;

        @Min(value = 50, message = "PP glucose must be at least 50 mg/dL")
        @Max(value = 600, message = "PP glucose must be under 600 mg/dL")
        private Integer ppGlucose;

        @NotNull(message = "Systolic BP is required")
        @Min(value = 60, message = "Systolic BP must be at least 60 mmHg")
        @Max(value = 260, message = "Systolic BP must be under 260 mmHg")
        private Integer systolicBp;

        @NotNull(message = "Diastolic BP is required")
        @Min(value = 40, message = "Diastolic BP must be at least 40 mmHg")
        @Max(value = 160, message = "Diastolic BP must be under 160 mmHg")
        private Integer diastolicBp;

        @Min(value = 30, message = "Heart rate must be at least 30 bpm")
        @Max(value = 220, message = "Heart rate must be under 220 bpm")
        private Integer heartRate;

        @NotNull(message = "Age is required")
        @Min(value = 1, message = "Age must be at least 1")
        @Max(value = 120, message = "Age must be under 120")
        private Integer age;

        @Min(value = 10, message = "BMI must be at least 10")
        @Max(value = 70, message = "BMI must be under 70")
        private Double bmi;

        private List<String> currentMedications;
        private String existingSymptoms;

        public Request() {}

        public Request(Integer fastingGlucose, Integer ppGlucose, Integer systolicBp, Integer diastolicBp,
                       Integer heartRate, Integer age, Double bmi, List<String> currentMedications, String existingSymptoms) {
            this.fastingGlucose = fastingGlucose;
            this.ppGlucose = ppGlucose;
            this.systolicBp = systolicBp;
            this.diastolicBp = diastolicBp;
            this.heartRate = heartRate;
            this.age = age;
            this.bmi = bmi;
            this.currentMedications = currentMedications;
            this.existingSymptoms = existingSymptoms;
        }

        public Integer getFastingGlucose() { return fastingGlucose; }
        public void setFastingGlucose(Integer fastingGlucose) { this.fastingGlucose = fastingGlucose; }

        public Integer getPpGlucose() { return ppGlucose; }
        public void setPpGlucose(Integer ppGlucose) { this.ppGlucose = ppGlucose; }

        public Integer getSystolicBp() { return systolicBp; }
        public void setSystolicBp(Integer systolicBp) { this.systolicBp = systolicBp; }

        public Integer getDiastolicBp() { return diastolicBp; }
        public void setDiastolicBp(Integer diastolicBp) { this.diastolicBp = diastolicBp; }

        public Integer getHeartRate() { return heartRate; }
        public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }

        public Integer getAge() { return age; }
        public void setAge(Integer age) { this.age = age; }

        public Double getBmi() { return bmi; }
        public void setBmi(Double bmi) { this.bmi = bmi; }

        public List<String> getCurrentMedications() { return currentMedications; }
        public void setCurrentMedications(List<String> currentMedications) { this.currentMedications = currentMedications; }

        public String getExistingSymptoms() { return existingSymptoms; }
        public void setExistingSymptoms(String existingSymptoms) { this.existingSymptoms = existingSymptoms; }
    }

    public static class Response {
        private int overallRiskScore; // 0 to 100
        private String riskCategory; // LOW, MODERATE, HIGH, CRITICAL
        private String riskColor; // GREEN, AMBER, RED, PURPLE
        private double modelConfidence; // e.g. 94.8%

        private DiabetesRisk diabetesRisk;
        private CardiologyRisk cardiologyRisk;

        private List<String> medicationWarnings;
        private List<String> lifestyleAdviceEnglish;
        private List<String> lifestyleAdviceHindi;

        private RecommendedDoctor recommendedDoctor;
        private String clinicalDisclaimer;

        public Response() {}

        public int getOverallRiskScore() { return overallRiskScore; }
        public void setOverallRiskScore(int overallRiskScore) { this.overallRiskScore = overallRiskScore; }

        public String getRiskCategory() { return riskCategory; }
        public void setRiskCategory(String riskCategory) { this.riskCategory = riskCategory; }

        public String getRiskColor() { return riskColor; }
        public void setRiskColor(String riskColor) { this.riskColor = riskColor; }

        public double getModelConfidence() { return modelConfidence; }
        public void setModelConfidence(double modelConfidence) { this.modelConfidence = modelConfidence; }

        public DiabetesRisk getDiabetesRisk() { return diabetesRisk; }
        public void setDiabetesRisk(DiabetesRisk diabetesRisk) { this.diabetesRisk = diabetesRisk; }

        public CardiologyRisk getCardiologyRisk() { return cardiologyRisk; }
        public void setCardiologyRisk(CardiologyRisk cardiologyRisk) { this.cardiologyRisk = cardiologyRisk; }

        public List<String> getMedicationWarnings() { return medicationWarnings; }
        public void setMedicationWarnings(List<String> medicationWarnings) { this.medicationWarnings = medicationWarnings; }

        public List<String> getLifestyleAdviceEnglish() { return lifestyleAdviceEnglish; }
        public void setLifestyleAdviceEnglish(List<String> lifestyleAdviceEnglish) { this.lifestyleAdviceEnglish = lifestyleAdviceEnglish; }

        public List<String> getLifestyleAdviceHindi() { return lifestyleAdviceHindi; }
        public void setLifestyleAdviceHindi(List<String> lifestyleAdviceHindi) { this.lifestyleAdviceHindi = lifestyleAdviceHindi; }

        public RecommendedDoctor getRecommendedDoctor() { return recommendedDoctor; }
        public void setRecommendedDoctor(RecommendedDoctor recommendedDoctor) { this.recommendedDoctor = recommendedDoctor; }

        public String getClinicalDisclaimer() { return clinicalDisclaimer; }
        public void setClinicalDisclaimer(String clinicalDisclaimer) { this.clinicalDisclaimer = clinicalDisclaimer; }
    }

    public static class DiabetesRisk {
        private String level; // Normal, Pre-Diabetes, Type-2 Risk, Severe Hyperglycemia
        private double probability; // e.g. 78.4%
        private String status; // NORMAL, ELEVATED, HIGH
        private String summary;

        public DiabetesRisk() {}
        public DiabetesRisk(String level, double probability, String status, String summary) {
            this.level = level;
            this.probability = probability;
            this.status = status;
            this.summary = summary;
        }

        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }

        public double getProbability() { return probability; }
        public void setProbability(double probability) { this.probability = probability; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }
    }

    public static class CardiologyRisk {
        private String stage; // Normal, Elevated BP, Stage 1 Hypertension, Stage 2 Hypertension, Hypertensive Crisis
        private double probability; // e.g. 64.2%
        private String status; // NORMAL, ELEVATED, HIGH, CRISIS
        private String summary;

        public CardiologyRisk() {}
        public CardiologyRisk(String stage, double probability, String status, String summary) {
            this.stage = stage;
            this.probability = probability;
            this.status = status;
            this.summary = summary;
        }

        public String getStage() { return stage; }
        public void setStage(String stage) { this.stage = stage; }

        public double getProbability() { return probability; }
        public void setProbability(double probability) { this.probability = probability; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }
    }

    public static class RecommendedDoctor {
        private String doctorId;
        private String doctorName;
        private String specialization;
        private String qualifications;
        private Integer consultationFee;
        private String reason;

        public RecommendedDoctor() {}
        public RecommendedDoctor(String doctorId, String doctorName, String specialization, String qualifications, Integer consultationFee, String reason) {
            this.doctorId = doctorId;
            this.doctorName = doctorName;
            this.specialization = specialization;
            this.qualifications = qualifications;
            this.consultationFee = consultationFee;
            this.reason = reason;
        }

        public String getDoctorId() { return doctorId; }
        public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

        public String getDoctorName() { return doctorName; }
        public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

        public String getSpecialization() { return specialization; }
        public void setSpecialization(String specialization) { this.specialization = specialization; }

        public String getQualifications() { return qualifications; }
        public void setQualifications(String qualifications) { this.qualifications = qualifications; }

        public Integer getConsultationFee() { return consultationFee; }
        public void setConsultationFee(Integer consultationFee) { this.consultationFee = consultationFee; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}
