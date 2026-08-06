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

const DEMO_DOCTOR_ID = "e6d0d7aa-2279-4e3b-898f-5a4c49a3f3b2"; // Dr. Rakesh Dakar

const mockAssistantService: AssistantService = {
  async chat(message, attachedFile) {
    const limited = assistantLimiter();
    if (limited) return mockError(limited);

    const text = message.toLowerCase();
    const fileName = attachedFile?.name;

    // 1. File Upload / Lab Report Parsing Mode
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
      return delay({
        answer:
          `📄 **AI Medical Report Analysis (${fileName || "Patient Medical Record"})**:\n\n` +
          "Our AI engine analyzed your blood test parameters and translated medical jargon into plain English & Hindi:\n\n" +
          "• **Key Finding**: Fasting Blood Sugar / HbA1c is **8.2%** (Elevated above 5.6% normal range).\n" +
          "• **Plain-English Meaning**: Your blood glucose levels indicate pre-diabetes / hyperglycemia. Dietary care and doctor consultation are recommended.",
        sources: [{ title: "Lab Test Guidelines & Clinical Ranges", section: "Endocrinology & Metabolic Health", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        isReportSummary: true,
        reportAnalysis: {
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
            "Schedule a follow-up consultation with Dr. Rakesh Dakar for dosage adjustment.",
          ],
        },
        doctorMatch: {
          doctorId: DEMO_DOCTOR_ID,
          doctorName: "Dr. Rakesh Dakar",
          specialization: "General Medicine & Endocrinology",
          qualifications: "MBBS, MD",
          consultationFee: 500,
          triageLevel: "ROUTINE",
          reason: "Consultation recommended for Blood Sugar (HbA1c 8.2%) & Lipid Management.",
        },
      });
    }

    // 2. Dual Symptom: Headache + Eye Pain (Neurology + Ophthalmology)
    if (
      (text.includes("headache") || text.includes("head pain") || text.includes("migraine") || text.includes("sir dard")) &&
      (text.includes("eye") || text.includes("aankh") || text.includes("vision") || text.includes("sight"))
    ) {
      return delay({
        answer:
          "🧠 **AI Symptom Triage**: **Neurology & Ophthalmology Consultation**\n\n" +
          "Aapne bataya ki aapko **Headache** aur **Eye pain** dono hain. Yeh symptoms **Migraine with Ocular Strain** ya **Tension Headache** indicate kar sakte hain.\n\n" +
          "• **Recommendation**: Is tarah ke dual symptoms ke liye **Dr. Kavita Verma (Neurology Specialist)** ya Senior **General Physician** se consult karna best rahega.\n" +
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
          reason: "Evaluation for Headache & Eye strain / Neurological symptoms.",
        },
      });
    }

    // 3. Eye Pain / Vision Issues
    if (text.includes("eye") || text.includes("aankh") || text.includes("vision") || text.includes("sight") || text.includes("optometry")) {
      return delay({
        answer:
          "👁️ **AI Symptom Triage**: **Ophthalmology & General Medicine**\n\n" +
          "Eye pain, dryness, ya vision strain ke liye **Eye Specialist (Ophthalmologist)** ya **General Physician** se checkup karwayein.\n\n" +
          "• **Quick Tip**: Agar aakhon me jalan ya redness hai toh thande paani se saaf karein aur aakhon ko rub mat karein.",
        sources: [{ title: "Ocular Health Protocols", section: "Primary Care", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-7",
          doctorName: "Dr. Rajesh Sharma",
          specialization: "General Physician & Primary Care",
          qualifications: "MBBS, MD (General Medicine)",
          consultationFee: 500,
          triageLevel: "ROUTINE",
          reason: "General evaluation for Eye discomfort & overall health.",
        },
      });
    }

    // 4. Headache / Migraine / Neurologist
    if (text.includes("headache") || text.includes("migraine") || text.includes("sir dard") || text.includes("neuro")) {
      return delay({
        answer:
          "🧠 **AI Symptom Triage**: **Neurology Specialist**\n\n" +
          "Headache ya Migraine ke recurrent episodes ke liye **Neurology Specialist** se consult karna sabse safe rehta hai.\n\n" +
          "• **Dr. Kavita Verma (DM Neurology)** migraine management aur nerve disorders me specialist hain.",
        sources: [{ title: "Neurology Care Guidelines", section: "Headache Management", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: "doc-8",
          doctorName: "Dr. Kavita Verma",
          specialization: "Neurology Specialist",
          qualifications: "MBBS, DM (Neurology)",
          consultationFee: 1300,
          triageLevel: "URGENT",
          reason: "Comprehensive evaluation for Migraine & Head pain.",
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
      text.includes("fatigue")
    ) {
      return delay({
        answer:
          "🩺 **AI Specialist Match**: **Senior General Physician**\n\n" +
          "Aapki general health evaluation, routine checkups, aur initial medical guidance ke liye **Dr. Rajesh Sharma (Senior Physician)** ya **Dr. Rakesh Dakar** sabse ideal doctor hain.\n\n" +
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
          "Sinus issues, ear discomfort, hearing problems, ya throat infection ke liye **Dr. Rahul Nair (ENT Specialist)** se consult karein.",
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
          "Chest discomfort, breathlessness, ya dizziness ke liye **Dr. Vikram Shetty (Cardiology Specialist)** ya **Dr. Rakesh Dakar** se consult karein.\n\n" +
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
          "• *'I need a General Physician for routine checkup'*\n" +
          "• *'Analyze my blood test report'* (ya 📎 Paperclip button se file attach karein!)",
        sources: [],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
      });
    }

    // Default Smart Dynamic Conversational Response (Never refusals!)
    return delay({
      answer:
        `💬 **Medi AI Health Assistant Response**:\n\n` +
        `Aapne poocha: "${message}"\n\n` +
        "Main aapki query ke basis par hamare Senior **General Physician (Dr. Rajesh Sharma)** ya **Demo Doctor (Dr. Rakesh Dakar)** ko consult karne ki recommendation deta hoon. Voh aapki complete medical history lekar correct clinical evaluation karenge.",
      sources: [{ title: "General Clinical Care Guidelines", section: "Primary Patient Consultation", evidenceStrength: "MODERATE" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      doctorMatch: {
        doctorId: DEMO_DOCTOR_ID,
        doctorName: "Dr. Rakesh Dakar",
        specialization: "General Medicine & Primary Care",
        qualifications: "MBBS, MD",
        consultationFee: 500,
        triageLevel: "ROUTINE",
        reason: "General Consultation for your health query.",
      },
    });
  },
};

const httpAssistantService: AssistantService = {
  async chat(message) {
    const { data } = await apiClient.post<AssistantReply>("/assistant/chat", { message });
    return data;
  },
};

export const assistantService: AssistantService = USE_MOCK_API
  ? mockAssistantService
  : httpAssistantService;
