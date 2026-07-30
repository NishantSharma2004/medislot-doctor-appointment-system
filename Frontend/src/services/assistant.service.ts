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

const mockAssistantService: AssistantService = {
  async chat(message) {
    const limited = assistantLimiter();
    if (limited) return mockError(limited);

    const text = message.toLowerCase();

    if (CLINICAL_TERMS.some((term) => text.includes(term))) {
      return delay({
        answer:
          "I am not able to interpret symptoms, suggest a diagnosis or recommend medicines. Please book an appointment so a doctor can review your case. If this is urgent, contact the clinic or your local emergency service.",
        sources: [],
        sufficientEvidence: true,
        disclaimer: ASSISTANT_DISCLAIMER,
      });
    }

    const match = mockKnowledgeBase.find((doc) =>
      doc.keywords.some((keyword) => text.includes(keyword)),
    );

    if (!match) {
      return delay({
        answer:
          "I could not find this in the clinic's verified documents, so I would rather not guess. You can ask about booking, rescheduling, cancellation, clinic timings or choosing a specialization.",
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
