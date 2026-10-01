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

// ============================================================================
// 3.5. CLINICAL Q&A KNOWLEDGE BASE (Specific Clinical Questions)
// ============================================================================

interface ClinicalQA {
  keywords: string[];
  specialty: string;
  en: {
    answer: string;
    suggestedQuestions: string[];
  };
  hi: {
    answer: string;
    suggestedQuestions: string[];
  };
}

const CLINICAL_QA_REGISTRY: ClinicalQA[] = [
  // 1. CBT-I
  {
    keywords: ["cbt-i", "cbt i", "insomnia therapy", "cognitive behavioral therapy for insomnia", "how does cognitive behavioral therapy"],
    specialty: "Sleep",
    en: {
      answer:
        "🧠 **Cognitive Behavioral Therapy for Insomnia (CBT-I)**\n\n" +
        "CBT-I is the gold-standard, evidence-based first-line clinical treatment for chronic sleep problems — without medication dependence.\n\n" +
        "It restores natural sleep architecture through 5 clinical pillars:\n\n" +
        "1. **Stimulus Control**: Re-associating your bed strictly with deep sleep. If you don't fall asleep within 20 minutes, leave the bed to avoid training your brain into anticipatory anxiety.\n" +
        "2. **Sleep Restriction**: Temporarily anchoring time in bed to actual sleep duration to rebuild biological sleep pressure (adenosine accumulation).\n" +
        "3. **Cognitive Restructuring**: Deconstructing catastrophic sleep anxiety (*\"If I don't sleep 8 hours tonight, my day will be ruined\"*).\n" +
        "4. **Circadian Optimization**: Aligning room temperature (18°C–20°C), darkness, and morning sunlight exposure.\n" +
        "5. **Autogenic Relaxation**: Downregulating sympathetic nervous system hyperarousal through somatic breathing.\n\n" +
        "Clinical trials show CBT-I produces sustained recovery in 70–80% of individuals within 4 to 8 sessions.",
      suggestedQuestions: [
        "What are the core sleep hygiene rules for falling asleep faster?",
        "Is evening screen time disrupting my sleep cycle?",
        "How do I consult a CBT-I sleep specialist?",
      ],
    },
    hi: {
      answer:
        "🧠 **Cognitive Behavioral Therapy for Insomnia (CBT-I)**\n\n" +
        "CBT-I bina kisi neend ki goli ke chronic insomnia ko theek karne ka sabse certified clinical tarika hai:\n\n" +
        "1. **Stimulus Control**: Bed ko sirf neend ke sath link karna. 20 minute tak neend na aane par bed se uth jana taaki dimaag me bed = tension na bane.\n" +
        "2. **Sleep Restriction**: Bed par bitae jane wale time ko actual sleep time se match karna taaki natural sleep pressure bane.\n" +
        "3. **Cognitive Restructuring**: Dimaag ke neend se jude dar aur negative thoughts ko reframe karna.\n" +
        "4. **Relaxation Protocols**: Autonomic nervous system ko shaant karne ke somatic techniques.\n\n" +
        "Clinical research ke mutabiq CBT-I 4 se 8 sessions me 80% logon ki neend ko naturally restore kar deta hai.",
      suggestedQuestions: [
        "Raat ko jaldi sojane ke sleep hygiene rules kya hain?",
        "Kya screen time meri neend rok raha hai?",
        "Sleep specialist se session kaise book karein?",
      ],
    },
  },

  // 2. Sleep Hygiene
  {
    keywords: ["sleep hygiene", "rules for falling asleep", "rules kya hain", "fall asleep faster", "jaldi sojane ke sleep hygiene"],
    specialty: "Sleep",
    en: {
      answer:
        "🌙 **Core Evidence-Based Sleep Hygiene Rules**\n\n" +
        "To synchronize your circadian pacemaker and trigger natural melatonin synthesis, practice these 5 core rules:\n\n" +
        "1. **Anchor Wake-Up Time**: Wake up at the exact same time every morning (including weekends). This anchors your circadian clock.\n" +
        "2. **Morning Sunlight Exposure**: Get 10–15 minutes of outdoor sunlight within 30 minutes of waking. This sets an internal timer for melatonin release 14–16 hours later.\n" +
        "3. **Digital Sunset (60 Min Before Bed)**: Artificial blue wavelengths suppress melatonin production by up to 50%. Keep screens outside the bedroom.\n" +
        "4. **10-Hour Caffeine Curfew**: Because caffeine's chemical half-life is 5 to 7 hours, avoid coffee, tea, and caffeinated sodas after 12:00 PM–1:00 PM.\n" +
        "5. **Cool Bedroom Temperature**: The human body must drop its core temperature by ~1°C to initiate sleep. Keep the bedroom around 18°C–20°C (65°F–68°F).",
      suggestedQuestions: [
        "How does Cognitive Behavioral Therapy for Insomnia (CBT-I) work?",
        "Is evening screen time disrupting my sleep cycle?",
        "How do I consult a sleep wellness coach?",
      ],
    },
    hi: {
      answer:
        "🌙 **Sleep Hygiene Ke 5 Zaroori Niyam**\n\n" +
        "1. **Fixed Uthne Ka Time**: Roz subah ek hi time par uthein (weekends par bhi), taaki body clock reset ho sake.\n" +
        "2. **Subah Ki Dhoop**: Uthne ke 30 minute ke andar 10-15 minute sunlight lein. Yeh raat ko melatonin release ko trigger karta hai.\n" +
        "3. **Sone se 1 Ghante Pehle No Screen**: Mobile/Laptop ki blue light melatonin ko 50% tak daba deti hai.\n" +
        "4. **Caffeine Curfew**: Dopahar 1 baje ke baad chai, coffee ya energy drinks na lein.\n" +
        "5. **Room Ka Temperature Thanda Rakhein**: Sone ke liye body temperature halka drop hona zaroori hota hai (around 19-21°C).",
      suggestedQuestions: [
        "CBT-I (Insomnia therapy) kaise kaam karti hai?",
        "Kya screen time meri neend rok raha hai?",
        "Under ₹1,000 ke sleep therapists dikhao",
      ],
    },
  },

  // 3. Screen Time
  {
    keywords: ["screen time", "blue light", "screen meri neend", "disrupting my sleep cycle"],
    specialty: "Sleep",
    en: {
      answer:
        "📱 **How Evening Screen Time Disrupts Your Sleep Cycle**\n\n" +
        "Screens sabotage sleep through two distinct neurological mechanisms:\n\n" +
        "• **Circadian Suppression**: Short-wavelength blue light stimulates retinal ganglion cells, signaling the suprachiasmatic nucleus that it is daylight. This delays your melatonin surge by 1.5 to 2 hours.\n" +
        "• **Dopaminergic Hyperarousal**: Infinite feeds, alerts, and video reels flood the prefrontal cortex with dopamine and cortisol, locking your brain into high-frequency beta waves when it needs to transition into theta/delta waves.\n" +
        "• **Sleep Fragmentation**: Late screen exposure reduces restorative REM sleep and deep slow-wave physical recovery sleep.\n\n" +
        "*Clinical protocol*: Institute a 45–60 minute wind-down routine with dim warm lighting, physical reading, or guided audio.",
      suggestedQuestions: [
        "What are the core sleep hygiene rules for falling asleep faster?",
        "How does Cognitive Behavioral Therapy for Insomnia (CBT-I) work?",
        "How do I consult a sleep specialist?",
      ],
    },
    hi: {
      answer:
        "📱 **Screen Time Kaise Neend Ko Kharab Karta Hai?**\n\n" +
        "• **Melatonin Hormones Ka Rukna**: Mobile ki blue light dimaag ko signal deti hai ki abhi din hai, jisse neend ka hormone (melatonin) 2 ghante tak delay ho jata hai.\n" +
        "• **Dopamine & Brain Alertness**: Reels aur notifications dimaag ko active rakhte hain, jisse nervous system rest mode me nahi ja pata.\n" +
        "• **Deep Sleep Ki Kami**: Screen dekhkar sone se neend baar-baar khulti hai aur subah thakan rehti hai.",
      suggestedQuestions: [
        "Raat ko jaldi sojane ke sleep hygiene rules kya hain?",
        "CBT-I (Insomnia therapy) kaise kaam karti hai?",
        "Sleep specialist se session kaise book karein?",
      ],
    },
  },

  // 4. 5-4-3-2-1 Technique
  {
    keywords: ["5-4-3-2-1", "54321", "grounding technique", "panic feeling"],
    specialty: "Anxiety",
    en: {
      answer:
        "⚡ **The 5-4-3-2-1 Somatic Grounding Technique for Panic & Acute Anxiety**\n\n" +
        "When panic activates the amygdala, this protocol re-engages your prefrontal cortex with physical sensory reality:\n\n" +
        "• **5 Things You Can SEE**: Look around and name 5 specific visual details (e.g., wall texture, pen color, shoe lace, door frame, cloud shape).\n" +
        "• **4 Things You Can TOUCH**: Feel 4 distinct tactile surfaces (e.g., fabric of your clothes, cold edge of a table, smooth phone back, soles of your feet).\n" +
        "• **3 Things You Can HEAR**: Tune into 3 subtle ambient sounds (e.g., fan hum, distant vehicles, your own breathing).\n" +
        "• **2 Things You Can SMELL**: Notice 2 scents (e.g., soap fragrance, coffee aroma, fresh breeze).\n" +
        "• **1 Thing You Can TASTE**: Focus on 1 taste in your mouth (e.g., mint, water, or the inside of your cheek).\n\n" +
        "Pair each step with slow diaphragmatic breaths (4s inhale, 6s exhale) to activate your vagal brake.",
      suggestedQuestions: [
        "How can I stop overthinking in the moment?",
        "Can anxiety be treated effectively without medication?",
        "How do I connect with an anxiety therapist?",
      ],
    },
    hi: {
      answer:
        "⚡ **Panic & Anxiety Ke Liye 5-4-3-2-1 Grounding Technique**\n\n" +
        "Jab ghabrahat ya panic badh jaye, toh apne dimaag ko reality me wapas laane ke liye yeh follow karein:\n\n" +
        "• **5 cheezein dekhein**: Aas-paas 5 specific cheezein notice karein.\n" +
        "• **4 cheezein touch karein**: Apne kapde, table ka kona, ya cold glass ko mehsoos karein.\n" +
        "• **3 aawazein sunein**: Fan ki aawaz, bahar ki gaadiyan, ya apni saans.\n" +
        "• **2 cheezein smell karein**: Coffee, soap ya taazi hawa.\n" +
        "• **1 cheez taste karein**: Paani ka ghoont ya mint.\n\n" +
        "Iske sath lambi saans (4 sec andar, 6 sec bahar) lein taaki dil ki dhadkan turant normal ho sake.",
      suggestedQuestions: [
        "Overthinking ko turant control kaise karein?",
        "Kya anxiety ko bina dawa ke therapy se theek kiya ja sakta hai?",
        "Anxiety specialist se baat kaise karein?",
      ],
    },
  },

  // 5. Stop Overthinking
  {
    keywords: ["stop overthinking", "overthinking in the moment", "control overthinking", "overthinking ko turant"],
    specialty: "Anxiety",
    en: {
      answer:
        "🌀 **3 Clinical Protocols to Halt Overthinking in the Moment**\n\n" +
        "Overthinking is a cognitive rumination loop. Here is how to interrupt the spiral:\n\n" +
        "1. **The Worry Postponement Window**: Tell your brain: *\"I acknowledge this thought, but I will only process it during my designated 15-minute Worry Window (e.g., 5:30 PM to 5:45 PM today).\"* Over 70% of worries lose their urgency when postponed.\n" +
        "2. **Cognitive Defusion (ACT Framework)**: Instead of adopting the thought *\"Everything is going to fall apart\"*, reframe it to: *\"I am noticing that my brain is generating the thought that everything will fall apart.\"* This creates cognitive distance.\n" +
        "3. **Mammalian Dive Reflex Reset**: Splash ice-cold water onto your eyes and cheekbones for 20 seconds. This physically slows heart rate and breaks mental rumination loops instantly.",
      suggestedQuestions: [
        "What is the 5-4-3-2-1 grounding technique for panic?",
        "Can anxiety be treated effectively without medication?",
        "How does a clinical psychologist help stop overthinking?",
      ],
    },
    hi: {
      answer:
        "🌀 **Overthinking Ko Turant Rokne Ke 3 Clinical Tarike**\n\n" +
        "1. **Worry Postponement Window**: Dimaag ko bolein: *\"Main is sawal par sirf shaam 5:30 baje 15 minute sochunga.\"* 70% tension tab tak apne aap khatam ho jati hai.\n" +
        "2. **Cognitive Defusion**: *\"Sab kharab hone wala hai\"* sochne ke bajaye kahein *\"Mera dimaag abhi ek negative thought generate kar raha hai, yeh reality nahi hai.\"*\n" +
        "3. **Thande Paani Ka Splash**: Chehre par thanda paani splash karein. Yeh dive reflex trigger karta hai jisse heartbeat aur overthinking dono control hote hain.",
      suggestedQuestions: [
        "Panic feeling aane par 5-4-3-2-1 technique kya hai?",
        "Kya anxiety ko bina dawa ke therapy se theek kiya ja sakta hai?",
        "Under ₹1,000 ke anxiety therapists dikhao",
      ],
    },
  },

  // 6. Medication vs Therapy
  {
    keywords: ["without medication", "bina dawa", "therapy se theek", "treated effectively without medication"],
    specialty: "Anxiety",
    en: {
      answer:
        "🌿 **Can Anxiety Be Treated Effectively Without Medication?**\n\n" +
        "**Yes, absolutely.** For mild to moderate anxiety (and even many presentations of severe anxiety), psychotherapy is the first-line, gold-standard clinical recommendation worldwide.\n\n" +
        "• **Cognitive Behavioral Therapy (CBT)**: Identifies cognitive distortions (catastrophizing, mind-reading) and retrains how you interpret ambiguous situations.\n" +
        "• **Exposure & Response Prevention (ERP)**: Gradually desensitizes your nervous system so fear triggers permanently lose their panic potency.\n" +
        "• **Somatic & Vagal Regulation**: Retrains your autonomic nervous system to release chronic tension without chemical dependence.\n\n" +
        "*When is medication used?* In severe cases where acute panic impairs daily survival, medication can temporarily stabilize brain chemistry while therapy teaches lifelong coping tools. A licensed clinical psychologist at Durrmi provides ethical, non-pharmacological care.",
      suggestedQuestions: [
        "What is the 5-4-3-2-1 grounding technique for panic?",
        "How can I stop overthinking in the moment?",
        "How do I book a private consultation with an anxiety specialist?",
      ],
    },
    hi: {
      answer:
        "🌿 **Kya Anxiety Bina Dawa Ke Therapy Se Theek Ho Sakti Hai?**\n\n" +
        "**Haan, bilkul.** Worldwide clinical research prove karta hai ki anxiety ka sabse permanent ilaj Psychotherapy hai:\n\n" +
        "• **CBT (Cognitive Behavioral Therapy)**: Yeh aapko darr aur negative thoughts ko identify aur badalna sikhata hai.\n" +
        "• **Exposure Therapy**: Dimaag ke darr ko step-by-step normal banata hai taaki panic na aaye.\n" +
        "• **Vagus Nerve Relaxation**: Sharir ki bechaini ko naturally calm down karta hai.\n\n" +
        "Dawa aksar temporary relief deti hai, jabki therapy aapko life-long tools deti hai taaki anxiety dobara na laute.",
      suggestedQuestions: [
        "Overthinking ko turant control kaise karein?",
        "Panic feeling aane par 5-4-3-2-1 technique kya hai?",
        "Anxiety doctor se consultation kaise book karein?",
      ],
    },
  },

  // 7. Work Stress 3 Tips
  {
    keywords: ["quick techniques to decompress", "decompress from work stress", "3 quick tips", "work stress ko manage"],
    specialty: "Stress & Burnout",
    en: {
      answer:
        "💼 **3 Rapid Protocols to Decompress from Work Stress**\n\n" +
        "1. **The Physiological Sigh (Stanford Huberman Lab)**: Take two consecutive deep inhales through your nose (one deep, followed immediately by a quick sharp top-off), then a long, slow exhale through your mouth. Doing this 3 times rapidly drops heart rate and dumps acute cortisol.\n" +
        "2. **The 20-20-20 Micro-Reset**: Every 20 minutes of intense screen concentration, focus your eyes on an object 20 feet away for 20 seconds. This releases optic nerve strain that triggers mental exhaustion.\n" +
        "3. **End-of-Day Transition Ritual**: At the end of the day, write down open work tasks on a physical pad, close your laptop completely, and change out of work clothes to signal to your nervous system that the demand cycle is closed.",
      suggestedQuestions: [
        "How do I know if I'm experiencing burnout or depression?",
        "When should I consider consulting a stress coach?",
        "How does a consultation with a stress & burnout specialist work?",
      ],
    },
    hi: {
      answer:
        "💼 **Workplace Stress Se Turant Rahat Paane Ke 3 Tarike**\n\n" +
        "1. **Physiological Sigh**: Naak se 2 baar saans andar lein (ek lambi, turant ek choti), aur muh se dheere-dheere bahar nikalein. 3 baar karne se stress hormone turant drop hota hai.\n" +
        "2. **20-20-20 Rule**: Har 20 minute me 20 second ke liye 20 feet door dekhein taaki dimaag aur aankhon ki thakan door ho.\n" +
        "3. **Work-to-Home Boundary**: Kaam khatam hone par laptop band karein aur kapde change karein taaki dimaag ko pata chale ki kaam ka pressure khatam ho gaya.",
      suggestedQuestions: [
        "Kya burnout se meri physical health par asar pad raha hai?",
        "Mujhe kab ek stress coach se baat karni chahiye?",
        "Under ₹1,000 ke stress coaches dikhao",
      ],
    },
  },

  // 8. Burnout vs Depression
  {
    keywords: ["burnout or depression", "burnout se meri physical health", "burnout se physical", "burnout symptoms"],
    specialty: "Stress & Burnout",
    en: {
      answer:
        "⚖️ **Differentiating Workplace Burnout vs. Clinical Depression**\n\n" +
        "While burnout and depression share fatigue and brain fog, clinicians distinguish them by domain:\n\n" +
        "• **Burnout is Domain-Specific**: It is driven by chronic workplace workload or interpersonal exhaustion. When you disconnect completely from work (during vacations or restful weekends), your joy and engagement begin to recover.\n" +
        "• **Depression is Pervasive**: It colors every area of existence — personal relationships, passions, food, and sleep. You experience *anhedonia* (inability to feel pleasure) regardless of context.\n" +
        "• **Physical Health Impact**: Unmanaged burnout causes chronic cortisol elevation, leading to gut dysbiosis (IBS), tension headaches, frequent colds, and morning exhaustion.",
      suggestedQuestions: [
        "What are 3 quick techniques to decompress from work stress?",
        "When should I consider consulting a stress coach?",
        "Can therapy help me recover without leaving my job?",
      ],
    },
    hi: {
      answer:
        "⚖️ **Burnout Aur Depression Mein Farq**\n\n" +
        "• **Burnout Sirf Kaam Se Juda Hota Hai**: Kaam aur office pressure ki wajah se thakan hoti hai, lekin chutti ya weekend par mood halka improve hota hai.\n" +
        "• **Depression Har Jagah Rehta Hai**: Chahe aap chutti par ho ya doston ke sath, andar se empty aur udaas mehsoos hota hai.\n" +
        "• **Sharirik Asar**: Lagataar burnout se acidity, sar dard, BP aur neend ki kami jaisi bimariyan ho sakti hain.",
      suggestedQuestions: [
        "Work stress ko manage karne ke 3 quick tips kya hain?",
        "Mujhe kab ek stress coach se baat karni chahiye?",
        "Stress management therapist se kaise connect karein?",
      ],
    },
  },

  // 9. When to Consult Stress Coach
  {
    keywords: ["stress coach", "kab ek stress coach", "when should i consider consulting a stress coach"],
    specialty: "Stress & Burnout",
    en: {
      answer:
        "🎯 **When Should You Consider Consulting a Stress Coach or Therapist?**\n\n" +
        "Consider booking a 1-on-1 consultation if you experience any of these 4 clinical indicators:\n\n" +
        "1. **Persistent Morning Dread**: You wake up feeling intense anxiety or exhaustion before your workday has even begun.\n" +
        "2. **Emotional Cynicism**: You find yourself unusually irritable with loved ones or detached from work that once mattered to you.\n" +
        "3. **Cognitive Paralysis**: Simple decisions feel overwhelming, causing severe procrastination or executive fatigue.\n" +
        "4. **Physical Symptoms**: Stress is causing gastrointestinal issues, chronic muscle tightness, or insomnia for more than 2 weeks.\n\n" +
        "Early professional support prevents acute burnout from transitioning into chronic depressive illness.",
      suggestedQuestions: [
        "Show verified stress specialists under my budget",
        "How does a 1-on-1 consultation work?",
        "What are 3 quick techniques to decompress from work stress?",
      ],
    },
    hi: {
      answer:
        "🎯 **Aapko Stress Coach Se Kab Baat Karni Chahiye?**\n\n" +
        "1. Agar roz subah uthte hi office/work ke darr se bechaini hoti hai.\n" +
        "2. Agar choti-choti baaton par gussa ya chidchidapan aa raha hai.\n" +
        "3. Agar 2 hafte se zyada se lagataar thakan aur neend ki kami hai.\n" +
        "4. Agar kaam me focus aur decision lene me mushkil aa rahi hai.\n\n" +
        "Durrmi ke verified stress coaches ke sath 1-on-1 baat karke aap burnout ko rok sakte hain.",
      suggestedQuestions: [
        "Under ₹1,000 ke stress coaches dikhao",
        "Work stress ko manage karne ke 3 quick tips kya hain?",
        "Kya pehla session confidential hota hai?",
      ],
    },
  },

  // 10. Boundaries in Relationships
  {
    keywords: ["boundary", "boundaries", "boundary kaise set karein", "healthy emotional boundaries"],
    specialty: "Relationships",
    en: {
      answer:
        "🌱 **How to Set Healthy Emotional Boundaries with a Partner**\n\n" +
        "Setting boundaries is not about building walls — it is about clarifying where you end and another person begins so love can flourish safely:\n\n" +
        "1. **Use 'I' Statements Rather than Blame**: Instead of *\"You are suffocating me\"*, communicate: *\"I need 30 minutes of quiet solitude after work so I can be energized and present with you later.\"*\n" +
        "2. **Agree During Peace, Not Conflict**: Establish boundary agreements when both partners are regulated and calm, rather than mid-argument.\n" +
        "3. **Tie Boundaries to Clear Action**: A boundary is about what *you* will do to protect your peace (e.g., *\"If yelling starts, I will take a 15-minute walking break, and we will resume talking respectfully\"*).",
      suggestedQuestions: [
        "How to heal emotionally after a painful breakup?",
        "What happens during a couples counseling session?",
        "How do I consult a relationship therapist?",
      ],
    },
    hi: {
      answer:
        "🌱 **Partner Ke Sath Healthy Boundaries Kaise Set Karein?**\n\n" +
        "1. **'Main' Statement Use Karein**: *\"Tum hamesha irritate karte ho\"* ke bajaye bolein *\"Mujhe office ke baad 20 minute shanti chahiye taaki main tumhare sath achhe se baat kar sakun.\"*\n" +
        "2. **Shaant Mahol Mein Baat Karein**: Boundary ladayi ke waqt nahi, balki jab dono calm hon tab decide karein.\n" +
        "3. **Clear Rules Banayein**: Agar dono me se koi gusse me aawaz unchi kare, toh 15 minute ka break lein aur phir baat karein.",
      suggestedQuestions: [
        "Breakup ke baad emotional recovery kaise karein?",
        "Couple counseling session kaise conduct hota hai?",
        "Couples therapist se session kaise book karein?",
      ],
    },
  },

  // 11. Breakup Recovery
  {
    keywords: ["breakup", "emotional recovery", "after a breakup", "breakup ke baad"],
    specialty: "Relationships",
    en: {
      answer:
        "💔 **Clinical Roadmap for Emotional Healing After a Breakup**\n\n" +
        "Neurological research shows heartbreak activates the exact same pain matrix as severe physical injury:\n\n" +
        "1. **Strict No-Contact Rule**: Checking social profiles or texting triggers acute dopamine withdrawal, repeatedly resetting your emotional healing clock.\n" +
        "2. **Permit the Grieving Stages**: Allow yourself to feel the natural phases of grief (denial, anger, bargaining, depression) without self-judgment.\n" +
        "3. **Identity Reclamation**: Invest deliberate energy into passions, friendships, and routines that existed before the relationship.\n" +
        "4. **Reframe the Narrative**: Therapy helps you see the end not as personal inadequacy, but as two mismatched emotional trajectories.",
      suggestedQuestions: [
        "How do I set healthy emotional boundaries with a partner?",
        "What happens during a couples counseling session?",
        "How do I consult an emotional recovery therapist?",
      ],
    },
    hi: {
      answer:
        "💔 **Breakup Ke Baad Emotional Recovery Ke 3 Steps**\n\n" +
        "1. **No-Contact Rule**: Ex ke social media check karna band karein. Yeh dimaag ke dopamine cycle ko todta hai.\n" +
        "2. **Feelings Ko Dabayein Mat**: Rona ya dukh hona normal hai. Dukh ko accept karein aur khud ko blame na karein.\n" +
        "3. **Apni Zindagi Wapas Rebuild Karein**: Apne doston se milein, hobbies shuru karein aur daily routine set karein.",
      suggestedQuestions: [
        "Partner ke sath boundary kaise set karein?",
        "Therapist se baat karne se heartbroken recovery kaise hoti hai?",
        "Under ₹1,000 ke counselors dikhao",
      ],
    },
  },
  // 12. ADHD vs Stress
  {
    keywords: ["adhd or just high stress", "adhd or high stress", "adhd or stress", "adhd aur stress-induced"],
    specialty: "ADHD",
    en: {
      answer:
        "🧠 **Differentiating Adult ADHD vs. High Stress / Burnout**\n\n" +
        "While both conditions present with forgetfulness, distraction, and mental fatigue, clinicians distinguish them by 3 diagnostic criteria:\n\n" +
        "1. **Lifelong Presence**: ADHD is a neurodevelopmental trait present since early childhood (often seen in school reports or persistent childhood daydreaming/impulsivity). Stress-induced brain fog is situational and began with adult responsibilities.\n" +
        "2. **Pervasiveness Across Environments**: ADHD impacts work, home organization, personal hobbies, and social interactions regardless of stress levels. Stress-induced distraction lifts when workload and pressure subside.\n" +
        "3. **Dopamine Modulation (Hyperfocus)**: People with ADHD struggle with non-stimulating routine tasks, but can hyperfocus for hours on things that spark genuine fascination. In pure stress or burnout, focus is depleted across all tasks indiscriminately.",
      suggestedQuestions: [
        "What are effective coping strategies for adult ADHD?",
        "How can an ADHD specialist help me build routines?",
        "How do I consult an ADHD specialist?",
      ],
    },
    hi: {
      answer:
        "🧠 **ADHD vs High Stress / Brain Fog Mein Kya Farq Hai?**\n\n" +
        "1. **Bachpan Se Presence**: ADHD ek neurodevelopmental pattern hai jo bachpan se chala aa raha hota hai. Jabki stress-induced distraction hal hi me kaam ya life ke pressure se shuru hota hai.\n" +
        "2. **Har Situation Mein Asar**: ADHD har jagah dikhta hai — ghar, office, hobbies. Stress wala focus issue tab theek ho jata hai jab chutti ya rest mile.\n" +
        "3. **Hyperfocus**: ADHD me boring kaam me bilkul dhyan nahi lagta, lekin interesting cheezon me ghanto bina thake dhyan lag sakta hai.",
      suggestedQuestions: [
        "Focus improve karne ke daily hacks kya hain?",
        "ADHD assessment test kaise conduct hota hai?",
        "Under ₹1,000 ke ADHD doctors dikhao",
      ],
    },
  },

  // 13. ADHD Coping Strategies
  {
    keywords: ["effective coping strategies for adult adhd", "coping strategies for adult adhd", "adhd coping", "focus improve karne ke daily hacks"],
    specialty: "ADHD",
    en: {
      answer:
        "⚡ **Evidence-Based Coping Protocols for Adult ADHD**\n\n" +
        "The ADHD brain possesses an 'interest-based' nervous system rather than an importance-based one. Use these executive-function prosthetics:\n\n" +
        "1. **Externalize Working Memory (Visual Cues)**: If an item or task is not visually visible, it ceases to exist in the ADHD brain. Use physical whiteboards, Kanban sticky-notes, and open desktop bins rather than deep closed drawers.\n" +
        "2. **Body Doubling**: Working in the physical or virtual presence of another focused person drastically reduces task initiation paralysis by up to 60%.\n" +
        "3. **Micro Time-Boxing (15-Minute Sprints)**: Committing to a 3-hour task triggers panic and avoidance. Commit only to 15 minutes of work with a visible analog timer.\n" +
        "4. **Dopamine Stacking**: Pair tedious low-stimulation tasks (e.g., filing reports, laundry) with high-dopamine audio (upbeat instrumental synthwave, fascinating audiobooks).",
      suggestedQuestions: [
        "How do I know if I have ADHD or just high stress?",
        "How can an ADHD specialist help me build routines?",
        "How does a clinical psychologist evaluate ADHD?",
      ],
    },
    hi: {
      answer:
        "⚡ **Adult ADHD & Focus Badhane Ke 4 Daily Hacks**\n\n" +
        "1. **Visible Reminders (Out of sight = Out of mind)**: Saare zaroori kaam sticky notes ya whiteboard par samne likh kar rakhein.\n" +
        "2. **Body Doubling**: Kisi dost ya colleague ke sath baithkar kaam karein. Dusre ko kaam karte dekhne se brain naturally focused rehta hai.\n" +
        "3. **15-Minute Sprints**: Ek sath 2-3 ghante ka plan na banayein; sirf 15 minute ka timer lagayein aur bina phone dekhe shuru karein.\n" +
        "4. **Dopamine Pairing**: Boring kaam karte waqt apna favorite instrumental music ya podcast sunein.",
      suggestedQuestions: [
        "ADHD aur stress-induced distraction mein kya farq hai?",
        "ADHD assessment test kaise conduct hota hai?",
        "ADHD specialist se guidance kaise lein?",
      ],
    },
  },

  // 14. ADHD Build Routines
  {
    keywords: ["specialist help me build routines", "build routines", "adhd assessment test", "adhd specialist help me"],
    specialty: "ADHD",
    en: {
      answer:
        "🛠️ **How an ADHD Specialist Helps You Build Sustainable Routines**\n\n" +
        "Traditional neurotypical productivity advice (*\"Just use a calendar and be disciplined\"*) often induces shame and burnout in ADHD brains. An ADHD specialist works through neuro-affirming scaffolding:\n\n" +
        "• **Friction-Free Habit Stacking**: Linking new tasks directly onto already automated physical habits (e.g., taking vitamins right beside the morning kettle).\n" +
        "• **De-shaming Executive Dysfunction**: Understanding that task paralysis is neurological dopamine deficiency, not moral laziness or lack of willpower.\n" +
        "• **Personalized Dopamine Mapping**: Structuring work hours around your personal peak focus windows rather than rigid 9-to-5 expectations.\n" +
        "• **Accountability Without Rejection Sensitivity**: A supportive clinical mirror to troubleshoot points of resistance safely.",
      suggestedQuestions: [
        "What are effective coping strategies for adult ADHD?",
        "How do I know if I have ADHD or just high stress?",
        "Show verified ADHD specialists under my budget",
      ],
    },
    hi: {
      answer:
        "🛠️ **ADHD Specialist Routine Banane Me Kaise Madad Karta Hai?**\n\n" +
        "• **Zero Guilt & Shame**: Specialist aapko yeh samajhne me help karta hai ki focus na banna laziness nahi, balki brain dopamine difference hai.\n" +
        "• **Friction-Free Habit Stacking**: Naye habits ko purane routine ke sath jodna taaki dimaag par bojh na pade.\n" +
        "• **Peak Energy Windows**: Aapka dimaag din ke kis waqt sabse active hota hai, uske hisab se timetable set karna.\n" +
        "• **Compassionate Accountability**: Regular check-ins bina kisi judge kiye.",
      suggestedQuestions: [
        "Focus improve karne ke daily hacks kya hain?",
        "ADHD aur stress-induced distraction mein kya farq hai?",
        "Under ₹1,000 ke ADHD doctors dikhao",
      ],
    },
  },

  // 15. Depression Small Steps
  {
    keywords: ["small steps when i have zero motivation", "zero motivation", "choti shuruat kaise karein"],
    specialty: "Depression and low mood",
    en: {
      answer:
        "🌱 **How to Take Small Steps When You Have Zero Motivation**\n\n" +
        "In clinical psychology, we teach the **Behavioral Activation Rule**: *Action precedes motivation, not the other way around.*\n\n" +
        "When dealing with low mood or depression, waiting to 'feel like doing it' ensures nothing happens because depression shuts down dopamine signaling:\n\n" +
        "1. **Shrink the Task to Ridiculous Proportions**: If cleaning your room feels like climbing Everest, your task is just to pick up one sock. If taking a shower feels impossible, your task is just splashing warm water on your hands.\n" +
        "2. **The 5-Minute Permission Rule**: Tell yourself: *\"I will do this for exactly 300 seconds. After 5 minutes, I have full permission to crawl back under the blanket with zero guilt.\"* Most of the time, overcoming the initiation barrier is the hardest part.\n" +
        "3. **Acknowledge Survival Wins**: In deep low mood, staying alive, drinking a glass of water, and brushing your teeth are major biological victories. Honor them.",
      suggestedQuestions: [
        "What is the difference between sadness and clinical depression?",
        "How does talking to a therapist help with low mood?",
        "How do I connect with a depression care specialist?",
      ],
    },
    hi: {
      answer:
        "🌱 **Jab Kuch Karne Ka Mann Na Ho Toh Choti Shuruat Kaise Karein?**\n\n" +
        "1. **Task Ko Ekdum Chota Kar Dein**: Agar poora kamra saaf karna mushkil lage, toh sirf ek kapda uthayein. Bada target dimaag ko freeze kar deta hai.\n" +
        "2. **5-Minute Rule**: Khud se bolein: *\"Main sirf 5 minute yeh kaam karunga. Agar tab bhi mann nahi kiya, toh main aaram se band kar dunga.\"*\n" +
        "3. **Choti Jeet Ko Acknowledge Karein**: Low mood me bistar se uthna ya paani peena bhi ek badi victory hai. Apne aap par gussa na karein.",
      suggestedQuestions: [
        "Sadness aur clinical depression mein kya farq hai?",
        "Therapist se 1-on-1 baat karne se kaise help milti hai?",
        "Depression counselor se consultation kaise book karein?",
      ],
    },
  },

  // 16. Sadness vs Clinical Depression
  {
    keywords: ["difference between sadness and clinical depression", "sadness aur clinical depression", "sadness and clinical depression"],
    specialty: "Depression and low mood",
    en: {
      answer:
        "🌧️ **The Difference Between Everyday Sadness and Clinical Depression**\n\n" +
        "While everyone experiences sadness, clinical depression is a systemic neurobiological state:\n\n" +
        "• **Everyday Sadness**: It is a transient, healthy human reaction to disappointment, grief, or hurt. Crucially, your capacity to experience joy, laugh at a joke, or feel comforted by loved ones remains intact.\n" +
        "• **Clinical Depression (Major Depressive Episode)**: Characterized by *anhedonia* — a total loss of interest or pleasure in all activities. It carries profound physical lethargy, changes in sleep and appetite, feelings of worthlessness, and cognitive sluggishness lasting more than 2 consecutive weeks.\n" +
        "• **Recovery**: Sadness usually clears as circumstances evolve or feelings are processed; depression often requires psychotherapeutic intervention (CBT/ACT) to rewire negative neural pathways.",
      suggestedQuestions: [
        "How can I take small steps when I have zero motivation?",
        "How does talking to a therapist help with low mood?",
        "How do I schedule a session with a clinical psychologist?",
      ],
    },
    hi: {
      answer:
        "🌧️ **Sadness Aur Clinical Depression Mein Farq**\n\n" +
        "• **Sadness (Udaasi)**: Yeh kisi specific wajah (heartbreak, loss, failure) se hoti hai, aur kuch dinon me doston se baat karke ya waqt ke sath theek ho jati hai.\n" +
        "• **Clinical Depression**: Yeh 2 hafte se zyada lagataar rehti hai. Kisi bhi cheez me khushi nahi milti (anhedonia), sharir me bilkul taakat nahi lagti aur khud ko hopeless feel hota hai.\n" +
        "• **Therapy Ka Role**: Sadness natural hai, lekin clinical depression me therapy lene se dimaag ke negative loop break hote hain.",
      suggestedQuestions: [
        "Jab kuch karne ka mann na ho toh choti shuruat kaise karein?",
        "Therapist se 1-on-1 baat karne se kaise help milti hai?",
        "Under ₹1,000 ke psychologists dikhao",
      ],
    },
  },

  // 17. Therapist Help for Low Mood
  {
    keywords: ["therapist help with low mood", "therapist se 1-on-1 baat karne se kaise help", "help with low mood", "talking to a therapist help"],
    specialty: "Depression and low mood",
    en: {
      answer:
        "🤝 **How Talking to a Licensed Psychologist Helps Overcome Low Mood**\n\n" +
        "A therapist is not just a sympathetic listener; they provide structured, evidence-based cognitive intervention:\n\n" +
        "1. **Deconstructing Negative Automatic Thoughts (NATs)**: Depression distorts perception through mental filters (*\"I am a failure\"*, *\"Nothing will ever improve\"*). Therapy gently tests the evidence for these thoughts.\n" +
        "2. **A Safe, Non-Judgmental Container**: Friends and family often try to 'fix' you with toxic positivity (*\"Just smile and be grateful!\"*). A therapist holds space for your pain without rushing you.\n" +
        "3. **Structured Behavioral Activation**: Breaking the inertia cycle with personalized, achievable daily momentum builders.",
      suggestedQuestions: [
        "How can I take small steps when I have zero motivation?",
        "What is the difference between sadness and clinical depression?",
        "Show verified psychologists under my budget",
      ],
    },
    hi: {
      answer:
        "🤝 **Therapist Se Baat Karne Se Low Mood Kaise Theek Hota Hai?**\n\n" +
        "• **Bina Judgment Ki Safe Space**: Dost ya parivar aksar gyaan dene lagte hain, lekin therapist bina judge kiye aapki baat sunta hai.\n" +
        "• **Negative Thoughts Ko Break Karna**: Depression dimaag me jhute thoughts daalta hai (*\"Mere sath sab galat hota hai\"*). Therapy inko challenge karna sikhati hai.\n" +
        "• **Behavioral Plan**: Dheere-dheere aapki energy aur routine ko rebuild karne ke practical steps.",
      suggestedQuestions: [
        "Jab kuch karne ka mann na ho toh choti shuruat kaise karein?",
        "Sadness aur clinical depression mein kya farq hai?",
        "Under ₹1,000 ke therapists dikhao",
      ],
    },
  },

  // 18. Career Confusion Decision
  {
    keywords: ["clear decisions when feeling career confusion", "career confusion", "right decision kaise lein"],
    specialty: "Career",
    en: {
      answer:
        "🎯 **How to Make Clear Decisions When Facing Career Confusion**\n\n" +
        "Career paralysis usually occurs when you try to optimize for too many conflicting variables (status, money, passion, security, parents' expectations) all at once:\n\n" +
        "1. **Identify Your Non-Negotiable Core Value**: Rank what matters most *for the next 18 months*: Rapid learning? Financial stability? Autonomy? Mental peace? You cannot optimize all four simultaneously.\n" +
        "2. **Two-Way Door Decisions (Jeff Bezos Framework)**: Most career pivots are reversible 'two-way doors'. If an experiment fails, you can walk back out with richer experience. Treating every choice as a permanent one-way door causes paralysis.\n" +
        "3. **Conduct 3 Low-Stakes Informational Interviews**: Instead of ruminating in your head, talk to three people currently doing the roles you're considering. Reality clears cognitive fog.",
      suggestedQuestions: [
        "How do I overcome imposter syndrome and workplace anxiety?",
        "How does a consultation with a career mindset coach work?",
        "How do I consult a career mindset coach?",
      ],
    },
    hi: {
      answer:
        "🎯 **Career Confusion Mein Sahi Decision Kaise Lein?**\n\n" +
        "1. **Agla 1 Saal Ka Target Decide Karein**: Kya aapko financial stability chahiye ya naya skill seekhna hai? Har cheez ek sath solve nahi hoti.\n" +
        "2. **Har Decision Permanent Nahi Hota**: Dimaag sochta hai ki ek galat kadam se career barbaad ho jayega. Mostly decisions reversible hote hain.\n" +
        "3. **Field Ke Logon Se Baat Karein**: Sirf dimaag me sochne ke bajaye us field me kaam kar rahe 2 logon se baat karein.",
      suggestedQuestions: [
        "Imposter syndrome se kaise deal karein?",
        "Career mindset coach se kaise connect karein?",
        "Under ₹1,000 ke career coaches dikhao",
      ],
    },
  },

  // 19. Imposter Syndrome
  {
    keywords: ["imposter syndrome", "workplace anxiety", "imposter syndrome se kaise deal"],
    specialty: "Career",
    en: {
      answer:
        "💼 **Overcoming Imposter Syndrome and Workplace Anxiety**\n\n" +
        "Imposter syndrome (*\"I got here by luck; they will soon discover I'm a fraud\"*) ironically strikes high-performers and conscientious individuals the most:\n\n" +
        "1. **Separate Feeling from Fact**: Just because you *feel* incompetent when facing a complex challenge does not mean you *are* incompetent. Discomfort is the physiological signature of neuroplastic growth.\n" +
        "2. **Maintain an Evidence Dossier**: Keep a dedicated folder of positive feedback, client praise, successfully shipped projects, and quantitative milestones. Review it when self-doubt flares up.\n" +
        "3. **Reframe from 'Expert' to 'Curious Learner'**: You don't have to know every answer; your real value is your ability to learn, adapt, and solve problems collaboratively.",
      suggestedQuestions: [
        "How can I make clear decisions when feeling career confusion?",
        "How does a consultation with a career mindset coach work?",
        "How do I connect with a career performance coach?",
      ],
    },
    hi: {
      answer:
        "💼 **Imposter Syndrome & Workplace Darr Se Kaise Deal Karein?**\n\n" +
        "1. **Feelings vs Reality**: Aisa lagna ki aap deserve nahi karte, ek natural feeling hai — yeh sach nahi hai. Naye kaam me thoda darr aana normal hai.\n" +
        "2. **Accomplishments Ki List Banayein**: Apne purane successful projects aur boss/clients ki tareef ko likh kar rakhein taaki darr ke waqt dekh sakein.\n" +
        "3. **Seekhne Par Focus Karein**: Har sawal ka jawab aana zaroori nahi hai; naya seekhne ki willingness sabse badi strength hoti hai.",
      suggestedQuestions: [
        "Career confusion mein right decision kaise lein?",
        "Career mindset coach se kaise connect karein?",
        "Under ₹1,000 ke career coaches dikhao",
      ],
    },
  },

  // 20. Career Mindset Coach
  {
    keywords: ["career mindset coach", "consultation with a career mindset coach", "mindset coach se kaise connect"],
    specialty: "Career",
    en: {
      answer:
        "🚀 **How a Consultation with a Career Mindset Coach Works**\n\n" +
        "A career mindset coach blends executive psychology with practical workplace strategy:\n\n" +
        "• **Unblocking Limiting Beliefs**: Identifying unconscious patterns of self-sabotage, chronic people-pleasing, or fear of failure.\n" +
        "• **Burnout-Free Performance**: Building high-impact output habits without sacrificing health or evening peace.\n" +
        "• **Executive Presence & Negotiation**: Building confidence for salary negotiations, promotion conversations, and high-stakes interviews.",
      suggestedQuestions: [
        "How can I make clear decisions when feeling career confusion?",
        "How do I overcome imposter syndrome and workplace anxiety?",
        "Show verified career coaches under my budget",
      ],
    },
    hi: {
      answer:
        "🚀 **Career Mindset Coach Ke Sath Session Me Kya Hota Hai?**\n\n" +
        "• **Self-Doubt Ko Khatam Karna**: Promotion ya nayi job ke darr ko door karna.\n" +
        "• **Work-Life Balance**: Kaam me high performance ke sath-sath apni health aur peace ko protect karna.\n" +
        "• **Salary & Career Growth Strategy**: Confidence se interview dena aur growth plan banana.",
      suggestedQuestions: [
        "Career confusion mein right decision kaise lein?",
        "Imposter syndrome se kaise deal karein?",
        "Career coach se consultation kaise book karein?",
      ],
    },
  },

  // 21. Deep Loneliness Coping
  {
    keywords: ["feelings of isolation", "deep feelings of isolation", "akelapan kam karne ke healthy"],
    specialty: "Loneliness",
    en: {
      answer:
        "🌿 **Navigating Deep Feelings of Loneliness and Isolation**\n\n" +
        "Loneliness is not a character flaw — it is an evolutionary alarm system (like physical hunger or thirst) signaling that your social connection receptors are running on empty:\n\n" +
        "1. **Distinguish Solitude from Loneliness**: Solitude is the peaceful enjoyment of your own company. Loneliness is the painful longing for connection. You can enjoy solitude while actively addressing loneliness.\n" +
        "2. **Practice 'Micro-Connections'**: You don't need a 10-person friend group overnight. Having a warm, genuine 30-second interaction with a local barista, a neighbor, or in a hobby group releases oxytocin and calms the nervous system.\n" +
        "3. **Engage in Shared-Context Spaces**: Join a weekly run club, pottery workshop, reading circle, or volunteer cause where bonding happens organically around a shared activity rather than forced small talk.",
      suggestedQuestions: [
        "Why do I feel lonely even around friends and family?",
        "How does therapy help in building meaningful connections?",
        "How do I consult a counseling psychologist for loneliness?",
      ],
    },
    hi: {
      answer:
        "🌿 **Gehre Akelapan Se Kaise Deal Karein?**\n\n" +
        "1. **Akelapan Koi Kamzori Nahi Hai**: Jaise bhookh lagne par sharir khana mangta hai, waise hi akelapan ek signal hai ki humein emotional connection chahiye.\n" +
        "2. **Choti-Choti Baatein Shuru Karein (Micro-Connections)**: Ek hi din me 10 dost banane ki zaroorat nahi hai. Padosi, dukandar ya kisi se 1 minute ki warm baat bhi mood lift karti hai.\n" +
        "3. **Hobby Groups Join Karein**: Kitabon ka club, walking group ya volunteer work jahan log kisi common interest ke liye milte hain.",
      suggestedQuestions: [
        "Bheed mein bhi lonely feel kyu hota hai?",
        "Therapist se baat karne se akelapan kaise door hota hai?",
        "Under ₹1,000 ke counselors dikhao",
      ],
    },
  },

  // 22. Lonely in Crowds
  {
    keywords: ["lonely even around friends", "lonely around friends and family", "bheed mein bhi lonely"],
    specialty: "Loneliness",
    en: {
      answer:
        "👥 **Why You Feel Lonely Even When Surrounded by Friends or Family**\n\n" +
        "Feeling lonely in a crowd or within your existing social circle points to the **'Intimacy Gap'**:\n\n" +
        "• **Physical Presence vs. Emotional Attunement**: You can sit in a room with 10 people, but if you have to perform, mask your true struggles, or engage only in superficial pleasantries, your emotional core remains untouched and profoundly lonely.\n" +
        "• **Fear of Vulnerability**: Many people keep up a strong, funny, or competent facade because they fear that revealing their true fears will lead to judgment or burdening others.\n" +
        "• **Emotional Mismatch**: Sometimes relationships were built for a previous version of you. As you grow, those connections no longer resonate with what you value today.",
      suggestedQuestions: [
        "How can I cope with deep feelings of isolation?",
        "How does therapy help in building meaningful connections?",
        "How do I talk to a therapist about feeling isolated?",
      ],
    },
    hi: {
      answer:
        "👥 **Doston Aur Parivar Ke Beech Rehkar Bhi Akelapan Kyu Lagta Hai?**\n\n" +
        "• **Fake Mask Pehanna**: Jab hum doston ke samne hamesha khush ya strong hone ka dikhawa karte hain aur apna asali dard share nahi kar pate, toh bheed me bhi akelapan lagta hai.\n" +
        "• **Superficial Baatein**: Jab baatein sirf gossip ya kaam tak simit hon aur koi dil ki baat na samjhe.\n" +
        "• **Emotional Safety Ki Kami**: Aisa darr lagna ki agar sach bataya toh log mazaak udayenge ya judge karenge.",
      suggestedQuestions: [
        "Akelapan kam karne ke healthy tarike kya hain?",
        "Therapist se baat karne se akelapan kaise door hota hai?",
        "Under ₹1,000 ke counselors dikhao",
      ],
    },
  },

  // 23. Therapy for Meaningful Connections
  {
    keywords: ["therapy help in building meaningful", "building meaningful connections", "akelapan kaise door hota hai"],
    specialty: "Loneliness",
    en: {
      answer:
        "🌱 **How Therapy Helps You Build Deep, Meaningful Connections**\n\n" +
        "Therapy provides a clinical mirror to examine how you relate to others:\n\n" +
        "• **Unpacking Attachment Styles**: Exploring whether you have an anxious, avoidant, or secure attachment pattern that unconsciously pushes people away or clings too tightly.\n" +
        "• **Safe Vulnerability Practice**: The therapeutic relationship itself is a training ground for being completely authentic and vulnerable without being rejected.\n" +
        "• **Boundaries and Mutual Reciprocity**: Learning to filter out one-sided relationships and invest in people who offer genuine reciprocity and warmth.",
      suggestedQuestions: [
        "How can I cope with deep feelings of isolation?",
        "Why do I feel lonely even around friends and family?",
        "Show verified counseling psychologists under my budget",
      ],
    },
    hi: {
      answer:
        "🌱 **Therapy Se Meaningful Rishte Kaise Bante Hain?**\n\n" +
        "• **Attachment Pattern Samajhna**: Samajhna ki kyu hum logon se door bhagte hain ya rejection se darte hain.\n" +
        "• **Khulkar Baat Karne Ki Practice**: Therapist ke sath bina kisi jhijhak ke sach bolne ki aadat padti hai jo aage relationships me kaam aati hai.\n" +
        "• **Sahi Logon Ko Pehchanna**: Ek-tarfa rishton se nikal kar aise doston se judna jo sach me aapki care karein.",
      suggestedQuestions: [
        "Akelapan kam karne ke healthy tarike kya hain?",
        "Bheed mein bhi lonely feel kyu hota hai?",
        "Counseling psychologist se session kaise book karein?",
      ],
    },
  },
];

