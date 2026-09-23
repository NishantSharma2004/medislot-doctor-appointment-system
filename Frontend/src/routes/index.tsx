import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DurrmiLogo, DurrmiLogoIcon } from "@/components/common/DurrmiLogo";
import {
  CalendarCheck,
  CalendarSearch,
  ClipboardList,
  MessageSquareText,
  ShieldCheck,
  Stethoscope,
  LayoutDashboard,
  User,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  HeartHandshake,
  ChevronDown,
  Clock,
  Award,
  Users,
  Search,
  Activity,
  Smile,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { mockSpecializations, mockDoctors } from "@/lib/api/mock-data";
import { defaultHomePageCmsData } from "@/lib/api/cms-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Durrmi — Your Journey To Wellness Starts Here" },
      {
        name: "description",
        content:
          "Search doctors by specialization, city and consultation fee, book clinic appointments, and manage your digital health vault records with Durrmi.",
      },
      { property: "og:title", content: "Durrmi — Your Journey To Wellness Starts Here" },
      {
        property: "og:description",
        content:
          "Search doctors by specialization, city and consultation fee, book clinic appointments, and manage your digital health vault records with Durrmi.",
      },
    ],
  }),
  component: LandingPage,
});

const STEPS = [
  {
    stepNo: "01",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    icon: Search,
    title: "Tell Us What You're Carrying",
    body: "Filter by anxiety, depression, relationship, stress, or burnout to find the therapist who truly gets it.",
  },
  {
    stepNo: "02",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    icon: HeartHandshake,
    title: "Get Matched With The Right Therapist",
    body: "Review verified licensed psychotherapists, qualifications, specialization focus, and transparent session rates.",
  },
  {
    stepNo: "03",
    badgeColor: "bg-teal-100 text-teal-900 border-teal-200",
    icon: CalendarCheck,
    title: "Book Your First Session",
    body: "Choose an available morning, afternoon, or evening session slot — your first session is on us with zero commitment.",
  },
];

const FAQS = [
  {
    q: "How does Durrmi therapy session booking & queue work?",
    a: "When you select a licensed therapist and book a session slot, Durrmi reserves your slot instantly and issues a private consultation token. You can pay online or choose flexible session packages.",
  },
  {
    q: "Are my session notes and health vault records confidential?",
    a: "100% Confidential! All session notes, wellness plans, and personal records inside your Health Vault are encrypted using bank-grade AES-256 encryption. Only you and your assigned therapist have access.",
  },
  {
    q: "Can I reschedule or change my therapist anytime?",
    a: "Yes! Finding the right fit matters. You can reschedule or switch your therapist anytime from your 'My Appointments' dashboard with 1-click.",
  },
  {
    q: "How do therapists share wellness plans and session guidance?",
    a: "Therapists use the Therapist Desk workspace to review your wellness history, record private session insights, and issue downloadable PDF Wellness & Guidance Plans.",
  },
];

const CONCERNS = [
  {
    name: "Anxiety & Stress Therapy",
    desc: "Chronic worry, panic attacks, social anxiety & racing thoughts.",
    bg: "bg-[#FFF8E7] hover:bg-[#FFF3D6] border-amber-200/80",
    tagBg: "bg-amber-100 text-amber-900",
    icon: Activity,
    linkSpec: "Anxiety & Stress Therapy",
  },
  {
    name: "Depression & Mood Care",
    desc: "Emotional exhaustion, persistent low mood & motivation recovery.",
    bg: "bg-[#EFF6FF] hover:bg-[#DBEAFE] border-blue-200/80",
    tagBg: "bg-blue-100 text-blue-900",
    icon: Activity,
    linkSpec: "Depression & Mood Care",
  },
  {
    name: "Couples & Relationship Counselling",
    desc: "Communication gaps, conflict resolution, trust & relationship healing.",
    bg: "bg-[#F0FDF4] hover:bg-[#DCFCE7] border-emerald-200/80",
    tagBg: "bg-emerald-100 text-emerald-900",
    icon: HeartHandshake,
    linkSpec: "Couples & Relationship Counselling",
  },
  {
    name: "Burnout & Career Stress",
    desc: "Workplace exhaustion, imposter syndrome & work-life balance.",
    bg: "bg-[#FFF1F2] hover:bg-[#FFE4E6] border-rose-200/80",
    tagBg: "bg-rose-100 text-rose-900",
    icon: Smile,
    linkSpec: "Burnout & Career Stress",
  },
  {
    name: "Trauma & Emotional Healing",
    desc: "Processing past trauma, grief, loss & deep emotional healing.",
    bg: "bg-[#FAF5FF] hover:bg-[#F3E8FF] border-purple-200/80",
    tagBg: "bg-purple-100 text-purple-900",
    icon: ShieldCheck,
    linkSpec: "Trauma & Emotional Healing",
  },
  {
    name: "Child & Teen Psychology",
    desc: "Supporting children and adolescents through growth & life transitions.",
    bg: "bg-[#FFF7ED] hover:bg-[#FFEDD5] border-orange-200/80",
    tagBg: "bg-orange-100 text-orange-900",
    icon: Users,
    linkSpec: "Child & Teen Psychology",
  },
];


const SPECIALIST_CARDS = [
  {
    id: "sp-1",
    name: "Aditi Sharma",
    role: "Anxiety specialist",
    category: "Anxiety Specialists",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sp-2",
    name: "Dr. Ryan Vance",
    role: "Anxiety specialist",
    category: "Anxiety Specialists",
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sp-3",
    name: "Aditi Sharma",
    role: "Anxiety specialist",
    category: "Anxiety Specialists",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sp-4",
    name: "Dr. Elena Rostova",
    role: "Anxiety specialist",
    category: "Anxiety Specialists",
    imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sp-5",
    name: "Dr. Michael Brown",
    role: "Depression specialist",
    category: "Depression Specialists",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sp-6",
    name: "Dr. Emily Davis",
    role: "Couple specialist",
    category: "Couple Specialists",
    imageUrl: "https://images.unsplash.com/photo-1594824813566-7885a3964478?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "sp-7",
    name: "Dr. Sarah Williams",
    role: "Stress specialist",
    category: "Stress Specialists",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
  },
];

