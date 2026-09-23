import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  X,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/b2b")({
  head: () => ({
    meta: [
      { title: "B2B & Corporate Wellness — Durrmi For Teams" },
      {
        name: "description",
        content:
          "Support for the people who build your company. Durrmi partners with organizations to bring licensed therapy, executive coaching, and team wellness programs directly to your workplace.",
      },
    ],
  }),
  component: B2BPage,
});

// Interactive Program Options from Figma B2B_v2.0
const B2B_PROGRAMS = [
  {
    id: "prog-1",
    title: "Sponsored One-To-One Support",
    shortDesc: "Lorem ipsum dolor sit amet consectetur. Turpis dolor duis convallis moles",
    features: [
      "Facilitated group sessions led by licensed mental health professionals",
      "Safe, confidential space for shared experiences and peer support",
      "Customizable formats — by team, department, or company-wide",
      "Focus areas like stress management, workplace conflict, change, and burnout prevention",
      "Continuous impact measurement with anonymized quarterly employee wellbeing reports",
    ],
  },
  {
    id: "prog-2",
    title: "Team Programs And Workshops.",
    shortDesc: "Interactive clinical workshops tackling high-pressure deadlines, resilience, and collaborative flow.",
    features: [
      "Live interactive group workshops designed for technical and high-stress teams",
      "Guided decompression sessions following major product launches or reorganizations",
      "Practical cognitive frameworks for psychological safety and open team communication",
      "Hands-on exercises on stress de-escalation and collaborative boundary-setting",
    ],
  },
  {
    id: "prog-3",
    title: "Leadership And Executive Development",
    shortDesc: "Private, confidential executive coaching to sharpen emotional resilience and decision clarity.",
    features: [
      "Confidential 1-on-1 consultations with senior organizational psychologists",
      "Decision fatigue management and executive cognitive stamina support",
      "Strategies to foster empathy and clear leadership without taking on team burnout",
      "Tailored executive onboarding and high-stakes crisis navigation",
    ],
  },
  {
    id: "prog-4",
    title: "Manager Enablement.",
    shortDesc: "Equipping managers with psychological first-aid tools to spot burnout early and support teams responsibly.",
    features: [
      "Training managers to identify subtle distress signals before resignation happens",
      "Clear boundaries: how to support direct reports without acting as an unlicensed therapist",
      "Actionable 1-on-1 check-in templates focused on mental bandwidth",
      "Ongoing mentorship circles for newly promoted team leads",
    ],
  },
  {
    id: "prog-5",
    title: "Organisational Crisis Response.",
    shortDesc: "Rapid-response psychological debriefing and grief support during sudden restructuring or loss.",
    features: [
      "24/7 priority emergency triage for workplace traumatic events or sudden loss",
      "Experienced crisis psychologists on-site or virtual within 24 hours",
      "Structured post-incident group debriefing and stabilization circles",
      "Ongoing individual follow-up care for directly impacted team members",
    ],
  },
  {
    id: "prog-6",
    title: "Wellbeing Pulse And Reporting.",
    shortDesc: "Anonymized, aggregate mental health metrics providing HR leadership visibility without violating trust.",
    features: [
      "Strict HIPAA and GDPR compliant anonymized utilization insights",
      "Department-level stress heatmaps to identify over-leveraged teams",
      "Quarterly ROI benchmarks comparing engagement and absenteeism trends",
      "Custom executive presentations with actionable HR recommendations",
    ],
  },
  {
    id: "prog-7",
    title: "Employer Console And Account Service",
    shortDesc: "A dedicated care manager and frictionless admin portal for easy benefits management.",
    features: [
      "Single centralized admin dashboard with instant employee provisioning",
      "Dedicated corporate care manager reachable via direct Slack/Teams channel",
      "Automated monthly invoices with zero hidden platform charges",
      "Self-serve seat upgrades and customizable session allowances",
    ],
  },
  {
    id: "prog-8",
    title: "Group Therapy",
    shortDesc: "Safe, professionally facilitated cohort therapy addressing shared workplace challenges.",
    features: [
      "Facilitated group sessions led by licensed mental health professionals",
      "Safe, confidential space for shared experiences and peer support",
      "Customizable formats — by team, department, or company-wide",
      "Focus areas like stress management, workplace conflict, change, and burnout prevention",
    ],
  },
];

