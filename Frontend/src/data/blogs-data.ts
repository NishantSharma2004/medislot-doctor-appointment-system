export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  categories: string[];
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  heroImageUrl: string;
  midImageUrl?: string;
  excerpt: string;
  content: {
    intro: string;
    sections: {
      heading: string;
      paragraphs: string[];
      highlightQuote?: string;
    }[];
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "story-of-durrmi",
    title: "Story of Durrmi",
    subtitle: "“Your mind isn’t a responsibility. It’s you—let us help you carry it.”",
    categories: ["Founder Story", "Emotional Health", "Self-Awareness"],
    date: "12-03-25",
    readTime: "5 mins",
    author: {
      name: "Girish Kotian",
      role: "Founder of Durrmi",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    heroImageUrl:
      "https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&w=1200&q=80",
    midImageUrl:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "\"Durrmi\" means “Power of Connecting Yourself,\" and prioritising your mental health is our priority. At Durrmi, we don’t believe in fixing you—because you’re not broken.",
    content: {
      intro:
        "\"Durrmi\" means “Power of Connecting Yourself,\" and prioritising your mental health is our priority. Here, we do more than interact with you; we help you understand yourself. Our goal is to support you without judgment. Our advisors will be available to assist you throughout your journey.\n\nYou- Durrmi—Find your way within. Our motive is to motivate you to go beyond and live an abundant life. The vision is to have clarity, embrace your thoughts, and see your potential.",
      sections: [
        {
          heading: "You Don’t Have to Always Be Around the Specialist",
          paragraphs: [
            "You don’t have to always be around the specialist, and you can’t be; we are not here to give you mental advice.",
            "At Durrmi, we don’t believe in fixing you—because you’re not broken. We believe in presence: someone who listens without judgment; we match you right; we walk beside you. We help you grow.",
          ],
          highlightQuote:
            "“At Durrmi, we don’t believe in fixing you—because you’re not broken. We believe in presence: someone who listens without judgment; we match you right; we walk beside you. We help you grow.”",
        },
        {
          heading: "Embracing Yourself Should Be Your Priority",
          paragraphs: [
            "We care, we reconnect, and we heal. You don’t have to sit and meditate; our work is to make you aware. Seeking inner power is not always about controlling; it’s about stepping into your inner self.",
            "Living with the problem is not the solution; that’s why we provide qualified specialists, personalised care, and the right Professionals for each person. Find yourself by choosing Durrmi.",
            "“Here, you can finally relax.”",
          ],
          highlightQuote:
            "“That's why Durrmi exists. Within our care, you will find a counsellor for your mental health.”",
        },
        {
          heading: "Managing Emotions and Breaking Isolation",
          paragraphs: [
            "Choosing yourself and your inner self should always be the priority. In this fast-moving world, being active on social media and career pressure are affecting our mental health.",
            "Managing emotions and isolating yourself will never be the option to avoid the situation. Sometimes self-care isn’t enough on its own—and that’s completely okay. Consider talking to someone.",
            "At Durrmi, we don’t believe in fixing you—because you’re not broken. We believe in presence: someone who listens without judgment; we match you right; we walk beside you. We help you grow.",
          ],
        },
        {
          heading: "A Journey of Finding the You Within You",
          paragraphs: [
            "It is a journey of going inward. A journey of finding the you within you.",
            "It is about understanding your thoughts, accepting your flaws, finding peace within chaos, and slowly discovering the truth of who you are within yourself.",
          ],
          highlightQuote:
            "“It is about understanding your thoughts, accepting your flaws, finding peace within chaos, and slowly discovering the truth of who you are within yourself.”",
        },
      ],
    },
  },
  {
    id: "2",
    slug: "true-abundance-is-inner-calm",
    title: "True abundance is inner calm.",
    subtitle:
      "We spend so much of our lives with others... we always forget to look for ourselves.",
    categories: ["Mindfulness", "Emotional Health", "Self-Awareness"],
    date: "14-03-25",
    readTime: "4 mins",
    author: {
      name: "Durrmi Team",
      role: "Holistic Well-being Collective",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    heroImageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    midImageUrl:
      "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "We spend so much of our lives with others, with friends, family, colleagues, and strangers online. Because of all this, we always forget to look for ourselves. Here, we believe that looking for ourselves emotionally empowers us to strengthen the bond and connect more abundantly.",
    content: {
      intro:
        "We spend so much of our lives with others, with friends, family, colleagues, and strangers online. Because of all this, we always forget to look for ourselves.\n\nHere, we believe that looking for ourselves emotionally empowers us to strengthen the bond and connect more abundantly.",
      sections: [
        {
          heading: "Limiting Beliefs & Vulnerability",
          paragraphs: [
            "Pushing feelings, avoiding difficult situations, and not taking care of mental health—none of it brings peace.",
            "Vulnerability makes noise louder. When we silence what we truly feel, the emotional turbulence only amplifies.",
          ],
          highlightQuote:
            "“Our coach will help you find your inner self and awaken the deep potential in each of us.”",
        },
        {
          heading: "Healing Shouldn't Feel Like a Duty",
          paragraphs: [
            "Healing shouldn't feel like a duty that you have to do. Our approach is different—a space designed to help you slow down, reflect, and truly stabilise your emotions.",
          ],
          highlightQuote:
            "“Well-being professionals will coach you to live life abundantly.”",
        },
        {
          heading: "Investing in What Cannot Be Stolen",
          paragraphs: [
            "You become your highest self when you invest in what no one can ever steal: your mindset, your honesty, your well-being, and your capacity to stay kind to yourself.",
            "That's why Durrmi exists. Within our care, you will have access to a counsellor for your mental health.",
          ],
        },
      ],
    },
  },
  {
    id: "3",
    slug: "navigating-burnout-before-it-manifests-physically",
    title: "Navigating Burnout Before It Manifests Physically",
    subtitle:
      "Recognizing early cognitive fatigue and reclaiming non-negotiable boundaries at work.",
    categories: ["Workplace Stress", "Emotional Health"],
    date: "June 12, 2026",
    readTime: "8 Min Read",
    author: {
      name: "Meera Nair",
      role: "Occupational Wellness Specialist",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    heroImageUrl:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "Modern professional environments celebrate relentless output, turning exhaustion into a badge of honor. Real sustainability demands understanding that recovery is not an afterthought.",
    content: {
      intro:
        "Modern professional environments celebrate relentless output, turning exhaustion into a badge of honor. Real sustainability demands understanding that recovery is not an afterthought.",
      sections: [
        {
          heading: "Recognizing Micro-Exhaustion",
          paragraphs: [
            "Irritability, decision paralysis, and fragmented sleep are often the earliest signals of burnout, well before clinical depression or physical collapse.",
          ],
        },
      ],
    },
  },
  {
    id: "4",
    slug: "somatic-grounding-for-sudden-panic",
    title: "Somatic Grounding for Sudden Panic",
    subtitle:
      "Rapid body-based techniques designed to restore autonomic balance in minutes.",
    categories: ["Anxiety Disorder", "Mindfulness"],
    date: "June 12, 2026",
    readTime: "6 Min Read",
    author: {
      name: "Dr. Ananya Roy",
      role: "Lead Clinical Psychologist, Durrmi",
    },
    heroImageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "Panic attacks peak rapidly and feel overwhelming. Grounding yourself in physical sensations signals immediate safety to the nervous system.",
    content: {
      intro:
        "Panic attacks peak rapidly and feel overwhelming. Grounding yourself in physical sensations signals immediate safety to the nervous system.",
      sections: [
        {
          heading: "Anchoring the Body",
          paragraphs: [
            "Sinking feet into the floor, splashing cold water, and prolonging exhalations activate the parasympathetic brake within seconds.",
          ],
        },
      ],
    },
  },
  {
    id: "5",
    slug: "couples-therapy-moving-past-defensiveness",
    title: "Couples Therapy: Moving Past Defensiveness",
    subtitle:
      "How to communicate your emotional needs without triggering protective defenses.",
    categories: ["Relationships", "Emotional Health"],
    date: "June 12, 2026",
    readTime: "7 Min Read",
    author: {
      name: "Dr. Vikram Seth",
      role: "Couples & Family Specialist",
    },
    heroImageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "When conflict arises, defensiveness is often a shield for vulnerability. Learning soft start-ups enables couples to address friction without emotional alienation.",
    content: {
      intro:
        "When conflict arises, defensiveness is often a shield for vulnerability. Learning soft start-ups enables couples to address friction without emotional alienation.",
      sections: [
        {
          heading: "The Art of the Soft Start-Up",
          paragraphs: [
            "Shifting from 'You never...' to 'I feel overwhelmed when...' creates space for collaboration rather than retaliation.",
          ],
        },
      ],
    },
  },
  {
    id: "6",
    slug: "why-sleep-is-the-bedrock-of-emotional-health",
    title: "Why Sleep Is the Bedrock of Emotional Health",
    subtitle:
      "The neuroscience of REM sleep, emotional regulation, and nocturnal anxiety.",
    categories: ["Sleep & Recovery", "Mindfulness"],
    date: "June 12, 2026",
    readTime: "5 Min Read",
    author: {
      name: "Meera Nair",
      role: "Occupational Wellness Specialist",
    },
    heroImageUrl:
      "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "During REM sleep, your brain recalibrates emotional intensity from the preceding day. Chronic sleep deprivation compromises prefrontal inhibition.",
    content: {
      intro:
        "During REM sleep, your brain recalibrates emotional intensity from the preceding day. Chronic sleep deprivation compromises prefrontal inhibition.",
      sections: [
        {
          heading: "Resetting Evening Sleep Architecture",
          paragraphs: [
            "Creating dim lighting, disconnecting screens, and establishing predictable wind-down rituals prime the brain for restorative rest.",
          ],
        },
      ],
    },
  },
];

export function getAllBlogs(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogByIdOrSlug(idOrSlug: string): BlogPost | undefined {
  return BLOG_POSTS.find(
    (b) =>
      b.id === idOrSlug ||
      b.slug === idOrSlug ||
      (idOrSlug === "your-mind-isnt-a-responsibility-its-you" && b.id === "1")
  );
}

export function getLatestBlogs(excludeId?: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((b) => b.id !== excludeId && b.slug !== excludeId).slice(0, limit);
}