function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const isDoctor = user?.role === "DOCTOR";
  const isAdmin = user?.role === "ADMIN";

  // Dynamic CMS Content State (Can be hydrated dynamically from GET /api/v1/pages/page_home)
  const [cmsData] = useState(defaultHomePageCmsData);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [activeSpecialistCategory, setActiveSpecialistCategory] = useState("Anxiety Specialists");
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const specialistsTrackRef = useRef<HTMLDivElement>(null);

  const scrollCards = (direction: "left" | "right") => {
    if (cardsContainerRef.current) {
      const scrollAmount = direction === "left" ? -330 : 330;
      cardsContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollSpecialists = (direction: "left" | "right") => {
    if (specialistsTrackRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      specialistsTrackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const filteredSpecialistCards = SPECIALIST_CARDS.filter(
    (item) => item.category === activeSpecialistCategory || activeSpecialistCategory === "Anxiety Specialists"
  );

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-800 font-sans selection:bg-amber-200">
      {/* 1. HERO SECTION (Durrmi Style with Left & Right Avatars) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] pt-12 pb-20 sm:pt-16 sm:pb-28 border-b border-amber-200/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Female Therapist Character Illustration */}
            <div className="hidden lg:flex shrink-0 w-72 items-center justify-center">
              <svg viewBox="0 0 240 280" className="w-full h-auto drop-shadow-md">
                {/* Orange Beanbag Chair Background */}
                <ellipse cx="100" cy="180" rx="80" ry="75" fill="#F89B29" />
                <ellipse cx="100" cy="185" rx="72" ry="65" fill="#E88A1A" />
                
                {/* Hair (Dark) */}
                <path d="M 90 60 C 70 60 65 95 65 110 C 65 125 75 130 80 130 C 85 130 90 120 90 110 Z" fill="#1A1A1A" />
                <circle cx="100" cy="75" r="28" fill="#1A1A1A" />
                
                {/* Face & Neck */}
                <path d="M 95 95 L 95 110 L 105 110 L 105 95 Z" fill="#E8A584" />
                <circle cx="102" cy="78" r="18" fill="#F2B89D" />
                <path d="M 108 72 C 112 76 112 82 108 86" stroke="#C97C5D" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="108" cy="80" r="2" fill="#1A1A1A" />
                
                {/* Green Shirt Torso */}
                <path d="M 80 110 Q 100 105 125 110 L 140 170 Q 100 175 70 170 Z" fill="#386641" />
                
                {/* Arms & Clipboard */}
                <path d="M 80 115 L 60 145 L 90 155 L 95 140 Z" fill="#386641" />
                <path d="M 120 115 L 145 140 L 125 155 Z" fill="#386641" />
                {/* Clipboard */}
                <rect x="90" y="130" width="38" height="52" rx="4" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2" transform="rotate(-12 109 156)" />
                <rect x="100" y="126" width="18" height="8" rx="2" fill="#E63946" transform="rotate(-12 109 156)" />
                <line x1="96" y1="144" x2="120" y2="144" stroke="#9CA3AF" strokeWidth="2" transform="rotate(-12 109 156)" />
                <line x1="96" y1="152" x2="120" y2="152" stroke="#9CA3AF" strokeWidth="2" transform="rotate(-12 109 156)" />
                <line x1="96" y1="160" x2="114" y2="160" stroke="#9CA3AF" strokeWidth="2" transform="rotate(-12 109 156)" />
                {/* Hands */}
                <circle cx="88" cy="154" r="6" fill="#F2B89D" />
                <circle cx="130" cy="148" r="6" fill="#F2B89D" />

                {/* Brown Trousers */}
                <path d="M 70 170 Q 100 175 140 170 L 155 220 L 125 225 L 110 185 L 95 225 L 65 220 Z" fill="#9A5034" />
                
                {/* Yellow Shoes */}
                <ellipse cx="60" cy="225" rx="14" ry="7" fill="#FFD166" />
                <path d="M 50 220 Q 60 212 72 224 Z" fill="#FFC43D" />
                <ellipse cx="160" cy="225" rx="14" ry="7" fill="#FFD166" />
                <path d="M 150 220 Q 160 212 172 224 Z" fill="#FFC43D" />
              </svg>
            </div>

            {/* Main Center Content */}
            <div className="mx-auto max-w-2xl text-center space-y-6">
              
              {/* Headline */}
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.2]">
                {isDoctor ? (
                  <>Welcome back to Doctor Desk, <span className="text-amber-700">{user?.fullName}</span></>
                ) : isAdmin ? (
                  <>Durrmi Wellness <span className="text-teal-700">Administration Portal</span></>
                ) : (
                  <>
                    <span className="block font-black">"The most important connection is the one within."</span>
                    <span className="block mt-2 font-extrabold text-amber-950">
                      — Prioritise your journey to wellness.
                    </span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <div className="mx-auto max-w-xl text-center space-y-2">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                  {isDoctor
                    ? "Review assigned patient appointments, inspect shared health vault records, record prescription notes, and publish consultation slots."
                    : isAdmin
                    ? "Monitor network analytics, manage doctor profiles, inspect security audit logs, and administer clinic documents."
                    : "Here, we do more than interact with you; we help you understand yourself. Our goal is to support you without judgment. Our advisors will be available to assist you throughout your journey."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {isDoctor ? (
                  <>
                    <Button asChild size="lg" className="h-12 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] px-7 font-black text-slate-950 text-xs uppercase tracking-wider shadow-md hover:shadow-lg gap-2">
                      <Link to="/doctor">
                        <Stethoscope className="size-4" /> Open Doctor Desk
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-slate-300 bg-white/90 px-7 font-bold text-slate-700 hover:bg-slate-100 gap-2 text-xs uppercase">
                      <Link to="/doctor/availability">
                        <CalendarCheck className="size-4 text-amber-700" /> Manage Slots
                      </Link>
                    </Button>
                  </>
                ) : isAdmin ? (
                  <Button asChild size="lg" className="h-12 rounded-full bg-teal-700 px-7 font-black text-white shadow-md hover:bg-teal-800 gap-2 text-xs uppercase">
                    <Link to="/admin">
                      <LayoutDashboard className="size-4" /> Open Admin Panel
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="h-12 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] px-8 font-black text-slate-950 text-xs shadow-md hover:shadow-lg transition-all border border-amber-500/30 gap-1.5">
                      <Link to="/free-session">
                        Reserve Your Free Session <span className="text-base leading-none">↗</span>
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-slate-400/80 bg-white/80 px-7 font-bold text-slate-800 hover:bg-slate-100 text-xs shadow-xs">
                      <a href="#why-durrmi">Explore Our Expertise</a>
                    </Button>
                  </>
                )}
              </div>

              {/* Trust Avatar Stack Badge */}
              <div className="pt-2 flex flex-col items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  <div className="size-8 rounded-full border-2 border-white bg-amber-200 grid place-items-center text-xs font-bold">👨‍💼</div>
                  <div className="size-8 rounded-full border-2 border-white bg-teal-200 grid place-items-center text-xs font-bold">👩‍⚕️</div>
                  <div className="size-8 rounded-full border-2 border-white bg-rose-200 grid place-items-center text-xs font-bold">👨‍⚕️</div>
                  <div className="size-8 rounded-full border-2 border-white bg-purple-200 grid place-items-center text-xs font-bold">👩‍💻</div>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Trusted by over <span className="text-slate-900 font-extrabold">1000+ customers</span>
                </span>
              </div>
            </div>

            {/* Right Female Client Character Illustration */}
            <div className="hidden lg:flex shrink-0 w-72 items-center justify-center">
              <svg viewBox="0 0 240 280" className="w-full h-auto drop-shadow-md">
                {/* Orange Beanbag Chair Background */}
                <ellipse cx="140" cy="180" rx="80" ry="75" fill="#F89B29" />
                <ellipse cx="140" cy="185" rx="72" ry="65" fill="#E88A1A" />
                
                {/* Hair (Dark long hair) */}
                <path d="M 130 55 C 105 55 100 95 100 135 C 100 145 110 150 115 150 Z" fill="#1A1A1A" />
                <path d="M 150 55 C 175 55 180 95 180 135 C 180 145 170 150 165 150 Z" fill="#1A1A1A" />
                <circle cx="140" cy="72" r="26" fill="#1A1A1A" />
                
                {/* Face & Neck */}
                <path d="M 135 92 L 135 108 L 145 108 L 145 92 Z" fill="#E8A584" />
                <circle cx="138" cy="76" r="17" fill="#F2B89D" />
                <path d="M 132 72 C 128 76 128 82 132 86" stroke="#C97C5D" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="132" cy="78" r="2" fill="#1A1A1A" />
                
                {/* Yellow Top Torso */}
                <path d="M 120 108 Q 140 104 160 108 L 172 165 Q 140 172 108 165 Z" fill="#F4A261" />
                
                {/* Folded Arms */}
                <path d="M 120 112 Q 105 135 125 155 Q 155 155 160 135 Z" fill="#E76F51" />
                <circle cx="140" cy="150" r="7" fill="#F2B89D" />

                {/* Dark Green Trousers */}
                <path d="M 108 165 Q 140 172 172 165 L 180 220 L 150 225 L 140 182 L 130 225 L 100 220 Z" fill="#2A9D8F" />
                
                {/* Brown Shoes */}
                <ellipse cx="95" cy="225" rx="14" ry="7" fill="#7F4F24" />
                <path d="M 85 220 Q 95 212 107 224 Z" fill="#58310E" />
                <ellipse cx="185" cy="225" rx="14" ry="7" fill="#7F4F24" />
                <path d="M 175 220 Q 185 212 197 224 Z" fill="#58310E" />
              </svg>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUSTED METRICS BAR (Matching Uploaded Design) */}
      <section className="bg-[#FAF8F3] py-16 border-b border-amber-200/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <p className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Trusted by people who took the first step.
          </p>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="rounded-[28px] border border-amber-200/80 bg-gradient-to-b from-white via-[#FFFDF8] to-[#FFF8E7] p-8 text-left shadow-sm relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B] rounded-t-[28px]" />
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">96%</p>
              <p className="mt-3 text-xs font-semibold text-slate-700">Client Success Rate</p>
            </div>

            {/* Card 2 */}
            <div className="rounded-[28px] border border-amber-200/80 bg-gradient-to-b from-white via-[#FFFDF8] to-[#FFF8E7] p-8 text-left shadow-sm relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B] rounded-t-[28px]" />
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">100+</p>
              <p className="mt-3 text-xs font-semibold text-slate-700">Happy Clients</p>
            </div>

            {/* Card 3 */}
            <div className="rounded-[28px] border border-amber-200/80 bg-gradient-to-b from-white via-[#FFFDF8] to-[#FFF8E7] p-8 text-left shadow-sm relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B] rounded-t-[28px]" />
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">10+</p>
              <p className="mt-3 text-xs font-semibold text-slate-700">Years Experience</p>
            </div>

            {/* Card 4 */}
            <div className="rounded-[28px] border border-amber-200/80 bg-gradient-to-b from-white via-[#FFFDF8] to-[#FFF8E7] p-8 text-left shadow-sm relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B] rounded-t-[28px]" />
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">50+</p>
              <p className="mt-3 text-xs font-semibold text-slate-700">Expert Consultants</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3-STEP PROCESS SECTION */}
      <section id="how-it-works" className="bg-[#FAF6EE] py-20 border-t border-b border-amber-200/60 scroll-mt-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Getting Started Shouldn't Be The Hardest Part.
          </h2>
          <p className="text-base font-extrabold text-amber-900">
            Start your self-care journey — it's never too late.
          </p>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            3 Simple steps to connect with your well-being.
          </p>

          <div className="mt-16 grid gap-10 md:grid-cols-3 relative items-start">
            {/* Step 1: Yellow 12-point star icon */}
            <div className="space-y-4 text-center group">
              <div className="mx-auto size-16 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 100 100" className="size-14 drop-shadow-sm">
                  <path fill="#FFBE0B" d="M50 0 L58 32 L90 10 L70 40 L100 50 L70 60 L90 90 L58 68 L50 100 L42 68 L10 90 L30 60 L0 50 L30 40 L10 10 L42 32 Z" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Talk at Your Own Pace.
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium max-w-xs mx-auto">
                Tell us what you're facing. Share as much or as little as you're ready to. There's no pressure to have the right words, whenever you're ready. <span className="font-bold text-amber-900">"YOUR WELLNESS AIM"</span> Connect with our licensed online therapist. Get Matched With The Right Therapist.
              </p>
            </div>

            {/* Step 2: Light blue plus icon */}
            <div className="space-y-4 text-center group md:mt-8">
              <div className="mx-auto size-16 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 100 100" className="size-14 drop-shadow-sm">
                  <path fill="#7BBDF7" d="M35 0 H65 V35 H100 V65 H65 V100 H35 V65 H0 V35 H35 Z" rx="10" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Get matched to the right expert.
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium max-w-xs mx-auto">
                We handpick a professional suited to your actual problem, not a random name from a list. <span className="font-bold text-blue-950">"Find support that touches your soul – not just words."</span> Matched to your actual problem, not generic advice. Book your sessions now. Our professionals are available to provide you with emotional support.
              </p>
            </div>

            {/* Step 3: Orange 6-point star icon */}
            <div className="space-y-4 text-center group">
              <div className="mx-auto size-16 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 100 100" className="size-14 drop-shadow-sm">
                  <path fill="#F7A072" d="M50 0 L63 35 L100 50 L63 65 L50 100 L37 65 L0 50 L37 35 Z" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Switch Anytime, No Awkwardness.
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium max-w-xs mx-auto">
                Connect with your expert. <span className="font-bold text-orange-950">"Durrmi asks you to come back to yourself."</span> If the fit isn't right, change therapists whenever you need to — finding the right person matters more than sticking with the first match. Select a convenient time and session format. Remember, sometimes, it starts with a small, meaningful step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE DURRMI & ABOUT US PHILOSOPHY */}
      <section id="why-durrmi" className="bg-[#FDEBB2]/90 py-20 overflow-hidden relative scroll-mt-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-amber-950 bg-amber-200 px-4 py-1 rounded-full border border-amber-400">
            WHY DURRMI — ABOUT US
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 pt-2">
            "Durrmi" means "Find Your Way Within."
          </h2>
          <p className="text-sm sm:text-base font-extrabold text-[#5C4105] max-w-2xl mx-auto leading-relaxed">
            The right therapist for you — who pushes you to stabilise your awareness.
          </p>
        </div>

        {/* CORNER-OVERLAPPING CARDS CONTAINER */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-12 relative flex flex-col items-center">
          {/* Card 1 */}
          <div className="w-full sm:w-[500px] bg-[#F7D479] border border-amber-700/30 rounded-[28px] p-6 sm:p-7 shadow-lg shadow-amber-950/10 transform sm:translate-x-16 hover:scale-[1.02] transition-all duration-300 z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="size-16 rounded-full bg-[#E5B551] flex items-center justify-center text-3xl shrink-0 shadow-inner">
                👩‍⚕️
              </div>
              <div className="text-left space-y-1.5">
                <h3 className="text-lg font-black text-[#5C4105] leading-snug">
                  Vetted Expert, Not A Directory
                </h3>
                <p className="text-xs font-bold text-amber-950 italic">
                  "Skip the search. Talk to a trusted expert right now."
                </p>
                <p className="text-xs font-medium text-[#73540F] leading-relaxed">
                  At Durrmi, we have chosen experts for your emotions and well-being. Real support, not a directory. We personally interview, test and verify the professionals.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="w-full sm:w-[500px] bg-[#A4D4FF] border border-blue-600/30 rounded-[28px] p-6 sm:p-7 shadow-xl shadow-blue-950/10 transform -mt-4 sm:-mt-6 sm:-translate-x-16 hover:scale-[1.02] transition-all duration-300 z-20">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="size-16 rounded-full bg-[#7BBDF7] flex items-center justify-center text-3xl shrink-0 shadow-inner">
                🩺
              </div>
              <div className="text-left space-y-1.5">
                <h3 className="text-lg font-black text-[#104778] leading-snug">
                  Matched To Your Actual Problem
                </h3>
                <p className="text-xs font-bold text-blue-950 italic">
                  "The Right Therapist for What You're Actually Facing."
                </p>
                <p className="text-xs font-medium text-[#1E5D96] leading-relaxed">
                  For a better approach, choose your experts based on what you're actually facing. You can match yourself to the professional who fits your challenge — real support for your emotions and well-being, as per your purpose.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="w-full sm:w-[500px] bg-[#F7C6A3] border border-orange-700/30 rounded-[28px] p-6 sm:p-7 shadow-lg shadow-orange-950/10 transform -mt-4 sm:-mt-6 sm:translate-x-16 hover:scale-[1.02] transition-all duration-300 z-30">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="text-left space-y-1.5 order-2 sm:order-1">
                <h3 className="text-lg font-black text-[#612A0A] leading-snug">
                  Clear Pricing No Surprises
                </h3>
                <p className="text-xs font-bold text-orange-950 italic">
                  "Simple, Honest & Clear Pricing."
                </p>
                <p className="text-xs font-medium text-[#7D3B14] leading-relaxed">
                  At Durrmi, you pay for what you see. The transparency of clear, upfront pricing with no hidden fees, no locked-in contracts, and no guessing games. Just honest access to the right expert for your emotions and well-being.
                </p>
              </div>
              <div className="size-16 rounded-full bg-[#E5AA80] flex items-center justify-center text-3xl shrink-0 shadow-inner order-1 sm:order-2">
                👨‍⚕️
              </div>
            </div>
          </div>
        </div>


      </section>

      {/* 5. SPECIALIZATIONS CAROUSEL */}
      <section className="bg-[#FAF7EF] py-20 border-t border-b border-amber-200/50 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            
            {/* Left Header Box */}
            <div className="lg:max-w-md space-y-4 shrink-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                SPECIALISATIONS & SERVICES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-[1.18]">
                The real luxury? A peaceful mind & a life full of ease.
              </h2>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Talk about it; don't carry it; <span className="font-extrabold text-slate-900">"our experts truly understand."</span> Find a helping partner here for your anxiety, depression, loss, or grief that you want to share. You were never meant to carry it all alone.
              </p>
              <div className="pt-2">
                <Button asChild size="lg" className="h-11 px-7 rounded-full bg-[#FFBE0B] hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs transition-all">
                  <Link to="/doctors">Explore Specialisations</Link>
                </Button>
              </div>
            </div>

            {/* Right Cards Carousel Track */}
            <div className="w-full lg:max-w-3xl space-y-4 min-w-0">
              <div className="flex items-center justify-end gap-3 pr-2">
                <button
                  type="button"
                  onClick={() => scrollCards("left")}
                  aria-label="Previous specialisations"
                  className="size-10 rounded-full border border-slate-400/80 bg-white flex items-center justify-center text-slate-800 hover:bg-amber-50 hover:border-amber-400 transition-all shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCards("right")}
                  aria-label="Next specialisations"
                  className="size-10 rounded-full border border-slate-400/80 bg-white flex items-center justify-center text-slate-800 hover:bg-amber-50 hover:border-amber-400 transition-all shadow-xs cursor-pointer"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>

              <div
                ref={cardsContainerRef}
                className="flex gap-5 overflow-x-auto scrollbar-none py-2 px-1 snap-x scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {/* Card 1: Individual Therapy */}
                <div className="w-[280px] sm:w-[310px] shrink-0 h-[360px] rounded-[28px] bg-gradient-to-b from-white via-[#FFF9EA] to-[#FFEEC4] border border-amber-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden relative snap-start transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="h-2.5 w-full bg-[#FFBE0B] rounded-t-[28px] absolute top-0 left-0 right-0" />
                  <div className="space-y-3 pt-2 z-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Individual therapy</h3>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      1 on 1 culturally inclusive, trauma-informed support for all the challenges and transitions in life to help you with meaningful personal growth.
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-10 -left-10 size-48 opacity-80 pointer-events-none">
                    <path fill="#FDE68A" d="M100 10 L112 68 L170 30 L132 88 L190 100 L132 112 L170 170 L112 132 L100 190 L88 132 L30 170 L68 112 L10 100 L68 88 L30 30 L88 68 Z" />
                  </svg>
                </div>

                {/* Card 2: Couple & Family counselling */}
                <Link
                  to="/services/couples-therapy"
                  className="w-[280px] sm:w-[310px] shrink-0 h-[360px] rounded-[28px] bg-gradient-to-b from-white via-[#F0F8FF] to-[#D5E9FF] border border-blue-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden relative snap-start transition-all hover:shadow-xl hover:-translate-y-1 block group"
                >
                  <div className="h-2.5 w-full bg-[#7BBDF7] rounded-t-[28px] absolute top-0 left-0 right-0" />
                  <div className="space-y-3 pt-2 z-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-900 transition-colors">Couple & Family counselling</h3>
                      <span className="text-blue-600 text-sm font-black">↗</span>
                    </div>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      Navigate conflicts, identify patterns and strengthen your relationship to a healthier version.
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-10 -left-10 size-48 opacity-85 pointer-events-none">
                    <path fill="#BAE6FD" d="M100 15 C115 55 145 55 160 100 C145 145 115 145 100 185 C85 145 55 145 40 100 C55 55 85 55 100 15 Z" />
                  </svg>
                </Link>

                {/* Card 3: Child and adolescent therapy */}
                <div className="w-[280px] sm:w-[310px] shrink-0 h-[360px] rounded-[28px] bg-gradient-to-b from-white via-[#FFF5ED] to-[#FFE2CD] border border-orange-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden relative snap-start transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="h-2.5 w-full bg-[#FF9F43] rounded-t-[28px] absolute top-0 left-0 right-0" />
                  <div className="space-y-3 pt-2 z-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Child & adolescent therapy</h3>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      Find support for academic challenges, behavioural concerns, and emotional navigation through all your child's developmental stages.
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-10 -left-6 size-44 opacity-85 pointer-events-none">
                    <path fill="#FED7AA" d="M100 0 C105 70 130 95 200 100 C130 105 105 130 100 200 C95 130 70 105 0 100 C70 95 95 70 100 0 Z" />
                  </svg>
                </div>

                {/* Card 4: Geriatric Support */}
                <div className="w-[280px] sm:w-[310px] shrink-0 h-[360px] rounded-[28px] bg-gradient-to-b from-white via-[#F0FDF4] to-[#C7F9D9] border border-emerald-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden relative snap-start transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="h-2.5 w-full bg-[#2ECC71] rounded-t-[28px] absolute top-0 left-0 right-0" />
                  <div className="space-y-3 pt-2 z-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Geriatric Support</h3>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      A respectful and compassionate space to process ageing, loss, and life transitions without feeling alone.
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-8 -left-8 size-48 opacity-85 pointer-events-none">
                    <path fill="#A7F3D0" d="M100 10 C120 60 160 60 190 100 C160 140 120 140 100 190 C80 140 40 140 10 100 C40 60 80 60 100 10 Z" />
                  </svg>
                </div>

                {/* Card 5: Relationship / Connection */}
                <div className="w-[280px] sm:w-[310px] shrink-0 h-[360px] rounded-[28px] bg-gradient-to-b from-white via-[#F9F5FF] to-[#E5CEFF] border border-purple-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden relative snap-start transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="h-2.5 w-full bg-[#A55EEA] rounded-t-[28px] absolute top-0 left-0 right-0" />
                  <div className="space-y-3 pt-2 z-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Relationship / Connection</h3>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      Unresolved emotions do not stay silent; it leaks through every conversation. Working together will help.
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-8 -left-8 size-48 opacity-85 pointer-events-none">
                    <path fill="#DDD6FE" d="M100 10 C105 70 130 80 190 100 C130 120 105 130 100 190 C95 130 70 120 10 100 C70 80 95 70 100 10 Z" />
                  </svg>
                </div>

                {/* Card 6: Addiction Support */}
                <div className="w-[280px] sm:w-[310px] shrink-0 h-[360px] rounded-[28px] bg-gradient-to-b from-white via-[#FFF1F2] to-[#FECDD3] border border-rose-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden relative snap-start transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="h-2.5 w-full bg-[#E11D48] rounded-t-[28px] absolute top-0 left-0 right-0" />
                  <div className="space-y-3 pt-2 z-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Addiction Support</h3>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      Addictions holding you back? <span className="font-extrabold text-rose-950">"We understand this deeply."</span> We do not dismiss these issues; instead, we listen and provide support.
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-8 -left-8 size-48 opacity-85 pointer-events-none">
                    <path fill="#FECDD3" d="M100 10 L120 70 L180 80 L130 120 L150 180 L100 140 L50 180 L70 120 L20 80 L80 70 Z" />
                  </svg>
                </div>

                {/* Card 7: Coaching */}
                <div className="w-[280px] sm:w-[310px] shrink-0 h-[360px] rounded-[28px] bg-gradient-to-b from-white via-[#F0FDF4] to-[#DCFCE7] border border-emerald-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden relative snap-start transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="h-2.5 w-full bg-[#22C55E] rounded-t-[28px] absolute top-0 left-0 right-0" />
                  <div className="space-y-3 pt-2 z-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Coaching</h3>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      You don’t need therapy but would like to work with a professional collaboratively to unlock your higher potential.
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-10 -left-10 size-48 opacity-80 pointer-events-none">
                    <polygon fill="#BBF7D0" points="100,10 120,70 185,75 135,120 155,185 100,145 45,185 65,120 15,75 80,70" />
                  </svg>
                </div>

                {/* Card 8: Group Therapy */}
                <div className="w-[280px] sm:w-[310px] shrink-0 h-[360px] rounded-[28px] bg-gradient-to-b from-white via-[#EEF2FF] to-[#E0E7FF] border border-indigo-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden relative snap-start transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="h-2.5 w-full bg-[#4338CA] rounded-t-[28px] absolute top-0 left-0 right-0" />
                  <div className="space-y-3 pt-2 z-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Group Therapy</h3>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      Not alone in this. A support group that meets weekly to lift each other through similar challenges
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-10 -left-10 size-48 opacity-75 pointer-events-none">
                    <g transform="rotate(45 100 100)" fill="#C7D2FE">
                      <rect x="75" y="10" width="50" height="180" rx="25" />
                      <rect x="10" y="75" width="180" height="50" rx="25" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. THE PEOPLE BEHIND DURRMI / THERAPIST SHOWCASE (Matching Images 1 & 2) */}
      <section className="bg-[#FAF8F3] py-20 border-t border-amber-200/50">
        
        {/* Our Specialists Team Carousel */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Meet the caring team that makes it all happen.
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-lg mx-auto pt-1">
              Real talk, Real credentials, and no algorithms. ~Therapist says healing starts with real conversations.
            </p>
          </div>

          {/* Specialist Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto pt-2">
            {["Anxiety Specialists", "Depression Specialists", "Couple Specialists", "Stress Specialists"].map((spec) => {
              const isActive = activeSpecialistCategory === spec;
              return (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setActiveSpecialistCategory(spec)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs ${
                    isActive
                      ? "bg-[#FFBE0B] text-slate-950 border-2 border-amber-400 scale-105"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-amber-50 hover:text-slate-900"
                  }`}
                >
                  {spec}
                </button>
              );
            })}
          </div>

          {/* Specialist Full-Photo Cards Track */}
          <div className="relative pt-6">
            <div
              ref={specialistsTrackRef}
              className="flex gap-6 overflow-x-auto scrollbar-none py-4 px-2 snap-x scroll-smooth max-w-6xl mx-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredSpecialistCards.map((therapist) => (
                <div
                  key={therapist.id}
                  className="w-[260px] sm:w-[300px] h-[360px] sm:h-[400px] rounded-[28px] overflow-hidden relative shadow-md shrink-0 snap-start transition-all hover:scale-[1.02] bg-slate-100 border border-slate-200"
                >
                  <img
                    src={therapist.imageUrl}
                    alt={therapist.name}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Overlapping Yellow Name & Role Badge (Bottom Left) */}
                  <div className="absolute bottom-0 left-0 bg-[#FCE6A6] text-slate-950 px-5 py-3 rounded-tr-2xl rounded-bl-2xl border-t border-r border-amber-300 shadow-md text-left z-10">
                    <p className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                      {therapist.name}
                    </p>
                    <p className="text-[11px] font-bold text-amber-900 leading-tight mt-0.5">
                      {therapist.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Arrow Controls & Dots */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                type="button"
                onClick={() => scrollSpecialists("left")}
                aria-label="Previous specialists"
                className="size-11 rounded-full border-2 border-slate-900 bg-white flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-xs cursor-pointer font-black text-lg"
              >
                ←
              </button>

              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="size-2 rounded-full bg-slate-900" />
                <span className="size-2 rounded-full bg-slate-400" />
                <span className="size-2 rounded-full bg-slate-400" />
              </div>

              <button
                type="button"
                onClick={() => scrollSpecialists("right")}
                aria-label="Next specialists"
                className="size-11 rounded-full border-2 border-slate-900 bg-white flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-xs cursor-pointer font-black text-lg"
              >
                →
              </button>
            </div>

            {/* Meet Our Full Therapist Team Link */}
            <div className="pt-6">
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-2 border-slate-900 bg-white hover:bg-slate-900 hover:text-white px-8 font-black text-xs uppercase tracking-wider transition-all shadow-xs"
              >
                <Link to="/therapists">
                  Meet Our Full Therapist Team →
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 6.5 NOT SURE WHERE TO START? THAT'S OKAY. (Matching Screenshot 1) */}
      <section className="bg-[#FAF8F3] py-14 sm:py-20 border-b border-amber-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[36px] bg-[#FFBE0B] border-2 border-amber-500/40 p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Heading, description, pills & button */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                  No clue where to start? Don't worry we are here.
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 max-w-lg leading-relaxed">
                  Feeling stuck before you even begin? Totally normal- you don't need a perfect word or a whole plan. Just show up as you are, and we'll help you take the first step at a time.
                </p>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <span className="px-4 py-2 rounded-full bg-white/95 border border-amber-900/20 text-xs font-bold text-slate-900 shadow-xs">
                    Relationship Recovery
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/95 border border-amber-900/20 text-xs font-bold text-slate-900 shadow-xs">
                    Weekly Support
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/95 border border-amber-900/20 text-xs font-bold text-slate-900 shadow-xs">
                    Anxiety Care
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/95 border border-amber-900/20 text-xs font-bold text-slate-900 shadow-xs">
                    Stress Management Journey
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/95 border border-amber-900/20 text-xs font-bold text-slate-900 shadow-xs">
                    Depression Support
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/95 border border-amber-900/20 text-xs font-bold text-slate-900 shadow-xs">
                    Couples Therapy
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/95 border border-amber-900/20 text-xs font-bold text-slate-900 shadow-xs">
                    Monthly Support
                  </span>
                </div>

                {/* Button */}
                <div className="pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="h-12 px-8 rounded-full bg-white text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:bg-slate-100 hover:shadow-lg transition-all border border-slate-200"
                  >
                    <Link to="/doctors">Book a free session</Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: Friends image */}
              <div className="lg:col-span-5 flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=800&q=80"
                  alt="Friends celebrating and connecting happily"
                  className="w-full h-72 sm:h-96 object-cover rounded-[28px] shadow-lg border-2 border-white/60"
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 7. PATIENT TESTIMONIALS SECTION (Stacked Card Deck Layout matching Screenshot 1) */}
      <section id="patient-reviews" className="bg-[#FAF6EE] py-20 border-t border-b border-amber-200/60 scroll-mt-10 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            
            {/* Left Side: Overlapping Stacked Card Carousel Deck */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative w-full max-w-lg h-[260px] sm:h-[280px]">
                {/* Background Card 2 (Layered Behind) */}
                <div className="absolute inset-0 rounded-[32px] border-2 border-amber-300/40 bg-[#FFF3D6] transform rotate-3 translate-x-4 translate-y-3 shadow-sm transition-transform duration-300" />
                {/* Background Card 1 (Layered Behind) */}
                <div className="absolute inset-0 rounded-[32px] border-2 border-orange-300/40 bg-[#FFE8D6] transform -rotate-2 -translate-x-3 translate-y-1 shadow-sm transition-transform duration-300" />

                {/* Active Front Card */}
                {cmsData.testimonials.testimonials.map((review, idx) => {
                  if (idx !== activeReviewIndex) return null;
                  return (
                    <div
                      key={review.id || idx}
                      className="relative z-10 w-full h-full rounded-[32px] border-2 border-amber-300 bg-white p-7 sm:p-8 shadow-xl flex flex-col justify-between transition-all duration-300 animate-in fade-in zoom-in-95"
                    >
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic">
                        {review.quote}
                      </p>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-black text-slate-900">{review.author}</p>
                          <p className="text-[11px] font-bold text-amber-700">{review.role}</p>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          Verified
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side: Title, Subtitle, Rating & Interactive Swipe Buttons */}
            <div className="lg:col-span-5 space-y-5 text-left">
              <span className="text-xs font-black uppercase tracking-widest text-amber-950 bg-amber-200 px-4 py-1 rounded-full border border-amber-400">
                {cmsData.testimonials.tag}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Their Words, Not Ours.
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                {cmsData.testimonials.subtitle}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-sm font-black text-slate-900">{cmsData.testimonials.ratingScore}</span>
                <div className="flex text-amber-500">
                  <Star className="size-4 fill-amber-500" />
                  <Star className="size-4 fill-amber-500" />
                  <Star className="size-4 fill-amber-500" />
                  <Star className="size-4 fill-amber-500" />
                  <Star className="size-4 fill-amber-500" />
                </div>
                <span className="text-xs font-semibold text-slate-500">{cmsData.testimonials.reviewCount}</span>
              </div>

              {/* Interactive Pill Buttons (← and →) */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveReviewIndex((prev) =>
                      prev === 0 ? cmsData.testimonials.testimonials.length - 1 : prev - 1
                    )
                  }
                  aria-label="Previous testimonial"
                  className="size-11 rounded-full border-2 border-slate-900 bg-white flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-xs cursor-pointer font-black text-lg"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveReviewIndex((prev) =>
                      prev === cmsData.testimonials.testimonials.length - 1 ? 0 : prev + 1
                    )
                  }
                  aria-label="Next testimonial"
                  className="size-11 rounded-full border-2 border-slate-900 bg-white flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-xs cursor-pointer font-black text-lg"
                >
                  →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. PRICING & WAYS TO GET SUPPORT (Exact Match to Screenshots 1 & 2) */}
      <section id="pricing" className="bg-[#FAF8F3] py-20 scroll-mt-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Two Ways To Get Support
          </h2>
          <p className="text-sm font-semibold text-slate-700 max-w-xl mx-auto">
            Book a single session when you need an answer, or a package when you need someone in your corner.
          </p>

          {/* TWO PRICING CARDS */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto items-stretch">
            {/* Card 1: Pre-Consultation */}
            <div className="rounded-[28px] border-2 border-amber-400 bg-white p-8 shadow-xs flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#FFBE0B]" />
              <div className="space-y-4 pt-2">
                <h3 className="text-2xl font-black text-slate-900">Pre-Consultation</h3>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  One focused session with a consultant. Pay only for the time you book
                </p>
                <div className="pt-2">
                  <p className="text-3xl sm:text-4xl font-black text-slate-900">Starts At ₹999</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-1">per session · set by each consultant</p>
                </div>
                <ul className="space-y-3 text-xs font-semibold text-slate-700 pt-4 border-t border-slate-100">
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded-md bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Single session, no commitment</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded-md bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Rate shown upfront before booking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded-md bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Pick the consultant and slot</span>
                  </li>
                </ul>
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8 rounded-full border-2 border-slate-900 bg-white text-slate-900 font-extrabold hover:bg-slate-100 text-xs tracking-tight h-12 w-full">
                <Link to="/doctors">Book a Consultancy</Link>
              </Button>
            </div>

            {/* Card 2: Package Pricing */}
            <div className="rounded-[28px] border-2 border-[#7BBDF7] bg-white p-8 shadow-xs flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#7BBDF7]" />
              <div className="space-y-4 pt-2">
                <h3 className="text-2xl font-black text-slate-900">Package Pricing</h3>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  Bundle multiple sessions with the same consultant at a lower effective rates
                </p>
                <div className="pt-2">
                  <p className="text-3xl sm:text-4xl font-black text-slate-900">Starts At ₹1,299</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-1">per package · scales with sessions included</p>
                </div>
                <ul className="space-y-3 text-xs font-semibold text-slate-700 pt-4 border-t border-slate-100">
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded-md bg-[#7BBDF7] text-white flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Multi-session bundle, better rate</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded-md bg-[#7BBDF7] text-white flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Continuity with one consultant</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded-md bg-[#7BBDF7] text-white flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Flexible scheduling across sessions</span>
                  </li>
                </ul>
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8 rounded-full border-2 border-slate-900 bg-white text-slate-900 font-extrabold hover:bg-slate-100 text-xs tracking-tight h-12 w-full">
                <Link to="/doctors">Explore Packages</Link>
              </Button>
            </div>
          </div>

          {/* Yellow Pill Bottom Button */}
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" className="h-12 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs tracking-wider shadow-md border border-amber-400">
              <Link to="/pricing">Know more about our pricing ↗</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION SECTION */}
      <section id="faq" className="bg-[#FAF6EE] py-20 border-t border-amber-200/60 scroll-mt-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10">
            
            {/* Left Question Box */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Questions? We've Got Answers.
              </h2>
              <div className="rounded-[28px] border-2 border-amber-400 bg-white p-7 shadow-xs space-y-4">
                <h3 className="text-2xl font-black text-slate-900">Still Have Any Questions?</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Need help choosing a therapist or setting up your mental wellness plan? Our support team is here to assist.
                </p>
                <Button asChild size="lg" className="h-11 px-7 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
                  <Link to="/contact">Contact us ↗</Link>
                </Button>
              </div>
            </div>

            {/* Right Accordions List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                  className="flex w-full items-center justify-between text-left font-bold text-slate-900 text-sm sm:text-base gap-3"
                >
                  <span>How does Durrmi match me with a therapist?</span>
                  <span className="size-7 rounded-lg bg-amber-400/80 flex items-center justify-center text-slate-950 shrink-0 font-black text-xs">
                    {openFaq === 0 ? "▲" : "▼"}
                  </span>
                </button>
                {openFaq === 0 ? (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t pt-3 font-medium">
                    Tell us what you're going through and your preferences. Durrmi uses that information to recommend therapists specialising in your specific concern.
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                  className="flex w-full items-center justify-between text-left font-bold text-slate-900 text-sm sm:text-base gap-3"
                >
                  <span>Can I choose my therapist?</span>
                  <span className="size-7 rounded-lg bg-amber-400/80 flex items-center justify-center text-slate-950 shrink-0 font-black text-xs">
                    {openFaq === 1 ? "▲" : "▼"}
                  </span>
                </button>
                {openFaq === 1 ? (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t pt-3 font-medium">
                    Yes. You can choose a consultant and select an available session slot.
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                  className="flex w-full items-center justify-between text-left font-bold text-slate-900 text-sm sm:text-base gap-3"
                >
                  <span>How much does a session cost?</span>
                  <span className="size-7 rounded-lg bg-amber-400/80 flex items-center justify-center text-slate-950 shrink-0 font-black text-xs">
                    {openFaq === 2 ? "▲" : "▼"}
                  </span>
                </button>
                {openFaq === 2 ? (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t pt-3 font-medium">
                    Session and package pricing is shown upfront before booking.
                  </p>
                ) : null}
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* 10. CTA BANNER ("Your First Session Is On Us" matching Screenshot 1) */}
      <section className="bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] py-20 border-t border-amber-200/60 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Vector Illustration: Two People Sitting Together on Beanbag Chair */}
            <div className="hidden lg:flex shrink-0 w-80 items-center justify-center">
              <svg viewBox="0 0 280 280" className="w-full h-auto drop-shadow-md">
                {/* Large Orange Beanbag Chair Background */}
                <ellipse cx="140" cy="190" rx="120" ry="80" fill="#F89B29" />
                <ellipse cx="140" cy="195" rx="110" ry="70" fill="#E88A1A" />

                {/* --- Left Person: Man in Brown Vest & Green Trousers --- */}
                <path d="M 60 70 C 45 70 40 95 40 105 C 40 115 50 120 55 120 Z" fill="#1A1A1A" />
                <circle cx="65" cy="78" r="20" fill="#1A1A1A" />
                <path d="M 60 92 L 60 106 L 70 106 L 70 92 Z" fill="#E8A584" />
                <circle cx="68" cy="80" r="14" fill="#F2B89D" />
                <path d="M 45 106 Q 65 102 85 106 L 95 160 Q 65 165 35 160 Z" fill="#9A5034" />
                <path d="M 58 106 L 65 160 L 75 160 L 68 106 Z" fill="#FFD166" />
                <path d="M 35 160 Q 65 165 95 160 L 105 215 L 75 220 L 65 178 L 55 220 L 25 215 Z" fill="#386641" />
                <ellipse cx="20" cy="220" rx="12" ry="6" fill="#E63946" />
                <ellipse cx="80" cy="223" rx="12" ry="6" fill="#E63946" />

                {/* --- Right Person: Woman in Red Sweater & Yellow Trousers --- */}
                <path d="M 130 65 C 110 65 105 100 105 130 C 105 140 115 145 120 145 Z" fill="#1A1A1A" />
                <circle cx="135" cy="75" r="22" fill="#1A1A1A" />
                <path d="M 130 92 L 130 106 L 140 106 L 140 92 Z" fill="#E8A584" />
                <circle cx="132" cy="78" r="15" fill="#F2B89D" />
                <path d="M 115 106 Q 135 102 155 106 L 165 160 Q 135 165 105 160 Z" fill="#C94A29" />
                <path d="M 105 160 Q 135 165 165 160 L 175 215 L 145 220 L 135 178 L 125 220 L 95 215 Z" fill="#FFC43D" />
                <ellipse cx="90" cy="220" rx="12" ry="6" fill="#E63946" />
                <ellipse cx="150" cy="223" rx="12" ry="6" fill="#E63946" />
              </svg>
            </div>

            {/* Center Content Column */}
            <div className="mx-auto max-w-2xl text-center space-y-5">
              
              {/* Avatar Stack + Customer Count */}
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex -space-x-2.5 overflow-hidden items-center justify-center">
                  <img
                    className="inline-block size-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Customer avatar 1"
                  />
                  <img
                    className="inline-block size-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                    alt="Customer avatar 2"
                  />
                  <img
                    className="inline-block size-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                    alt="Customer avatar 3"
                  />
                  <img
                    className="inline-block size-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                    alt="Customer avatar 4"
                  />
                  <img
                    className="inline-block size-9 rounded-full ring-2 ring-white object-cover shadow-xs"
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                    alt="Customer avatar 5"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-700 tracking-tight">
                  Trusted by over 1000+ customers
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] pt-1">
                Completely free. Totally chill.<br />Massive Clarity.
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base font-semibold text-slate-600 max-w-lg mx-auto leading-relaxed">
                Meet your guide with zero awkwardness at Durrmi.
              </p>

              {/* Yellow Pill Button */}
              <div className="pt-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-9 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/40"
                >
                  <Link to="/free-session">Book a free session</Link>
                </Button>
              </div>
            </div>

            {/* Right Vector Illustration: Female Therapist in Green Jacket & Yellow Trousers in Beanbag */}
            <div className="hidden lg:flex shrink-0 w-80 items-center justify-center">
              <svg viewBox="0 0 240 280" className="w-full h-auto drop-shadow-md">
                {/* Orange Beanbag Chair Background */}
                <ellipse cx="120" cy="180" rx="90" ry="75" fill="#F89B29" />
                <ellipse cx="120" cy="185" rx="80" ry="65" fill="#E88A1A" />
                
                {/* Hair (Dark) */}
                <path d="M 110 60 C 90 60 85 95 85 110 C 85 125 95 130 100 130 C 105 130 110 120 110 110 Z" fill="#1A1A1A" />
                <circle cx="120" cy="75" r="28" fill="#1A1A1A" />
                
                {/* Face & Neck */}
                <path d="M 115 95 L 115 110 L 125 110 L 125 95 Z" fill="#E8A584" />
                <circle cx="122" cy="78" r="18" fill="#F2B89D" />
                <path d="M 128 72 C 132 76 132 82 128 86" stroke="#C97C5D" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="128" cy="80" r="2" fill="#1A1A1A" />
                
                {/* Green Shirt/Jacket Torso */}
                <path d="M 100 110 Q 120 105 145 110 L 160 170 Q 120 175 90 170 Z" fill="#386641" />
                
                {/* Arms & Clipboard */}
                <path d="M 100 115 L 80 145 L 110 155 L 115 140 Z" fill="#386641" />
                <path d="M 140 115 L 165 140 L 145 155 Z" fill="#386641" />
                {/* Clipboard */}
                <rect x="70" y="130" width="42" height="56" rx="4" fill="#A0522D" stroke="#7A3C1E" strokeWidth="2" transform="rotate(-15 90 156)" />
                <rect x="82" y="126" width="18" height="8" rx="2" fill="#D1D5DB" transform="rotate(-15 90 156)" />
                <line x1="78" y1="144" x2="104" y2="144" stroke="#FFFFFF" strokeWidth="2" transform="rotate(-15 90 156)" />
                <line x1="78" y1="152" x2="104" y2="152" stroke="#FFFFFF" strokeWidth="2" transform="rotate(-15 90 156)" />
                <line x1="78" y1="160" x2="98" y2="160" stroke="#FFFFFF" strokeWidth="2" transform="rotate(-15 90 156)" />
                {/* Hands */}
                <circle cx="108" cy="154" r="6" fill="#F2B89D" />
                <circle cx="150" cy="148" r="6" fill="#F2B89D" />

                {/* Yellow Trousers */}
                <path d="M 90 170 Q 120 175 160 170 L 175 220 L 145 225 L 130 185 L 115 225 L 85 220 Z" fill="#FFC43D" />
                
                {/* Green Shoes */}
                <ellipse cx="80" cy="225" rx="14" ry="7" fill="#386641" />
                <path d="M 70 220 Q 80 212 92 224 Z" fill="#2D5234" />
                <ellipse cx="180" cy="225" rx="14" ry="7" fill="#386641" />
                <path d="M 170 220 Q 180 212 192 224 Z" fill="#2D5234" />
              </svg>
            </div>

          </div>
        </div>
      </section>

      {/* 11. DURRMI-STYLE WARM PASTEL FOOTER */}
      <footer className="bg-[#FAF8F3] pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl bg-[#FCE6A6] border border-amber-400/60 rounded-[36px] sm:rounded-[48px] p-8 sm:p-12 shadow-xl shadow-amber-950/5 relative overflow-hidden">
          
          {/* 8 Columns Navigation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 text-left">
            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">Home</h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/#how-it-works" className="hover:underline">How it Works</Link></li>
                <li><Link to="/#why-durrmi" className="hover:underline">Why Durrmi</Link></li>
                <li><Link to="/#patient-reviews" className="hover:underline">Testimonials</Link></li>
                <li><Link to="/#faq" className="hover:underline">Common FAQs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">
                <Link to="/about" className="hover:underline">About Us</Link>
              </h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/about" className="hover:underline">Our Story &amp; Mission</Link></li>
                <li><Link to="/about" className="hover:underline">Meet Our Leadership</Link></li>
                <li><Link to="/careers" className="hover:underline font-bold text-amber-950">Join Our Team / Careers ↗</Link></li>
                <li><Link to="/about" className="hover:underline">Learn More About Us ➔</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">
                <Link to="/pricing" className="hover:underline">Pricing</Link>
              </h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/pricing" className="hover:underline">Find Your Best Plan</Link></li>
                <li><Link to="/free-session" className="hover:underline">Free Trial Assessment</Link></li>
                <li><Link to="/b2b" className="hover:underline">Corporate Care Plans</Link></li>
                <li><Link to="/pricing" className="hover:underline">Compare Tiers &amp; Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">
                <Link to="/doctors" className="hover:underline">Specialisations</Link>
              </h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/services/couples-therapy" className="hover:underline font-bold text-amber-950">Couples Therapy ↗</Link></li>
                <li><Link to="/doctors" className="hover:underline">Individual Therapy</Link></li>
                <li><Link to="/doctors" className="hover:underline">Anxiety &amp; Stress</Link></li>
                <li><Link to="/doctors" className="hover:underline">Depression Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">
                <Link to="/therapists" className="hover:underline">Therapists</Link>
              </h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/therapists" className="hover:underline">Meet Our Specialists</Link></li>
                <li><Link to="/doctors" className="hover:underline">Book an Instant Slot</Link></li>
                <li><Link to="/health-risk-calculator" className="hover:underline">AI Health Risk Calculator</Link></li>
                <li><Link to="/free-session" className="hover:underline">Claim Free Consultation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">
                <Link to="/contact" className="hover:underline">Contact Us</Link>
              </h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/contact" className="hover:underline">Help &amp; Support Desk</Link></li>
                <li><Link to="/contact" className="hover:underline">Book a Consult Call</Link></li>
                <li><Link to="/b2b" className="hover:underline">Partner With Us</Link></li>
                <li><Link to="/contact" className="hover:underline">Emergency Hotline Info</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">
                <Link to="/resources" className="hover:underline">Resources</Link>
              </h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/b2b" className="hover:underline font-bold text-amber-900">For Teams (B2B) ↗</Link></li>
                <li><Link to="/blogs" className="hover:underline font-bold text-amber-900">Clinical Blogs &amp; Stories ↗</Link></li>
                <li><Link to="/resources" className="hover:underline font-bold text-amber-900">Mental Health Library ↗</Link></li>
                <li><Link to="/health-vault" className="hover:underline font-bold text-amber-900">Health Vault Privacy ↗</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">Legal</h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/contact" className="hover:underline">Privacy Policy</Link></li>
                <li><Link to="/contact" className="hover:underline">Terms of Service</Link></li>
                <li><Link to="/health-vault" className="hover:underline">HIPAA &amp; Data Security</Link></li>
                <li><Link to="/pricing" className="hover:underline">Cancellation Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#4A2D13]/15 my-8" />

          {/* Sub-Footer Row with Social Icons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-semibold text-[#5A381B]">
            <p>*Durrmi connects patients with verified specialist doctors for seamless clinic scheduling and health vault privacy.</p>
            <div className="flex items-center gap-4 text-[#3D250F]">
              <a href="#" className="hover:opacity-80 transition-opacity">📘 Facebook</a>
              <a href="#" className="hover:opacity-80 transition-opacity">𝕏 Twitter</a>
              <a href="#" className="hover:opacity-80 transition-opacity">📸 Instagram</a>
            </div>
          </div>

          {/* GIANT BOLD DURRMI TYPOGRAPHY AT BOTTOM WITH LOGO ICON */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 overflow-hidden">
            <DurrmiLogoIcon className="size-20 sm:size-32 lg:size-44 text-[#3D2311] shrink-0" />
            <h1
              className="text-6xl font-black tracking-[0.2em] text-[#3D2311] sm:text-8xl lg:text-[11rem] leading-none select-none uppercase"
              style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", fontWeight: 900 }}
            >
              DURRMI
            </h1>
          </div>

        </div>
      </footer>
    </div>
  );
}
