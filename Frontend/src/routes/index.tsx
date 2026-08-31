import { createFileRoute, Link } from "@tanstack/react-router";
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
  HeartHandshake,
  ChevronDown,
  Clock,
  Award,
  Users,
  Search,
  Activity,
  Smile,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { useState } from "react";
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
    title: "Tell Us What You're Going Through",
    body: "Filter by medical concern, specialization, city, and consultation fee to find the perfect healthcare match.",
  },
  {
    stepNo: "02",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    icon: Stethoscope,
    title: "Get Matched With The Right Specialist",
    body: "Review verified doctor profiles, qualifications, patient ratings, and live consultation fee structures.",
  },
  {
    stepNo: "03",
    badgeColor: "bg-teal-100 text-teal-900 border-teal-200",
    icon: CalendarCheck,
    title: "Book Your First Session",
    body: "Choose an available morning, afternoon, or evening time slot and receive an instant OPD Queue Token.",
  },
];

const FAQS = [
  {
    q: "How does MediSlot slot booking & OPD queue work?",
    a: "When you select a doctor and book an available time slot, MediSlot locks the slot instantly and issues a unique OPD Queue Token number. You can choose to pay online via Razorpay or cash at the clinic.",
  },
  {
    q: "Is my medical data inside the Health Vault safe?",
    a: "Yes! All uploaded lab reports, medical histories, and vitals records inside your Health Vault are encrypted using bank-grade AES-256 encryption. Only you and your assigned doctor can access them.",
  },
  {
    q: "Can I reschedule or cancel my appointment?",
    a: "Absolutely. You can manage, reschedule, or cancel your active appointments anytime from your 'My Appointments' dashboard with 1-click.",
  },
  {
    q: "How do doctors publish digital prescriptions?",
    a: "Assigned doctors use the Doctor Desk workspace to review patient profiles, record clinical notes, write dosage advice, and generate downloadable digital PDF prescriptions.",
  },
];

const CONCERNS = [
  {
    name: "General Medicine & Wellness",
    desc: "Routine checkups, fever, fatigue, lifestyle health & daily care.",
    bg: "bg-[#FFF8E7] hover:bg-[#FFF3D6] border-amber-200/80",
    tagBg: "bg-amber-100 text-amber-900",
    icon: Activity,
    linkSpec: "General Medicine",
  },
  {
    name: "Cardiology & Heart Care",
    desc: "Chest health, blood pressure management, ECG & cardiac wellness.",
    bg: "bg-[#EFF6FF] hover:bg-[#DBEAFE] border-blue-200/80",
    tagBg: "bg-blue-100 text-blue-900",
    icon: Activity,
    linkSpec: "Cardiology",
  },
  {
    name: "Neurology & Brain Health",
    desc: "Headaches, migraines, nerve issues & neurological evaluations.",
    bg: "bg-[#F0FDF4] hover:bg-[#DCFCE7] border-emerald-200/80",
    tagBg: "bg-emerald-100 text-emerald-900",
    icon: Sparkles,
    linkSpec: "Neurology",
  },
  {
    name: "Pediatrics & Child Care",
    desc: "Childhood vaccinations, growth tracking & infant care.",
    bg: "bg-[#FFF1F2] hover:bg-[#FFE4E6] border-rose-200/80",
    tagBg: "bg-rose-100 text-rose-900",
    icon: Smile,
    linkSpec: "Pediatrics",
  },
  {
    name: "Orthopaedics & Joint Care",
    desc: "Bone health, joint pain, posture correction & sports injury.",
    bg: "bg-[#FAF5FF] hover:bg-[#F3E8FF] border-purple-200/80",
    tagBg: "bg-purple-100 text-purple-900",
    icon: ShieldCheck,
    linkSpec: "Orthopaedics",
  },
  {
    name: "Dermatology & Skin",
    desc: "Skin allergy, acne treatment, scalp care & dermatological care.",
    bg: "bg-[#FFF7ED] hover:bg-[#FFEDD5] border-orange-200/80",
    tagBg: "bg-orange-100 text-orange-900",
    icon: Sparkles,
    linkSpec: "Dermatology",
  },
];

