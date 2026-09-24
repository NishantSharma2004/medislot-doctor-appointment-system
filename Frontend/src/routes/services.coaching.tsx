import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Target, Zap, Rocket, CheckCircle2, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/services/coaching")({
  head: () => ({
    meta: [
      { title: "Professional & Personal Coaching — Durrmi Mental Wellness" },
      {
        name: "description",
        content:
          "You don't need therapy to want clarity. Collaborate with certified coaches to unlock your higher potential and thrive in life and career at Durrmi.",
      },
    ],
  }),
  component: CoachingServicePage,
});

export function CoachingServicePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans pb-24 selection:bg-amber-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] py-16 sm:py-24 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-950 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
                <Rocket className="size-3 text-emerald-600" /> Unlock Your Higher Potential
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Executive &amp; Life Coaching
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-bold text-emerald-950 leading-snug">
                You don’t need therapy but would like to work with a professional collaboratively to unlock your higher potential.
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xl leading-relaxed">
                Sometimes you don't need healing — you need momentum, strategic clarity, and focused accountability. Our professional coaches partner with founders, executives, creators, and individuals at transitions to turn goals into measurable breakthroughs without burning out.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Book a coaching session</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 px-7 rounded-full border-slate-300 bg-white/90 text-slate-800 font-bold text-xs uppercase hover:bg-slate-100 shadow-xs"
                >
                  <a href="#offers">What coaching offers ↓</a>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="md:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
                alt="Confident professional in collaborative coaching discussion"
                className="w-full max-w-md h-72 sm:h-88 object-cover rounded-[32px] shadow-xl border-2 border-white/90"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHAT COACHING OFFERS SECTION */}
      <section id="offers" className="py-16 sm:py-20 border-b border-amber-200/40 scroll-mt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Collaborative Growth In Action
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Clear thinking, razor-sharp focus, and sustainable achievement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Goal Structuring */}
            <div className="rounded-[28px] border border-emerald-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <Target className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Goal Architecture
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Transform fuzzy ambitions into structured, sequenced milestones with concrete deadlines and metrics.
              </p>
            </div>

            {/* Card 2: Mindset Elevation */}
            <div className="rounded-[28px] border border-amber-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
                <Zap className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Mindset Elevation
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Shatter limiting self-beliefs, imposter syndrome, and decision paralysis to step into abundant confidence.
              </p>
            </div>

            {/* Card 3: Momentum & Accountability */}
            <div className="rounded-[28px] border border-sky-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800">
                <TrendingUp className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Active Accountability
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Regular, high-energy checkpoints to evaluate hurdles, maintain execution momentum, and celebrate wins.
              </p>
            </div>

            {/* Card 4: Sustainable Balance */}
            <div className="rounded-[28px] border border-purple-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-800">
                <Sparkles className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Sustainable Peak Flow
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Achieve ambitious career and creative outcomes without sacrificing mental health, sleep, or personal presence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOCUS AREAS */}
      <section className="py-16 sm:py-20 bg-[#FAF7EF] border-b border-amber-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-6 space-y-5 text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Future-Focused
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Partner with an expert who pushes you to sharpen your edge.
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Coaching is not about analyzing the past — it is about engineering your future. Our vetted professional coaches give you objective feedback, strategic frameworks, and unconditional support.
              </p>
              <div className="pt-2">
                <Button asChild size="lg" className="h-11 px-7 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
                  <Link to="/doctors">Find Your Coach</Link>
                </Button>
              </div>
            </div>

            <div className="md:col-span-6 space-y-3">
              {[
                "Navigating career transitions, promotions, or starting a business",
                "Breaking through creative blocks, procrastination, or overwhelm",
                "Public speaking confidence, executive presence, and negotiation",
                "Time management architecture and boundary setting for leaders",
                "Aligning everyday work with core values and long-term vision",
                "Building resilience and mental sharpness in high-pressure roles",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-emerald-200/80 p-4 flex items-center gap-3 shadow-2xs hover:border-emerald-400 transition-colors"
                >
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 4. 4-STEP COACHING ROADMAP */}
      <section className="py-16 sm:py-24 border-b border-amber-200/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              4 Steps To Level Up
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
              High-impact coaching tailored specifically to your goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-[28px] bg-[#FFBE0B] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-amber-900 shadow-xs">
                01
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Discovery &amp; Fit
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Clarify where you are, where you want to be, and ensure full synergy with your coach.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-[28px] bg-[#F97316] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-orange-900 shadow-xs">
                02
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Roadmap Blueprint
              </h3>
              <p className="text-xs font-medium text-orange-50 leading-relaxed">
                Co-design an actionable strategy, identifying levers of leverage and growth.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-[28px] bg-[#38BDF8] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-sky-900 shadow-xs">
                03
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Execution Sprints
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Bi-weekly or weekly sessions to remove bottlenecks, adjust tactics, and stay accountable.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-[28px] bg-[#22C55E] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-emerald-900 shadow-xs">
                04
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Unlock Potential
              </h3>
              <p className="text-xs font-medium text-emerald-50 leading-relaxed">
                Celebrate breakthroughs, internalize high-performance habits, and sustain your peak.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. CONSULTANT SPOTLIGHT */}
      <section className="py-16 sm:py-24 bg-[#FAF7EF]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80"
                alt="Executive & Life Coach at Durrmi"
                className="w-full max-w-sm h-80 sm:h-96 object-cover rounded-[32px] shadow-xl border-2 border-white"
              />
            </div>

            <div className="md:col-span-7 space-y-6 text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Vetted Life &amp; Executive Coaches
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Your highest self is waiting for you to step up. When you invest in your mindset, honesty, and execution, nothing can hold you back. Explore certified coaches who bring proven industry track records.
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Explore Certified Coaches</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
