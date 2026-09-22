/**
 * Dynamic CMS Content Provider for Durrmi Platform
 * Matches page_home component schema defined in sample.json & CMS Architecture specifications.
 */

export interface CmsCta {
  id: string;
  label: string;
  url: string;
  buttonType: "PRIMARY" | "SECONDARY";
  target?: string;
}

export interface CmsHeroContent {
  title: string;
  subtitle: string;
  description: string;
  primaryCta: CmsCta;
  secondaryCta: CmsCta;
  trustBadgeText: string;
}

export interface CmsTrustStatCard {
  id: string;
  value: string;
  label: string;
}

export interface CmsTrustContent {
  title: string;
  subtitle: string;
  stats: CmsTrustStatCard[];
}

export interface CmsStepCard {
  id: string;
  stepNo: string;
  title: string;
  description: string;
  iconType: "star12" | "plus" | "star6";
}

export interface CmsStepsContent {
  title: string;
  subtitle: string;
  tagline: string;
  steps: CmsStepCard[];
}

export interface CmsSpecialisationCard {
  id: string;
  title: string;
  description: string;
  stroke?: string;
}

export interface CmsSpecialisationsContent {
  title: string;
  subtitle: string;
  description: string;
  cta: CmsCta;
  specialisations: CmsSpecialisationCard[];
}

export interface CmsTherapistCard {
  id: string;
  name: string;
  title: string;
  tag: string;
  tagBg: string;
  description: string;
  iconEmoji: string;
}

export interface CmsTherapistShowcaseContent {
  tag: string;
  title: string;
  subtitle: string;
  quote: string;
  therapists: CmsTherapistCard[];
  cta: CmsCta;
}

export interface CmsTestimonialCard {
  id: string;
  quote: string;
  author: string;
  role: string;
  verified: boolean;
}

export interface CmsTestimonialsContent {
  tag: string;
  title: string;
  subtitle: string;
  ratingScore: string;
  reviewCount: string;
  testimonials: CmsTestimonialCard[];
}

export interface CmsPricingPlanCard {
  id: string;
  title: string;
  description: string;
  price: string;
  subtext: string;
  accentColor: "yellow" | "orange" | "blue" | "green";
  features: string[];
  ctaLabel: string;
}

export interface CmsPricingContent {
  tag: string;
  title: string;
  subtitle: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCtaLabel?: string;
  categories?: string[];
  plansHeaderTitle?: string;
  plansHeaderSubtitle?: string;
  plansHeaderComment?: string;
  planCards?: CmsPricingPlanCard[];
  corporateBanner?: {
    title: string;
    badge: string;
    description: string;
    ctaLabel: string;
  };
  completeCareBundle?: {
    title: string;
    subtitle: string;
    cards: Array<{
      id: string;
      title: string;
      description: string;
      price: string;
      subtext: string;
      features: string[];
      ctaLabel: string;
    }>;
  };
  freeOfferTitle: string;
  freeOfferDescription: string;
  freeOfferBullets: string[];
  freeOfferCta: CmsCta;
  preConsultation: {
    title: string;
    description: string;
    price: string;
    subtext: string;
    features: string[];
    cta: CmsCta;
  };
  packagePricing: {
    title: string;
    description: string;
    price: string;
    subtext: string;
    features: string[];
    cta: CmsCta;
  };
}

export interface CmsFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface CmsFaqContent {
  title: string;
  supportBoxTitle: string;
  supportBoxDescription: string;
  supportEmail: string;
  faqs: CmsFaqItem[];
}

export interface CmsFooterCtaContent {
  tag: string;
  title: string;
  subtitle: string;
  highlightText: string;
  cta: CmsCta;
}

export interface CmsHomePageData {
  pageId: string;
  slug: string;
  version: number;
  hero: CmsHeroContent;
  trust: CmsTrustContent;
  steps: CmsStepsContent;
  specialisations: CmsSpecialisationsContent;
  therapists: CmsTherapistShowcaseContent;
  testimonials: CmsTestimonialsContent;
  pricing: CmsPricingContent;
  faqs: CmsFaqContent;
  footerCta: CmsFooterCtaContent;
}

/**
 * Default Home Page CMS Payload (Aligned with CMS JSON Schema & Durrmi Guidelines)
 */
