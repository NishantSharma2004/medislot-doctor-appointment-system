import { apiClient } from "@/lib/api/client";
import { mockDoctors } from "@/lib/api/mock-data";
import type { AssistantReply, DoctorMatchInfo } from "@/lib/api/types";
import { USE_MOCK_API, createMockRateLimiter, delay } from "./config";
import { doctorService } from "./doctor.service";

/**
 * Durrmi Mental Health & Therapy Assistant Service.
 *
 * Backend endpoint: POST /api/v1/assistant/chat
 * Multi-LLM provider architecture: Groq (Primary) -> Gemini (Fallback) -> OpenAI (Emergency)
 */
export const ASSISTANT_DISCLAIMER =
  "Durrmi Companion provides emotional support, therapy navigation, and platform information. It does not provide medical diagnosis or crisis treatment.";

export interface AssistantChatOptions {
  topic?: string;
  budgetTier?: "under_1000" | "1000_to_2000" | "above_2000" | "any";
}

export interface AssistantService {
  chat(message: string, options?: AssistantChatOptions): Promise<AssistantReply>;
}

const assistantLimiter = createMockRateLimiter(10, 30_000);

// ============================================================================
// 1. ZERO-TOKEN GUARDRAILS (<5ms)
// ============================================================================

/** Check 1: Crisis & Emergency Detection */
function checkCrisis(messageText: string): AssistantReply | null {
  const text = messageText.toLowerCase();
  const crisisWords = [
    "suicide", "kill myself", "end my life", "harm myself", "want to die", 
    "cut myself", "take my life", "atmaghatya", "jaan de dunga", "marne ka mann"
  ];

  if (crisisWords.some((w) => text.includes(w))) {
    return {
      answer:
        "🚨 **Please reach out for immediate support. You do not have to carry this alone.**\n\n" +
        "If you or someone you know is in distress or feeling hopeless, please contact these 24/7 free, confidential national helplines right now:\n\n" +
        "• **Tele-MANAS (Govt of India)**: Dial **14416** or **1800-891-4416** (24x7 Free)\n" +
        "• **KIRAN Helpline**: Dial **1800-599-0019**\n" +
        "• **Vandrevala Foundation**: **+91 9999 666 555**\n\n" +
        "Our AI and therapists care deeply about your safety. Please reach out to these emergency services or a trusted loved one immediately.",
      sources: [{ title: "National Emergency Helpline Directory", section: "Crisis Intervention", evidenceStrength: "STRONG" }],
      sufficientEvidence: true,
      disclaimer: "If you are in immediate danger, please visit the nearest hospital emergency room.",
      suggestedQuestions: [
        "How can I talk to someone right now?",
        "What is Tele-MANAS helpline?",
        "Can a therapist help me feel better?",
      ],
      isSecurityBlocked: true,
    };
  }
  return null;
}