function findClinicalQAReply(text: string, isHindi: boolean): { answer: string; suggestedQuestions: string[]; specialty: string } | null {
  const lower = text.toLowerCase();
  for (const item of CLINICAL_QA_REGISTRY) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      const content = isHindi ? item.hi : item.en;
      return {
        answer: content.answer,
        suggestedQuestions: content.suggestedQuestions,
        specialty: item.specialty,
      };
    }
  }
  return null;
}

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

  // 5. Specific Clinical Q&A Lookup (e.g. CBT-I, 5-4-3-2-1, sleep hygiene, etc.)
  const clinicalQA = findClinicalQAReply(text, isHindi);

  // 6. Specialty Mapping
  const targetSpecialtyName = clinicalQA?.specialty || options?.topic;
  const mapping = detectSpecialty(text, targetSpecialtyName);

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

  // Resolve Doctor for this specialty & budget
  let matchedDoctor = mapping.defaultDoctorMatch;
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

  const content = isHindi ? mapping.hi : mapping.en;
  const lower = text.toLowerCase();
  const isTopicIntakeStart = lower.startsWith("i want to discuss") || lower.startsWith("let's discuss");

  let answerText = "";
  let suggestedQuestions = content.suggestedQuestions;

  // Check if user specifically requested a therapist, doctor, consultation, or pricing
  const userWantsTherapist =
    lower.includes("therapist") ||
    lower.includes("counselor") ||
    lower.includes("consult") ||
    lower.includes("doctor") ||
    lower.includes("book") ||
    lower.includes("appointment") ||
    lower.includes("fees") ||
    lower.includes("pricing") ||
    lower.includes("session book") ||
    lower.includes("talk to someone");

  if (userWantsTherapist) {
    // User specifically asked to talk to or book a therapist / consultant
    if (clinicalQA) {
      answerText = `${clinicalQA.answer}\n\n`;
      suggestedQuestions = clinicalQA.suggestedQuestions;
    } else {
      answerText = `${content.empatheticReflection}\n\n`;
    }

    if (isHindi) {
      answerText +=
        `Aapke **${mapping.specialty}** concern ke mutabiq certified specialist ka profile card niche diya gaya hai. ` +
        `Aap bina kisi delay ke unke sath private 1-on-1 session schedule kar sakte hain:`;
    } else {
      answerText +=
        `For your concerns with **${mapping.specialty}**, here is our recommended licensed clinical specialist. ` +
        `You can review their profile and schedule a private 1-on-1 consultation directly below:`;
    }
  } else if (clinicalQA) {
    // User asked a specific question from the question chips or clinical domain (pure conversational answer)
    answerText = `${clinicalQA.answer}\n\n`;
    suggestedQuestions = clinicalQA.suggestedQuestions;

    if (isHindi) {
      answerText += `Kya aap is baare mein thoda aur share karna chahenge, ya niche diye gaye suggestion sawalon me se kisi par baat karna chahte hain?`;
    } else {
      answerText += `Would you like to explore this further, or tap any of the related questions below?`;
    }
  } else if (isTopicIntakeStart) {
    // User just entered conversation with selected topic (greeting & suggestion chips, NO pushy card)
    answerText = `${content.empatheticReflection}\n\n`;

    if (isHindi) {
      answerText += `Aap bina kisi jhijhak ke apni baat share kar sakte hain, ya niche diye gaye suggestion sawalon par click karke shuru kar sakte hain:`;
    } else {
      answerText += `Feel free to share what is on your mind, or tap any of the suggested questions below to explore:`;
    }
  } else {
    // General conversational query in this specialty
    answerText = `${content.empatheticReflection}\n\n`;

    if (isHindi) {
      answerText += `Kya aap is baare mein thoda aur share karna chahenge? Hum bina kisi judgment ke aapko sunne ke liye yahan hain.`;
    } else {
      answerText += `Would you like to share a little more about what you're experiencing? This is a safe, non-judgmental space.`;
    }
  }

  return {
    answer: answerText,
    sources: [{ title: "Durrmi Clinical Framework", section: mapping.specialty, evidenceStrength: "STRONG" }],
    sufficientEvidence: true,
    disclaimer: ASSISTANT_DISCLAIMER,
    suggestedQuestions,
    matchedSpecialty: mapping.specialty,
    doctorMatch: userWantsTherapist ? matchedDoctor : undefined, // ONLY show card when user asks for consultant/therapist!
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