export function B2BPage() {
  const [activeProgId, setActiveProgId] = useState(B2B_PROGRAMS[0].id);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state for Corporate Modal
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formTeamSize, setFormTeamSize] = useState("51-200");
  const [formMessage, setFormMessage] = useState("");

  const activeProgram =
    B2B_PROGRAMS.find((p) => p.id === activeProgId) || B2B_PROGRAMS[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim() || !formCompany.trim()) {
      toast.error("Please fill in your work email and company name.");
      return;
    }
    toast.success(`Thank you, ${formName || "there"}! Our Corporate Care Director will reach out to ${formEmail} within 2 hours.`);
    setModalOpen(false);
    setFormName("");
    setFormEmail("");
    setFormCompany("");
    setFormMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 font-sans selection:bg-amber-200">
      
      {/* 1. HERO SECTION (Matching Figma Image 1 Top) */}
      <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-24 border-b border-amber-200/40">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[380px] bg-gradient-to-b from-[#FFEAA7]/30 via-[#FFF4D4]/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Support For The People Who Build Your Company
              </h1>

              <p className="text-sm sm:text-base font-semibold text-slate-600 leading-relaxed max-w-xl">
                Durrmi partners with organizations to bring expert coaching and group therapy directly to your teams — helping leaders think clearer and employees feel supported, together.
              </p>

              <div className="pt-2">
                <Button
                  onClick={() => setModalOpen(true)}
                  size="lg"
                  className="h-12 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md border border-amber-400 cursor-pointer"
                >
                  Book a session for your team
                </Button>
              </div>
            </div>

            {/* Right Hero Image: Team Celebration Photo matching Figma Image 1 */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg aspect-[16/11] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-lg border border-slate-200/90 bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="High-performing, happy corporate team celebration"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DIFFERENT PROGRAMS FOR ALL YOUR TEAM NEEDS (Matching Figma Image 1 Bottom) */}
      <section className="py-20 sm:py-28 bg-[#FFFDF8] border-b border-amber-200/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Different Programs For All Your<br className="hidden sm:inline" /> Team Needs
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xl mx-auto leading-relaxed">
              Every journey looks different. That's why we've built a few simple ways to start.
            </p>
          </div>

          {/* Interactive Split Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-4">
            
            {/* Left Column: Interactive Program Tabs */}
            <div className="lg:col-span-6 space-y-3 text-left">
              {B2B_PROGRAMS.map((prog) => {
                const isActive = prog.id === activeProgId;
                return (
                  <div
                    key={prog.id}
                    onClick={() => setActiveProgId(prog.id)}
                    className={`cursor-pointer transition-all duration-200 py-3 px-4 rounded-xl ${
                      isActive
                        ? "border-l-4 border-[#FFBE0B] bg-amber-50/60 shadow-2xs"
                        : "border-l-4 border-transparent hover:bg-slate-50 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <h3
                      className={`text-base sm:text-lg font-black tracking-tight ${
                        isActive ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {prog.title}
                    </h3>

                    {isActive && (
                      <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed animate-in fade-in duration-200">
                        {prog.shortDesc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Stacked Feature Cards matching Figma */}
            <div className="lg:col-span-6">
              <div className="rounded-[32px] border border-amber-200/80 bg-white p-6 sm:p-8 shadow-sm space-y-3.5">
                {activeProgram.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#FDECB2] text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed text-left flex items-start gap-3 shadow-2xs"
                  >
                    <span className="size-4.5 rounded-full bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-black text-[10px] mt-0.5">
                      ✓
                    </span>
                    <span>{feat}</span>
                  </div>
                ))}

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={() => setModalOpen(true)}
                    className="rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-bold text-xs uppercase tracking-wider px-6 h-10 border border-amber-400"
                  >
                    Inquire about this program
                  </Button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. GETTING STARTED IS SIMPLE (Matching Figma Image 2) */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Getting Started Is Simple
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xl mx-auto leading-relaxed">
              Whether you consult with us or build with us — you'll be shaping how consultancy works for the next generation.
            </p>
          </div>

          {/* 4 Staggered Connected Step Cards Matching Figma Image 2 */}
          <div className="relative max-w-4xl mx-auto pt-6 pb-8">
            
            {/* SVG Curved Dashed Connection Paths */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
              viewBox="0 0 800 680"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Path 01 -> 02 */}
              <path
                d="M 380 90 C 450 90, 480 180, 520 220"
                stroke="#64748B"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeOpacity="0.45"
              />
              {/* Path 02 -> 03 */}
              <path
                d="M 440 330 C 370 330, 340 380, 320 420"
                stroke="#64748B"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeOpacity="0.45"
              />
              {/* Path 03 -> 04 */}
              <path
                d="M 380 500 C 450 500, 480 540, 520 570"
                stroke="#64748B"
                strokeWidth="2"
                strokeDasharray="6 6"
                strokeOpacity="0.45"
              />
            </svg>

            <div className="space-y-10 sm:space-y-12 relative z-10">
              
              {/* Card 01: Consult (Yellow) */}
              <div className="flex justify-start">
                <div className="w-full sm:w-[380px] rounded-[24px] border-2 border-amber-300 bg-white overflow-hidden shadow-md">
                  <div className="h-4 bg-[#FFE58F]" />
                  <div className="p-6 text-left space-y-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#FFBE0B]">01</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">Consult</h3>
                    <div className="border-b border-slate-200 pt-1" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 pt-2 leading-relaxed">
                      Tell us about your team size, goals, and challenges.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 02: Customize (Blue) */}
              <div className="flex justify-end">
                <div className="w-full sm:w-[380px] rounded-[24px] border-2 border-blue-300 bg-white overflow-hidden shadow-md">
                  <div className="h-4 bg-[#BEE3F8]" />
                  <div className="p-6 text-left space-y-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#3182CE]">02</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">Customize</h3>
                    <div className="border-b border-slate-200 pt-1" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 pt-2 leading-relaxed">
                      We design a tailored 1-on-1 or group therapy program that fits your organization.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 03: Onboard (Orange) */}
              <div className="flex justify-start">
                <div className="w-full sm:w-[380px] rounded-[24px] border-2 border-orange-300 bg-white overflow-hidden shadow-md">
                  <div className="h-4 bg-[#FED7D7]" />
                  <div className="p-6 text-left space-y-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#DD6B20]">03</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">Onboard</h3>
                    <div className="border-b border-slate-200 pt-1" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 pt-2 leading-relaxed">
                      Employees and leaders are matched with licensed professionals and scheduled seamlessly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 04: Support, Ongoing (Purple) */}
              <div className="flex justify-end">
                <div className="w-full sm:w-[380px] rounded-[24px] border-2 border-purple-300 bg-white overflow-hidden shadow-md">
                  <div className="h-4 bg-[#7064CB]" />
                  <div className="p-6 text-left space-y-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#7064CB]">04</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">Support, Ongoing</h3>
                    <div className="border-b border-slate-200 pt-1" />
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 pt-2 leading-relaxed">
                      Sessions run on a recurring cadence, with check-ins to track impact and adjust as needed.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. FINAL CALLOUT BANNER WITH SIGNATURE VECTOR ART (Matching Figma Image 3) */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FFFDF7] border-t border-amber-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 text-center">
            
            {/* Left Vector Illustration: Two Colleagues Sitting in Beanbags */}
            <div className="hidden lg:block w-64 h-64 shrink-0">
              <svg viewBox="0 0 250 250" className="w-full h-full drop-shadow-sm">
                <g transform="translate(10, 10)">
                  {/* Left Person */}
                  <path d="M 25 110 C 5 130 5 180 35 195 C 65 210 105 200 115 170 C 125 140 105 110 65 105 Z" fill="#D95D39" />
                  <path d="M 50 140 Q 70 160 80 190 L 110 190 Q 90 155 70 140 Z" fill="#2A9D8F" />
                  <path d="M 40 90 Q 60 80 80 90 L 70 140 Q 50 140 40 90 Z" fill="#8B4513" />
                  <circle cx="55" cy="60" r="16" fill="#1A1A1A" />
                  <circle cx="60" cy="62" r="13" fill="#F2B89D" />
                  <ellipse cx="115" cy="192" rx="12" ry="6" fill="#E76F51" />
                  <ellipse cx="85" cy="192" rx="12" ry="6" fill="#E76F51" />

                  {/* Right Person in Same Beanbag Talking */}
                  <path d="M 120 105 C 90 115 90 175 120 195 C 150 210 200 195 205 160 C 210 125 180 100 140 105 Z" fill="#F4A261" />
                  <path d="M 130 145 Q 140 180 150 195 L 180 195 Q 165 155 150 145 Z" fill="#E9C46A" />
                  <path d="M 120 95 Q 145 85 170 95 L 155 145 Q 130 145 120 95 Z" fill="#6B3A19" />
                  <circle cx="150" cy="60" r="16" fill="#1A1A1A" />
                  <circle cx="146" cy="62" r="13" fill="#F2B89D" />
                  <ellipse cx="150" cy="197" rx="14" ry="7" fill="#E76F51" />
                  <ellipse cx="182" cy="197" rx="14" ry="7" fill="#E76F51" />
                </g>
              </svg>
            </div>

            {/* Center Content */}
            <div className="space-y-6 max-w-xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Your People Are Your Company. Take Care Of Both.
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                Investing in mental health isn't a perk anymore — it's infrastructure. Let's build a program that supports your leaders and your teams, together.
              </p>
              <div>
                <Button
                  onClick={() => setModalOpen(true)}
                  size="lg"
                  className="h-12 px-9 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md border border-amber-400 cursor-pointer"
                >
                  Talk to us
                </Button>
              </div>
            </div>

            {/* Right Vector Illustration: Doctor with Clipboard */}
            <div className="hidden lg:block w-64 h-64 shrink-0">
              <svg viewBox="0 0 250 250" className="w-full h-full drop-shadow-sm">
                <g transform="translate(10, 10)">
                  {/* Beanbag */}
                  <path d="M 40 105 C 10 115 10 175 40 195 C 70 210 120 195 125 160 C 130 125 100 100 60 105 Z" fill="#D95D39" />
                  {/* Legs */}
                  <path d="M 50 145 Q 60 180 70 195 L 100 195 Q 85 155 70 145 Z" fill="#F4A261" />
                  {/* Torso */}
                  <path d="M 40 95 Q 65 85 90 95 L 75 145 Q 50 145 40 95 Z" fill="#2A9D8F" />
                  {/* Head */}
                  <circle cx="70" cy="60" r="16" fill="#1A1A1A" />
                  <circle cx="66" cy="62" r="13" fill="#F2B89D" />
                  {/* Clipboard */}
                  <rect x="25" y="105" width="22" height="30" rx="3" fill="#8B4513" />
                  <rect x="29" y="110" width="14" height="20" rx="1" fill="#FFFFFF" />
                  {/* Green Shoes */}
                  <ellipse cx="70" cy="197" rx="14" ry="7" fill="#2A9D8F" />
                  <ellipse cx="102" cy="197" rx="14" ry="7" fill="#2A9D8F" />
                </g>
              </svg>
            </div>

          </div>
        </div>
      </section>

      {/* CORPORATE INQUIRY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <X className="size-4" />
            </button>

            <div className="space-y-2 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold">
                <Building2 className="size-3.5 text-amber-600" /> B2B Corporate Wellness
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Design Your Team Program
              </h2>
              <p className="text-xs font-semibold text-slate-600">
                Tell us about your organization and our Lead Clinical Director will prepare a customized proposal within 2 hours.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 pt-4 text-left">
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1">
                  Your Full Name
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Priya Nair"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="rounded-xl border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1">
                    Work Email
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="priya@company.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="rounded-xl border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1">
                    Company Name
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Acme Corp"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="rounded-xl border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1">
                  Estimated Team Size
                </label>
                <select
                  value={formTeamSize}
                  onChange={(e) => setFormTeamSize(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="10-50">10 – 50 employees</option>
                  <option value="51-200">51 – 200 employees</option>
                  <option value="201-1000">201 – 1,000 employees</option>
                  <option value="1000+">1,000+ enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1">
                  How Can We Help Your Team?
                </label>
                <Textarea
                  placeholder="e.g. We are looking for group resilience workshops and subsidized 1-on-1 therapy for our tech team..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="rounded-xl border-slate-300 text-xs min-h-[80px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider px-6 border border-amber-400 shadow-sm"
                >
                  Submit Inquiry
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
