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
      { title: "MediSlot — Your Journey To Wellness Starts Here" },
      {
        name: "description",
        content:
          "Search doctors by specialization, city and consultation fee, book clinic appointments, and manage your digital health vault records with MediSlot.",
      },
      { property: "og:title", content: "MediSlot — Your Journey To Wellness Starts Here" },
      {
        property: "og:description",
        content:
          "Search doctors by specialization, city and consultation fee, book clinic appointments, and manage your digital health vault records with MediSlot.",
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
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans selection:bg-amber-200">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#FAF8F5] pb-16 pt-8 sm:pb-24 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Top Pill Tag */}
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 shadow-xs">
              <Sparkles className="size-3.5 text-amber-600" />
              {isDoctor
                ? `Doctor Portal Active • ${user?.fullName}`
                : isAdmin
                ? "Clinic Network Administration"
                : "Your Journey To Wellness Starts Here"}
            </span>

            {/* Main Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]">
              {isDoctor ? (
                <>Welcome back to Doctor Desk, <span className="text-amber-700">{user?.fullName}</span></>
              ) : isAdmin ? (
                <>MediSlot Clinic <span className="text-teal-700">Administration Portal</span></>
              ) : (
                <>Your Journey To <span className="text-amber-700 underline decoration-amber-300 decoration-wavy underline-offset-8">Wellness</span> Starts Here</>
              )}
            </h1>

            {/* Sub-headline */}
            <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">
              {isDoctor
                ? "Review assigned patient appointments, inspect shared health vault records, record prescription notes, and publish consultation slots."
                : isAdmin
                ? "Monitor network analytics, manage doctor profiles, inspect security audit logs, and administer clinic documents."
                : "MediSlot connects patients, verified specialist doctors, and clinics in one seamless scheduling workspace — search availability, confirm bookings, and keep your health vault in sync."}
            </p>

            {/* CTA Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {isDoctor ? (
                <>
                  <Button asChild size="lg" className="h-12 rounded-2xl bg-amber-600 px-6 font-bold text-white shadow-md hover:bg-amber-700 gap-2">
                    <Link to="/doctor">
                      <Stethoscope className="size-5" /> Open Doctor Desk
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-12 rounded-2xl border-slate-300 bg-white/80 px-6 font-bold text-slate-700 hover:bg-slate-100 gap-2">
                    <Link to="/doctor/availability">
                      <CalendarCheck className="size-5 text-amber-600" /> Manage Availability
                    </Link>
                  </Button>
                </>
              ) : isAdmin ? (
                <Button asChild size="lg" className="h-12 rounded-2xl bg-teal-700 px-6 font-bold text-white shadow-md hover:bg-teal-800 gap-2">
                  <Link to="/admin">
                    <LayoutDashboard className="size-5" /> Open Admin Panel
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="h-12 rounded-2xl bg-amber-600 px-8 font-bold text-white shadow-md hover:bg-amber-700 gap-2 text-base">
                    <Link to="/doctors">
                      <Search className="size-5" /> Find a Doctor
                    </Link>
                  </Button>
                  {isAuthenticated ? (
                    <Button asChild size="lg" variant="outline" className="h-12 rounded-2xl border-slate-300 bg-white px-6 font-bold text-slate-700 hover:bg-slate-100 gap-2">
                      <Link to="/dashboard">
                        <LayoutDashboard className="size-5 text-amber-600" /> My Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild size="lg" variant="outline" className="h-12 rounded-2xl border-slate-300 bg-white px-6 font-bold text-slate-700 hover:bg-slate-100 gap-2">
                        <Link to="/register" search={{ role: "PATIENT" }}>
                          <User className="size-5 text-amber-600" /> Join as Patient
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="ghost" className="h-12 rounded-2xl font-bold text-slate-600 hover:bg-amber-100/50 gap-2">
                        <Link to="/register" search={{ role: "DOCTOR" }}>
                          <Stethoscope className="size-5 text-amber-600" /> Join as Doctor
                        </Link>
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-400">
              ⚡ MediSlot handles appointment scheduling only. It does not replace emergency medical care.
            </p>
          </div>

          {/* TRUST STATS METRIC BANNER */}
          <div className="mt-14 grid gap-6 sm:grid-cols-3 lg:gap-8">
            <div className="rounded-3xl border border-amber-200/80 bg-white/90 p-6 text-center shadow-xs backdrop-blur-xs transition-transform hover:-translate-y-1">
              <p className="text-4xl font-extrabold text-amber-700 sm:text-5xl">96%</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500">Patient Satisfaction Rate</p>
            </div>
            <div className="rounded-3xl border border-teal-200/80 bg-white/90 p-6 text-center shadow-xs backdrop-blur-xs transition-transform hover:-translate-y-1">
              <p className="text-4xl font-extrabold text-teal-700 sm:text-5xl">10+</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500">Years Healthcare Experience</p>
            </div>
            <div className="rounded-3xl border border-rose-200/80 bg-white/90 p-6 text-center shadow-xs backdrop-blur-xs transition-transform hover:-translate-y-1">
              <p className="text-4xl font-extrabold text-rose-700 sm:text-5xl">100+</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500">Verified Specialist Doctors</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-STEP PROCESS SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Getting Started Shouldn't Be The Hardest Part.
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
            Book trusted doctor consultations in under 60 seconds with 3 easy steps.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.stepNo} className="relative rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs transition-all hover:shadow-md hover:border-amber-300">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-sm font-extrabold border ${s.badgeColor}`}>
                  Step {s.stepNo}
                </span>
                <span className="grid size-12 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                  <s.icon className="size-6" />
                </span>
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-slate-900">{s.title}</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONCERNS & SPECIALIZATIONS SECTION */}
      <section className="bg-[#F5F0E6] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-200/80 px-3.5 py-1 rounded-full">
                Departments & Specializations
              </span>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Whatever You're Carrying, There's Someone Who Gets It.
              </h2>
            </div>
            <Button asChild variant="outline" className="rounded-2xl border-slate-400 bg-white font-bold text-slate-700 hover:bg-slate-100 self-start md:self-auto">
              <Link to="/doctors">View All Departments ➔</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CONCERNS.map((c) => (
              <Link
                key={c.name}
                to="/doctors"
                search={{ specialization: c.linkSpec }}
                className={`group rounded-3xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${c.bg}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-block rounded-xl px-3 py-1 text-xs font-extrabold ${c.tagBg}`}>
                    {c.linkSpec}
                  </span>
                  <ArrowRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-800" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{c.name}</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DOCTORS SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
            Specialist Network
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            The People Behind MediSlot
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
            Experienced, verified medical specialists ready to listen and treat.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockDoctors.slice(0, 3).map((doc) => (
            <div key={doc.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-4">
                  <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-800 font-extrabold text-xl">
                    {doc.fullName.charAt(4) || "D"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{doc.fullName}</h3>
                    <p className="text-xs font-semibold text-amber-700">{doc.specializationName}</p>
                    <p className="text-[11px] text-slate-500">{doc.qualifications} • {doc.yearsOfExperience} yrs exp</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs">
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="size-4 fill-amber-500 text-amber-500" /> {doc.ratingAverage} ({doc.ratingCount} reviews)
                  </span>
                  <span className="font-extrabold text-slate-900">₹{doc.consultationFee} / session</span>
                </div>
              </div>
              <Button asChild className="mt-6 w-full rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800">
                <Link to={`/doctors/${doc.id}`}>Book Consultation</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE MEDISLOT CORNER-OVERLAPPING CARDS SECTION */}
      <section className="bg-[#FDEBB2]/90 border-t border-b border-amber-300/60 py-20 overflow-hidden relative">
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
                  Every doctor on MediSlot is screened for real credentials, registration numbers, and track record — so you're never guessing who's on the other end.
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

      {/* THEIR WORDS, NOT OURS TESTIMONIALS SECTION */}
      <section id="patient-reviews" className="bg-[#FAF8F5] py-16 scroll-mt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
                Patient Testimonials
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Their Words, Not Ours.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Read how MediSlot simplified doctor consultations, live OPD queue tracking, and medical record vault sharing for patients across clinics.
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

      {/* PRICING & CONSULTATION OPTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Two Ways To Get Support
          </h2>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <div className="rounded-3xl border-2 border-amber-300 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="inline-block rounded-xl bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-900">
                Single Consultation
              </span>
              <h3 className="mt-4 text-2xl font-extrabold text-slate-900">Pre-Consultation Visit</h3>
              <p className="mt-2 text-xs text-slate-500">Book a single session when you need an immediate expert doctor opinion.</p>
              <div className="mt-6 text-3xl font-black text-slate-900">
                Starts At <span className="text-amber-700">₹499</span> <span className="text-xs font-normal text-slate-500">/ session</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" /> Single session, in-person or online</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" /> Live OPD Queue Token # assigned</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" /> Downloadable Digital PDF Prescription</li>
              </ul>
            </div>
            <Button asChild size="lg" className="mt-8 rounded-2xl bg-amber-600 text-white font-bold hover:bg-amber-700">
              <Link to="/doctors">Book Single Session</Link>
            </Button>
          </div>

          <div className="rounded-3xl border-2 border-teal-300 bg-white p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="inline-block rounded-xl bg-teal-100 px-3 py-1 text-xs font-extrabold text-teal-900">
                Full Health Package
              </span>
              <h3 className="mt-4 text-2xl font-extrabold text-slate-900">Comprehensive Care</h3>
              <p className="mt-2 text-xs text-slate-500">Includes consultation + AES-256 Health Vault Locker + follow-up checks.</p>
              <div className="mt-6 text-3xl font-black text-slate-900">
                Starts At <span className="text-teal-700">₹1,299</span> <span className="text-xs font-normal text-slate-500">/ package</span>
              </div>
              <ul className="mt-6 space-y-3 text-xs font-medium text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" /> Full session bundle with senior specialists</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" /> Encrypted Digital Health Vault Storage</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-600" /> Flexible scheduling & priority follow-up</li>
              </ul>
            </div>
            <Button asChild size="lg" className="mt-8 rounded-2xl bg-teal-700 text-white font-bold hover:bg-teal-800">
              <Link to="/doctors">Explore Packages</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="bg-[#FAF6EE] py-16 border-t border-amber-200/60">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Questions? We've Got Answers.
            </h2>
            <p className="mt-2 text-sm text-slate-600">Everything you need to know about MediSlot scheduling.</p>
          </div>

          <div className="mt-10 space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between text-left font-bold text-slate-900 text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`size-5 transition-transform text-slate-400 ${openFaq === idx ? "rotate-180 text-amber-600" : ""}`} />
                </button>
                {openFaq === idx ? (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t pt-3">
                    {faq.a}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIG BOTTOM CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 px-8 py-14 text-center text-white shadow-xl">
          <Sparkles className="mx-auto size-10 text-amber-200 mb-4" />
          <h2 className="text-3xl font-black sm:text-4xl">Your First Session Is On Us.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-amber-100">
            Join thousands of patients who schedule clinic visits, track OPD queues, and manage medical records seamlessly.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="h-12 rounded-2xl bg-white px-8 font-extrabold text-amber-900 shadow-md hover:bg-amber-50">
              <Link to="/doctors">Book A Session Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* BIG TYPOGRAPHY FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-white font-extrabold text-xl">
                <Stethoscope className="size-6 text-amber-500" /> MediSlot
              </div>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed">
                Enterprise doctor appointment booking, live OPD queue tokens & encrypted health vault locker.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Patient Tools</h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li><Link to="/doctors" className="hover:text-white">Find Doctors</Link></li>
                <li><Link to="/appointments" className="hover:text-white">My Appointments</Link></li>
                <li><Link to="/health-vault" className="hover:text-white">Digital Health Vault</Link></li>
                <li><Link to="/health-risk-calculator" className="hover:text-white">AI Health Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Doctor Portal</h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li><Link to="/doctor" className="hover:text-white">Doctor Desk Workspace</Link></li>
                <li><Link to="/doctor/availability" className="hover:text-white">Manage Availability Slots</Link></li>
                <li><Link to="/register" search={{ role: "DOCTOR" }} className="hover:text-white">Join As Doctor</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Contact & Support</h4>
              <p className="mt-3 text-xs text-slate-400">Support Email: support@medislot.test</p>
              <p className="mt-1 text-xs text-slate-400">Clinic Helpline: +91 98441 23440</p>
            </div>
          </div>

          {/* GIANT LOGO BANNER */}
          <div className="pt-10 text-center">
            <h1 className="text-6xl font-black tracking-widest text-slate-800 sm:text-8xl lg:text-9xl select-none opacity-80">
              MEDISLOT
            </h1>
            <p className="mt-4 text-[11px] text-slate-500">
              © {new Date().getFullYear()} MediSlot Healthcare System. All rights reserved. Built with React & Spring Boot.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