/** Check 2: Technology Stack & API Confidentiality Guardrail */
function checkSecurityAndTechLeak(messageText: string): AssistantReply | null {
  const text = messageText.toLowerCase();
  const techKeywords = [
    "what api", "which api", "konsi api", "koun si api", "what model", "which llm", 
    "are you chatgpt", "are you gpt", "are you grok", "are you gemini", "system prompt",
    "prompt injection", "source code", "tech stack", "backend technology", "which tech"
  ];

  if (techKeywords.some((w) => text.includes(w))) {
    return {
      answer:
        "🔒 **Confidentiality Notice**\n\n" +
        "Durrmi platform policies and proprietary technology architecture are confidential and not publicly disclosed.\n\n" +
        "I am here solely as your **Durrmi AI Assistant** to provide empathetic support, answer questions about mental wellbeing, and guide you to our licensed therapists.",
      sources: [{ title: "Durrmi Platform Terms", section: "Security & Confidentiality", evidenceStrength: "STRONG" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      suggestedQuestions: [
        "How do I find the right therapist?",
        "What clinical areas does Durrmi support?",
        "How does a 1-on-1 session work?",
      ],
      isSecurityBlocked: true,
    };
  }
  return null;
}

/** Check 3: Out-of-Scope (Zero-Token Saver) */
function checkOutOfScope(messageText: string): AssistantReply | null {
  const text = messageText.toLowerCase();

  // 1. Technical, Programming & Coding Keywords
  const techKeywords = [
    "code", "coding", "program", "programming", "programmer", "c++", "cpp", "java",
    "python", "javascript", "typescript", "html", "css", "react", "angular", "vue",
    "sql", "database", "git", "github", "compiler", "terminal", "algorithm", "hello world",
    "function", "loop", "variable", "class", "syntax", "debug", "api key", "frontend", "backend"
  ];

  // 2. Non-Mental Health General Trivia (Sports, Cooking, Finance, Politics)
  const triviaKeywords = [
    "recipe", "how to cook", "cook", "cooking", "biryani", "khana banana", "dish",
    "cricket", "football", "ipl", "match score", "who won", "world cup", "sports",
    "stock market", "share market", "trading", "crypto", "bitcoin", "nifty", "sensex",
    "politics", "election", "bjp", "congress", "modi", "minister", "prime minister",
    "math homework", "solve equation", "physics problem", "chemistry formula", "algebra",
    "weather in", "temperature in", "movie review", "song lyrics"
  ];

  const allOutOfScope = [...techKeywords, ...triviaKeywords];

  const matched = allOutOfScope.some((kw) => {
    if (kw.length <= 4) {
      const regex = new RegExp(`(^|\\s|[^a-zA-Z0-9])${kw.replace("+", "\\+")}($|\\s|[^a-zA-Z0-9])`, "i");
      return regex.test(text);
    }
    return text.includes(kw);
  });

  if (matched) {
    return {
      answer:
        "🌿 **Durrmi Mental Health Focus**\n\n" +
        "Main Durrmi ka emotional wellbeing aur mental health companion hoon. Main coding, technical questions, recipes, sports ya non-health queries solve nahi kar sakta.\n\n" +
        "Agar aap **stress, anxiety, burnout, relationships, neend**, ya **licensed therapist consultation** ke baare mein baat karna chahte hain, toh main aapki poori help karunga.",
      sources: [{ title: "Durrmi Scope Guidelines", section: "Clinical Scope", evidenceStrength: "LIMITED" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      suggestedQuestions: [
        "🌿 How to manage anxiety & overthinking?",
        "💼 Work stress ko manage karne ke quick tips",
        "👩‍⚕️ How much does a therapy consultation cost?",
      ],
      isOutOfScope: true,
    };
  }
  return null;
}

// ============================================================================
// 2. RAG POLICY & PLATFORM RULES ENGINE
// ============================================================================

function checkDurrmiPolicyRAG(messageText: string): AssistantReply | null {
  const text = messageText.toLowerCase();

  // A. Cancellation & Refund Policy
  if (text.includes("cancel") || text.includes("refund") || text.includes("paise wapas") || text.includes("cancellation policy")) {
    return {
      answer:
        "📋 **Durrmi Cancellation & Refund Policy**\n\n" +
        "Hum samajhte hain ki life mein unexpected situations aa sakti hain. Isliye Durrmi ka cancellation process transparent aur easy hai:\n\n" +
        "• **24+ Ghante Pehle (Full Refund)**: Agar aap scheduled session se 24 ghante pehle cancel karte hain, toh **100% full refund** aapke original payment method par 5-7 working days mein credit ho jata hai.\n" +
        "• **12 se 24 Ghante ke Beech (Free Reschedule)**: Aap bina kisi penalty ke apna slot kisi aur time par reschedule kar sakte hain ya 50% session credit prapt kar sakte hain.\n" +
        "• **12 Ghante ke Andar**: Therapist ka time reserved hone ki wajah se refund applicable nahi hota, par emergency hone par hamari support team se baat kar sakte hain.",
      sources: [{ title: "Durrmi Booking & Cancellation Terms", section: "Refund Protocol 4.2", evidenceStrength: "STRONG" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      suggestedQuestions: [
        "Appointment reschedule kaise karein?",
        "Session kitne minute ka hota hai?",
        "Support team se kaise contact karein?",
      ],
    };
  }

  // B. Pricing & Consultation Packages
  if (text.includes("package") || text.includes("pricing") || text.includes("kitne paise") || text.includes("cost") || text.includes("fees")) {
    return {
      answer:
        "💳 **Durrmi Consultation Pricing & Packages**\n\n" +
        "Durrmi par har kisi ke budget aur requirement ke mutabiq certified mental health specialists available hain:\n\n" +
        "• **Budget-Friendly Care**: Starts from **₹600 – ₹999 / session** (Ideal for students & youth)\n" +
        "• **Experienced Clinical Psychologists**: **₹1,000 – ₹1,800 / session** (1-on-1 deep therapy)\n" +
        "• **Couple & Family Therapy**: **₹1,800 – ₹2,500 / session**\n\n" +
        "Har session **45 se 50 minutes** ka 1-on-1 private video ya audio consultation hota hai.",
      sources: [{ title: "Durrmi Pricing Transparency", section: "Consultation Fee Schedule", evidenceStrength: "STRONG" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      suggestedQuestions: [
        "Under ₹1,000 ke therapists dikhao",
        "Online session kaise hota hai?",
        "Kya pehla session free hota hai?",
      ],
    };
  }

  // C. Confidentiality & Privacy
  if (text.includes("confidential") || text.includes("privacy") || text.includes("safe") || text.includes("secret") || text.includes("data")) {
    return {
      answer:
        "🛡️ **100% Confidential & Secure**\n\n" +
        "Durrmi par aapki personal baatein aur session details poori tarah confidential hoti hain:\n\n" +
        "• **End-to-End Encryption**: Video aur audio sessions secure channels par conduct hote hain.\n" +
        "• **Strict Privacy**: Aapki conversation kisi third party ya employer ke sath share nahi ki jaati.\n" +
        "• **DPDP Act Compliant**: Hum Indian Data Protection standards ka strict compliance follow karte hain.",
      sources: [{ title: "Durrmi Privacy Policy", section: "Client Confidentiality", evidenceStrength: "STRONG" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      suggestedQuestions: [
        "Kya mujhe real name batana zaroori hai?",
        "Doctor se session kaise book karein?",
        "Durrmi ka founder kaun hai?",
      ],
    };
  }

  return null;
}

// ============================================================================
// 3. MENTAL HEALTH TRIAGE & THERAPIST MATCHING (14 Clinical Areas)
// ============================================================================

interface SpecialtyMapping {
  specialty: string;
  empatheticReflection: string;
  suggestedQuestions: string[];
  defaultDoctorMatch: DoctorMatchInfo;
}

const SPECIALTY_REGISTRY: Record<string, SpecialtyMapping> = {
  "Stress & Burnout": {
    specialty: "Stress & Burnout",
    empatheticReflection:
      "Kaam aur life ka burden lagataar bana rahe toh yeh hamari energy aur peace dono ko drain kar deta hai. Durrmi mein hum mante hain ki aapko is load ko akele carry karne ki zaroorat nahi hai. Yeh bilkul valid hai ki aap thaka hua feel kar rahe hain.",
    suggestedQuestions: [
      "Work stress ko manage karne ke 3 quick tips kya hain?",
      "Kya burnout se meri physical health par asar pad raha hai?",
      "Mujhe kab ek stress coach se baat karni chahiye?",
    ],
    defaultDoctorMatch: {
      doctorId: "doc-stress-01",
      doctorName: "Dr. Aakash Mehra",
      specialization: "Stress & Burnout Specialist",
      qualifications: "M.Sc Clinical Psychology • CBT Certified",
      consultationFee: 799,
      triageLevel: "ROUTINE",
      reason: "Specialized in workplace stress, executive burnout, and work-life balance.",
    },
  },
  Anxiety: {
    specialty: "Anxiety",
    empatheticReflection:
      "Overthinking aur bechaini ka continuously chalna bohot exhausting hota hai. Aisa lagna ki kuch galat hone wala hai, ek natural nervous system response hai. Durrmi par hum bina kisi judgment ke aapke sath walk karte hain.",
    suggestedQuestions: [
      "Overthinking ko turant control kaise karein?",
      "Panic feeling aane par 5-4-3-2-1 technique kya hai?",
      "Kya anxiety ko bina dawa ke therapy se theek kiya ja sakta hai?",
    ],
    defaultDoctorMatch: {
      doctorId: "doc-anxiety-01",
      doctorName: "Dr. Sneha Roy",
      specialization: "Anxiety & Panic Specialist",
      qualifications: "M.Phil Clinical Psychology • 8+ Yrs Exp",
      consultationFee: 899,
      triageLevel: "ROUTINE",
      reason: "Expert in Generalized Anxiety Disorder (GAD), panic episodes, and overthinking.",
    },
  },
  Relationships: {
    specialty: "Relationships",
    empatheticReflection:
      "Relationships hamari zindagi ka sabse sensitive hissa hote hain. Misunderstandings ya emotional distance se guzarne par bohot akelapan aur hurt feel hota hai. Yahan aap bina dare apni feelings express kar sakte hain.",
    suggestedQuestions: [
      "Partner ke sath boundary kaise set karein?",
      "Breakup ke baad emotional recovery kaise karein?",
      "Couple counseling session kaise conduct hota hai?",
    ],
    defaultDoctorMatch: {
      doctorId: "doc-rel-01",
      doctorName: "Dr. Ritu Verma",
      specialization: "Relationship & Couple Therapist",
      qualifications: "MA Psychology • Certified Gottman Method",
      consultationFee: 1200,
      triageLevel: "ROUTINE",
      reason: "Specialized in couple conflict resolution, communication, and emotional healing.",
    },
  },
  Sleep: {
    specialty: "Sleep",
    empatheticReflection:
      "Jab dimaag shant na ho toh neend aana mushkil ho jata hai, aur agla pura din thaka hua gujarta hai. Insomnia aksar unexpressed stress ya anxiety ka reflection hota hai.",
    suggestedQuestions: [
      "Raat ko jaldi sojane ke sleep hygiene rules kya hain?",
      "CBT-I (Insomnia therapy) kaise kaam karti hai?",
      "Kya screen time meri neend rok raha hai?",
    ],
    defaultDoctorMatch: {
      doctorId: "doc-sleep-01",
      doctorName: "Dr. Vikram Sethi",
      specialization: "Sleep & Circadian Wellness Coach",
      qualifications: "MBBS • Behavioral Sleep Medicine",
      consultationFee: 950,
      triageLevel: "ROUTINE",
      reason: "Expert in chronic insomnia, sleep anxiety, and relaxation protocols.",
    },
  },
  "Depression and low mood": {
    specialty: "Depression and low mood",
    empatheticReflection:
      "Aisa feel hona ki kisi cheez mein dil nahi lag raha ya andar se sab empty hai, sach mein bohot heavy hota hai. At Durrmi, we don't believe in fixing you — because you are not broken. We believe in presence.",
    suggestedQuestions: [
      "Jab kuch karne ka mann na ho toh choti shuruat kaise karein?",
      "Sadness aur clinical depression mein kya farq hai?",
      "Therapist se 1-on-1 baat karne se kaise help milti hai?",
    ],
    defaultDoctorMatch: {
      doctorId: "doc-dep-01",
      doctorName: "Dr. Priya Nair",
      specialization: "Depression and low mood",
      qualifications: "M.Phil Psychology • ACT & Mindfulness",
      consultationFee: 850,
      triageLevel: "ROUTINE",
      reason: "Specialized in mood stabilization, low self-esteem, and gentle emotional recovery.",
    },
  },
  Career: {
    specialty: "Career",
    empatheticReflection:
      "Career choices, future uncertainty aur expectations ka pressure dimaag par bohot heavy padta hai. Clarity na hona normal hai, aur is par step-by-step kaam kiya ja sakta hai.",
    suggestedQuestions: [
      "Career confusion mein right decision kaise lein?",
      "Imposter syndrome se kaise deal karein?",
      "Career mindset coach se kaise connect karein?",
    ],
    defaultDoctorMatch: {
      doctorId: "doc-career-01",
      doctorName: "Dr. Rohan Kapoor",
      specialization: "Career & Mindset Coach",
      qualifications: "Certified Career Counselor • ICF Coach",
      consultationFee: 800,
      triageLevel: "ROUTINE",
      reason: "Helping professionals and students navigate career pivots and workplace anxiety.",
    },
  },
};

function detectSpecialty(text: string, optionsTopic?: string): SpecialtyMapping | null {
  const lower = text.toLowerCase();
  
  if (optionsTopic && SPECIALTY_REGISTRY[optionsTopic]) {
    return SPECIALTY_REGISTRY[optionsTopic];
  }

  if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("neend") || lower.includes("awake") || lower.includes("so nahi")) {
    return SPECIALTY_REGISTRY["Sleep"];
  }
  if (lower.includes("relationship") || lower.includes("breakup") || lower.includes("partner") || lower.includes("divorce") || lower.includes("couple") || lower.includes("shaadi") || lower.includes("pyaar")) {
    return SPECIALTY_REGISTRY["Relationships"];
  }
  if (lower.includes("depress") || lower.includes("sad") || lower.includes("empty") || lower.includes("hopeless") || lower.includes("udaas") || lower.includes("cry") || lower.includes("rona") || lower.includes("alone") || lower.includes("lonel") || lower.includes("akela")) {
    return SPECIALTY_REGISTRY["Depression and low mood"];
  }
  if (lower.includes("career") || lower.includes("job") || lower.includes("future") || lower.includes("college") || lower.includes("interview") || lower.includes("workplace") || lower.includes("office")) {
    return SPECIALTY_REGISTRY["Career"];
  }
  if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("panic") || lower.includes("overthink") || lower.includes("ghabrahat") || lower.includes("darr") || lower.includes("nervous")) {
    return SPECIALTY_REGISTRY["Anxiety"];
  }
  if (lower.includes("stress") || lower.includes("burnout") || lower.includes("exhaust") || lower.includes("tired") || lower.includes("thaka") || lower.includes("pressure") || lower.includes("burden") || lower.includes("tension")) {
    return SPECIALTY_REGISTRY["Stress & Burnout"];
  }

  // General emotional greeting or therapy intent
  const isMentalHealthOrGreeting = [
    "feel", "feeling", "mental", "health", "mind", "mood", "help", "hello", "hi", "hey",
    "namaste", "durrmi", "therapist", "counselor", "doctor", "consult", "talk", "session", "wellness"
  ].some((kw) => lower.includes(kw));

  if (isMentalHealthOrGreeting) {
    return SPECIALTY_REGISTRY["Stress & Burnout"];
  }

  return null;
}

// ============================================================================
// 4. CLIENT GROUNDING FALLBACK ENGINE
// ============================================================================

async function generateDurrmiAssistantReply(message: string, options?: AssistantChatOptions): Promise<AssistantReply> {
  const text = message.trim();

  // 1. Crisis Check
  const crisis = checkCrisis(text);
  if (crisis) return crisis;

  // 2. Security / Tech Stack Leak Check
  const security = checkSecurityAndTechLeak(text);
  if (security) return security;

  // 3. Out-of-Scope Token Saver
  const outOfScope = checkOutOfScope(text);
  if (outOfScope) return outOfScope;

  // 4. RAG Policy Check
  const policy = checkDurrmiPolicyRAG(text);
  if (policy) return policy;

  // 5. Mental Health Conversational Triage
  const mapping = detectSpecialty(text, options?.topic);

  if (!mapping) {
    return {
      answer:
        "🌿 **Durrmi Mental Health Focus**\n\n" +
        "Main Durrmi ka emotional wellbeing aur mental health companion hoon. Main general non-health topics ya unrelated queries solve nahi kar sakta.\n\n" +
        "Aap mujhse **stress, anxiety, relationships, sleep, burnout, low mood**, ya **licensed therapist consultation** ke baare mein baat kar sakte hain.",
      sources: [{ title: "Durrmi Scope Guidelines", section: "Clinical Scope", evidenceStrength: "LIMITED" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      suggestedQuestions: [
        "🌿 How to manage anxiety & overthinking?",
        "💼 Work stress ko manage karne ke quick tips",
        "👩‍⚕️ How much does a therapy consultation cost?",
      ],
      isOutOfScope: true,
    };
  }

  const lower = text.toLowerCase();

  // Check if user specifically requested consultation or therapist
  const userWantsTherapist =
    lower.includes("therapist") ||
    lower.includes("counselor") ||
    lower.includes("consult") ||
    lower.includes("doctor") ||
    lower.includes("book") ||
    lower.includes("appointment") ||
    lower.includes("fees") ||
    lower.includes("price") ||
    lower.includes("talk to someone");

  let answerText = `${mapping.empatheticReflection}\n\n`;

  if (userWantsTherapist) {
    answerText +=
      `Aapke requirement aur **${mapping.specialty}** concern ke liye Durrmi par hamare certified counselors available hain. ` +
      `Aap bina kisi delay ke unke sath private 1-on-1 session schedule kar sakte hain:`;
  } else {
    answerText +=
      `Kya aap is baare mein thoda aur share karna chahenge, ya aap kisi certified therapist se 1-on-1 consultation ke options explore karna chahte hain?`;
  }

  // Doctor Matching
  let matchedDoctor = mapping.defaultDoctorMatch;

  // Attempt real doctor lookup from backend/mock store
  try {
    const realDocs = await doctorService.searchDoctors({
      specialization: mapping.specialty,
      maxFee: options?.budgetTier === "under_1000" ? 1000 : options?.budgetTier === "1000_to_2000" ? 2000 : undefined,
      size: 1,
    });
    if (realDocs.content && realDocs.content.length > 0) {
      const doc = realDocs.content[0];
      matchedDoctor = {
        doctorId: doc.id,
        doctorName: doc.fullName,
        specialization: doc.specialization,
        qualifications: doc.qualifications,
        consultationFee: doc.consultationFee,
        triageLevel: "ROUTINE",
        reason: `Verified specialist for ${mapping.specialty} & emotional wellbeing.`,
      };
    }
  } catch {
    // Fallback to registry doctor
  }

  return {
    answer: answerText,
    sources: [{ title: "Durrmi Clinical Framework", section: mapping.specialty, evidenceStrength: "STRONG" }],
    sufficientEvidence: true,
    disclaimer: ASSISTANT_DISCLAIMER,
    suggestedQuestions: mapping.suggestedQuestions,
    matchedSpecialty: mapping.specialty,
    doctorMatch: userWantsTherapist ? matchedDoctor : undefined,
  };
}

// ============================================================================
// 5. SERVICE EXPORT (HTTP + Resilient Fallback)
// ============================================================================

const httpAssistantService: AssistantService = {
  async chat(message, options) {
    // Fast-path client guardrails (saves backend requests)
    const crisis = checkCrisis(message);
    if (crisis) return crisis;
    const security = checkSecurityAndTechLeak(message);
    if (security) return security;
    const outOfScope = checkOutOfScope(message);
    if (outOfScope) return outOfScope;

    try {
      const { data } = await apiClient.post<AssistantReply>("/assistant/chat", {
        message,
        topic: options?.topic,
        budgetTier: options?.budgetTier,
      });
      return data;
    } catch {
      // Seamless resilient fallback to client grounding engine
      return generateDurrmiAssistantReply(message, options);
    }
  },
};

const mockAssistantService: AssistantService = {
  async chat(message, options) {
    await delay(350); // Fast realistic response (~350ms)
    return generateDurrmiAssistantReply(message, options);
  },
};

export const assistantService = USE_MOCK_API ? mockAssistantService : httpAssistantService;
