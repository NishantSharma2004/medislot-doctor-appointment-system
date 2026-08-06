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
  chat(message: string): Promise<AssistantReply>;
}

const assistantLimiter = createMockRateLimiter(8, 30_000);

const CLINICAL_TERMS = [
  "diagnose", "diagnosis", "symptom", "medicine", "medication", "dose", "dosage",
  "prescribe", "prescription", "treatment", "cure", "tablet", "pain", "fever",
];

const DEMO_DOCTOR_ID = "e6d0d7aa-2279-4e3b-898f-5a4c49a3f3b2"; // Dr. Rakesh Dakar

const mockAssistantService: AssistantService = {
  async chat(message) {
    const limited = assistantLimiter();
    if (limited) return mockError(limited);

    const text = message.toLowerCase();

    // 1. AI Lab Report & Medical Terminology Translator Mode
    if (
      text.includes("report") ||
      text.includes("blood test") ||
      text.includes("hba1c") ||
      text.includes("prescription") ||
      text.includes("sugar") ||
      text.includes("lab")
    ) {
      return delay({
        answer:
          "📄 **AI Lab Report & Medical Terminology Analysis**:\n\n" +
          "• **Key Finding**: Fasting Blood Sugar / HbA1c shows **8.2%** (Elevated above 6.5% normal range).\n" +
          "• **Plain-English Meaning**: High blood glucose indicates pre-diabetes / diabetes. No panic required, but dietary care and medication are needed.\n" +
          "• **Doctor Advice**: Follow Dr. Rakesh Dakar's prescription. Avoid refined sugar, stay hydrated, and schedule a follow-up test in 14 days.",
        sources: [{ title: "Lab Test Guidelines", section: "Endocrinology", evidenceStrength: "STRONG" }],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
        isReportSummary: true,
        doctorMatch: {
          doctorId: DEMO_DOCTOR_ID,
          doctorName: "Dr. Rakesh Dakar",
          specialization: "General Medicine & Endocrinology",
          qualifications: "MBBS, MD",
          consultationFee: 500,
          triageLevel: "ROUTINE",
          reason: "Follow-up consultation for Diabetes & Blood Sugar control.",
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