function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const isDoctor = user?.role === "DOCTOR";
  const isAdmin = user?.role === "ADMIN";

  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
                  : "Durrmi connects patients, verified specialist doctors, and clinics in one seamless scheduling workspace — search availability, confirm bookings, and keep your health vault in sync."}
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
                      <Link to="/doctors">Book a session</Link>
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
                  Trusted by over <span className="text-slate-900 font-extrabold">1000+ patients</span> across clinics
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

      {/* 2. TRUSTED METRICS BAR (Durrmi Style 3 White Cards with Yellow Top Border) */}
      <section className="bg-[#FAF8F3] py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800">
            Trusted By People Who Took The First Step.
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-3xl border border-amber-200/80 bg-white p-8 text-center shadow-xs relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B]" />
              <p className="text-5xl font-black tracking-tight text-slate-900">96%</p>
              <p className="mt-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Patient Satisfaction Rate</p>
            </div>

            <div className="rounded-3xl border border-amber-200/80 bg-white p-8 text-center shadow-xs relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B]" />
              <p className="text-5xl font-black tracking-tight text-slate-900">10+</p>
              <p className="mt-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Years Of Combined Experience</p>
            </div>

            <div className="rounded-3xl border border-amber-200/80 bg-white p-8 text-center shadow-xs relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B]" />
              <p className="text-5xl font-black tracking-tight text-slate-900">100+</p>
              <p className="mt-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Verified Specialist Doctors</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3-STEP PROCESS SECTION (Durrmi Style "Getting Started Shouldn't Be The Hardest Part") */}
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
                ✴️
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Tell Us What You're Going Through
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                A short, guided filter — select your symptom concerns, preferred city location, or budget preference.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 text-center group md:mt-12">
              <div className="mx-auto size-16 rounded-full bg-[#7BBDF7] text-slate-950 flex items-center justify-center text-2xl font-black shadow-md group-hover:scale-110 transition-transform">
                ➕
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Get Matched With The Right Doctor
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Based on your responses, we recommend verified specialists who focus on your specific condition.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 text-center group">
              <div className="mx-auto size-16 rounded-full bg-[#F7A072] text-slate-950 flex items-center justify-center text-2xl font-black shadow-md group-hover:scale-110 transition-transform">
                ✳️
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Book Your First Session
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                Choose a time slot that works for you — receive an instant OPD Queue Token with zero waiting hassle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE MEDISLOT CORNER-OVERLAPPING CARDS SECTION */}
      <section className="bg-[#FDEBB2]/90 py-20 overflow-hidden relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            Why Choose MediSlot
          </h2>
          <p className="text-sm font-semibold text-slate-700 max-w-md mx-auto">
            Get expert medical care, on your terms.
          </p>
        </div>

        {/* CORNER-OVERLAPPING CARDS CONTAINER */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-12 relative flex flex-col items-center">
          {/* Card 1: Top Right Warm Gold/Yellow */}
          <div className="w-full sm:w-[460px] md:w-[480px] bg-[#F7D479] border border-amber-700/30 rounded-[28px] p-6 sm:p-7 shadow-lg shadow-amber-950/10 transform sm:translate-x-20 hover:scale-[1.02] transition-all duration-300 z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="size-20 rounded-full bg-[#E5B551] flex items-center justify-center text-3xl shrink-0 shadow-inner">
                👩‍⚕️
              </div>
              <div className="text-left space-y-1.5">
                <h3 className="text-lg font-black text-[#5C4105] leading-snug">
                  Vetted Experts, Not A Directory
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#73540F] leading-relaxed">
                  Every doctor on Durrmi is screened for real credentials, registration numbers, and track record — so you're never guessing who's on the other end.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Middle Left Pastel Blue (Corner Overlap Only) */}
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
                  Tell us what you're stuck on or your symptom concerns and we point you to the right specialist expertise, instead of leaving you to scroll through profiles.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Bottom Right Soft Coral / Warm Peach (Corner Overlap Only) */}
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

          {/* Bottom Pill Action Button -> Smooth Scroll to User Reviews */}
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

      {/* 5. SPECIALIZATIONS CAROUSEL ("Whatever You're Carrying, There's Someone Who Gets It.") */}
      <section className="bg-[#FAF6EE] py-20 border-t border-b border-amber-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Header Box */}
            <div className="lg:col-span-5 space-y-5">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                Whatever You're Carrying, There's Someone Who Gets It.
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                From cardiology and skin allergy to routine checkups and pediatric care — find a verified specialist who understands your health journey.
              </p>
              <Button asChild size="lg" className="h-11 px-7 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs">
                <Link to="/doctors">Explore Specialisations</Link>
              </Button>
            </div>

            {/* Right Cards Carousel Grid */}
            <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2">
              {CONCERNS.slice(0, 4).map((c) => (
                <div key={c.name} className="relative rounded-3xl border border-amber-300/70 bg-[#FEF9EE] p-6 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-[#FFBE0B]" />
                  <div className="space-y-3 pt-2">
                    <h3 className="text-lg font-extrabold text-slate-900">{c.name}</h3>
                    <div className="h-0.5 w-full bg-slate-200" />
                    <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <span className="text-3xl opacity-80">🌼</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. THE PEOPLE BEHIND DURRMI (Specialist Showcase) */}
      <section className="bg-[#FAF8F3] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            The People Behind Durrmi
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600 max-w-lg mx-auto">
            Real doctors, real credentials, real conversations — no algorithms deciding who you talk to.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Info Card */}
            <div className="rounded-3xl border border-amber-300/80 bg-[#FDEBB2] p-6 text-left shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3">
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  Cardiology & Skin Specialists
                </h3>
                <div className="h-0.5 w-full bg-amber-700/20" />
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  Every doctor on Durrmi has completed verified clinical training with proven hospital experience.
                </p>
              </div>
              <div className="pt-10 flex justify-end">
                <span className="text-5xl">🌸</span>
              </div>
            </div>

            {/* Doctor Photo Cards */}
            {mockDoctors.slice(0, 3).map((doc) => (
              <div key={doc.id} className="relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-md group h-[320px] flex flex-col justify-between bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                
                {/* Doctor Avatar / Image placeholder */}
                <div className="absolute inset-0 bg-amber-900/40 grid place-items-center text-7xl font-black text-amber-200/40 select-none">
                  {doc.fullName.charAt(4) || "D"}
                </div>

                <div className="relative z-20 p-5 flex justify-end">
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {doc.specializationName}
                  </span>
                </div>

                <div className="relative z-20 p-5 text-left space-y-1 bg-gradient-to-t from-amber-200/90 to-amber-100/90 text-slate-950 rounded-b-2xl">
                  <p className="font-extrabold text-sm">{doc.fullName}</p>
                  <p className="text-[11px] font-bold text-amber-900">{doc.qualifications} • {doc.yearsOfExperience} Yrs Exp</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Button asChild size="lg" className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
              <Link to="/doctors">Get to know them ➔</Link>
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
                Read how Durrmi simplified doctor consultations, live OPD queue tracking, and medical record vault sharing for patients across clinics.
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
                  "Booking an appointment with Dr. Rajesh was so smooth. I got my OPD Token #4 instantly and didn't have to wait in clinic queues!"
                </p>
                <div className="pt-2 border-t flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Aditi Sharma</p>
                    <p className="text-[10px] font-semibold text-amber-700">General Medicine Patient</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
                </div>
              </div>

              <div className="rounded-3xl border border-teal-200/80 bg-white p-6 shadow-xs space-y-3">
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "The Digital Health Vault feature is amazing. I attached my blood report directly during slot booking, and the doctor had it open before I entered!"
                </p>
                <div className="pt-2 border-t flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Karan Verma</p>
                    <p className="text-[10px] font-semibold text-teal-700">Cardiology Consultation</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PRICING & CONSULTATION OPTIONS (Durrmi Style) */}
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
                  <p className="text-3xl font-black text-slate-900">Starts At ₹499</p>
                  <p className="text-[11px] font-medium text-slate-500">per session • set by each doctor</p>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-2 border-t">
                  <li className="flex items-center gap-2">✅ Single session, no commitment</li>
                  <li className="flex items-center gap-2">✅ Rate shown upfront before booking</li>
                  <li className="flex items-center gap-2">✅ Pick the doctor and slot</li>
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
                  <p className="text-3xl font-black text-slate-900">Starts At ₹1,299</p>
                  <p className="text-[11px] font-medium text-slate-500">per package • scales with sessions</p>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-2 border-t">
                  <li className="flex items-center gap-2">✅ Multi-session bundle, better rate</li>
                  <li className="flex items-center gap-2">✅ Continuity with one doctor</li>
                  <li className="flex items-center gap-2">✅ Flexible scheduling across sessions</li>
                </ul>
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8 rounded-full border-slate-900 bg-white text-slate-900 font-bold hover:bg-slate-100 text-xs">
                <Link to="/doctors">Explore Packages</Link>
              </Button>
            </div>
          </div>

          <div className="mt-10">
            <Button asChild size="lg" className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
              <Link to="/doctors">Know more about our pricing ➔</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION SECTION (Durrmi Style) */}
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
                  Need help choosing a doctor or setting up your digital health vault? Our clinic support team is here to assist.
                </p>
                <Button asChild size="sm" className="h-9 px-6 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider">
                  <a href="mailto:support@durrmi.test">Contact us</a>
                </Button>
              </div>
            </div>

            {/* Right Accordions List */}
            <div className="lg:col-span-7 space-y-4">
              {FAQS.map((faq, idx) => (
                <div key={faq.q} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="flex w-full items-center justify-between text-left font-bold text-slate-900 text-sm sm:text-base gap-3"
                  >
                    <span>{faq.q}</span>
                    <span className="size-7 rounded-lg bg-amber-400/80 flex items-center justify-center text-slate-950 shrink-0 font-black text-xs">
                      {openFaq === idx ? "▲" : "▼"}
                    </span>
                  </button>
                  {openFaq === idx ? (
                    <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t pt-3 font-medium">
                      {faq.a}
                    </p>
                  ) : null}
                </div>
              ))}
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

          {/* GIANT BOLD DURRMI TYPOGRAPHY AT BOTTOM */}
          <div className="pt-8 text-center overflow-hidden">
            <h1 className="text-7xl font-black tracking-tighter text-[#3D2311] sm:text-9xl lg:text-[13rem] leading-none select-none uppercase font-mono">
              DURRMI
            </h1>
          </div>

        </div>
      </footer>
    </div>
  );
}
