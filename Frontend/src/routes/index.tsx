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

function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const isDoctor = user?.role === "DOCTOR";
  const isAdmin = user?.role === "ADMIN";

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const scrollCards = (direction: "left" | "right") => {
    if (cardsContainerRef.current) {
      const scrollAmount = direction === "left" ? -330 : 330;
      cardsContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

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
                  <>MediSlot Clinic <span className="text-teal-700">Administration Portal</span></>
                ) : (
                  <>"The most important connection is the one within." — Prioritise your journey to wellness.</>
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
                      <Link to="/doctors">
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

      {/* 2. TRUSTED METRICS BAR (Durrmi Style Stat Cards) */}
      <section className="bg-[#FAF8F3] py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-black uppercase tracking-widest text-amber-800 bg-amber-100/90 inline-block px-3.5 py-1 rounded-full border border-amber-300/50">
            Trusted By People Who Took The First Step
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            "Take the first trusted step & find yourself."
          </h2>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 pt-6">
            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 text-center shadow-xs relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B]" />
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">96%</p>
              <p className="mt-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Client Success Rate</p>
            </div>

            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 text-center shadow-xs relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B]" />
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">10+</p>
              <p className="mt-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Years of combined experience</p>
            </div>

            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 text-center shadow-xs relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B]" />
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">100+</p>
              <p className="mt-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Lives Transformed</p>
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
            {/* Step 1 */}
            <div className="space-y-4 text-center group bg-white p-6 rounded-3xl border border-amber-200 shadow-xs">
              <div className="mx-auto size-14 rounded-full bg-[#FFBE0B] text-slate-950 flex items-center justify-center text-xl font-black shadow-md group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Talk at Your Own Pace.
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Tell us what you're facing. Share as much or as little as you're ready to. There's no pressure to have the right words, whenever you're ready. <span className="font-bold text-amber-900">"YOUR WELLNESS AIM"</span> Connect with our licensed online therapist. Get Matched With The Right Therapist.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center group bg-white p-6 rounded-3xl border border-blue-200 shadow-xs md:mt-6">
              <div className="mx-auto size-14 rounded-full bg-[#7BBDF7] text-slate-950 flex items-center justify-center text-xl font-black shadow-md group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Get matched to the right expert.
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                We handpick a professional suited to your actual problem, not a random name from a list. <span className="font-bold text-blue-950">"Find support that touches your soul – not just words."</span> Matched to your actual problem, not generic advice. Book your sessions now. Our professionals are available to provide you with emotional support.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center group bg-white p-6 rounded-3xl border border-orange-200 shadow-xs">
              <div className="mx-auto size-14 rounded-full bg-[#F7A072] text-slate-950 flex items-center justify-center text-xl font-black shadow-md group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Switch Anytime, No Awkwardness.
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
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

        {/* FULL ABOUT US PHILOSOPHY BLOCK FROM DOCUMENT */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-16 bg-white/90 rounded-[32px] p-8 sm:p-10 border border-amber-300 shadow-md text-slate-800 space-y-6">
          <div className="border-b border-amber-200 pb-4 text-center">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
              Our Inner Philosophy
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-2">
              Choosing yourself & your mental health should always be the priority.
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-xs leading-relaxed font-medium text-slate-700">
            <div className="space-y-4">
              <p>
                The word <strong className="text-slate-900 font-extrabold">Durrmi</strong> not only defines sensitive emotions, but it also represents safety and trust. We believe in working together. Individuality and abundance come together when you see your inner self, when you honour your own ideas, voice, emotions, and perspective; you naturally create from authenticity rather than comparison.
              </p>
              <p>
                <strong className="text-amber-900 font-extrabold">Durr</strong> means power within an individual. <strong className="text-amber-900 font-extrabold">Mi</strong> represents bringing abundance. Our holistic Therapists work with you not just on your challenges, but also help you evolve into an empowered version of yourself.
              </p>
              <p className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 italic">
                "At Durrmi, we don't believe in fixing you — because you're not broken. We believe in presence: someone who listens without judgment; we match you right; we walk beside you. We help you grow."
              </p>
            </div>

            <div className="space-y-4">
              <p>
                Limiting beliefs, pushing feelings, avoiding difficult situations, and not taking care of mental health — none of it brings peace. Vulnerability makes noise louder. <strong className="text-slate-900">"Our coach will help you find your inner self and awaken the deep potential in each of us."</strong>
              </p>
              <p>
                Healing shouldn't feel like a duty that you have to do. Our approach is different — a space designed to help you slow down, reflect, and truly stabilise your emotions. <strong className="text-slate-900">"Well-being professionals will coach you to live life abundantly."</strong>
              </p>
              <p>
                You become your highest self when you invest in what no one can ever steal: your mindset, your honesty, your well-being, and your capacity to stay kind to yourself.
              </p>
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
                Whatever You're Carrying, There's Someone Who Gets It.
              </h2>
              <p className="text-sm font-extrabold text-amber-900 italic">
                "The real luxury? A peaceful mind & a life full of ease."
              </p>
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
                <div className="w-[280px] sm:w-[310px] shrink-0 h-[360px] rounded-[28px] bg-gradient-to-b from-white via-[#F0F8FF] to-[#D5E9FF] border border-blue-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden relative snap-start transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="h-2.5 w-full bg-[#7BBDF7] rounded-t-[28px] absolute top-0 left-0 right-0" />
                  <div className="space-y-3 pt-2 z-10">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Couple & Family counselling</h3>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      Navigate conflicts, identify patterns and strengthen your relationship to a healthier version.
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-10 -left-10 size-48 opacity-85 pointer-events-none">
                    <path fill="#BAE6FD" d="M100 15 C115 55 145 55 160 100 C145 145 115 145 100 185 C85 145 55 145 40 100 C55 55 85 55 100 15 Z" />
                  </svg>
                </div>

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
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. THE PEOPLE BEHIND DURRMI */}
      <section className="bg-[#FAF8F3] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-amber-900 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300">
            THE PEOPLE BEHIND DURRMI
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-2">
            "Meet the caring team that makes it all happen."
          </h2>
          <p className="text-sm font-extrabold text-amber-950 max-w-lg mx-auto">
            Real talk, Real credentials, and no algorithms.
          </p>
          <p className="text-xs font-bold text-slate-600 italic">
            ~Therapist says healing starts with real conversations.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Therapist 1: Dr. Sarah Williams */}
            <div className="rounded-3xl border border-amber-300/80 bg-[#FDEBB2] p-6 text-left shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3">
                <span className="bg-amber-200 text-amber-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-400">
                  Understanding You
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-tight pt-2">
                  Dr. Sarah Williams
                </h3>
                <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Clinical Psychologist</p>
                <div className="h-0.5 w-full bg-amber-700/20" />
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  Personalised support designed around your unique journey, needs, and goals.
                </p>
              </div>
              <div className="pt-6 flex justify-end">
                <span className="text-5xl">🌸</span>
              </div>
            </div>

            {/* Therapist 2: Dr. Michael Brown */}
            <div className="rounded-3xl border border-blue-300/80 bg-[#D5E9FF] p-6 text-left shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3">
                <span className="bg-blue-200 text-blue-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-400">
                  A Safe Space
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-tight pt-2">
                  Dr. Michael Brown
                </h3>
                <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">Senior Therapist</p>
                <div className="h-0.5 w-full bg-blue-700/20" />
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  Helping you feel heard, understood, and supported at every step.
                </p>
              </div>
              <div className="pt-6 flex justify-end">
                <span className="text-5xl">🌿</span>
              </div>
            </div>

            {/* Therapist 3: Dr. Emily Davis */}
            <div className="rounded-3xl border border-emerald-300/80 bg-[#C7F9D9] p-6 text-left shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3">
                <span className="bg-emerald-200 text-emerald-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-400">
                  Your Journey Matters
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-tight pt-2">
                  Dr. Emily Davis
                </h3>
                <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">Counselling Psychologist</p>
                <div className="h-0.5 w-full bg-emerald-700/20" />
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  Thoughtful guidance to help you move forward with confidence.
                </p>
              </div>
              <div className="pt-6 flex justify-end">
                <span className="text-5xl">🌱</span>
              </div>
            </div>

            {/* Therapist 4: Dr. James Wilson */}
            <div className="rounded-3xl border border-orange-300/80 bg-[#FFE2CD] p-6 text-left shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3">
                <span className="bg-orange-200 text-orange-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-orange-400">
                  Support That Fits
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-tight pt-2">
                  Dr. James Wilson
                </h3>
                <p className="text-[11px] font-bold text-orange-900 uppercase tracking-wider">Wellness Specialist</p>
                <div className="h-0.5 w-full bg-orange-700/20" />
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  Care and guidance tailored to your individual goals and lifestyle.
                </p>
              </div>
              <div className="pt-6 flex justify-end">
                <span className="text-5xl">☀️</span>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Button asChild size="lg" className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
              <Link to="/doctors">Meet the experts ➔</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 7. PATIENT TESTIMONIALS SECTION */}
      <section id="patient-reviews" className="bg-[#FAF6EE] py-20 border-t border-b border-amber-200/60 scroll-mt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-amber-950 bg-amber-200 px-4 py-1 rounded-full border border-amber-400">
                "Voices of Durrmi."
              </span>
              <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
                Customer review's part
              </h2>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Real words from people who walked this path and chose Durrmi to take the first step towards feeling better.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm font-extrabold text-slate-900">4.9 / 5.0</span>
                <div className="flex text-amber-500">
                  <Star className="size-4 fill-amber-500" />
                  <Star className="size-4 fill-amber-500" />
                  <Star className="size-4 fill-amber-500" />
                  <Star className="size-4 fill-amber-500" />
                  <Star className="size-4 fill-amber-500" />
                </div>
                <span className="text-xs font-medium text-slate-500">(1,200+ Reviews)</span>
              </div>
            </div>

            <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-amber-200/80 bg-white p-6 shadow-xs space-y-3">
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "Finding the right therapist felt overwhelming before Durrmi. The matching process made everything much easier and I finally felt comfortable talking to someone who understood what I was going through."
                </p>
                <div className="pt-2 border-t flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Aditi Sharma</p>
                    <p className="text-[10px] font-semibold text-amber-700">Verified Client</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
                </div>
              </div>

              <div className="rounded-3xl border border-teal-200/80 bg-white p-6 shadow-xs space-y-3">
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "I really liked how simple the entire process was. I didn't have to scroll through endless profiles. I was connected with someone who actually matched what I needed."
                </p>
                <div className="pt-2 border-t flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Rahul Mehta</p>
                    <p className="text-[10px] font-semibold text-teal-700">Verified Client</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PRICING & WAYS TO GET SUPPORT */}
      <section id="pricing" className="bg-[#FAF8F3] py-20 scroll-mt-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-amber-950 bg-amber-200 px-4 py-1 rounded-full border border-amber-400">
            WAYS TO GET SUPPORT
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-2">
            Clarity in a session, consistency in a package.
          </h2>
          <p className="text-sm font-semibold text-slate-700 max-w-lg mx-auto">
            Meet your Expert - Free. A Single Conversation. Need consistency — Begin a package.
          </p>

          {/* FREE SESSION HIGHLIGHT BANNER CARD */}
          <div className="mt-8 bg-gradient-to-r from-[#FFF3D6] via-[#FCE6A6] to-[#FFE8A3] border-2 border-amber-400 rounded-3xl p-6 sm:p-8 text-left shadow-md flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <span className="bg-amber-950 text-amber-100 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Special Offer
              </span>
              <h3 className="text-2xl font-black text-slate-900">Book Free Session</h3>
              <p className="text-xs font-medium text-slate-800 max-w-xl leading-relaxed">
                We're sharing the best professional therapist sessions for free. Well-being shouldn't come with a price tag — book yours today and take the first step toward feeling better.
              </p>
              <ul className="flex flex-wrap gap-4 text-xs font-extrabold text-amber-950 pt-2">
                <li>✦ Choose your session for free.</li>
                <li>✦ Register for free.</li>
                <li>✦ Take your first step.</li>
              </ul>
            </div>
            <Button asChild size="lg" className="h-12 px-8 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shrink-0 shadow-lg">
              <Link to="/doctors">Book Free Session ➔</Link>
            </Button>
          </div>

          {/* TWO PRICING CARDS */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
            {/* Card 1: Pre-Consultation */}
            <div className="rounded-3xl border-2 border-amber-400 bg-white p-8 shadow-xs flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B]" />
              <div className="space-y-4 pt-2">
                <h3 className="text-2xl font-black text-slate-900">Pre-consultation</h3>
                <p className="text-xs font-medium text-slate-700">
                  A single conversation will help you find clarity. With one session, a friendlier rate, and assurance from our experts.
                </p>
                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Starts At</p>
                  <p className="text-4xl font-black text-slate-900">₹999</p>
                  <p className="text-[11px] font-medium text-slate-500">Per session. Set by each consultant.</p>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-2 border-t">
                  <li className="flex items-center gap-2">✅ Single session, no commitments</li>
                  <li className="flex items-center gap-2">✅ Clear upfront rates</li>
                  <li className="flex items-center gap-2">✅ Pick slot & consultant</li>
                </ul>
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8 rounded-full border-slate-900 bg-white text-slate-900 font-black hover:bg-slate-100 text-xs uppercase">
                <Link to="/doctors">Book a Pre-consultation</Link>
              </Button>
            </div>

            {/* Card 2: Package Pricing */}
            <div className="rounded-3xl border-2 border-blue-400 bg-[#FAF8F3] p-8 shadow-xs flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#7BBDF7]" />
              <div className="space-y-4 pt-2">
                <h3 className="text-2xl font-black text-slate-900">Package Pricing</h3>
                <p className="text-xs font-medium text-slate-700">
                  Ongoing support with the same consultant, at a friendlier rate with assurance from our experts.
                </p>
                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Starts At</p>
                  <p className="text-4xl font-black text-slate-900">₹1,299</p>
                  <p className="text-[11px] font-medium text-slate-500">Per package. Scales with sessions.</p>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-2 border-t">
                  <li className="flex items-center gap-2">✅ Multi-session bundle, better rate</li>
                  <li className="flex items-center gap-2">✅ Consultancy with one consultant</li>
                  <li className="flex items-center gap-2">✅ Flexible scheduling sessions</li>
                </ul>
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8 rounded-full border-slate-900 bg-white text-slate-900 font-black hover:bg-slate-100 text-xs uppercase">
                <Link to="/doctors">Explore Packages</Link>
              </Button>
            </div>
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
              <div className="rounded-3xl border-2 border-amber-400 bg-white p-6 shadow-xs space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900">Still Have Any Questions?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Need help choosing a therapist or setting up your mental wellness plan? Our support team is here to assist.
                </p>
                <Button asChild size="sm" className="h-9 px-6 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider">
                  <a href="mailto:support@durrmi.test">Contact us</a>
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

      {/* 10. CTA BANNER ("TRY DURRMI FREE") */}
      <section className="bg-[#FAF6EE] py-20 border-t border-amber-200/60 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Sitting Illustration Card */}
            <div className="hidden lg:flex shrink-0 w-72 items-center justify-center">
              <div className="relative p-6 rounded-full bg-[#FCE8BD] border border-amber-300/60 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                <span className="text-8xl">🛋️</span>
              </div>
            </div>

            {/* Center Content */}
            <div className="mx-auto max-w-2xl text-center space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-amber-950 bg-amber-200 px-4 py-1 rounded-full border border-amber-400">
                (Your First Session Is On Us)
              </span>

              {/* Big Headline */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none pt-2">
                TRY DURRMI FREE
              </h2>

              {/* Subtitle */}
              <p className="text-sm font-bold text-amber-950 max-w-md mx-auto">
                Our aim is to support you, with our no cost & no commitment.
              </p>
              <p className="text-xs font-extrabold text-slate-700 max-w-lg mx-auto bg-amber-100/80 p-3 rounded-2xl border border-amber-300/60">
                "Your First Self-care shouldn't cost you. Book a free session with us, with no cost & no commitments."
              </p>

              {/* Yellow Pill Button */}
              <div className="pt-2">
                <Button asChild size="lg" className="h-12 px-9 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/40">
                  <Link to="/doctors">Book a free session</Link>
                </Button>
              </div>
            </div>

            {/* Right Sitting Doctor Card */}
            <div className="hidden lg:flex shrink-0 w-72 items-center justify-center">
              <div className="relative p-6 rounded-full bg-[#D4E8FC] border border-blue-300/60 shadow-lg transform rotate-2 hover:rotate-0 transition-transform">
                <span className="text-8xl">📋</span>
              </div>
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
                <li><Link to="/doctors" className="hover:underline">Specialisations</Link></li>
                <li><Link to="/doctors" className="hover:underline">Therapists</Link></li>
                <li><Link to="/#why-durrmi" className="hover:underline">Why Durrmi</Link></li>
                <li><Link to="/#patient-reviews" className="hover:underline">Testimonials</Link></li>
                <li><Link to="/#pricing" className="hover:underline">Pricing</Link></li>
                <li><Link to="/#faq" className="hover:underline">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">About Us</h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/#how-it-works" className="hover:underline">How it Works</Link></li>
                <li><Link to="/doctors" className="hover:underline">Specialisations</Link></li>
                <li><Link to="/doctors" className="hover:underline">Therapists</Link></li>
                <li><Link to="/#faq" className="hover:underline">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">Pricing</h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/#how-it-works" className="hover:underline">How it Works</Link></li>
                <li><Link to="/doctors" className="hover:underline">Specialisations</Link></li>
                <li><Link to="/doctors" className="hover:underline">Therapists</Link></li>
                <li><Link to="/#why-durrmi" className="hover:underline">Why Durrmi</Link></li>
                <li><Link to="/#patient-reviews" className="hover:underline">Testimonials</Link></li>
                <li><Link to="/#pricing" className="hover:underline">Pricing</Link></li>
                <li><Link to="/#faq" className="hover:underline">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">Specialisations</h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/doctors" className="hover:underline">How it Works</Link></li>
                <li><Link to="/doctors" className="hover:underline">Specialisations</Link></li>
                <li><Link to="/doctors" className="hover:underline">Therapists</Link></li>
                <li><Link to="/#why-durrmi" className="hover:underline">Why Durrmi</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">Therapists</h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/doctors" className="hover:underline">How it Works</Link></li>
                <li><Link to="/doctors" className="hover:underline">Specialisations</Link></li>
                <li><Link to="/doctors" className="hover:underline">Therapists</Link></li>
                <li><Link to="/#faq" className="hover:underline">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">Contact Us</h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/#how-it-works" className="hover:underline">How it Works</Link></li>
                <li><Link to="/doctors" className="hover:underline">Specialisations</Link></li>
                <li><Link to="/doctors" className="hover:underline">Therapists</Link></li>
                <li><Link to="/#why-durrmi" className="hover:underline">Why Durrmi</Link></li>
                <li><Link to="/#patient-reviews" className="hover:underline">Testimonials</Link></li>
                <li><Link to="/#pricing" className="hover:underline">Pricing</Link></li>
                <li><Link to="/#faq" className="hover:underline">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">Resources</h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/#how-it-works" className="hover:underline">How it Works</Link></li>
                <li><Link to="/doctors" className="hover:underline">Specialisations</Link></li>
                <li><Link to="/doctors" className="hover:underline">Therapists</Link></li>
                <li><Link to="/#faq" className="hover:underline">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-[#3D250F] mb-3">Legal</h4>
              <ul className="space-y-2 text-[11px] font-medium text-[#6E4924]">
                <li><Link to="/#how-it-works" className="hover:underline">How it Works</Link></li>
                <li><Link to="/doctors" className="hover:underline">Specialisations</Link></li>
                <li><Link to="/doctors" className="hover:underline">Therapists</Link></li>
                <li><Link to="/#why-durrmi" className="hover:underline">Why Durrmi</Link></li>
                <li><Link to="/#patient-reviews" className="hover:underline">Testimonials</Link></li>
                <li><Link to="/#pricing" className="hover:underline">Pricing</Link></li>
                <li><Link to="/#faq" className="hover:underline">FAQ</Link></li>
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
