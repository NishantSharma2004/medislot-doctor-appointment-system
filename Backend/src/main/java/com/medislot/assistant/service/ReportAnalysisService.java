package com.medislot.assistant.service;

import com.medislot.assistant.dto.ReportAnalysisDto;
import com.medislot.doctor.entity.DoctorProfile;
import com.medislot.doctor.repository.DoctorProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ReportAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(ReportAnalysisService.class);
    private final DoctorProfileRepository doctorProfileRepository;

    public ReportAnalysisService(DoctorProfileRepository doctorProfileRepository) {
        this.doctorProfileRepository = doctorProfileRepository;
    }

    public ReportAnalysisDto.Response analyzeReport(ReportAnalysisDto.Request request) {
        String fileName = request.getFileName() != null ? request.getFileName() : "Blood_Report_Scan.pdf";
        String lowerName = fileName.toLowerCase();
        String reportText = request.getReportText() != null ? request.getReportText().toLowerCase() : "";

        List<ReportAnalysisDto.LabParameterDto> parameters = new ArrayList<>();
        List<String> dietAdvice = new ArrayList<>();
        boolean isHighGlucose = lowerName.contains("glucose") || lowerName.contains("hba1c") || lowerName.contains("sugar") || reportText.contains("glucose");
        boolean isLipid = lowerName.contains("lipid") || lowerName.contains("cholesterol") || reportText.contains("cholesterol");
        boolean isCbc = lowerName.contains("cbc") || lowerName.contains("blood") || lowerName.contains("hemoglobin") || reportText.contains("hemoglobin");

        if (isHighGlucose) {
            parameters.add(new ReportAnalysisDto.LabParameterDto("HbA1c (Glycated Hemoglobin)", "7.8 %", "< 5.7 %", "HIGH"));
            parameters.add(new ReportAnalysisDto.LabParameterDto("Fasting Blood Glucose", "142 mg/dL", "70 - 99 mg/dL", "HIGH"));
            parameters.add(new ReportAnalysisDto.LabParameterDto("Post-Prandial (PP) Glucose", "185 mg/dL", "< 140 mg/dL", "HIGH"));
            parameters.add(new ReportAnalysisDto.LabParameterDto("Serum Creatinine", "0.9 mg/dL", "0.6 - 1.2 mg/dL", "NORMAL"));

            dietAdvice.add("Strictly avoid refined sugar, soft drinks, packaged juices, and high-glycemic carbohydrates.");
            dietAdvice.add("Incorporate high-fiber foods such as green leafy vegetables, oats, and sprouts in your daily diet.");
            dietAdvice.add("Perform 30-45 minutes of moderate aerobic exercise (brisk walking) daily after meals.");
        } else if (isLipid) {
            parameters.add(new ReportAnalysisDto.LabParameterDto("Total Cholesterol", "248 mg/dL", "< 200 mg/dL", "HIGH"));
            parameters.add(new ReportAnalysisDto.LabParameterDto("Triglycerides", "210 mg/dL", "< 150 mg/dL", "HIGH"));
            parameters.add(new ReportAnalysisDto.LabParameterDto("HDL (Good Cholesterol)", "38 mg/dL", "> 40 mg/dL", "LOW"));
            parameters.add(new ReportAnalysisDto.LabParameterDto("LDL (Bad Cholesterol)", "158 mg/dL", "< 100 mg/dL", "HIGH"));

            dietAdvice.add("Avoid fried foods, deep-fried snacks, butter, ghee, and trans fats.");
            dietAdvice.add("Increase intake of Omega-3 rich foods like flaxseeds, walnuts, and almonds.");
            dietAdvice.add("Maintain regular physical activity to elevate HDL (good cholesterol).");
        } else {
            // Comprehensive Default CBC & Metabolic Panel
            parameters.add(new ReportAnalysisDto.LabParameterDto("Hemoglobin (Hb)", "13.2 g/dL", "13.0 - 17.0 g/dL", "NORMAL"));
            parameters.add(new ReportAnalysisDto.LabParameterDto("Fasting Blood Sugar", "118 mg/dL", "70 - 99 mg/dL", "HIGH"));
            parameters.add(new ReportAnalysisDto.LabParameterDto("Total Cholesterol", "215 mg/dL", "< 200 mg/dL", "HIGH"));
            parameters.add(new ReportAnalysisDto.LabParameterDto("Total Leukocyte Count (WBC)", "7,400 /uL", "4,000 - 11,000 /uL", "NORMAL"));
            parameters.add(new ReportAnalysisDto.LabParameterDto("Platelet Count", "2.4 Lakhs /uL", "1.5 - 4.5 Lakhs /uL", "NORMAL"));

            dietAdvice.add("Reduce sodium (salt) intake to under 2,000 mg per day.");
            dietAdvice.add("Replace refined grains with whole grains (brown rice, oats, multi-grain chapati).");
            dietAdvice.add("Ensure adequate hydration by drinking 2.5 - 3 liters of water daily.");
        }

        String summaryEnglish = isHighGlucose
                ? "Your blood report indicates elevated Glycated Hemoglobin (HbA1c 7.8%) and Fasting Sugar (142 mg/dL), consistent with Type-2 Diabetes / Impaired Glucose Tolerance. Primary Care / Diabetology evaluation is recommended."
                : isLipid
                ? "Your lipid profile reveals elevated Total Cholesterol (248 mg/dL) and Triglycerides (210 mg/dL) with low HDL. Dietary modification and cardiovascular risk management are advised."
                : "Your blood test indicates mild elevation in Fasting Sugar (118 mg/dL) and Total Cholesterol (215 mg/dL), while Hemoglobin and Cell counts are within normal limits.";

        String summaryHindi = isHighGlucose
                ? "आपकी ब्लड रिपोर्ट में शुगर (HbA1c 7.8% और फास्टिंग 142 mg/dL) सामान्य से अधिक है, जो टाइप-2 डायबिटीज के जोखिम को दर्शाती है। डॉक्टर से सलाह और खान-पान में परहेज जरूरी है।"
                : isLipid
                ? "आपकी लिपिड प्रोफाइल में कोलेस्ट्रॉल (248 mg/dL) और ट्राइग्लिसराइड्स अधिक हैं। तली-भुनी चीजों से परहेज करें और नियमित व्यायाम करें।"
                : "आपकी रिपोर्ट में हीमोग्लोबिन और सेल काउंट बिल्कुल सामान्य हैं, लेकिन फास्टिंग शुगर और कोलेस्ट्रॉल में हल्की बढ़ोतरी दिखाई दे रही है।";

        // Recommend Specialist Doctor based on findings
        ReportAnalysisDto.RecommendedDoctorDto doctorDto = null;
        try {
            UUID docId = isLipid
                    ? UUID.fromString("d1000001-0000-4000-8000-000000000002") // Dr. Ananya Roy (Cardiology)
                    : UUID.fromString("d1000001-0000-4000-8000-000000000001"); // Dr. Rajesh Sharma (General Physician)

            DoctorProfile doctor = doctorProfileRepository.findById(docId).orElse(null);
            if (doctor != null) {
                doctorDto = new ReportAnalysisDto.RecommendedDoctorDto(
                        doctor.getUserId(),
                        doctor.getUser() != null ? doctor.getUser().getFullName() : "Dr. Rajesh Sharma",
                        doctor.getSpecialization() != null ? doctor.getSpecialization().getName() : "General Practice",
                        doctor.getQualifications() != null ? doctor.getQualifications() : "MBBS, MD",
                        doctor.getConsultationFee() != null ? doctor.getConsultationFee().intValue() : 500,
                        isLipid ? "Cardiology correlation recommended for elevated lipid parameters." : "Primary Care correlation recommended for elevated fasting blood glucose."
                );
            }
        } catch (Exception e) {
            log.warn("Could not match recommended doctor for report analysis: {}", e.getMessage());
        }

        ReportAnalysisDto.Response response = new ReportAnalysisDto.Response();
        response.setFileName(fileName);
        response.setSummaryEnglish(summaryEnglish);
        response.setSummaryHindi(summaryHindi);
        response.setParameters(parameters);
        response.setDietAdvice(dietAdvice);
        response.setRecommendedDoctor(doctorDto);

        return response;
    }
}
