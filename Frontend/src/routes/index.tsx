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
            
            {/* Left Doctor Illustration Card */}
            <div className="hidden lg:flex shrink-0 w-64 items-center justify-center">
              <div className="relative p-6 rounded-full bg-[#FCE8BD] border border-amber-300/60 shadow-lg shadow-amber-950/5 transform -rotate-3 hover:rotate-0 transition-transform">
                <span className="text-8xl">👩‍⚕️</span>
              </div>
            </div>

            {/* Main Center Content */}
            <div className="mx-auto max-w-2xl text-center space-y-6">
              {/* Top Pill Tag */}
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-100/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-950 shadow-2xs">
                <Sparkles className="size-3.5 text-amber-700" />
                {isDoctor
                  ? `Doctor Portal Active • ${user?.fullName}`
                  : isAdmin
                  ? "Clinic Network Administration"
                  : "Your Journey To Wellness Starts Here"}
              </span>

              {/* Headline */}
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
                {isDoctor ? (
                  <>Welcome back to Doctor Desk, <span className="text-amber-700">{user?.fullName}</span></>
                ) : isAdmin ? (
                  <>MediSlot Clinic <span className="text-teal-700">Administration Portal</span></>
                ) : (
                  <>Your Journey To <span className="text-slate-900 underline decoration-amber-400 decoration-wavy underline-offset-8">Wellness</span> Starts Here</>
                )}
              </h1>

              {/* Subtitle */}
              <p className="mx-auto max-w-xl text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                {isDoctor
                  ? "Review assigned patient appointments, inspect shared health vault records, record prescription notes, and publish consultation slots."
                  : isAdmin
                  ? "Monitor network analytics, manage doctor profiles, inspect security audit logs, and administer clinic documents."
                  : "Find the right therapist for what you're going through and take the first step towards better mental wellbeing."}
              </p>

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
                    <Button asChild size="lg" className="h-12 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] px-8 font-black text-slate-950 text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30">
                      <Link to="/doctors">Book a free session</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-slate-400/80 bg-white/80 px-7 font-bold text-slate-800 hover:bg-slate-100 text-xs uppercase">
                      <Link to="/doctors">Explore Specialisations</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Trust Avatar Stack Badge */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="flex -space-x-2">
                  <div className="size-8 rounded-full border-2 border-white bg-amber-200 grid place-items-center text-xs font-bold">👨‍💼</div>
                  <div className="size-8 rounded-full border-2 border-white bg-teal-200 grid place-items-center text-xs font-bold">👩‍⚕️</div>
                  <div className="size-8 rounded-full border-2 border-white bg-rose-200 grid place-items-center text-xs font-bold">👨‍⚕️</div>
                  <div className="size-8 rounded-full border-2 border-white bg-purple-200 grid place-items-center text-xs font-bold">👩‍💻</div>
                </div>
                <span className="text-xs font-bold text-slate-600">
                  Trusted by over <span className="text-slate-900 font-extrabold">100+ customers</span>
                </span>
              </div>
            </div>

            {/* Right Doctor Illustration Card */}
            <div className="hidden lg:flex shrink-0 w-64 items-center justify-center">
              <div className="relative p-6 rounded-full bg-[#D4E8FC] border border-blue-300/60 shadow-lg shadow-blue-950/5 transform rotate-3 hover:rotate-0 transition-transform">
                <span className="text-8xl">🩺</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUSTED METRICS BAR (Durrmi Style 4 Stat Cards) */}
      <section className="bg-[#FAF8F3] py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800">
            Trusted by people who took the first step.
          </h2>

          <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 text-center shadow-xs relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B]" />
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">96%</p>
              <p className="mt-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Client Success Rate</p>
            </div>

            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 text-center shadow-xs relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B]" />
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">100+</p>
              <p className="mt-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Happy Clients</p>
            </div>

            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 text-center shadow-xs relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B]" />
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">10+</p>
              <p className="mt-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Years Experience</p>
            </div>

            <div className="rounded-3xl border border-amber-200/80 bg-white p-6 text-center shadow-xs relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B]" />
              <p className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">0+</p>
              <p className="mt-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Expert Consultants</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3-STEP PROCESS SECTION */}
      <section className="bg-[#FAF6EE] py-20 border-t border-b border-amber-200/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Getting Started Shouldn't Be The Hardest Part.
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600 max-w-md mx-auto">
            Three simple steps between you and someone who understands.
          </p>

          <div className="mt-16 grid gap-10 md:grid-cols-3 relative items-start">
            {/* Step 1 */}
            <div className="space-y-4 text-center group">
              <div className="mx-auto size-16 rounded-full bg-[#FFBE0B] text-slate-950 flex items-center justify-center text-2xl font-black shadow-md group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Tell us what you're going through
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                A short, guided questionnaire — not a form, more like a conversation — about what's bringing you to therapy, your preferences, and what kind of support you're looking for.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center group md:mt-12">
              <div className="mx-auto size-16 rounded-full bg-[#7BBDF7] text-slate-950 flex items-center justify-center text-2xl font-black shadow-md group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Get Matched With The Right Therapist
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Based on your responses, we recommend therapists who specialise in your specific concern, not just whoever's next in line.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center group">
              <div className="mx-auto size-16 rounded-full bg-[#F7A072] text-slate-950 flex items-center justify-center text-2xl font-black shadow-md group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Book Your First Session
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Choose a time that works for you — video, audio, or in-person, whatever feels most comfortable to start with.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE DURRMI CORNER-OVERLAPPING CARDS SECTION */}
      <section id="why-durrmi" className="bg-[#FDEBB2]/90 py-20 overflow-hidden relative scroll-mt-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Why Choose Durrmi
          </h2>
          <p className="text-sm font-semibold text-slate-700 max-w-md mx-auto">
            Get expert support, on your terms.
          </p>
        </div>

        {/* CORNER-OVERLAPPING CARDS CONTAINER */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-12 relative flex flex-col items-center">
          {/* Card 1 */}
          <div className="w-full sm:w-[460px] md:w-[480px] bg-[#F7D479] border border-amber-700/30 rounded-[28px] p-6 sm:p-7 shadow-lg shadow-amber-950/10 transform sm:translate-x-20 hover:scale-[1.02] transition-all duration-300 z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="size-20 rounded-full bg-[#E5B551] flex items-center justify-center text-3xl shrink-0 shadow-inner">
                👩‍⚕️
              </div>
              <div className="text-left space-y-1.5">
                <h3 className="text-lg font-black text-[#5C4105] leading-snug">
                  Vetted experts, not a directory
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#73540F] leading-relaxed">
                  Every consultant on Durrmi is screened for real credentials and track record — so you're never guessing who's on the other end.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="w-full sm:w-[460px] md:w-[480px] bg-[#A4D4FF] border border-blue-600/30 rounded-[28px] p-6 sm:p-7 shadow-xl shadow-blue-950/10 transform -mt-4 sm:-mt-6 sm:-translate-x-24 hover:scale-[1.02] transition-all duration-300 z-20">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="size-20 rounded-full bg-[#7BBDF7] flex items-center justify-center text-3xl shrink-0 shadow-inner">
                🩺
              </div>
              <div className="text-left space-y-1.5">
                <h3 className="text-lg font-black text-[#104778] leading-snug">
                  Matched To Your Actual Problem
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#1E5D96] leading-relaxed">
                  Tell us what you're stuck on and we point you to the right expertise, instead of leaving you to scroll through profiles.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="w-full sm:w-[460px] md:w-[480px] bg-[#F7C6A3] border border-orange-700/30 rounded-[28px] p-6 sm:p-7 shadow-lg shadow-orange-950/10 transform -mt-4 sm:-mt-6 sm:translate-x-24 hover:scale-[1.02] transition-all duration-300 z-30">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="text-left space-y-1.5 order-2 sm:order-1">
                <h3 className="text-lg font-black text-[#612A0A] leading-snug">
                  Clear Pricing, No Surprises
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#7D3B14] leading-relaxed">
                  See rates upfront and know exactly what a session costs before you book — no hidden fees, no awkward billing conversations.
                </p>
              </div>
              <div className="size-20 rounded-full bg-[#E5AA80] flex items-center justify-center text-3xl shrink-0 shadow-inner order-1 sm:order-2">
                👨‍⚕️
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-10 z-40">
            <Button
              size="lg"
              className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/40 cursor-pointer"
              onClick={() => {
                document.getElementById("patient-reviews")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Know more about us ➔
            </Button>
          </div>
        </div>
      </section>

      {/* 5. SPECIALIZATIONS CAROUSEL */}
      <section className="bg-[#FAF7EF] py-20 border-t border-b border-amber-200/50 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            
            {/* Left Header Box */}
            <div className="lg:max-w-md space-y-6 shrink-0">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
                Whatever you're carrying, there's someone who gets it.
              </h2>
              <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                From anxiety and relationships to grief and burnout — find a therapist who specialises in what you're going through.
              </p>
              <Button asChild size="lg" className="h-12 px-8 rounded-full bg-[#FFBE0B] hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs transition-all">
                <Link to="/doctors">Explore Specialisations</Link>
              </Button>
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
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Individual Therapy</h3>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      One-on-one sessions designed to help you understand yourself, work through challenges, and build healthier ways of coping.
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-10 -left-10 size-48 opacity-80 pointer-events-none">
                    <path fill="#FDE68A" d="M100 10 L112 68 L170 30 L132 88 L190 100 L132 112 L170 170 L112 132 L100 190 L88 132 L30 170 L68 112 L10 100 L68 88 L30 30 L88 68 Z" />
                  </svg>
                </div>

                {/* Card 2: Couples Therapy */}
                <div className="w-[280px] sm:w-[310px] shrink-0 h-[360px] rounded-[28px] bg-gradient-to-b from-white via-[#F0F8FF] to-[#D5E9FF] border border-blue-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden relative snap-start transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="h-2.5 w-full bg-[#7BBDF7] rounded-t-[28px] absolute top-0 left-0 right-0" />
                  <div className="space-y-3 pt-2 z-10">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Couples Therapy</h3>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      A safe and supportive space to improve communication, strengthen your relationship, and navigate challenges together.
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-10 -left-10 size-48 opacity-85 pointer-events-none">
                    <path fill="#BAE6FD" d="M100 15 C115 55 145 55 160 100 C145 145 115 145 100 185 C85 145 55 145 40 100 C55 55 85 55 100 15 Z" />
                  </svg>
                </div>

                {/* Card 3: Anxiety & Stress */}
                <div className="w-[280px] sm:w-[310px] shrink-0 h-[360px] rounded-[28px] bg-gradient-to-b from-white via-[#FFF5ED] to-[#FFE2CD] border border-orange-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden relative snap-start transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="h-2.5 w-full bg-[#FF9F43] rounded-t-[28px] absolute top-0 left-0 right-0" />
                  <div className="space-y-3 pt-2 z-10">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Anxiety & Stress</h3>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      Practical support to help you manage anxiety, reduce stress, and regain a sense of balance in your everyday life.
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-10 -left-6 size-44 opacity-85 pointer-events-none">
                    <path fill="#FED7AA" d="M100 0 C105 70 130 95 200 100 C130 105 105 130 100 200 C95 130 70 105 0 100 C70 95 95 70 100 0 Z" />
                  </svg>
                </div>

                {/* Card 4: Depression Support */}
                <div className="w-[280px] sm:w-[310px] shrink-0 h-[360px] rounded-[28px] bg-gradient-to-b from-white via-[#F0FDF4] to-[#C7F9D9] border border-emerald-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden relative snap-start transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="h-2.5 w-full bg-[#2ECC71] rounded-t-[28px] absolute top-0 left-0 right-0" />
                  <div className="space-y-3 pt-2 z-10">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Depression Support</h3>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      Compassionate guidance to help you understand difficult emotions and gradually move towards a healthier, more fulfilling life.
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-8 -left-8 size-48 opacity-85 pointer-events-none">
                    <path fill="#A7F3D0" d="M100 10 C120 60 160 60 190 100 C160 140 120 140 100 190 C80 140 40 140 10 100 C40 60 80 60 100 10 Z" />
                  </svg>
                </div>

                {/* Card 5: Self Growth */}
                <div className="w-[280px] sm:w-[310px] shrink-0 h-[360px] rounded-[28px] bg-gradient-to-b from-white via-[#F9F5FF] to-[#E5CEFF] border border-purple-200/80 shadow-md p-6 flex flex-col justify-between overflow-hidden relative snap-start transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="h-2.5 w-full bg-[#A55EEA] rounded-t-[28px] absolute top-0 left-0 right-0" />
                  <div className="space-y-3 pt-2 z-10">
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Self Growth</h3>
                    <div className="h-[1px] w-full bg-slate-300/80" />
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      Explore your thoughts, behaviours, and goals while developing greater confidence, awareness, and emotional resilience.
                    </p>
                  </div>
                  <svg viewBox="0 0 200 200" className="absolute -bottom-8 -left-8 size-48 opacity-85 pointer-events-none">
                    <path fill="#DDD6FE" d="M100 10 C105 70 130 80 190 100 C130 120 105 130 100 190 C95 130 70 120 10 100 C70 80 95 70 100 10 Z" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. THE PEOPLE BEHIND DURRMI (Specialist Showcase matching JSON schema) */}
      <section className="bg-[#FAF8F3] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The People Behind Durrmi
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600 max-w-lg mx-auto">
            Real therapists, real credentials, real conversations — no algorithms deciding who you talk to.
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
              <Link to="/doctors">Get to know Them ➔</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 7. PATIENT TESTIMONIALS SECTION */}
      <section id="patient-reviews" className="bg-[#FAF6EE] py-20 border-t border-b border-amber-200/60 scroll-mt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-200/80 px-3.5 py-1 rounded-full">
                Patient Testimonials
              </span>
              <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
                Their Words, Not Ours.
              </h2>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Real experiences from people who chose Durrmi to take the first step towards better mental wellbeing.
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

      {/* 8. PRICING & CONSULTATION OPTIONS */}
      <section id="pricing" className="bg-[#FAF8F3] py-20 scroll-mt-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Two Ways To Get Support
          </h2>
          <p className="text-sm font-semibold text-slate-600 max-w-md mx-auto">
            Book a single session when you need an answer, or a package when you need someone in your corner.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
            {/* Card 1: Pre-Consultation */}
            <div className="rounded-3xl border-2 border-amber-400 bg-white p-8 shadow-xs flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B]" />
              <div className="space-y-4 pt-2">
                <h3 className="text-xl font-black text-slate-900">Pre-Consultation</h3>
                <p className="text-xs font-medium text-slate-600">One focused session with a consultant. Pay only for the time you book.</p>
                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Starts At</p>
                  <p className="text-3xl font-black text-slate-900">₹999</p>
                  <p className="text-[11px] font-medium text-slate-500">per session · set by each consultant</p>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-2 border-t">
                  <li className="flex items-center gap-2">✅ Single session, no commitment</li>
                  <li className="flex items-center gap-2">✅ Rate shown upfront before booking</li>
                  <li className="flex items-center gap-2">✅ Pick the consultant and slot</li>
                </ul>
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8 rounded-full border-slate-900 bg-white text-slate-900 font-bold hover:bg-slate-100 text-xs">
                <Link to="/doctors">Book a Consultancy</Link>
              </Button>
            </div>

            {/* Card 2: Package Pricing */}
            <div className="rounded-3xl border-2 border-blue-400 bg-[#FAF8F3] p-8 shadow-xs flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#7BBDF7]" />
              <div className="space-y-4 pt-2">
                <h3 className="text-xl font-black text-slate-900">Package Pricing</h3>
                <p className="text-xs font-medium text-slate-600">Bundle multiple sessions with the same consultant at a lower effective rate.</p>
                <div className="pt-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Starts At</p>
                  <p className="text-3xl font-black text-slate-900">₹1,299</p>
                  <p className="text-[11px] font-medium text-slate-500">per package · scales with sessions included</p>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-2 border-t">
                  <li className="flex items-center gap-2">✅ Multi-session bundle, better rate</li>
                  <li className="flex items-center gap-2">✅ Continuity with one consultant</li>
                  <li className="flex items-center gap-2">✅ Flexible scheduling across sessions</li>
                </ul>
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8 rounded-full border-slate-900 bg-white text-slate-900 font-bold hover:bg-slate-100 text-xs">
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

      {/* 10. CTA BANNER ("Your First Session Is On Us.") */}
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
              {/* Trust Avatar Stack */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="size-8 rounded-full border-2 border-white bg-amber-200 grid place-items-center text-xs font-bold">👨‍💼</div>
                  <div className="size-8 rounded-full border-2 border-white bg-teal-200 grid place-items-center text-xs font-bold">👩‍⚕️</div>
                  <div className="size-8 rounded-full border-2 border-white bg-rose-200 grid place-items-center text-xs font-bold">👨‍⚕️</div>
                  <div className="size-8 rounded-full border-2 border-white bg-purple-200 grid place-items-center text-xs font-bold">👩‍💻</div>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  Trusted by over <span className="text-slate-900 font-black">1000+ customers</span>
                </span>
              </div>

              {/* Big Headline */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
                Your First Session Is On Us.
              </h2>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-md mx-auto">
                Book a free session and see if it feels right — no commitment, no cost.
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
