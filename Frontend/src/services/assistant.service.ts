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

    // 1. AI Lab Report & Medical Terminology Translator Mode (File Upload OR Report Keyword)
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
          `📄 **AI Lab Report & Medical Analysis (${fileName || "Patient Medical Record"})**:\n\n` +
          "Our AI engine analyzed your blood test parameters and translated complex medical terminology into simple English & Hindi.\n\n" +
          "• **Key Finding**: Fasting Blood Sugar / HbA1c is **8.2%** (Elevated above 5.6% normal range).\n" +
          "• **Plain-English Meaning**: Your blood sugar levels indicate mild diabetes / hyperglycemia. No panic needed, but medical supervision is required.",
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

    // 2. AI Symptom Checker & Specialist Auto Match
    if (text.includes("chest") || text.includes("heart") || text.includes("dizziness") || text.includes("breath")) {
      return delay({
        answer:
          "🩺 **AI Symptom Checker Triage**: **Cardiology & Heart Specialist**\n\n" +
          "Based on your reported symptoms (*Chest discomfort / Dizziness*), our AI triage engine recommends consulting a **Cardiology Specialist**.\n\n" +
          "⚠️ *Severity Alert*: If you experience severe radiating chest pain to arm/jaw or acute breathlessness, please visit the nearest ER immediately.",
        sources: [{ title: "Cardiology Clinical Triage Protocol", section: "Symptom Checker", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: DEMO_DOCTOR_ID,
          doctorName: "Dr. Rakesh Dakar",
          specialization: "Cardiology & General Medicine",
          qualifications: "MBBS, MD (Cardiology)",
          consultationFee: 500,
          triageLevel: text.includes("severe") ? "EMERGENCY" : "URGENT",
          reason: "Symptoms indicate chest pain & dizziness — evaluation required.",
        },
      });
    }

    if (text.includes("fever") || text.includes("cough") || text.includes("cold") || text.includes("headache") || text.includes("pain")) {
      return delay({
        answer:
          "🩺 **AI Symptom Checker Triage**: **General Medicine**\n\n" +
          "Based on your symptoms (*Fever / Body Pain / Cold*), our AI triage engine recommends a consultation with a **General Medicine Specialist**.\n\n" +
          "• Stay hydrated, monitor temperature every 4 hours, and rest adequately.",
        sources: [{ title: "General Practice Guidelines", section: "Fever Management", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        doctorMatch: {
          doctorId: DEMO_DOCTOR_ID,
          doctorName: "Dr. Rakesh Dakar",
          specialization: "General Medicine",
          qualifications: "MBBS, MD",
          consultationFee: 500,
          triageLevel: "ROUTINE",
          reason: "Fever & general malaise consultation.",
        },
      });
    }

    const match = mockKnowledgeBase.find((doc) =>
      doc.keywords.some((keyword) => text.includes(keyword)),
    );

    if (!match) {
      return delay({
        answer:
          "I could not find this in the clinic's verified documents, so I would rather not guess. You can ask about symptoms (e.g. chest pain, fever), uploading lab reports, clinic timings, or choosing a doctor.",
        sources: [],
        sufficientEvidence: false,
        disclaimer: ASSISTANT_DISCLAIMER,
      });
    }

    return delay({
      answer: match.answer,
      sources: [
        { title: match.title, section: match.section, evidenceStrength: match.evidenceStrength },
      ],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
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