export const defaultHomePageCmsData: CmsHomePageData = {
  pageId: "page_home",
  slug: "/",
  version: 1,
  hero: {
    title: `"The most important connection is the one within." — Prioritise your journey to wellness.`,
    subtitle: `"The most important connection is the one within." — Prioritise your journey to wellness.`,
    description: `Here, we do more than interact with you; we help you understand yourself. Our goal is to support you without judgment. Our advisors will be available to assist you throughout your journey.`,
    primaryCta: {
      id: "cta_hero_primary",
      label: "Reserve Your Free Session",
      url: "/doctors",
      buttonType: "PRIMARY",
    },
    secondaryCta: {
      id: "cta_hero_secondary",
      label: "Explore Our Expertise",
      url: "#why-durrmi",
      buttonType: "SECONDARY",
    },
    trustBadgeText: "Trusted by over 1000+ customers",
  },
  trust: {
    title: "Trusted By People Who Took The First Step",
    subtitle: `"Take the first trusted step & find yourself."`,
    stats: [
      { id: "stat-1", value: "96%", label: "Client Success Rate" },
      { id: "stat-2", value: "10+", label: "Years of combined experience" },
      { id: "stat-3", value: "100+", label: "Lives Transformed" },
    ],
  },
  steps: {
    title: "Getting Started Shouldn't Be The Hardest Part.",
    subtitle: "Start your self-care journey — it's never too late.",
    tagline: "3 Simple steps to connect with your well-being.",
    steps: [
      {
        id: "step-1",
        stepNo: "01",
        title: "Talk at Your Own Pace.",
        description: `Tell us what you're facing. Share as much or as little as you're ready to. There's no pressure to have the right words, whenever you're ready. "YOUR WELLNESS AIM" Connect with our licensed online therapist. Get Matched With The Right Therapist.`,
        iconType: "star12",
      },
      {
        id: "step-2",
        stepNo: "02",
        title: "Get matched to the right expert.",
        description: `We handpick a professional suited to your actual problem, not a random name from a list. "Find support that touches your soul – not just words." Matched to your actual problem, not generic advice. Book your sessions now. Our professionals are available to provide you with emotional support.`,
        iconType: "plus",
      },
      {
        id: "step-3",
        stepNo: "03",
        title: "Switch Anytime, No Awkwardness.",
        description: `Connect with your expert. "Durrmi asks you to come back to yourself." If the fit isn't right, change therapists whenever you need to — finding the right person matters more than sticking with the first match. Select a convenient time and session format. Remember, sometimes, it starts with a small, meaningful step.`,
        iconType: "star6",
      },
    ],
  },
  specialisations: {
    title: "Whatever You're Carrying, There's Someone Who Gets It.",
    subtitle: `"The real luxury? A peaceful mind & a life full of ease."`,
    description: `Talk about it; don't carry it; "our experts truly understand." Find a helping partner here for your anxiety, depression, loss, or grief that you want to share. You were never meant to carry it all alone.`,
    cta: {
      id: "cta_spec",
      label: "Explore Specialisations",
      url: "/doctors",
      buttonType: "SECONDARY",
    },
    specialisations: [
      {
        id: "sp-1",
        title: "Individual therapy",
        description: "1 on 1 culturally inclusive, trauma-informed support for all the challenges and transitions in life to help you with meaningful personal growth.",
      },
      {
        id: "sp-2",
        title: "Couple & Family counselling",
        description: "Navigate conflicts, identify patterns and strengthen your relationship to a healthier version.",
      },
      {
        id: "sp-3",
        title: "Child & adolescent therapy",
        description: "Find support for academic challenges, behavioural concerns, and emotional navigation through all your child's developmental stages.",
      },
      {
        id: "sp-4",
        title: "Geriatric Support",
        description: "A respectful and compassionate space to process ageing, loss, and life transitions without feeling alone.",
      },
      {
        id: "sp-5",
        title: "Relationship / Connection",
        description: "Unresolved emotions do not stay silent; it leaks through every conversation. Working together will help.",
      },
      {
        id: "sp-6",
        title: "Addiction Support",
        description: `Addictions holding you back? "We understand this deeply." We do not dismiss these issues; instead, we listen and provide support.`,
      },
    ],
  },
  therapists: {
    tag: "THE PEOPLE BEHIND DURRMI",
    title: `"Meet the caring team that makes it all happen."`,
    subtitle: "Real talk, Real credentials, and no algorithms.",
    quote: "~Therapist says healing starts with real conversations.",
    therapists: [
      {
        id: "th-1",
        name: "Dr. Sarah Williams",
        title: "Clinical Psychologist",
        tag: "Understanding You",
        tagBg: "bg-amber-200 text-amber-950 border-amber-400",
        description: "Personalised support designed around your unique journey, needs, and goals.",
        iconEmoji: "🌸",
      },
      {
        id: "th-2",
        name: "Dr. Michael Brown",
        title: "Senior Therapist",
        tag: "A Safe Space",
        tagBg: "bg-blue-200 text-blue-950 border-blue-400",
        description: "Helping you feel heard, understood, and supported at every step.",
        iconEmoji: "🌿",
      },
      {
        id: "th-3",
        name: "Dr. Emily Davis",
        title: "Counselling Psychologist",
        tag: "Your Journey Matters",
        tagBg: "bg-emerald-200 text-emerald-950 border-emerald-400",
        description: "Thoughtful guidance to help you move forward with confidence.",
        iconEmoji: "🌱",
      },
      {
        id: "th-4",
        name: "Dr. James Wilson",
        title: "Wellness Specialist",
        tag: "Support That Fits",
        tagBg: "bg-orange-200 text-orange-950 border-orange-400",
        description: "Care and guidance tailored to your individual goals and lifestyle.",
        iconEmoji: "☀️",
      },
    ],
    cta: {
      id: "cta_therapists",
      label: "Meet the experts",
      url: "/doctors",
      buttonType: "PRIMARY",
    },
  },
  testimonials: {
    tag: `"Voices of Durrmi."`,
    title: "Customer review's part",
    subtitle: "Real words from people who walked this path and chose Durrmi to take the first step towards feeling better.",
    ratingScore: "4.9 / 5.0",
    reviewCount: "(1,200+ Reviews)",
    testimonials: [
      {
        id: "rev-1",
        quote: `"Finding the right therapist felt overwhelming before Durrmi. The matching process made everything much easier and I finally felt comfortable talking to someone who understood what I was going through."`,
        author: "Aditi Sharma",
        role: "Verified Client",
        verified: true,
      },
      {
        id: "rev-2",
        quote: `"I really liked how simple the entire process was. I didn't have to scroll through endless profiles. I was connected with someone who actually matched what I needed."`,
        author: "Rahul Mehta",
        role: "Verified Client",
        verified: true,
      },
    ],
  },
  pricing: {
    tag: "WAYS TO GET SUPPORT",
    title: "Two Ways To Get Support",
    subtitle: "Book a single session when you need an answer, or a package when you need someone in your corner.",
    heroTitle: "Care That Fits Where You Are",
    heroSubtitle: "Whether you need a single session to talk something through, or ongoing support to work on something deeper — Durrmi has a path that fits your pace, your budget, and your needs.",
    heroCtaLabel: "Find your plan ↗",
    plansHeaderTitle: "Choose What Feels Best For You",
    plansHeaderSubtitle: "Every journey looks different. That's why we've built a few simple ways to start.",
    plansHeaderComment: "Start your journey with a few simple steps with our Experts.",
    categories: [
      "Relationship Recovery",
      "Weekly Support",
      "Anxiety Care",
      "Stress Management Journey",
      "Depression Support",
      "Couples Therapy",
    ],
    planCards: [
      {
        id: "plan-1",
        title: "Single Session",
        description: "One focused session with a consultant.",
        price: "₹1,200",
        subtext: "per session",
        accentColor: "yellow",
        features: [
          "Single session, no commitment",
          "Rate shown upfront before booking",
          "Pick the consultant and slot",
        ],
        ctaLabel: "Book a session",
      },
      {
        id: "plan-2",
        title: "1-Hour Session",
        description: "One focused session with a consultant.",
        price: "₹1,800",
        subtext: "per session",
        accentColor: "orange",
        features: [
          "Single session, no commitment",
          "Rate shown upfront before booking",
          "Pick the consultant and slot",
        ],
        ctaLabel: "Book a session",
      },
      {
        id: "plan-3",
        title: "5 Sessions Package",
        description: "One focused session with a consultant.",
        price: "₹5,000",
        subtext: "per 5 session",
        accentColor: "blue",
        features: [
          "Single session, no commitment",
          "Rate shown upfront before booking",
          "Pick the consultant and slot",
        ],
        ctaLabel: "Book a session",
      },
      {
        id: "plan-4",
        title: "Full-Time Therapists",
        description: "One focused session with a consultant.",
        price: "₹1,200",
        subtext: "per session",
        accentColor: "green",
        features: [
          "Single session, no commitment",
          "Rate shown upfront before booking",
          "Pick the consultant and slot",
        ],
        ctaLabel: "Book a session",
      },
    ],
    corporateBanner: {
      title: "Looking For A Corporate Plan:",
      badge: "THE TOTAL CARE PLAN",
      description: "Flexible mental health support for your whole organization. Customize packages for your team with dedicated care managers.",
      ctaLabel: "Contact sales",
    },
    completeCareBundle: {
      title: "The Complete Care Bundle",
      subtitle: "Everything you need for a full course of support — at a better price.",
      cards: [
        {
          id: "bundle-1",
          title: "Monthly Package",
          description: "One focused session with a consultant.",
          price: "Starts At ₹12,000",
          subtext: "per session",
          features: [
            "Single session, no commitment",
            "Rate shown upfront before booking",
            "Pick the consultant and slot",
            "Dedicated progress tracker",
            "Unlimited messaging support",
          ],
          ctaLabel: "Book a session",
        },
        {
          id: "bundle-2",
          title: "Monthly Package",
          description: "One focused session with a consultant.",
          price: "Starts At ₹15,000",
          subtext: "per session",
          features: [
            "Single session, no commitment",
            "Rate shown upfront before booking",
            "Pick the consultant and slot",
            "Priority therapist matching",
            "Full mental wellness assessment",
          ],
          ctaLabel: "Book a session",
        },
      ],
    },
    freeOfferTitle: "Book Free Session",
    freeOfferDescription: "We're sharing the best professional therapist sessions for free. Well-being shouldn't come with a price tag — book yours today and take the first step toward feeling better.",
    freeOfferBullets: [
      "✦ Choose your session for free.",
      "✦ Register for free.",
      "✦ Take your first step.",
    ],
    freeOfferCta: {
      id: "cta_free_session",
      label: "Book Free Session",
      url: "/doctors",
      buttonType: "PRIMARY",
    },
    preConsultation: {
      title: "Pre-Consultation",
      description: "One focused session with a consultant. Pay only for the time you book",
      price: "₹999",
      subtext: "per session · set by each consultant",
      features: [
        "Single session, no commitment",
        "Rate shown upfront before booking",
        "Pick the consultant and slot",
      ],
      cta: {
        id: "cta_pre_consultation",
        label: "Book a Consultancy",
        url: "/doctors",
        buttonType: "SECONDARY",
      },
    },
    packagePricing: {
      title: "Package Pricing",
      description: "Bundle multiple sessions with the same consultant at a lower effective rates",
      price: "₹1,299",
      subtext: "per package · scales with sessions included",
      features: [
        "Multi-session bundle, better rate",
        "Continuity with one consultant",
        "Flexible scheduling across sessions",
      ],
      cta: {
        id: "cta_package_pricing",
        label: "Explore Packages",
        url: "/doctors",
        buttonType: "SECONDARY",
      },
    },
  },
  faqs: {
    title: "Questions? We've Got Answers.",
    supportBoxTitle: "Still Have Any Questions?",
    supportBoxDescription: "Need help choosing a therapist or setting up your mental wellness plan? Our support team is here to assist.",
    supportEmail: "support@durrmi.test",
    faqs: [
      {
        id: "faq-1",
        question: "How does Durrmi match me with a therapist?",
        answer: "Tell us what you're going through and your preferences. Durrmi uses that information to recommend therapists specialising in your specific concern.",
      },
      {
        id: "faq-2",
        question: "Can I choose my therapist?",
        answer: "Yes. You can choose a consultant and select an available session slot.",
      },
      {
        id: "faq-3",
        question: "How much does a session cost?",
        answer: "Session and package pricing is shown upfront before booking.",
      },
    ],
  },
  footerCta: {
    tag: "Trusted by over 1000+ customers",
    title: "Completely free. Totally chill. Massive Clarity.",
    subtitle: "Meet your guide with zero awkwardness at Durrmi.",
    highlightText: `"Meet your guide with zero awkwardness at Durrmi."`,
    cta: {
      id: "cta_footer_free",
      label: "Book a free session",
      url: "/doctors",
      buttonType: "PRIMARY",
    },
  },
};

/**
 * Fetch dynamic CMS Page content from Backend API endpoint: GET /api/v1/pages/page_home
 * Fallback to defaultHomePageCmsData if backend CMS service is offline or returning empty.
 */
export async function fetchCmsHomePageData(): Promise<CmsHomePageData> {
  try {
    const response = await fetch("/api/v1/pages/page_home");
    if (response.ok) {
      const json = await response.json();
      if (json && json.hero) {
        return json as CmsHomePageData;
      }
    }
  } catch (e) {
    // Backend API offline or returning fallback
  }
  return defaultHomePageCmsData;
}

