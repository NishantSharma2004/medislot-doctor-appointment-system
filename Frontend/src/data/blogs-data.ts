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
    slug: "the-advice-we-give-anxious-people-that-doesnt-help",
    title: "The Advice We Give Anxious People That Doesn't Help",
    subtitle:
      `If you've ever dealt with anxiety, chances are you've heard some version of this: "Just relax." "Don't overthink it." "It's all in your head." "Just breathe." And chances are, none of it actually helped.`,
    categories: ["Anxiety Disorder", "Emotional Health"],
    date: "12-03-25",
    readTime: "5 mins",
    author: {
      name: "Dr. Ananya Roy",
      role: "Lead Clinical Psychologist, Durrmi",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    heroImageUrl:
      "https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&w=1200&q=80",
    midImageUrl:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
    content: {
      intro:
        `If you've ever dealt with anxiety, chances are you've heard some version of this: "Just relax." "Don't overthink it." "It's all in your head." "Just breathe." And chances are, none of it actually helped.\n\nThat's not because the people saying it don't care. Most of the time, they do. They're trying to comfort you, or fix things quickly, or simply don't know what else to say. But anxiety doesn't work the way casual advice assumes it does — and when the advice misses that, it can leave you feeling more alone than before you said anything at all.\n\nLet's look at why some of the most common things people say don't land, and what actually tends to help.`,
      sections: [
        {
          heading: "Blog Heading",
          paragraphs: [
            `If you've ever dealt with anxiety, chances are you've heard some version of this: "Just relax." "Don't overthink it." "It's all in your head." "Just breathe." And chances are, none of it actually helped.`,
            `That's not because the people saying it don't care. Most of the time, they do. They're trying to comfort you, or fix things quickly, or simply don't know what else to say. But anxiety doesn't work the way casual advice assumes it does — and when the advice misses that, it can leave you feeling more alone than before you said anything at all.`,
            `Let's look at why some of the most common things people say don't land, and what actually tends to help.`,
          ],
          highlightQuote:
            "Anxiety is a physiological alarm system, not a flaw in reasoning. You cannot argue someone out of fight-or-flight with logic alone.",
        },
        {
          heading: "Blog Heading",
          paragraphs: [
            `If you've ever dealt with anxiety, chances are you've heard some version of this: "Just relax." "Don't overthink it." "It's all in your head." "Just breathe." And chances are, none of it actually helped.`,
            `That's not because the people saying it don't care. Most of the time, they do. They're trying to comfort you, or fix things quickly, or simply don't know what else to say. But anxiety doesn't work the way casual advice assumes it does — and when the advice misses that, it can leave you feeling more alone than before you said anything at all.`,
            `Let's look at why some of the most common things people say don't land, and what actually tends to help.`,
            `If you've ever dealt with anxiety, chances are you've heard some version of this: "Just relax." "Don't overthink it." "It's all in your head." "Just breathe." And chances are, none of it actually helped.`,
            `That's not because the people saying it don't care. Most of the time, they do. They're trying to comfort you, or fix things quickly, or simply don't know what else to say. But anxiety doesn't work the way casual advice assumes it does — and when the advice misses that, it can leave you feeling more alone than before you said anything at all.`,
          ],
        },
      ],
    },
  },
  {
    id: "2",
    slug: "breaking-the-cycle-of-chronic-overthinking",
    title: "Blog Heading 1",
    subtitle:
      "How to step back from catastrophic spirals and reconnect with present grounding cues.",
    categories: ["Anxiety Disorder", "Mindfulness"],
    date: "June 12, 2026",
    readTime: "8 Min Read",
    author: {
      name: "Dr. Vikram Seth",
      role: "Psychiatrist & Cognitive Behavioral Therapist",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    heroImageUrl:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    midImageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
    content: {
      intro:
        "Rumination masquerades as problem solving. When we believe that thinking about a distressor will yield safety, our nervous system remains locked in vigilance.",
      sections: [
        {
          heading: "The Physiology of Thought Spirals",
          paragraphs: [
            "Cognitive loops occur when anticipation bypasses our sensory grounding. Breaking this cycle requires somatic intervention before verbal reasoning can take effect.",
            "Practicing 5-4-3-2-1 sensory awareness reliably interrupts amygdala activation, granting you the breathing room to choose your response.",
          ],
        },
      ],
    },
  },
  {
    id: "3",
    slug: "navigating-burnout-before-it-manifests-physically",
    title: "Blog Heading 1",
    subtitle:
      "Recognizing early cognitive fatigue and reclaiming non-negotiable boundaries at work.",
    categories: ["Anxiety Disorder", "Workplace Stress"],
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
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
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
    title: "Blog Heading 1",
    subtitle:
      "Rapid body-based techniques designed to restore autonomic balance in minutes.",
    categories: ["Anxiety Disorder", "Somatic Therapy"],
    date: "June 12, 2026",
    readTime: "8 Min Read",
    author: {
      name: "Dr. Ananya Roy",
      role: "Lead Clinical Psychologist, Durrmi",
    },
    heroImageUrl:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
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
    title: "Blog Heading 1",
    subtitle:
      "How to communicate your emotional needs without triggering protective defenses.",
    categories: ["Anxiety Disorder", "Relationships"],
    date: "June 12, 2026",
    readTime: "8 Min Read",
    author: {
      name: "Dr. Vikram Seth",
      role: "Couples & Family Specialist",
    },
    heroImageUrl:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
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
    title: "Blog Heading 1",
    subtitle:
      "The neuroscience of REM sleep, emotional regulation, and nocturnal anxiety.",
    categories: ["Anxiety Disorder", "Sleep & Recovery"],
    date: "June 12, 2026",
    readTime: "8 Min Read",
    author: {
      name: "Meera Nair",
      role: "Occupational Wellness Specialist",
    },
    heroImageUrl:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    excerpt:
      "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis molestie. Facilisi consequat integer dignissim pharetra viverra. Viverra quis cras lobortis consectetur.",
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
    (b) => b.id === idOrSlug || b.slug === idOrSlug
  );
}

export function getLatestBlogs(excludeId?: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((b) => b.id !== excludeId && b.slug !== excludeId).slice(0, limit);
}
