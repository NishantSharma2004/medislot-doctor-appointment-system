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

/**
 * Language Detection Helper:
 * Default is FALSE (English). Only returns TRUE if the user explicitly writes in
 * Devanagari script, uses common Hindi/Hinglish words, or asks for Hindi/Hinglish.
 */
export function isHindiOrHinglish(text: string): boolean {
  if (!text) return false;

  // 1. Devanagari script presence
  if (/[\u0900-\u097F]/.test(text)) return true;

  const lower = text.toLowerCase();

  // 2. Explicit style requests
  if (
    lower.includes("hinglish") ||
    lower.includes("whatsapp style") ||
    lower.includes("hindi me") ||
    lower.includes("hindi mai") ||
    lower.includes("hindi mein")
  ) {
    return true;
  }

  // 3. Common Romanized Hindi/Hinglish words
  const hindiWords = [
    "hai", "hain", "kya", "kyu", "kyun", "kaise", "kaisi", "kaisa", "kese",
    "mujhe", "mera", "meri", "mere", "tumhara", "apna", "apni", "apne",
    "aap", "aapka", "aapki", "aapke", "hota", "hoti", "hote", "raha", "rahi", "rahe",
    "chahiye", "nahi", "nahin", "batao", "bataiye", "karna", "karein", "kare",
    "thoda", "thodi", "bohot", "bohut", "darr", "neend", "bechaini", "paise", "wapas",
    "bhai", "shukriya", "dhanyawad", "madad", "gaya", "gayi", "gaye", "aaya", "aayi", "aaye",
    "accha", "achha", "sahi", "galat", "kuch", "zaroorat", "samajh"
  ];

  const words = lower.split(/[^a-zA-Z0-9]+/);
  return hindiWords.some((marker) => words.includes(marker));
}

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
function checkSecurityAndTechLeak(messageText: string, isHindi = false): AssistantReply | null {
  const text = messageText.toLowerCase();
  const techKeywords = [
    "what api", "which api", "konsi api", "koun si api", "what model", "which llm", 
    "are you chatgpt", "are you gpt", "are you grok", "are you gemini", "system prompt",
    "prompt injection", "source code", "tech stack", "backend technology", "which tech"
  ];

  if (techKeywords.some((w) => text.includes(w))) {
    const answer = isHindi
      ? "🔒 **Confidentiality Notice**\n\nDurrmi platform policies aur proprietary technology architecture confidential hain.\n\nMain yahan sirf aapka **Durrmi AI Assistant** hoon taaki aapki emotional wellbeing aur licensed therapist consultation mein madad kar sakun."
      : "🔒 **Confidentiality Notice**\n\nDurrmi platform policies and proprietary technology architecture are confidential and not publicly disclosed.\n\nI am here solely as your **Durrmi AI Assistant** to provide empathetic support, answer questions about mental wellbeing, and guide you to our licensed therapists.";

    const suggestedQuestions = isHindi
      ? [
          "Right therapist kaise choose karein?",
          "Durrmi kaunse clinical areas support karta hai?",
          "1-on-1 session kaise kaam karta hai?",
        ]
      : [
          "How do I find the right therapist?",
          "What clinical areas does Durrmi support?",
          "How does a 1-on-1 session work?",
        ];

    return {
      answer,
      sources: [{ title: "Durrmi Platform Terms", section: "Security & Confidentiality", evidenceStrength: "STRONG" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      suggestedQuestions,
      isSecurityBlocked: true,
    };
  }
  return null;
}

/** Check 3: Out-of-Scope (Zero-Token Saver) */
function checkOutOfScope(messageText: string, isHindi = false): AssistantReply | null {
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
    const answer = isHindi
      ? "🌿 **Durrmi Mental Health Focus**\n\n" +
        "Main Durrmi ka emotional wellbeing aur mental health companion hoon. Main coding, technical questions, recipes, sports ya non-health queries solve nahi kar sakta.\n\n" +
        "Agar aap **stress, anxiety, burnout, relationships, neend**, ya **licensed therapist consultation** ke baare mein baat karna chahte hain, toh main aapki poori help karunga."
      : "🌿 **Durrmi Mental Health Focus**\n\n" +
        "I am Durrmi's emotional wellbeing and mental health companion. I am unable to assist with coding, programming, recipes, sports, or general non-health topics.\n\n" +
        "I am here to support you with **stress, anxiety, burnout, relationships, sleep, low mood**, or connecting with a **licensed therapist**.";

    const suggestedQuestions = isHindi
      ? [
          "🌿 How to manage anxiety & overthinking?",
          "💼 Work stress ko manage karne ke quick tips",
          "👩‍⚕️ How much does a therapy consultation cost?",
        ]
      : [
          "🌿 How to manage anxiety & overthinking?",
          "💼 3 quick tips to manage work stress",
          "👩‍⚕️ How much does a therapy consultation cost?",
        ];

    return {
      answer,
      sources: [{ title: "Durrmi Scope Guidelines", section: "Clinical Scope", evidenceStrength: "LIMITED" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      suggestedQuestions,
      isOutOfScope: true,
    };
  }
  return null;
}

// ============================================================================
// 2. RAG POLICY & PLATFORM RULES ENGINE
// ============================================================================

function checkDurrmiPolicyRAG(messageText: string, isHindi = false): AssistantReply | null {
  const text = messageText.toLowerCase();

  // A. Cancellation & Refund Policy
  if (text.includes("cancel") || text.includes("refund") || text.includes("paise wapas") || text.includes("cancellation policy")) {
    const answer = isHindi
      ? "📋 **Durrmi Cancellation & Refund Policy**\n\n" +
        "Hum samajhte hain ki life mein unexpected situations aa sakti hain. Isliye Durrmi ka cancellation process transparent aur easy hai:\n\n" +
        "• **24+ Ghante Pehle (Full Refund)**: Agar aap scheduled session se 24 ghante pehle cancel karte hain, toh **100% full refund** aapke original payment method par 5-7 working days mein credit ho jata hai.\n" +
        "• **12 se 24 Ghante ke Beech (Free Reschedule)**: Aap bina kisi penalty ke apna slot kisi aur time par reschedule kar sakte hain ya 50% session credit prapt kar sakte hain.\n" +
        "• **12 Ghante ke Andar**: Therapist ka time reserved hone ki wajah se refund applicable nahi hota, par emergency hone par hamari support team se baat kar sakte hain."
      : "📋 **Durrmi Cancellation & Refund Policy**\n\n" +
        "We understand that unexpected events arise. Durrmi provides a transparent and compassionate cancellation policy:\n\n" +
        "• **24+ Hours Before Session (100% Full Refund)**: If you cancel at least 24 hours prior to your scheduled slot, a **100% full refund** is issued to your original payment method within 5–7 business days.\n" +
        "• **Between 12 to 24 Hours (Free Reschedule)**: You can reschedule your appointment at no penalty or receive a 50% session credit.\n" +
        "• **Within 12 Hours**: As the therapist's time has been reserved, cancellations within 12 hours are non-refundable. For urgent emergencies, please contact our support team.";

    const suggestedQuestions = isHindi
      ? [
          "Appointment reschedule kaise karein?",
          "Session kitne minute ka hota hai?",
          "Support team se kaise contact karein?",
        ]
      : [
          "How do I reschedule an appointment?",
          "How long is a therapy session?",
          "How do I contact the support team?",
        ];

    return {
      answer,
      sources: [{ title: "Durrmi Booking & Cancellation Terms", section: "Refund Protocol 4.2", evidenceStrength: "STRONG" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      suggestedQuestions,
    };
  }

  // B. Pricing & Consultation Packages
  if (text.includes("package") || text.includes("pricing") || text.includes("kitne paise") || text.includes("cost") || text.includes("fees")) {
    const answer = isHindi
      ? "💳 **Durrmi Consultation Pricing & Packages**\n\n" +
        "Durrmi par har kisi ke budget aur requirement ke mutabiq certified mental health specialists available hain:\n\n" +
        "• **Budget-Friendly Care**: Starts from **₹600 – ₹999 / session** (Ideal for students & youth)\n" +
        "• **Experienced Clinical Psychologists**: **₹1,000 – ₹1,800 / session** (1-on-1 deep therapy)\n" +
        "• **Couple & Family Therapy**: **₹1,800 – ₹2,500 / session**\n\n" +
        "Har session **45 se 50 minutes** ka 1-on-1 private video ya audio consultation hota hai."
      : "💳 **Durrmi Consultation Pricing & Packages**\n\n" +
        "Durrmi provides accessible, verified mental health consultations tailored to your personal goals and budget:\n\n" +
        "• **Budget-Friendly Care**: Starts from **₹600 – ₹999 / session** (Ideal for students & young adults)\n" +
        "• **Experienced Clinical Psychologists**: **₹1,000 – ₹1,800 / session** (1-on-1 in-depth therapy)\n" +
        "• **Couples & Family Therapy**: **₹1,800 – ₹2,500 / session**\n\n" +
        "Every session is a **45 to 50-minute** private, 1-on-1 video or audio consultation with a verified specialist.";

    const suggestedQuestions = isHindi
      ? [
          "Under ₹1,000 ke therapists dikhao",
          "Online session kaise hota hai?",
          "Kya pehla session free hota hai?",
        ]
      : [
          "Show therapists under ₹1,000",
          "How does an online therapy session work?",
          "How many sessions are recommended?",
        ];

    return {
      answer,
      sources: [{ title: "Durrmi Pricing Transparency", section: "Consultation Fee Schedule", evidenceStrength: "STRONG" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      suggestedQuestions,
    };
  }

  // C. Confidentiality & Privacy
  if (text.includes("confidential") || text.includes("privacy") || text.includes("safe") || text.includes("secret") || text.includes("data")) {
    const answer = isHindi
      ? "🛡️ **100% Confidential & Secure**\n\n" +
        "Durrmi par aapki personal baatein aur session details poori tarah confidential hoti hain:\n\n" +
        "• **End-to-End Encryption**: Video aur audio sessions secure channels par conduct hote hain.\n" +
        "• **Strict Privacy**: Aapki conversation kisi third party ya employer ke sath share nahi ki jaati.\n" +
        "• **DPDP Act Compliant**: Hum Indian Data Protection standards ka strict compliance follow karte hain."
      : "🛡️ **100% Confidential & Secure**\n\n" +
        "Your privacy and emotional safety are our highest priorities at Durrmi:\n\n" +
        "• **End-to-End Encryption**: Video and audio sessions are conducted over secure, encrypted channels.\n" +
        "• **Strict Confidentiality**: Your conversations and records are never shared with employers, family, or third parties.\n" +
        "• **DPDP Act Compliant**: We strictly comply with India's Digital Personal Data Protection standards.";

    const suggestedQuestions = isHindi
      ? [
          "Kya mujhe real name batana zaroori hai?",
          "Doctor se session kaise book karein?",
          "Durrmi ka founder kaun hai?",
        ]
      : [
          "Do I need to share my real name?",
          "How do I book a private session?",
          "How is my medical data protected?",
        ];

    return {
      answer,
      sources: [{ title: "Durrmi Privacy Policy", section: "Client Confidentiality", evidenceStrength: "STRONG" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      suggestedQuestions,
    };
  }

  return null;
}

// ============================================================================
// 3. MENTAL HEALTH TRIAGE & THERAPIST MATCHING (14 Clinical Areas)
// ============================================================================

interface LocalizedReflection {
  empatheticReflection: string;
  suggestedQuestions: string[];
}

interface SpecialtyMapping {
  specialty: string;
  en: LocalizedReflection;
  hi: LocalizedReflection;
  defaultDoctorMatch: DoctorMatchInfo;
}

const SPECIALTY_REGISTRY: Record<string, SpecialtyMapping> = {
  "Stress & Burnout": {
    specialty: "Stress & Burnout",
    en: {
      empatheticReflection:
        "Carrying the continuous weight of work and life responsibilities drains both energy and mental peace. At Durrmi, we believe you don't have to carry this load alone. Feeling exhausted or overwhelmed is completely valid.",
      suggestedQuestions: [
        "What are 3 quick techniques to decompress from work stress?",
        "How do I know if I'm experiencing burnout or depression?",
        "When should I consider consulting a stress coach?",
      ],
    },
    hi: {
      empatheticReflection:
        "Kaam aur life ka burden lagataar bana rahe toh yeh hamari energy aur peace dono ko drain kar deta hai. Durrmi mein hum mante hain ki aapko is load ko akele carry karne ki zaroorat nahi hai. Yeh bilkul valid hai ki aap thaka hua feel kar rahe hain.",
      suggestedQuestions: [
        "Work stress ko manage karne ke 3 quick tips kya hain?",
        "Kya burnout se meri physical health par asar pad raha hai?",
        "Mujhe kab ek stress coach se baat karni chahiye?",
      ],
    },
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
    en: {
      empatheticReflection:
        "Experiencing persistent worry, racing thoughts, or a constant feeling of apprehension can be exhausting. Feeling as though something might go wrong is a natural autonomic nervous system response to stress. At Durrmi, we walk beside you with empathy and zero judgment.",
      suggestedQuestions: [
        "How can I stop overthinking in the moment?",
        "What is the 5-4-3-2-1 grounding technique for panic?",
        "Can anxiety be treated effectively without medication?",
      ],
    },
    hi: {
      empatheticReflection:
        "Overthinking aur bechaini ka continuously chalna bohot exhausting hota hai. Aisa lagna ki kuch galat hone wala hai, ek natural nervous system response hai. Durrmi par hum bina kisi judgment ke aapke sath walk karte hain.",
      suggestedQuestions: [
        "Overthinking ko turant control kaise karein?",
        "Panic feeling aane par 5-4-3-2-1 technique kya hai?",
        "Kya anxiety ko bina dawa ke therapy se theek kiya ja sakta hai?",
      ],
    },
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
    en: {
      empatheticReflection:
        "Relationships are central to our emotional wellbeing. Navigating misunderstandings, emotional distance, or heartbreak can feel deeply painful and isolating. This is a safe space to unpack what you are feeling without fear of judgment.",
      suggestedQuestions: [
        "How do I set healthy emotional boundaries with a partner?",
        "How to heal emotionally after a painful breakup?",
        "What happens during a couples counseling session?",
      ],
    },
    hi: {
      empatheticReflection:
        "Relationships hamari zindagi ka sabse sensitive hissa hote hain. Misunderstandings ya emotional distance se guzarne par bohot akelapan aur hurt feel hota hai. Yahan aap bina dare apni feelings express kar sakte hain.",
      suggestedQuestions: [
        "Partner ke sath boundary kaise set karein?",
        "Breakup ke baad emotional recovery kaise karein?",
        "Couple counseling session kaise conduct hota hai?",
      ],
    },
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
    en: {
      empatheticReflection:
        "When the mind is active and tense, falling asleep can feel impossible, leaving you drained the next day. Sleep difficulties and insomnia are frequently tied to underlying stress, overthinking, or nervous system hyperarousal.",
      suggestedQuestions: [
        "What are the core sleep hygiene rules for falling asleep faster?",
        "How does Cognitive Behavioral Therapy for Insomnia (CBT-I) work?",
        "Is evening screen time disrupting my sleep cycle?",
      ],
    },
    hi: {
      empatheticReflection:
        "Jab dimaag shant na ho toh neend aana mushkil ho jata hai, aur agla pura din thaka hua gujarta hai. Insomnia aksar unexpressed stress ya anxiety ka reflection hota hai.",
      suggestedQuestions: [
        "Raat ko jaldi sojane ke sleep hygiene rules kya hain?",
        "CBT-I (Insomnia therapy) kaise kaam karti hai?",
        "Kya screen time meri neend rok raha hai?",
      ],
    },
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
    en: {
      empatheticReflection:
        "Feeling persistent sadness, emptiness, or a loss of interest in things you once enjoyed can feel immensely heavy. At Durrmi, we don't believe in 'fixing' you — because you are not broken. We believe in presence and gentle, non-judgmental support.",
      suggestedQuestions: [
        "How can I take small steps when I have zero motivation?",
        "What is the difference between sadness and clinical depression?",
        "How does talking to a therapist help with low mood?",
      ],
    },
    hi: {
      empatheticReflection:
        "Aisa feel hona ki kisi cheez mein dil nahi lag raha ya andar se sab empty hai, sach mein bohot heavy hota hai. At Durrmi, we don't believe in fixing you — because you are not broken. We believe in presence.",
      suggestedQuestions: [
        "Jab kuch karne ka mann na ho toh choti shuruat kaise karein?",
        "Sadness aur clinical depression mein kya farq hai?",
        "Therapist se 1-on-1 baat karne se kaise help milti hai?",
      ],
    },
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
    en: {
      empatheticReflection:
        "Career choices, future uncertainty, and expectations put enormous pressure on our mental wellbeing. Lacking clarity is completely normal, and finding direction happens one manageable step at a time.",
      suggestedQuestions: [
        "How can I make clear decisions when feeling career confusion?",
        "How do I overcome imposter syndrome and workplace anxiety?",
        "How does a consultation with a career mindset coach work?",
      ],
    },
    hi: {
      empatheticReflection:
        "Career choices, future uncertainty aur expectations ka pressure dimaag par bohot heavy padta hai. Clarity na hona normal hai, aur is par step-by-step kaam kiya ja sakta hai.",
      suggestedQuestions: [
        "Career confusion mein right decision kaise lein?",
        "Imposter syndrome se kaise deal karein?",
        "Career mindset coach se kaise connect karein?",
      ],
    },
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
  ADHD: {
    specialty: "ADHD",
    en: {
      empatheticReflection:
        "Struggling with attention, feeling easily distracted, or dealing with executive dysfunction can feel frustrating when the world expects linear focus. Your brain simply processes stimuli differently, and with the right strategies, you can thrive.",
      suggestedQuestions: [
        "What are effective coping strategies for adult ADHD?",
        "How do I know if I have ADHD or just high stress?",
        "How can an ADHD specialist help me build routines?",
      ],
    },
    hi: {
      empatheticReflection:
        "Attention maintain karna ya easily distract ho jana frustrating ho sakta hai. Aapka dimaag alag tarike se process karta hai, aur right guidance se aap apne focus ko effectively channel kar sakte hain.",
      suggestedQuestions: [
        "ADHD aur stress-induced distraction mein kya farq hai?",
        "Focus improve karne ke daily hacks kya hain?",
        "ADHD assessment test kaise conduct hota hai?",
      ],
    },
    defaultDoctorMatch: {
      doctorId: "doc-adhd-01",
      doctorName: "Dr. Shalini Gupta",
      specialization: "ADHD & Neurodevelopmental Specialist",
      qualifications: "MD Psychiatry • Behavioral Therapy",
      consultationFee: 1100,
      triageLevel: "ROUTINE",
      reason: "Expertise in adult ADHD, executive functioning coaching, and neurodivergence.",
    },
  },
  Loneliness: {
    specialty: "Loneliness",
    en: {
      empatheticReflection:
        "Feeling lonely even when surrounded by people is a deeply human and painful experience. It is not a sign of weakness — it is a signal of a fundamental human need for meaningful emotional connection.",
      suggestedQuestions: [
        "How can I cope with deep feelings of isolation?",
        "Why do I feel lonely even around friends and family?",
        "How does therapy help in building meaningful connections?",
      ],
    },
    hi: {
      empatheticReflection:
        "Sabke beech rehkar bhi akelapan mehsoos hona bohot dardnak hota hai. Yeh kamzori nahi hai — yeh ek reminder hai ki humein genuine emotional bonding ki zaroorat hai.",
      suggestedQuestions: [
        "Akelapan kam karne ke healthy tarike kya hain?",
        "Bheed mein bhi lonely feel kyu hota hai?",
        "Therapist se baat karne se akelapan kaise door hota hai?",
      ],
    },
    defaultDoctorMatch: {
      doctorId: "doc-lonely-01",
      doctorName: "Dr. Tanya Sen",
      specialization: "Counseling Psychologist",
      qualifications: "M.Sc Counseling Psychology • 6+ Yrs Exp",
      consultationFee: 750,
      triageLevel: "ROUTINE",
      reason: "Focus on social connection, emotional attachment, and personal grounding.",
    },
  },
};

function detectSpecialty(text: string, optionsTopic?: string): SpecialtyMapping | null {
  const lower = text.toLowerCase();
  
  if (optionsTopic && SPECIALTY_REGISTRY[optionsTopic]) {
    return SPECIALTY_REGISTRY[optionsTopic];
  }

  if (lower.includes("adhd") || lower.includes("attention") || lower.includes("focus") || lower.includes("hyperactiv") || lower.includes("distract")) {
    return SPECIALTY_REGISTRY["ADHD"];
  }
  if (lower.includes("lonel") || lower.includes("alone") || lower.includes("akela") || lower.includes("isolat")) {
    return SPECIALTY_REGISTRY["Loneliness"];
  }
  if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("neend") || lower.includes("awake") || lower.includes("so nahi")) {
    return SPECIALTY_REGISTRY["Sleep"];
  }
  if (lower.includes("relationship") || lower.includes("breakup") || lower.includes("partner") || lower.includes("divorce") || lower.includes("couple") || lower.includes("shaadi") || lower.includes("pyaar")) {
    return SPECIALTY_REGISTRY["Relationships"];
  }
  if (lower.includes("depress") || lower.includes("sad") || lower.includes("empty") || lower.includes("hopeless") || lower.includes("udaas") || lower.includes("cry") || lower.includes("rona")) {
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
  const isHindi = isHindiOrHinglish(text);

  // 1. Crisis Check
  const crisis = checkCrisis(text);
  if (crisis) return crisis;

  // 2. Security / Tech Stack Leak Check
  const security = checkSecurityAndTechLeak(text, isHindi);
  if (security) return security;

  // 3. Out-of-Scope Token Saver
  const outOfScope = checkOutOfScope(text, isHindi);
  if (outOfScope) return outOfScope;

  // 4. RAG Policy Check
  const policy = checkDurrmiPolicyRAG(text, isHindi);
  if (policy) return policy;

  // 5. Mental Health Conversational Triage
  const mapping = detectSpecialty(text, options?.topic);

  if (!mapping) {
    const answer = isHindi
      ? "🌿 **Durrmi Mental Health Focus**\n\n" +
        "Main Durrmi ka emotional wellbeing aur mental health companion hoon. Main general non-health topics ya unrelated queries solve nahi kar sakta.\n\n" +
        "Aap mujhse **stress, anxiety, relationships, sleep, burnout, low mood**, ya **licensed therapist consultation** ke baare mein baat kar sakte hain."
      : "🌿 **Durrmi Mental Health Focus**\n\n" +
        "I am Durrmi's emotional wellbeing and mental health companion. I am unable to assist with non-health topics or unrelated questions.\n\n" +
        "I am here to support you with **stress, anxiety, relationships, sleep, burnout, low mood**, or connecting with a **licensed therapist**.";

    const suggestedQuestions = isHindi
      ? [
          "🌿 How to manage anxiety & overthinking?",
          "💼 Work stress ko manage karne ke quick tips",
          "👩‍⚕️ How much does a therapy consultation cost?",
        ]
      : [
          "🌿 How to manage anxiety & overthinking?",
          "💼 3 quick tips to manage work stress",
          "👩‍⚕️ How much does a therapy consultation cost?",
        ];

    return {
      answer,
      sources: [{ title: "Durrmi Scope Guidelines", section: "Clinical Scope", evidenceStrength: "LIMITED" }],
      sufficientEvidence: true,
      disclaimer: ASSISTANT_DISCLAIMER,
      suggestedQuestions,
      isOutOfScope: true,
    };
  }

  const content = isHindi ? mapping.hi : mapping.en;
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

  let answerText = `${content.empatheticReflection}\n\n`;

  if (userWantsTherapist) {
    answerText += isHindi
      ? `Aapke **${mapping.specialty}** concern ke liye Durrmi par hamare certified counselors available hain. ` +
        `Aap bina kisi delay ke unke sath private 1-on-1 session schedule kar sakte hain:`
      : `For your concerns with **${mapping.specialty}**, we have verified clinical specialists available at Durrmi. ` +
        `You can schedule a private 1-on-1 consultation directly below:`;
  } else {
    answerText += isHindi
      ? `Kya aap is baare mein thoda aur share karna chahenge, ya aap kisi certified therapist se 1-on-1 consultation ke options explore karna chahte hain?`
      : `Would you like to share a little more about what you're experiencing, or would you like to explore 1-on-1 consultation options with a certified therapist?`;
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
    suggestedQuestions: content.suggestedQuestions,
    matchedSpecialty: mapping.specialty,
    doctorMatch: userWantsTherapist ? matchedDoctor : undefined,
  };
}

// ============================================================================
// 5. SERVICE EXPORT (HTTP + Resilient Fallback)
// ============================================================================

const httpAssistantService: AssistantService = {
  async chat(message, options) {
    const isHindi = isHindiOrHinglish(message);
    // Fast-path client guardrails (saves backend requests)
    const crisis = checkCrisis(message);
    if (crisis) return crisis;
    const security = checkSecurityAndTechLeak(message, isHindi);
    if (security) return security;
    const outOfScope = checkOutOfScope(message, isHindi);
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
