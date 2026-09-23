import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, ShieldCheck, HeartHandshake, Award } from "lucide-react";

export const Route = createFileRoute("/therapists")({
  head: () => ({
    meta: [
      { title: "Meet Our Therapists — Durrmi" },
      {
        name: "description",
        content:
          "We partner only with world-class, licensed psychotherapists and clinical psychologists to provide dedicated, compassionate mental health care for your unique journey.",
      },
    ],
  }),
  component: TherapistsPage,
});

// Avatar collage in Hero section matching Figma Therapists_v3.0
const COLLAGE_AVATARS = [
  { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", name: "Therapist 1", className: "w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-32 -rotate-3" },
  { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80", name: "Therapist 2", className: "w-14 h-18 sm:w-18 sm:h-22 md:w-22 md:h-28 rotate-2" },
  { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80", name: "Therapist 3", className: "w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-36 -rotate-1" },
  { url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80", name: "Therapist 4", className: "w-18 h-22 sm:w-22 sm:h-26 md:w-26 md:h-32 rotate-3" },
  { url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80", name: "Therapist 5", className: "w-20 h-24 sm:w-24 sm:h-28 md:w-28 md:h-36 -rotate-2" },
  { url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80", name: "Therapist 6", className: "w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-30 rotate-2" },
  { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80", name: "Therapist 7", className: "w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-32 -rotate-1" },
];

const SPECIALIST_CARDS = [
  {
    id: "sp-1",
    name: "Aditi Sharma",
    role: "Anxiety specialist",
    category: "Anxiety Specialists",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    experience: "8+ yrs exp",
  },
  {
    id: "sp-2",
    name: "Dr. Ryan Vance",
    role: "Anxiety specialist",
    category: "Anxiety Specialists",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    experience: "12+ yrs exp",
  },
  {
    id: "sp-3",
    name: "Aditi Sharma",
    role: "Anxiety specialist",
    category: "Anxiety Specialists",
    imageUrl: "https://images.unsplash.com/photo-1594824813566-7885a3964478?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    experience: "6+ yrs exp",
  },
  {
    id: "sp-4",
    name: "Dr. Elena Rostova",
    role: "Anxiety specialist",
    category: "Anxiety Specialists",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    experience: "10+ yrs exp",
  },
  {
    id: "sp-5",
    name: "Dr. Michael Chen",
    role: "Depression specialist",
    category: "Depression Specialists",
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    experience: "11+ yrs exp",
  },
  {
    id: "sp-6",
    name: "Dr. Emily Davis",
    role: "Couple specialist",
    category: "Couple Specialists",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    experience: "9+ yrs exp",
  },
  {
    id: "sp-7",
    name: "Dr. Sarah Williams",
    role: "Stress specialist",
    category: "Stress Specialists",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    experience: "7+ yrs exp",
  },
];

// Core Team (4 top row + 3 bottom row matching Figma Therapists_v3.0)
const CORE_TEAM_MEMBERS = [
  {
    name: "Aditi Sharma",
    role: "Lead Clinical Psychologist",
    imageUrl: "https://images.unsplash.com/photo-1594824813566-7885a3964478?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dr. Ryan Vance",
    role: "Chief Psychotherapy Advisor",
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dr. Elena Rostova",
    role: "Couples & Family Specialist",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Aditi Sharma",
    role: "Stress & Anxiety Consultant",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dr. Michael Vance",
    role: "Senior Behavioral Therapist",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Aditi Sharma",
    role: "Trauma Care Specialist",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dr. Sarah Chen",
    role: "Holistic Wellness Director",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
  },
];

const FILTER_CATEGORIES = [
  "Anxiety Specialists",
  "Depression Specialists",
  "Couple Specialists",
  "Stress Specialists",
  "Relationship Recovery",
  "Career Coaching",
  "Couples Therapy",
];

export function TherapistsPage() {
  const [activeCategory, setActiveCategory] = useState("Anxiety Specialists");
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollTrack = (direction: "left" | "right") => {
    if (trackRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      trackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const filteredCards = SPECIALIST_CARDS.filter(
    (c) => c.category === activeCategory || activeCategory === "Anxiety Specialists"
  );

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-800 font-sans selection:bg-amber-200">
      
      {/* ============================================================== */}
      {/* 1. HERO SECTION: Collage + Trusted By World Class Therapists    */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] pt-14 pb-20 sm:pt-20 sm:pb-28 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8 relative">
          
          {/* Top Collage of Headshots (matching Figma Therapists_v3.0) */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-hidden py-4 max-w-5xl mx-auto flex-wrap">
            {COLLAGE_AVATARS.map((avatar, idx) => (
              <div
                key={idx}
                className={`${avatar.className} rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white shadow-lg shrink-0 transition-transform duration-300 hover:scale-110 hover:z-20 bg-slate-200`}
              >
                <img
                  src={avatar.url}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Centered Headline Content */}
          <div className="space-y-4 max-w-3xl mx-auto pt-4 relative">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-slate-500 bg-amber-100/80 px-4 py-1 rounded-full border border-amber-300/60">
              TRUSTED BY
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              We Partner Only With<br />World-Class Therapists.
            </h1>

            {/* Subtitle using real website content from Screenshot 2 */}
            <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-600 leading-relaxed max-w-2xl mx-auto pt-2">
              We partner only with world-class, licensed psychotherapists and clinical psychologists to provide dedicated, compassionate mental health care for your unique journey.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/40"
              >
                <Link to="/free-session">
                  Book a free session ↗
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-full border-slate-300 bg-white/90 font-bold text-slate-700 hover:bg-slate-100 text-xs uppercase tracking-wider shadow-xs"
              >
                <Link to="/doctors">
                  Browse All Doctors
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-8 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600" />
                <span>100% Verified Credentials</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="size-4 text-amber-600" />
                <span>5+ Years Experience Minimum</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="size-4 text-sky-600" />
                <span>Empathetic, Judgment-Free</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. OUR SPECIALIST TEAM (Carousel + Filter Pills)                */}
      {/* ============================================================== */}
      <section className="bg-[#FAF8F3] py-20 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="space-y-3 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Meet the Specialists Behind Every Solution
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xl mx-auto leading-relaxed">
              A dedicated team of experts committed to solving your toughest challenges with precision, care, and proven experience.
            </p>
          </div>

          {/* Category Filter Pills (2 Rows matching Figma) */}
          <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto pt-2">
            {FILTER_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs ${
                    isActive
                      ? "bg-[#FFBE0B] text-slate-950 border-2 border-amber-400 scale-105"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-amber-50 hover:text-slate-900"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Specialist Full-Photo Cards Carousel */}
          <div className="relative pt-6">
            <div
              ref={trackRef}
              className="flex gap-6 overflow-x-auto scrollbar-none py-4 px-2 snap-x scroll-smooth max-w-6xl mx-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {filteredCards.map((therapist) => (
                <div
                  key={therapist.id}
                  className="w-[260px] sm:w-[300px] h-[360px] sm:h-[400px] rounded-[28px] overflow-hidden relative shadow-lg shrink-0 snap-start transition-all hover:scale-[1.02] bg-slate-100 border border-slate-200 group"
                >
                  <img
                    src={therapist.imageUrl}
                    alt={therapist.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
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
                onClick={() => scrollTrack("left")}
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
                onClick={() => scrollTrack("right")}
                aria-label="Next specialists"
                className="size-11 rounded-full border-2 border-slate-900 bg-white flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-xs cursor-pointer font-black text-lg"
              >
                →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. OUR CORE TEAM (4 Top + 3 Bottom Grid from Figma)             */}
      {/* ============================================================== */}
      <section className="bg-[#FAF7EF] py-20 sm:py-28 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              The Minds Behind Durrmi
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
              The passionate experts shaping every step of your healing journey.
            </p>
          </div>

          {/* Row 1: 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {CORE_TEAM_MEMBERS.slice(0, 4).map((member, idx) => (
              <div
                key={idx}
                className="h-[380px] rounded-[28px] overflow-hidden relative shadow-lg bg-slate-100 border border-slate-200 group hover:-translate-y-1.5 transition-all duration-300"
              >
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {/* Yellow Bottom-Left Label Badge */}
                <div className="absolute bottom-0 left-0 bg-[#FCE6A6] text-slate-950 px-5 py-3 rounded-tr-2xl rounded-bl-2xl border-t border-r border-amber-300 shadow-md text-left z-10">
                  <p className="text-sm font-black text-slate-900 leading-tight">
                    {member.name}
                  </p>
                  <p className="text-[11px] font-bold text-amber-900 leading-tight mt-0.5">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: 3 Cards Centered Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {CORE_TEAM_MEMBERS.slice(4, 7).map((member, idx) => (
              <div
                key={idx}
                className="h-[380px] rounded-[28px] overflow-hidden relative shadow-lg bg-slate-100 border border-slate-200 group hover:-translate-y-1.5 transition-all duration-300"
              >
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {/* Yellow Bottom-Left Label Badge */}
                <div className="absolute bottom-0 left-0 bg-[#FCE6A6] text-slate-950 px-5 py-3 rounded-tr-2xl rounded-bl-2xl border-t border-r border-amber-300 shadow-md text-left z-10">
                  <p className="text-sm font-black text-slate-900 leading-tight">
                    {member.name}
                  </p>
                  <p className="text-[11px] font-bold text-amber-900 leading-tight mt-0.5">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. BOTTOM BOOKING CTA BANNER                                    */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-[36px] bg-[#FFBE0B] border-2 border-amber-500/40 p-8 sm:p-12 shadow-xl relative overflow-hidden space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Ready to find the therapist that feels 100% right?
            </h2>
            <p className="text-sm sm:text-base font-semibold text-slate-900 max-w-xl mx-auto leading-relaxed">
              Book a zero-commitment 30-minute free clarity session or explore available appointment slots right now.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
              >
                <Link to="/free-session">
                  Book Free Session <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-full border-slate-950 bg-white/90 text-slate-900 font-bold hover:bg-white text-xs uppercase tracking-wider shadow-xs"
              >
                <Link to="/doctors">
                  Browse Doctor Slots
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
