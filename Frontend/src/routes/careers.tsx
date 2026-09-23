import { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Clock, Globe, UploadCloud, ChevronDown, ChevronUp, CheckCircle2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers & Join Our Team — Durrmi Mental Wellness" },
      {
        name: "description",
        content:
          "Build the future of therapy with Durrmi. Join our verified network of licensed consultants or our team of passionate builders.",
      },
    ],
  }),
  component: CareersPage,
});

export function CareersPage() {
  // Accordion state for Open Roles
  const [expandedRole, setExpandedRole] = useState<string | null>("product-designer");

  // Application form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    applyingFor: "Licensed Consultant / Therapist",
    specialisation: "Individual Therapy",
    role: "Product Designer",
    message: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applySectionRef = useRef<HTMLDivElement>(null);

  const scrollToApply = (preselectRole?: string) => {
    if (preselectRole) {
      setFormData((prev) => ({ ...prev, role: preselectRole }));
    }
    applySectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Please fill in your name and email address.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Application submitted successfully! Our team will reach out within 48 hours.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans pb-24 selection:bg-amber-200">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Matching Careers_v3.0 Image 1)                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] py-16 sm:py-24 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Let's reshape how the<br />
                world does therapy
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-600 max-w-lg leading-relaxed">
                Whether you're a professional looking to consult, or a builder who wants to join our team — there's a place for you at Durrmi.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => scrollToApply()}
                  size="lg"
                  className="h-12 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/40 cursor-pointer"
                >
                  Join Durrmi
                </Button>
              </div>
            </div>

            {/* Right Photography Card: Diverse Team Hands Stack */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                <img
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1000&q=80"
                  alt="Team members joining hands together in collaboration"
                  className="w-full h-80 sm:h-96 object-cover rounded-[36px] sm:rounded-[44px] shadow-2xl border-4 border-white/90"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. WHY PEOPLE CHOOSE DURRMI (3 Floating Pastel Cards - Image 1)          */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-amber-200/50 bg-[#FAF7EF]/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Let's reshape how the world does therapy
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
              Bring your consulting expertise or lock in as a builder on our team-Durrmi has a sport for you
            </p>
          </div>

          {/* 3 Staggered Value Cards */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch pt-4 text-left max-w-5xl mx-auto">
            
            {/* Card 1: Mission-Driven Work (Warm Yellow) */}
            <div className="rounded-[32px] border-2 border-amber-300/90 bg-[#FCE6A6] p-8 shadow-md flex flex-col justify-between space-y-6 hover:-translate-y-1.5 transition-all">
              <div className="space-y-4">
                {/* 8-Point Pointed Star SVG Icon */}
                <div className="size-16 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="size-14 text-amber-500 fill-amber-500">
                    <polygon points="50,0 62,35 98,20 72,50 98,80 62,65 50,100 38,65 2,80 28,50 2,20 38,35" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
                  Mission-Driven<br />Work
                </h3>
                <div className="h-[1.5px] w-full bg-amber-400/80" />
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                  Purpose first.Build a consultancy that's trusted and accessible
                </p>
              </div>
            </div>

            {/* Card 2: Transparent Culture (Sky Blue, Staggered Down) */}
            <div className="rounded-[32px] border-2 border-sky-300/90 bg-[#BAE6FD] p-8 shadow-md flex flex-col justify-between space-y-6 md:translate-y-4 hover:translate-y-2 transition-all">
              <div className="space-y-4">
                {/* Multi-Petal Flower SVG Icon */}
                <div className="size-16 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="size-14 fill-[#0284C7]">
                    {/* Flower Petals */}
                    <circle cx="50" cy="50" r="14" fill="#0369A1" />
                    <ellipse cx="50" cy="22" rx="7" ry="16" />
                    <ellipse cx="50" cy="78" rx="7" ry="16" />
                    <ellipse cx="22" cy="50" rx="16" ry="7" />
                    <ellipse cx="78" cy="50" rx="16" ry="7" />
                    <g transform="rotate(45 50 50)">
                      <ellipse cx="50" cy="22" rx="7" ry="16" />
                      <ellipse cx="50" cy="78" rx="7" ry="16" />
                      <ellipse cx="22" cy="50" rx="16" ry="7" />
                      <ellipse cx="78" cy="50" rx="16" ry="7" />
                    </g>
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
                  Transparent<br />Culture
                </h3>
                <div className="h-[1.5px] w-full bg-sky-300" />
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                  Real talk, always."- Clear, fair, and honest-no exceptions
                </p>
              </div>
            </div>

            {/* Card 3: Growth-Focused (Peach / Coral, Angled) */}
            <div className="rounded-[32px] border-2 border-orange-300/90 bg-[#FFD0B5] p-8 shadow-md flex flex-col justify-between space-y-6 md:rotate-2 hover:rotate-0 hover:-translate-y-1.5 transition-all">
              <div className="space-y-4">
                {/* 6-Point Coral Star SVG Icon */}
                <div className="size-16 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="size-14 fill-[#EA580C]">
                    <polygon points="50,5 63,35 96,35 70,55 80,88 50,68 20,88 30,55 4,35 37,35" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
                  Growth-<br />Focused
                </h3>
                <div className="h-[1.5px] w-full bg-orange-300/90" />
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                  Level up here." -Learn, grow and expand your role over time.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. A SIMPLE, SECURE PATH TO JOINING AS A CONSULTANT (Zigzag Path - Img 2) */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Section Header: Left Title + Right Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left border-b border-amber-200/50 pb-8">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                No cap, joining as a<br />consultant is this simple
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                Simple, transparent steps designed to welcome licensed professionals into our trusted care network without friction.
              </p>
            </div>
          </div>

          {/* 5 Zigzag Stepped Cards with Connecting Curved Arrows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative items-start">
            
            {/* Step 1: Submit Your Application (Yellow) */}
            <div className="rounded-[28px] bg-[#FFBE0B] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform relative">
              <span className="inline-flex size-10 items-center justify-center bg-white rounded-full text-xs font-black text-amber-950 shadow-xs">
                01
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Submit Your Application
              </h3>
              <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                Tell us about your background, expertise, and areas you specialize in
              </p>
            </div>

            {/* Step 2: Document Verification (Orange, Lower offset) */}
            <div className="rounded-[28px] bg-[#F97316] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform relative lg:mt-12">
              <span className="inline-flex size-10 items-center justify-center bg-white rounded-full text-xs font-black text-orange-950 shadow-xs">
                02
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Document Verification
              </h3>
              <p className="text-xs font-medium text-orange-50 leading-relaxed">
                We confirm your qualifications, certifications and active licenses
              </p>
            </div>

            {/* Step 3: Background & Compliance (Sky Blue, Top) */}
            <div className="rounded-[28px] bg-[#38BDF8] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform relative">
              <span className="inline-flex size-10 items-center justify-center bg-white rounded-full text-xs font-black text-sky-950 shadow-xs">
                03
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Background & Compliance
              </h3>
              <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                Thorough checks ensure every consultant meets our trusted standards.
              </p>
            </div>

            {/* Step 4: Onboarding Call (Green, Lower offset) */}
            <div className="rounded-[28px] bg-[#22C55E] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform relative lg:mt-12">
              <span className="inline-flex size-10 items-center justify-center bg-white rounded-full text-xs font-black text-emerald-950 shadow-xs">
                04
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Onboarding Call
              </h3>
              <p className="text-xs font-medium text-emerald-50 leading-relaxed">
                A quick chat to walk through how Durrmi works and answer questions.
              </p>
            </div>

            {/* Step 5: Go Live (Deep Indigo, Top) */}
            <div className="rounded-[28px] bg-[#3730A3] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform relative">
              <span className="inline-flex size-10 items-center justify-center bg-white rounded-full text-xs font-black text-indigo-950 shadow-xs">
                05
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Go Live
              </h3>
              <p className="text-xs font-medium text-indigo-100 leading-relaxed">
                Set your schedule, open your profile, and begin consulting with clients
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BE PART OF OUR MISSION (Open Positions with Accordions - Image 3)      */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#FAF7EF] border-t border-b border-amber-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header: Left Title + Right Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
            <div className="max-w-md">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Let's do this together
              </h2>
            </div>
            <div className="max-w-lg">
              <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                Change doesn't happen solo. Team up with us and be part of a mission built for real people, real growth, real impact.
              </p>
            </div>
          </div>

          {/* Job Listings Accordion Stack */}
          <div className="space-y-6 max-w-4xl mx-auto text-left">
            
            {/* Job 1: Product Designer */}
            <div className="rounded-[28px] border-2 border-amber-300/80 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="h-2 w-full bg-[#FFBE0B]" />
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">Product Designer</h3>
                    <p className="text-xs font-semibold text-slate-600">
                      We're looking for a mid-level product designer to join our team
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-800 border border-slate-200">
                        <Clock className="size-3.5" /> Full Time
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-800 border border-slate-200">
                        <Globe className="size-3.5" /> 100% Remote
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToApply("Product Designer")}
                    className="self-start sm:self-center text-xs font-black text-slate-900 underline underline-offset-4 hover:text-amber-800 cursor-pointer"
                  >
                    Apply now
                  </button>
                </div>

                {/* Collapsible Content */}
                {expandedRole === "product-designer" ? (
                  <div className="pt-4 border-t border-slate-100 space-y-6 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed animate-in fade-in-50 duration-200">
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900">About The Job</h4>
                      <p>
                        You'll shape intuitive, compassionate digital healthcare experiences that connect real people with verified therapy and emotional care. You will collaborate directly with founders and clinical advisors to design accessible, frictionless workflows that turn emotional support into an easy, everyday reality.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900">Responsibilities</h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                        <li>Lead end-to-end design from user research and wireframes to polished UI and prototypes.</li>
                        <li>Partner with front-end engineers to ensure pixel-perfect, responsive component delivery.</li>
                        <li>Conduct empathetic user research with both clients and practicing therapists.</li>
                        <li>Maintain, evolve, and document Durrmi's warm, pastel design system.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Business", "Design", "Marketing", "Figma", "User Research", "Prototyping"].map((skill) => (
                          <span key={skill} className="px-3 py-1 rounded-full bg-amber-100/80 text-amber-950 font-bold text-[11px] border border-amber-300/60">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Toggle Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setExpandedRole(expandedRole === "product-designer" ? null : "product-designer")}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    {expandedRole === "product-designer" ? (
                      <>Know Less <ChevronUp className="size-4" /></>
                    ) : (
                      <>Know More <ChevronDown className="size-4" /></>
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* Job 2: Licensed Clinical Consultant */}
            <div className="rounded-[28px] border-2 border-amber-300/80 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="h-2 w-full bg-[#F97316]" />
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">Licensed Clinical Consultant</h3>
                    <p className="text-xs font-semibold text-slate-600">
                      Join our verified directory of psychologists, counselors, and relationship therapists
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-800 border border-slate-200">
                        <Clock className="size-3.5" /> Flexible Hours
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-800 border border-slate-200">
                        <Globe className="size-3.5" /> 100% Remote
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToApply("Licensed Clinical Consultant")}
                    className="self-start sm:self-center text-xs font-black text-slate-900 underline underline-offset-4 hover:text-amber-800 cursor-pointer"
                  >
                    Apply now
                  </button>
                </div>

                {/* Collapsible Content */}
                {expandedRole === "consultant" ? (
                  <div className="pt-4 border-t border-slate-100 space-y-6 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed animate-in fade-in-50 duration-200">
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900">About The Job</h4>
                      <p>
                        Provide compassionate, 1-on-1, couple, or group therapy to individuals seeking guidance through anxiety, grief, relationships, and major transitions. You maintain total control over your schedule while we handle verified bookings, secure infrastructure, and client coordination.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900">Responsibilities</h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                        <li>Conduct secure, confidential video consultations via Durrmi's compliant web platform.</li>
                        <li>Deliver evidence-based therapy and practical guidance tailored to client needs.</li>
                        <li>Set your own weekly availability and consultation rates.</li>
                        <li>Adhere to licensed clinical guidelines and professional code of ethics.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {["Clinical Psychology", "CBT", "Couples Counselling", "Trauma-Informed", "Active Listening"].map((skill) => (
                          <span key={skill} className="px-3 py-1 rounded-full bg-orange-100/80 text-orange-950 font-bold text-[11px] border border-orange-300/60">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Toggle Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setExpandedRole(expandedRole === "consultant" ? null : "consultant")}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    {expandedRole === "consultant" ? (
                      <>Know Less <ChevronUp className="size-4" /></>
                    ) : (
                      <>Know More <ChevronDown className="size-4" /></>
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* Job 3: Fullstack Software Engineer */}
            <div className="rounded-[28px] border-2 border-amber-300/80 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
              <div className="h-2 w-full bg-[#38BDF8]" />
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900">Fullstack Software Engineer</h3>
                    <p className="text-xs font-semibold text-slate-600">
                      Build secure, resilient healthcare infrastructure with React, TypeScript, and Java Spring Boot
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-800 border border-slate-200">
                        <Clock className="size-3.5" /> Full Time
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-800 border border-slate-200">
                        <Globe className="size-3.5" /> 100% Remote
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToApply("Fullstack Software Engineer")}
                    className="self-start sm:self-center text-xs font-black text-slate-900 underline underline-offset-4 hover:text-amber-800 cursor-pointer"
                  >
                    Apply now
                  </button>
                </div>

                {/* Collapsible Content */}
                {expandedRole === "engineer" ? (
                  <div className="pt-4 border-t border-slate-100 space-y-6 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed animate-in fade-in-50 duration-200">
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900">About The Job</h4>
                      <p>
                        Develop real-time consultation scheduling, patient health vaults, SSR web architecture, and secure telehealth workflows. You will take full ownership over scalable web features and production reliability.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900">Responsibilities</h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                        <li>Engineer accessible, high-performance UI using TanStack Router, React, and Tailwind CSS.</li>
                        <li>Develop secure REST endpoints with Spring Boot, PostgreSQL, and token-based authentication.</li>
                        <li>Ensure end-to-end security compliance for healthcare and appointment data.</li>
                        <li>Continuously optimize Core Web Vitals, SSR performance, and developer experience.</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-900">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {["React", "TypeScript", "TailwindCSS", "Java", "Spring Boot", "PostgreSQL"].map((skill) => (
                          <span key={skill} className="px-3 py-1 rounded-full bg-sky-100/80 text-sky-950 font-bold text-[11px] border border-sky-300/60">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Toggle Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setExpandedRole(expandedRole === "engineer" ? null : "engineer")}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    {expandedRole === "engineer" ? (
                      <>Know Less <ChevronUp className="size-4" /></>
                    ) : (
                      <>Know More <ChevronDown className="size-4" /></>
                    )}
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. READY TO BE PART OF DURRMI'S STORY? (Application Form - Image 4)      */}
      {/* ========================================================================= */}
      <section ref={applySectionRef} id="apply" className="py-20 sm:py-24 scroll-mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="space-y-3 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Your Story Starts with Durrmi.
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
              This is more than a service — it's a movement. Come grow with us and make your mark on the story.
            </p>
          </div>

          {/* Form & Image Two-Column Grid */}
          <div className="grid lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
            
            {/* Left Photo: Two Happy Team Members Outdoor */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
                  alt="Two team members smiling together in sunlight"
                  className="w-full h-96 sm:h-[480px] object-cover rounded-[36px] shadow-2xl border-4 border-white"
                />
              </div>
            </div>

            {/* Right Application Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-[32px] border border-amber-200/80 shadow-lg text-left">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="size-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Application Received!</h3>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-md mx-auto">
                    Thank you for applying to join Durrmi. Our talent and onboarding team will review your details and reach out within 48 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        applyingFor: "Licensed Consultant / Therapist",
                        specialisation: "Individual Therapy",
                        role: "Product Designer",
                        message: "",
                      });
                      setResumeFile(null);
                    }}
                    className="rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider px-6 h-10 mt-4"
                  >
                    Submit Another Application
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Row 1: Full Name & Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Full Name *</label>
                      <Input
                        required
                        type="text"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="h-11 rounded-xl bg-slate-50/80 border-slate-300/80 text-xs font-semibold focus:border-amber-400 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Email *</label>
                      <Input
                        required
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-11 rounded-xl bg-slate-50/80 border-slate-300/80 text-xs font-semibold focus:border-amber-400 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Row 2: Phone No. & What are you applying for */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Phone No.</label>
                      <Input
                        type="tel"
                        placeholder="Phone No."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-11 rounded-xl bg-slate-50/80 border-slate-300/80 text-xs font-semibold focus:border-amber-400 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">What are you applying for</label>
                      <select
                        value={formData.applyingFor}
                        onChange={(e) => setFormData({ ...formData, applyingFor: e.target.value })}
                        className="h-11 w-full rounded-xl bg-slate-50/80 border border-slate-300/80 px-3 text-xs font-semibold text-slate-800 focus:border-amber-400 focus:bg-white outline-none"
                      >
                        <option value="Licensed Consultant / Therapist">Licensed Consultant / Therapist</option>
                        <option value="Team Member / Engineering">Team Member / Engineering</option>
                        <option value="Team Member / Product & Design">Team Member / Product & Design</option>
                        <option value="Team Member / Operations & Growth">Team Member / Operations & Growth</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Which specialisation are you interested in? (If consultant) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Which specialisation are you interested in? (If consultant)
                    </label>
                    <select
                      value={formData.specialisation}
                      onChange={(e) => setFormData({ ...formData, specialisation: e.target.value })}
                      className="h-11 w-full rounded-xl bg-slate-50/80 border border-slate-300/80 px-3 text-xs font-semibold text-slate-800 focus:border-amber-400 focus:bg-white outline-none"
                    >
                      <option value="Individual Therapy">Individual Therapy</option>
                      <option value="Couples & Relationship Counselling">Couples & Relationship Counselling</option>
                      <option value="Child & Adolescent Therapy">Child & Adolescent Therapy</option>
                      <option value="Coaching">Coaching</option>
                      <option value="Group Therapy">Group Therapy</option>
                      <option value="Not Applicable (Applying as Team Member)">Not Applicable (Applying as Team Member)</option>
                    </select>
                  </div>

                  {/* Row 4: Which role are you interested in? (If team member) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Which role are you interested in? (If team member)
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="h-11 w-full rounded-xl bg-slate-50/80 border border-slate-300/80 px-3 text-xs font-semibold text-slate-800 focus:border-amber-400 focus:bg-white outline-none"
                    >
                      <option value="Product Designer">Product Designer</option>
                      <option value="Licensed Clinical Consultant">Licensed Clinical Consultant</option>
                      <option value="Fullstack Software Engineer">Fullstack Software Engineer</option>
                      <option value="Care Operations Manager">Care Operations Manager</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Row 5: Upload Resume Box */}
                  <div className="space-y-1 pt-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setResumeFile(file);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-slate-300 rounded-2xl p-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:bg-amber-50/60 hover:border-amber-400 transition-all cursor-pointer"
                    >
                      <UploadCloud className="size-5 text-amber-500" />
                      {resumeFile ? (
                        <span className="text-emerald-700 font-extrabold truncate max-w-xs">
                          {resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)
                        </span>
                      ) : (
                        <span>Upload Resume (PDF, DOCX up to 10MB)</span>
                      )}
                    </button>
                  </div>

                  {/* Row 6: Tell us why you'd like to join Durrmi */}
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-bold text-slate-700">
                      Tell us why you'd like to join Durrmi
                    </label>
                    <Textarea
                      rows={4}
                      placeholder="Tell us about your background, why you care about mental healthcare, and what you're hoping to build or accomplish together..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="rounded-xl bg-slate-50/80 border-slate-300/80 text-xs font-medium focus:border-amber-400 focus:bg-white leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 px-9 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/40 cursor-pointer"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>

                </form>
              )}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
