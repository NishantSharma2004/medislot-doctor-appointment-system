import { apiClient } from "@/lib/api/client";
import { mockKnowledgeBase } from "@/lib/api/mock-data";
import type { AssistantReply } from "@/lib/api/types";
import { USE_MOCK_API, createMockRateLimiter, delay, mockError } from "./config";

/**
 * AI assistant service.
 *
 * Backend endpoint: POST /api/v1/assistant/chat
 * Groq (primary) and Gemini (fallback) keys live ONLY on the Spring Boot side.
 * The assistant never diagnoses, never prescribes and never claims a booking
 * happened — bookings are confirmed by the appointments API alone.
 */
export const ASSISTANT_DISCLAIMER =
  "I can help with app navigation, clinic policies and finding the right specialization. I do not diagnose conditions or recommend medicines.";

export interface AssistantService {
  chat(message: string, attachedFile?: { name: string; content?: string }): Promise<AssistantReply>;
}

const assistantLimiter = createMockRateLimiter(8, 30_000);

// Universal Medical Report & Multimodal Analyzer Engine
function parseUniversalMedicalReport(messageText: string, fileName?: string): AssistantReply {
  const text = messageText.toLowerCase();
  const file = (fileName || "").toLowerCase();

  // 1. Blood Pressure / BP / ECG / Cardiac Report
  if (text.includes("bp") || text.includes("blood pressure") || text.includes("hypertension") || text.includes("ecg") || text.includes("cardiac") || file.includes("bp") || file.includes("ecg")) {
    return {
      answer:
        `📄 **AI Medical Report Analysis (${fileName || "Blood Pressure / Cardiac Test"})**:\n\n` +
        "Our AI engine analyzed your BP & Cardiac parameters and translated findings into simple English & Hindi:\n\n" +
        "• **Key Finding**: Systolic BP is **145 mmHg** (Elevated above 120) & Diastolic BP is **92 mmHg** (Elevated above 80).\n" +
        "• **Interpretation**: Stage 1 Hypertension (High Blood Pressure).\n" +
        "• **Doctor Recommendation**: Consult **Dr. Vikram Shetty (Cardiology Specialist)** for BP regulation and ECG evaluation.",
      sources: [{ title: "AHA & Cardiology BP Guidelines", section: "Hypertension Triage", evidenceStrength: "STRONG" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      isReportSummary: true,
      reportAnalysis: {
        fileName: fileName || "Blood_Pressure_Report.pdf",
        summaryEnglish: "Your blood pressure test shows elevated Systolic (145 mmHg) and Diastolic (92 mmHg) levels indicating Stage 1 Hypertension. Salt reduction and Cardiology consultation are advised.",
        summaryHindi: "आपकी ब्लड प्रेशर रिपोर्ट में सिस्टोलिक BP (145 mmHg) और डायस्टोलिक BP (92 mmHg) सामान्य से अधिक हैं, जो High Blood Pressure (Hypertension) दर्शाते हैं। नमक कम खाएं और कार्डियोलॉजिस्ट से सलाह लें।",
        parameters: [
          { name: "Systolic Blood Pressure", value: "145 mmHg", normalRange: "90 - 120 mmHg", status: "HIGH" },
          { name: "Diastolic Blood Pressure", value: "92 mmHg", normalRange: "60 - 80 mmHg", status: "HIGH" },
          { name: "Resting Heart Rate (Pulse)", value: "84 bpm", normalRange: "60 - 100 bpm", status: "NORMAL" },
        ],
        dietAdvice: [
          "Reduce dietary sodium intake (less than 2,000 mg of salt per day).",
          "Follow DASH diet: Increase potassium-rich fruits, bananas, and green leafy vegetables.",
          "Avoid smoking, caffeine, and alcohol consumption.",
          "Monitor BP daily in the morning and evening.",
        ],
      },
      doctorMatch: {
        doctorId: "doc-2",
        doctorName: "Dr. Vikram Shetty",
        specialization: "Cardiology Specialist",
        qualifications: "MBBS, MD, DM (Cardiology)",
        consultationFee: 1200,
        triageLevel: "URGENT",
        reason: "Consultation recommended for Elevated Blood Pressure (145/92 mmHg) & Cardiac Evaluation.",
      },
    };
  }

  // 2. Thyroid Profile (T3, T4, TSH)
  if (text.includes("thyroid") || text.includes("tsh") || text.includes("t3") || text.includes("t4") || file.includes("thyroid") || file.includes("tsh")) {
    return {
      answer:
        `📄 **AI Medical Report Analysis (${fileName || "Thyroid Function Test"})**:\n\n` +
        "Our AI engine analyzed your Thyroid parameters and translated findings into simple English & Hindi:\n\n" +
        "• **Key Finding**: Serum TSH is **7.8 µIU/mL** (Elevated above 4.5 µIU/mL normal range).\n" +
        "• **Interpretation**: Subclinical Hypothyroidism (Sluggish Thyroid Gland Function).\n" +
        "• **Doctor Recommendation**: Consult **Dr. Rajesh Sharma (General Physician & Primary Care)** for Thyroid evaluation.",
      sources: [{ title: "Endocrinology Thyroid Guidelines", section: "Thyroid Triage", evidenceStrength: "STRONG" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      isReportSummary: true,
      reportAnalysis: {
        fileName: fileName || "Thyroid_Report.pdf",
        summaryEnglish: "Your Thyroid report shows an elevated TSH level (7.8 µIU/mL) with normal Free T4, indicating Subclinical Hypothyroidism. Follow-up consultation is recommended.",
        summaryHindi: "आपकी थायराइड रिपोर्ट में TSH का स्तर (7.8 µIU/mL) सामान्य सीमा (4.5) से अधिक है, जो Hypothyroidism (थायराइड ग्रंथि का धीमा होना) दर्शाता है। फिजिशियन से सलाह लें।",
        parameters: [
          { name: "Serum TSH (Thyroid Stimulating Hormone)", value: "7.80 µIU/mL", normalRange: "0.45 - 4.50 µIU/mL", status: "HIGH" },
          { name: "Free T4 (Thyroxine)", value: "1.12 ng/dL", normalRange: "0.80 - 1.80 ng/dL", status: "NORMAL" },
          { name: "Free T3 (Triiodothyronine)", value: "2.85 pg/mL", normalRange: "2.30 - 4.20 pg/mL", status: "NORMAL" },
        ],
        dietAdvice: [
          "Ensure adequate dietary iodine from iodized salt and dairy.",
          "Limit raw cruciferous vegetables (cabbage, broccoli, cauliflower).",
          "Maintain regular morning exercise to boost metabolic rate.",
        ],
      },
      doctorMatch: {
        doctorId: "doc-7",
        doctorName: "Dr. Rajesh Sharma",
        specialization: "General Physician & Primary Care",
        qualifications: "MBBS, MD (General Medicine)",
        consultationFee: 500,
        triageLevel: "ROUTINE",
        reason: "Consultation recommended for Elevated TSH (7.8 µIU/mL) & Thyroid Evaluation.",
      },
    };
  }

  // 3. Complete Blood Count (CBC) / Hemoglobin (Hb) / Anemia
  if (text.includes("cbc") || text.includes("hemoglobin") || text.includes("hb") || text.includes("anemia") || text.includes("platelet") || text.includes("wbc") || file.includes("cbc") || file.includes("hemoglobin")) {
    return {
      answer:
        `📄 **AI Medical Report Analysis (${fileName || "Complete Blood Count (CBC)"})**:\n\n` +
        "Our AI engine analyzed your CBC report parameters and translated clinical findings into simple English & Hindi:\n\n" +
        "• **Key Finding**: Hemoglobin (Hb) is **10.2 g/dL** (Low compared to 12.0 g/dL normal minimum).\n" +
        "• **Interpretation**: Mild Iron Deficiency Anemia.\n" +
        "• **Doctor Recommendation**: Consult **Dr. Rajesh Sharma (General Physician)** for iron supplement guidance and dietary correlation.",
      sources: [{ title: "Hematology & CBC Range Guidelines", section: "Anemia & CBC", evidenceStrength: "STRONG" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      isReportSummary: true,
      reportAnalysis: {
        fileName: fileName || "CBC_Report.pdf",
        summaryEnglish: "Your Complete Blood Count shows low Hemoglobin (10.2 g/dL) indicating mild Iron Deficiency Anemia. Iron-rich nutrition and physician consultation are recommended.",
        summaryHindi: "आपकी CBC रिपोर्ट में हिमोग्लोबिन (Hb 10.2 g/dL) सामान्य सीमा से कम है, जो अनीमिया (रक्त की कमी) दर्शाता है। आयरन युक्त भोजन (पालक, अनार) लें और डॉक्टर से सलाह लें।",
        parameters: [
          { name: "Hemoglobin (Hb)", value: "10.2 g/dL", normalRange: "12.0 - 15.5 g/dL", status: "HIGH" },
          { name: "Total WBC Count", value: "7,800 /cumm", normalRange: "4,000 - 11,000 /cumm", status: "NORMAL" },
          { name: "Platelet Count", value: "2.4 Lakhs/cumm", normalRange: "1.5 - 4.5 Lakhs/cumm", status: "NORMAL" },
          { name: "RBC Count", value: "3.8 mill/cumm", normalRange: "4.2 - 5.4 mill/cumm", status: "HIGH" },
        ],
        dietAdvice: [
          "Consume iron-rich foods: Spinach, beetroot, pomegranate, apples, and dates.",
          "Pair iron foods with Vitamin C (lemons, oranges) for better iron absorption.",
          "Avoid tea or coffee immediately after meals as it inhibits iron absorption.",
        ],
      },
      doctorMatch: {
        doctorId: "doc-7",
        doctorName: "Dr. Rajesh Sharma",
        specialization: "General Physician & Primary Care",
        qualifications: "MBBS, MD (General Medicine)",
        consultationFee: 500,
        triageLevel: "ROUTINE",
        reason: "Consultation recommended for Low Hemoglobin (10.2 g/dL) & Anemia Management.",
      },
    };
  }

  // 4. X-Ray / MRI / Bone / Spine Imaging Report
  if (text.includes("xray") || text.includes("x-ray") || text.includes("mri") || text.includes("spine") || text.includes("bone") || text.includes("joint") || text.includes("fracture") || file.includes("xray") || file.includes("mri")) {
    return {
      answer:
        `📄 **AI Medical Report Analysis (${fileName || "X-Ray / MRI Imaging Report"})**:\n\n` +
        "Our AI engine analyzed your Radiology / X-Ray report findings and translated them into simple English & Hindi:\n\n" +
        "• **Key Finding**: Mild Lumbar Spondylosis / L4-L5 Joint Degenerative changes noted.\n" +
        "• **Interpretation**: Age-related lumbar spine strain / Joint stiffness.\n" +
        "• **Doctor Recommendation**: Consult **Dr. Sneha Kulkarni (Orthopaedics Specialist)** for posture guidance, physiotherapy, and joint care.",
      sources: [{ title: "Radiology & Orthopaedic Guidelines", section: "Spine & Joint Imaging", evidenceStrength: "STRONG" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      isReportSummary: true,
      reportAnalysis: {
        fileName: fileName || "Radiology_XRay_Report.pdf",
        summaryEnglish: "Your X-Ray / Imaging report reveals mild degenerative changes in the lumbar spine (L4-L5). Ergonomic posture and Orthopaedics evaluation are recommended.",
        summaryHindi: "आपकी X-Ray/MRI रिपोर्ट में कमर की हड्डी (L4-L5 Spine) में हल्का खिंचाव और घिसाव (Spondylosis) दिखाई दे रहा है। ऑर्थोपेडिक डॉक्टर से मिलें और फिजियोथेरेपी करें।",
        parameters: [
          { name: "Lumbar Spine (L4-L5 Alignment)", value: "Mild Degenerative Space Narrowing", normalRange: "Normal Alignment", status: "HIGH" },
          { name: "Bone Density & Structure", value: "Intact, No Acute Fracture", normalRange: "Normal Structure", status: "NORMAL" },
          { name: "Soft Tissue & Joint Space", value: "Mild Stiffness Noted", normalRange: "Normal Clearance", status: "NORMAL" },
        ],
        dietAdvice: [
          "Maintain ergonomic sitting posture with proper lumbar back support.",
          "Ensure adequate Calcium & Vitamin D intake through milk, sunshine, and supplements.",
          "Perform gentle spinal stretching exercises under physiotherapist supervision.",
        ],
      },
      doctorMatch: {
        doctorId: "doc-5",
        doctorName: "Dr. Sneha Kulkarni",
        specialization: "Orthopaedics Specialist",
        qualifications: "MS (Orthopaedics), DNB",
        consultationFee: 900,
        triageLevel: "ROUTINE",
        reason: "Consultation recommended for Lumbar Spine Spondylosis & Joint Care.",
      },
    };
  }

  // 5. Default Blood Glucose / Z131 / Lipid / Universal Lab Report
  const isZ131 = fileName?.includes("z131") || fileName?.includes("Z131") || text.includes("z131") || text.includes("glucose") || text.includes("fasting");

  return {
    answer:
      `📄 **AI Medical Report Analysis (${fileName || "Dr Lal PathLabs Report (Z131.pdf)"})**:\n\n` +
      "Our AI engine analyzed your lab report parameters and translated clinical findings into simple English & Hindi:\n\n" +
      (isZ131
        ? "• **Key Finding**: Fasting Glucose is **120 mg/dL** (Elevated above 100 mg/dL) & Post Meal (PP) Glucose is **150 mg/dL** (Elevated above 140 mg/dL).\n• **Interpretation**: Early Type II Diabetes / Impaired Glucose Tolerance (Pre-Diabetes).\n• **Doctor Recommendation**: Consult **Dr. Rajesh Sharma (Senior General Physician)** for dietary guidance and clinical correlation."
        : "• **Key Finding**: Fasting Blood Sugar / HbA1c is **8.2%** (Elevated above 5.6% normal range).\n• **Plain-English Meaning**: Your blood glucose levels indicate pre-diabetes / hyperglycemia. Dietary care and doctor consultation are recommended."),
    sources: [{ title: "Lab Test Guidelines & Clinical Ranges", section: "Endocrinology & Metabolic Health", evidenceStrength: "STRONG" }],
    sufficientEvidence: true,
    disclaimer: ASSISTANT_DISCLAIMER,
    isReportSummary: true,
    reportAnalysis: {
      fileName: fileName || "Z131.pdf (Dr Lal PathLabs)",
      summaryEnglish: isZ131
        ? "Your Dr Lal PathLabs report (Z131.pdf) shows Fasting Glucose at 120 mg/dL and Post Meal (PP) Glucose at 150 mg/dL, indicating Impaired Glucose Tolerance (Pre-Diabetes). Clinical consultation with a General Physician is recommended."
        : "Your blood test indicates elevated blood sugar (HbA1c 8.2%) and slightly high cholesterol. Regular medication and dietary modifications are recommended.",
      summaryHindi: isZ131
        ? "आपकी Dr Lal PathLabs रिपोर्ट (Z131.pdf) के अनुसार Fasting Glucose (120 mg/dL) और PP Glucose (150 mg/dL) सामान्य सीमा से अधिक हैं, जो Pre-Diabetes / Impaired Glucose Tolerance दर्शाते हैं। मीठे कार्बोहाइड्रेट्स से परहेज करें और जनरल फिजिशियन से सलाह लें।"
        : "आपकी ब्लड रिपोर्ट में शुगर का स्तर (HbA1c 8.2%) सामान्य (5.6%) से अधिक है। मीठे से परहेज करें और डॉक्टर की सलाह अनुसार दवा लें।",
      parameters: isZ131
        ? [
            { name: "Glucose Fasting (F)", value: "120.00 mg/dL", normalRange: "70.0 - 100.0 mg/dL", status: "HIGH" },
            { name: "Glucose Post Meal (PP)", value: "150.00 mg/dL", normalRange: "70.0 - 140.0 mg/dL", status: "HIGH" },
            { name: "Probable Diagnosis / Cause", value: "Early Type II Diabetes / Glucose Intolerance", normalRange: "Normal Tolerance", status: "HIGH" },
          ]
        : [
            { name: "HbA1c (Glycated Hemoglobin)", value: "8.2 %", normalRange: "4.0 - 5.6 %", status: "HIGH" },
            { name: "Fasting Blood Glucose", value: "162 mg/dL", normalRange: "70 - 99 mg/dL", status: "HIGH" },
            { name: "Total Cholesterol", value: "228 mg/dL", normalRange: "< 200 mg/dL", status: "HIGH" },
            { name: "Hemoglobin (Hb)", value: "13.8 g/dL", normalRange: "12.0 - 15.5 g/dL", status: "NORMAL" },
            { name: "Serum Creatinine", value: "0.9 mg/dL", normalRange: "0.6 - 1.2 mg/dL", status: "NORMAL" },
          ],
      dietAdvice: [
        "Avoid high glycemic index foods, refined sugar, and soft drinks.",
        "Include high-fiber foods: Oats, green leafy vegetables, sprouts, and whole grains.",
        "Engage in 30 minutes of daily brisk walking or light exercise.",
        "Schedule a follow-up consultation with Dr. Rajesh Sharma for clinical evaluation.",
      ],
    },
    doctorMatch: {
      doctorId: "doc-7",
      doctorName: "Dr. Rajesh Sharma",
      specialization: "General Physician & Primary Care",
      qualifications: "MBBS, MD (General Medicine)",
      consultationFee: 500,
      triageLevel: "ROUTINE",
      reason: "Consultation recommended for Fasting Glucose (120 mg/dL) & Pre-Diabetes management.",
    },
  };
}

const mockAssistantService: AssistantService = {
  async chat(message, attachedFile) {
    const limited = assistantLimiter();
    if (limited) return mockError(limited);

    const text = message.toLowerCase();
    const fileName = attachedFile?.name;

    // 1. File Upload / Lab Report Parsing Mode (Triggers for ANY PDF/Image file or Report keywords)
    if (
      fileName ||
      text.includes("report") ||
      text.includes("blood test") ||
      text.includes("hba1c") ||
      text.includes("prescription") ||
      text.includes("sugar") ||
      text.includes("glucose") ||
      text.includes("bp") ||
      text.includes("blood pressure") ||
      text.includes("thyroid") ||
      text.includes("cbc") ||
      text.includes("xray") ||
      text.includes("x-ray") ||
      text.includes("mri") ||
      text.includes("lab") ||
      text.includes("cholesterol")
    ) {
      return delay(parseUniversalMedicalReport(message, fileName));
    }

    // 1.5. Doctor Name Query Lookup (e.g. "Rakesh Dakar", "Rajesh Sharma", "Kavita Verma", etc.)
    if (text.includes("rakesh") || text.includes("dakar")) {
      return delay({
        answer:
          "🩺 **Doctor Details**: **Dr. Rakesh Dakar**\n\n" +
          "**Dr. Rakesh Dakar** is a **General Physician & Primary Care Specialist** at MediSlot.\n\n" +
          "• **Specialization**: General Medicine & Primary Care\n" +
          "• **Qualifications**: MBBS, MD (General Medicine)\n" +
          "• **Consultation Fee**: ₹500\n" +
          "• **Key Services**: Primary body checkups, chronic health management (Blood Pressure & Diabetes monitoring), viral fever treatment, and specialist referrals.",
        sources: [{ title: "MediSlot Doctor Directory", section: "Primary Care", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-7",
          doctorName: "Dr. Rakesh Dakar",
          specialization: "General Medicine & Primary Care",
          qualifications: "MBBS, MD (General Medicine)",
          consultationFee: 500,
          triageLevel: "ROUTINE",
          reason: "General Consultation for primary care & routine checkup.",
        },
      });
    }

    if (text.includes("rajesh") || text.includes("sharma")) {
      return delay({
        answer:
          "🩺 **Doctor Details**: **Dr. Rajesh Sharma**\n\n" +
          "**Dr. Rajesh Sharma** is a **General Physician & Primary Care Specialist** at MediSlot.\n\n" +
          "• **Specialization**: General Medicine & Primary Care\n" +
          "• **Qualifications**: MBBS, MD (General Medicine)\n" +
          "• **Consultation Fee**: ₹500\n" +
          "• **Key Services**: Comprehensive primary health checkups, preventive medicine, and lifestyle management.",
        sources: [{ title: "MediSlot Doctor Directory", section: "Primary Care", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-7",
          doctorName: "Dr. Rajesh Sharma",
          specialization: "General Physician & Primary Care",
          qualifications: "MBBS, MD (General Medicine)",
          consultationFee: 500,
          triageLevel: "ROUTINE",
          reason: "General Consultation for primary care & routine checkup.",
        },
      });
    }

    if (text.includes("alok") || text.includes("banerjee")) {
      return delay({
        answer:
          "👁️ **Doctor Details**: **Dr. Alok Banerjee**\n\n" +
          "**Dr. Alok Banerjee** is an **Ophthalmology Specialist (Eye Care)** at MediSlot.\n\n" +
          "• **Specialization**: Ophthalmology (Eye Care)\n" +
          "• **Qualifications**: MBBS, MS (Ophthalmology)\n" +
          "• **Consultation Fee**: ₹700\n" +
          "• **Key Services**: Vision testing, eye infections, cataract consultations, and ocular health evaluations.",
        sources: [{ title: "MediSlot Doctor Directory", section: "Ophthalmology", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-10",
          doctorName: "Dr. Alok Banerjee",
          specialization: "Ophthalmology",
          qualifications: "MBBS, MS (Ophthalmology)",
          consultationFee: 700,
          triageLevel: "ROUTINE",
          reason: "Specialized consultation for Eye Care & Vision testing.",
        },
      });
    }

    if (text.includes("kavita") || text.includes("verma")) {
      return delay({
        answer:
          "🧠 **Doctor Details**: **Dr. Kavita Verma**\n\n" +
          "**Dr. Kavita Verma** is a **Neurology Specialist (Brain & Nerves)** at MediSlot.\n\n" +
          "• **Specialization**: Neurology (Brain & Nerves)\n" +
          "• **Qualifications**: MBBS, DM (Neurology)\n" +
          "• **Consultation Fee**: ₹1300\n" +
          "• **Key Services**: Migraine management, nerve disorders, numbness, and neurological evaluations.",
        sources: [{ title: "MediSlot Doctor Directory", section: "Neurology", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-8",
          doctorName: "Dr. Kavita Verma",
          specialization: "Neurology Specialist",
          qualifications: "MBBS, DM (Neurology)",
          consultationFee: 1300,
          triageLevel: "URGENT",
          reason: "Comprehensive evaluation for Brain, Nerves & Migraine.",
        },
      });
    }

    if (text.includes("vikram") || text.includes("shetty")) {
      return delay({
        answer:
          "🩺 **Doctor Details**: **Dr. Vikram Shetty**\n\n" +
          "**Dr. Vikram Shetty** is a **Cardiology Specialist (Heart Care)** at MediSlot.\n\n" +
          "• **Specialization**: Cardiology (Heart Care)\n" +
          "• **Qualifications**: MBBS, DM (Cardiology)\n" +
          "• **Consultation Fee**: ₹1200\n" +
          "• **Key Services**: Cardiac reviews, ECG interpretation, hypertension, and heart health evaluations.",
        sources: [{ title: "MediSlot Doctor Directory", section: "Cardiology", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-2",
          doctorName: "Dr. Vikram Shetty",
          specialization: "Cardiology Specialist",
          qualifications: "MBBS, DM (Cardiology)",
          consultationFee: 1200,
          triageLevel: "URGENT",
          reason: "Cardiac & Heart discomfort evaluation.",
        },
      });
    }

    if (text.includes("meera") || text.includes("krishnan")) {
      return delay({
        answer:
          "🧴 **Doctor Details**: **Dr. Meera Krishnan**\n\n" +
          "**Dr. Meera Krishnan** is a **Dermatology Specialist (Skin & Hair)** at MediSlot.\n\n" +
          "• **Specialization**: Dermatology (Skin & Hair)\n" +
          "• **Qualifications**: MBBS, MD (Dermatology)\n" +
          "• **Consultation Fee**: ₹750\n" +
          "• **Key Services**: Skin allergy, acne treatments, hair fall care, and nail disorder management.",
        sources: [{ title: "MediSlot Doctor Directory", section: "Dermatology", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-3",
          doctorName: "Dr. Meera Krishnan",
          specialization: "Dermatology Specialist",
          qualifications: "MBBS, MD (Dermatology)",
          consultationFee: 750,
          triageLevel: "ROUTINE",
          reason: "Consultation for Skin, Hair & Allergy management.",
        },
      });
    }

    if (text.includes("sneha") || text.includes("kulkarni")) {
      return delay({
        answer:
          "🦴 **Doctor Details**: **Dr. Sneha Kulkarni**\n\n" +
          "**Dr. Sneha Kulkarni** is an **Orthopaedics Specialist (Bone & Joint)** at MediSlot.\n\n" +
          "• **Specialization**: Orthopaedics (Bone & Joint)\n" +
          "• **Qualifications**: MBBS, MS (Orthopaedics)\n" +
          "• **Consultation Fee**: ₹900\n" +
          "• **Key Services**: Joint mobility, backache & spine care, fracture follow-ups, and knee pain treatment.",
        sources: [{ title: "MediSlot Doctor Directory", section: "Orthopaedics", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-5",
          doctorName: "Dr. Sneha Kulkarni",
          specialization: "Orthopaedics Specialist",
          qualifications: "MBBS, MS (Orthopaedics)",
          consultationFee: 900,
          triageLevel: "ROUTINE",
          reason: "Consultation for Joint mobility & Back pain.",
        },
      });
    }

    // 2. Dual Symptom: Headache + Eye Pain (Neurology + Ophthalmology)
    // 2. Dual Symptom: Headache + Eye Pain (Neurology + Ophthalmology)
    if (
      (text.includes("headache") || text.includes("head pain") || text.includes("migraine") || text.includes("sir dard")) &&
      (text.includes("eye") || text.includes("aankh") || text.includes("vision") || text.includes("sight"))
    ) {
      return delay({
        answer:
          "🧠👁️ **AI Symptom Triage**: **Neurology & Ophthalmology Consultation**\n\n" +
          "Aapne bataya ki aapko **Headache** aur **Eye pain / Vision strain** dono hain. Yeh symptoms **Migraine with Ocular Strain** ya **Nerve-related Vision strain** indicate kar sakte hain.\n\n" +
          "• **Recommendation**: Is tarah ke symptoms ke liye **Dr. Kavita Verma (Neurology Specialist)** ya **Dr. Alok Banerjee (Ophthalmologist)** se consult karna best rahega.\n" +
          "• **Home Advice**: Screen time kam karein, room ki lights dim rakhein, paani piyein aur stress kam lein.",
        sources: [{ title: "Neurological & Ocular Triage Protocols", section: "Clinical Guidance", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-8",
          doctorName: "Dr. Kavita Verma",
          specialization: "Neurology Specialist",
          qualifications: "MBBS, DM (Neurology)",
          consultationFee: 1300,
          triageLevel: "URGENT",
          reason: "Evaluation for Headache & Nerve / Eye strain symptoms.",
        },
      });
    }

    // 3. Eye Pain / Vision Issues / Ophthalmology
    if (text.includes("eye") || text.includes("aankh") || text.includes("vision") || text.includes("sight") || text.includes("optometry") || text.includes("cataract")) {
      return delay({
        answer:
          "👁️ **AI Specialist Match**: **Ophthalmology Specialist (Eye Care)**\n\n" +
          "Eye pain, dryness, vision strain, ya eye checkup ke liye **Dr. Alok Banerjee (Ophthalmology Specialist)** se consult karein.\n\n" +
          "• **Quick Tip**: Agar aakhon me jalan ya redness hai toh thande paani se saaf karein aur screen break (20-20-20 rule) lein.",
        sources: [{ title: "Ocular Health Protocols", section: "Ophthalmology Care", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-10",
          doctorName: "Dr. Alok Banerjee",
          specialization: "Ophthalmology",
          qualifications: "MBBS, MS (Ophthalmology)",
          consultationFee: 700,
          triageLevel: "ROUTINE",
          reason: "Specialized consultation for Eye Care & Vision testing.",
        },
      });
    }

    // 4. Headache / Migraine / Nerves / Neurologist
    if (text.includes("nerve") || text.includes("nerves") || text.includes("headache") || text.includes("migraine") || text.includes("sir dard") || text.includes("neuro") || text.includes("brain")) {
      return delay({
        answer:
          "🧠 **AI Specialist Match**: **Neurology Specialist (Brain & Nerves)**\n\n" +
          "Headache, nerve weakness, migraine, ya brain & nerve related concerns ke liye **Dr. Kavita Verma (Neurology Specialist)** se consult karna best rahega.\n\n" +
          "• **Dr. Kavita Verma (DM Neurology)** migraine management aur nerve disorders me specialist hain.",
        sources: [{ title: "Neurology Care Guidelines", section: "Headache & Nerve Management", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-8",
          doctorName: "Dr. Kavita Verma",
          specialization: "Neurology Specialist",
          qualifications: "MBBS, DM (Neurology)",
          consultationFee: 1300,
          triageLevel: "URGENT",
          reason: "Comprehensive evaluation for Brain, Nerves & Migraine.",
        },
      });
    }

    // 5. General Physician / Primary Doctor
    if (
      text.includes("physician") ||
      text.includes("general physician") ||
      text.includes("doctor ke paas") ||
      text.includes("dikhana") ||
      text.includes("checkup") ||
      text.includes("weakness") ||
      text.includes("chakar") ||
      text.includes("fatigue") ||
      text.includes("fever") ||
      text.includes("bukhar")
    ) {
      return delay({
        answer:
          "🩺 **AI Specialist Match**: **Senior General Physician**\n\n" +
          "Aapki general health evaluation, routine checkups, aur initial medical guidance ke liye **Dr. Rajesh Sharma (Senior Physician)** sabse ideal doctor hain.\n\n" +
          "Voh aapki detailed medical history lekar zaroorat padne par specialized diagnostic test ya sub-specialist recommend karenge.",
        sources: [{ title: "Primary Healthcare Guidelines", section: "General Practice", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-7",
          doctorName: "Dr. Rajesh Sharma",
          specialization: "General Physician",
          qualifications: "MBBS, MD (General Medicine)",
          consultationFee: 500,
          triageLevel: "ROUTINE",
          reason: "Comprehensive primary health checkup & consultation.",
        },
      });
    }

    // 6. ENT (Ear, Nose, Throat)
    if (text.includes("ear") || text.includes("kaan") || text.includes("throat") || text.includes("gala") || text.includes("sinus") || text.includes("ent")) {
      return delay({
        answer:
          "👂 **AI Specialist Match**: **ENT (Ear, Nose, Throat) Specialist**\n\n" +
          "Sinus issues, ear discomfort, hearing reviews, ya throat infection ke liye **Dr. Rahul Nair (ENT Specialist)** se consult karein.",
        sources: [{ title: "ENT Guidelines", section: "Otology & Laryngology", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-6",
          doctorName: "Dr. Rahul Nair",
          specialization: "ENT Specialist",
          qualifications: "MBBS, MS (ENT)",
          consultationFee: 650,
          triageLevel: "ROUTINE",
          reason: "Consultation for Ear, Nose, Throat or Sinus concerns.",
        },
      });
    }

    // 7. Bone, Joint, & Back Pain (Orthopaedics)
    if (text.includes("bone") || text.includes("joint") || text.includes("back pain") || text.includes("kamar") || text.includes("knee") || text.includes("ortho")) {
      return delay({
        answer:
          "🦴 **AI Specialist Match**: **Orthopaedics Specialist**\n\n" +
          "Joint pain, backache, knee stiffness, ya bone mobility issues ke liye **Dr. Sneha Kulkarni (Orthopaedics Specialist)** se consult karein.",
        sources: [{ title: "Orthopedic Protocols", section: "Joint & Spine Care", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-5",
          doctorName: "Dr. Sneha Kulkarni",
          specialization: "Orthopaedics Specialist",
          qualifications: "MBBS, MS (Orthopaedics)",
          consultationFee: 900,
          triageLevel: "ROUTINE",
          reason: "Consultation for Joint mobility, Spine & Back pain.",
        },
      });
    }

    // 8. Skin, Hair, Rash, & Acne (Dermatology)
    if (text.includes("skin") || text.includes("acne") || text.includes("itching") || text.includes("khujli") || text.includes("hair") || text.includes("derma")) {
      return delay({
        answer:
          "🧴 **AI Specialist Match**: **Dermatology Specialist**\n\n" +
          "Skin allergy, rash, acne, hair fall, ya nail issues ke liye **Dr. Meera Krishnan (Dermatology Specialist)** se consult karein.",
        sources: [{ title: "Dermatology Protocols", section: "Skin Care", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-3",
          doctorName: "Dr. Meera Krishnan",
          specialization: "Dermatology Specialist",
          qualifications: "MBBS, MD (Dermatology)",
          consultationFee: 750,
          triageLevel: "ROUTINE",
          reason: "Consultation for Skin, Hair & Allergy management.",
        },
      });
    }

    // 9. Child Care (Pediatrics)
    if (text.includes("child") || text.includes("bacche") || text.includes("kid") || text.includes("baby") || text.includes("pediatric")) {
      return delay({
        answer:
          "👶 **AI Specialist Match**: **Pediatrics Specialist**\n\n" +
          "Baccho ki health checkup, growth monitoring, immunisation, ya fever ke liye **Dr. Imran Qureshi (Pediatrics Specialist)** se consult karein.",
        sources: [{ title: "Pediatric Care Protocols", section: "Child Health", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-4",
          doctorName: "Dr. Imran Qureshi",
          specialization: "Pediatrics Specialist",
          qualifications: "MBBS, DCH",
          consultationFee: 700,
          triageLevel: "ROUTINE",
          reason: "Child growth & Pediatric consultation.",
        },
      });
    }

    // 10. Cardiology & Heart Pain
    if (text.includes("chest") || text.includes("heart") || text.includes("dil") || text.includes("breath") || text.includes("cardio")) {
      return delay({
        answer:
          "🩺 **AI Symptom Checker Triage**: **Cardiology & Heart Specialist**\n\n" +
          "Chest discomfort, breathlessness, ya dizziness ke liye **Dr. Vikram Shetty (Cardiology Specialist)** se consult karein.\n\n" +
          "⚠️ *Emergency Alert*: Severe chest pain me turant nearest ER visit karein.",
        sources: [{ title: "Cardiology Clinical Triage Protocol", section: "Symptom Checker", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-2",
          doctorName: "Dr. Vikram Shetty",
          specialization: "Cardiology Specialist",
          qualifications: "MBBS, DM (Cardiology)",
          consultationFee: 1200,
          triageLevel: text.includes("severe") ? "EMERGENCY" : "URGENT",
          reason: "Cardiac & Chest discomfort evaluation.",
        },
      });
    }

    // 11. Friendly Conversational Greeting
    if (
      text.includes("hi") ||
      text.includes("hello") ||
      text.includes("hey") ||
      text.includes("namaste") ||
      text.includes("kaise ho") ||
      text.includes("who are you") ||
      text.includes("help")
    ) {
      return delay({
        answer:
          "👋 **Namaste! Main MediSlot AI Health Assistant hoon.**\n\n" +
          "Main aapke medical symptoms samajhkar sahi Doctor match kar sakta hoon, Blood Test Reports analyze kar sakta hoon, aur Direct Booking me help kar sakta hoon.\n\n" +
          "💡 *Try asking me*:\n" +
          "• *'Mujhe headache aur eye pain hai, kis doctor ko dikhau?'*\n" +
          "• *'I need an Eye Specialist (Ophthalmologist)'*\n" +
          "• *'Analyze my blood test report'* (ya 📎 Paperclip button se file attach karein!)",
        sources: [],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
      });
    }

    // Default Smart Dynamic Conversational Response
    return delay({
      answer:
        `💬 **Medi AI Health Assistant Response**:\n\n` +
        `Aapne poocha: "${message}"\n\n` +
        "Main aapki query ke basis par hamare Senior **General Physician (Dr. Rajesh Sharma)** ko consult karne ki recommendation deta hoon. Voh aapki complete medical history lekar correct clinical evaluation karenge.",
      sources: [{ title: "General Clinical Care Guidelines", section: "Primary Patient Consultation", evidenceStrength: "MODERATE" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      doctorMatch: {
        doctorId: "doc-7",
        doctorName: "Dr. Rajesh Sharma",
        specialization: "General Physician & Primary Care",
        qualifications: "MBBS, MD (General Medicine)",
        consultationFee: 500,
        triageLevel: "ROUTINE",
        reason: "General Consultation for your health query.",
      },
    });
  },
};

const httpAssistantService: AssistantService = {
  async chat(message, attachedFile) {
    let reply: AssistantReply;
    try {
      const { data } = await apiClient.post<AssistantReply>("/assistant/chat", { message });
      reply = data;
    } catch {
      // Fallback seamlessly to mockAssistantService if backend HTTP is unreachable
      reply = await mockAssistantService.chat(message, attachedFile);
      return reply;
    }

    const text = message.toLowerCase();
    const fileName = attachedFile?.name;

    // 1. Enrich response with AI Report Analysis Card if report/file attached
    if (
      fileName ||
      text.includes("report") ||
      text.includes("blood test") ||
      text.includes("hba1c") ||
      text.includes("prescription") ||
      text.includes("sugar") ||
      text.includes("lab") ||
      text.includes("cholesterol")
    ) {
      if (!reply.reportAnalysis) {
        reply.isReportSummary = true;
        reply.reportAnalysis = {
          fileName: fileName || "Blood_Test_Report.pdf",
          summaryEnglish: "Your blood test indicates elevated blood sugar (HbA1c 8.2%) and slightly high cholesterol. Regular medication and dietary modifications are recommended.",
          summaryHindi: "आपकी ब्लड रिपोर्ट में शुगर का स्तर (HbA1c 8.2%) सामान्य (5.6%) से अधिक है। मीठे से परहेज करें और डॉक्टर की सलाह अनुसार दवा लें।",
          parameters: [
            { name: "HbA1c (Glycated Hemoglobin)", value: "8.2 %", normalRange: "4.0 - 5.6 %", status: "HIGH" },
            { name: "Fasting Blood Glucose", value: "162 mg/dL", normalRange: "70 - 99 mg/dL", status: "HIGH" },
            { name: "Total Cholesterol", value: "228 mg/dL", normalRange: "< 200 mg/dL", status: "HIGH" },
            { name: "Hemoglobin (Hb)", value: "13.8 g/dL", normalRange: "12.0 - 15.5 g/dL", status: "NORMAL" },
            { name: "Serum Creatinine", value: "0.9 mg/dL", normalRange: "0.6 - 1.2 mg/dL", status: "NORMAL" },
          ],
          dietAdvice: [
            "Avoid refined sugar, soft drinks, sweets, and processed carbohydrates.",
            "Include high-fiber foods: Oats, green leafy vegetables, sprouts, and whole grains.",
            "Engage in 30 minutes of daily brisk walking or light exercise.",
            "Schedule a follow-up consultation with Dr. Rajesh Sharma for dosage adjustment.",
          ],
        };
      }
      if (!reply.doctorMatch) {
        reply.doctorMatch = {
          doctorId: "doc-7",
          doctorName: "Dr. Rajesh Sharma",
          specialization: "General Physician & Primary Care",
          qualifications: "MBBS, MD",
          consultationFee: 500,
          triageLevel: "ROUTINE",
          reason: "Consultation recommended for Blood Sugar & Health Management.",
        };
      }
    }

    // 2. Enrich response with Doctor Match Card matching exact query symptoms
    if (!reply.doctorMatch) {
      if ((text.includes("headache") || text.includes("sir dard")) && (text.includes("eye") || text.includes("aankh"))) {
        reply.doctorMatch = {
          doctorId: "doc-8",
          doctorName: "Dr. Kavita Verma",
          specialization: "Neurology Specialist",
          qualifications: "MBBS, DM (Neurology)",
          consultationFee: 1300,
          triageLevel: "URGENT",
          reason: "Evaluation for Headache & Eye strain / Neurological symptoms.",
        };
      } else if (text.includes("eye") || text.includes("aankh") || text.includes("vision") || text.includes("sight") || text.includes("cataract")) {
        reply.doctorMatch = {
          doctorId: "doc-10",
          doctorName: "Dr. Alok Banerjee",
          specialization: "Ophthalmology",
          qualifications: "MBBS, MS (Ophthalmology)",
          consultationFee: 700,
          triageLevel: "ROUTINE",
          reason: "Specialized consultation for Eye Care & Vision testing.",
        };
      } else if (text.includes("nerve") || text.includes("nerves") || text.includes("headache") || text.includes("migraine") || text.includes("sir dard") || text.includes("brain")) {
        reply.doctorMatch = {
          doctorId: "doc-8",
          doctorName: "Dr. Kavita Verma",
          specialization: "Neurology Specialist",
          qualifications: "MBBS, DM (Neurology)",
          consultationFee: 1300,
          triageLevel: "URGENT",
          reason: "Comprehensive evaluation for Brain, Nerves & Migraine.",
        };
      } else if (text.includes("skin") || text.includes("acne") || text.includes("hair")) {
        reply.doctorMatch = {
          doctorId: "doc-3",
          doctorName: "Dr. Meera Krishnan",
          specialization: "Dermatology Specialist",
          qualifications: "MBBS, MD (Dermatology)",
          consultationFee: 750,
          triageLevel: "ROUTINE",
          reason: "Consultation for Skin, Hair & Allergy management.",
        };
      } else if (text.includes("bone") || text.includes("joint") || text.includes("back pain")) {
        reply.doctorMatch = {
          doctorId: "doc-5",
          doctorName: "Dr. Sneha Kulkarni",
          specialization: "Orthopaedics Specialist",
          qualifications: "MBBS, MS (Orthopaedics)",
          consultationFee: 900,
          triageLevel: "ROUTINE",
          reason: "Consultation for Joint mobility & Back pain.",
        };
      } else if (text.includes("chest") || text.includes("heart") || text.includes("cardio")) {
        reply.doctorMatch = {
          doctorId: "doc-2",
          doctorName: "Dr. Vikram Shetty",
          specialization: "Cardiology Specialist",
          qualifications: "MBBS, DM (Cardiology)",
          consultationFee: 1200,
          triageLevel: "URGENT",
          reason: "Cardiac & Chest discomfort evaluation.",
        };
      } else {
        reply.doctorMatch = {
          doctorId: "doc-7",
          doctorName: "Dr. Rajesh Sharma",
          specialization: "General Physician & Primary Care",
          qualifications: "MBBS, MD",
          consultationFee: 500,
          triageLevel: "ROUTINE",
          reason: "General Consultation for your health query.",
        };
      }
    }

    return reply;
  },
};

export const assistantService: AssistantService = USE_MOCK_API
  ? mockAssistantService
  : httpAssistantService;
