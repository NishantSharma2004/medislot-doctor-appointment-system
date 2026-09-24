import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Shield, Compass, HeartHandshake, CheckCircle2, Lock } from "lucide-react";

export const Route = createFileRoute("/services/addiction-support")({
  head: () => ({
    meta: [
      { title: "Addiction & Substance Support — Durrmi Mental Wellness" },
      {
        name: "description",
        content:
          "Addictions holding you back? We understand this deeply. Confidential, non-judgmental addiction support and recovery therapy at Durrmi.",
      },
    ],
  }),
  component: AddictionSupportPage,
});

export function AddictionSupportPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans pb-24 selection:bg-amber-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] py-16 sm:py-24 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-rose-950 bg-rose-100 px-3.5 py-1 rounded-full border border-rose-300">
                <Lock className="size-3 text-rose-600" /> 100% Confidential &amp; Shame-Free
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Addiction Support
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-bold text-rose-950 leading-snug">
                Addictions holding you back? "We understand this deeply." We do not dismiss these issues; instead, we listen and provide support.
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xl leading-relaxed">
                Addiction is not a lack of willpower; it is often a coping mechanism for pain, anxiety, and overwhelm. We create a compassionate sanctuary where you can speak honestly about what you are dealing with — alcohol, substance dependency, behavioral compulsions, or digital escape — with experienced clinical experts.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Talk to a specialist</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 px-7 rounded-full border-slate-300 bg-white/90 text-slate-800 font-bold text-xs uppercase hover:bg-slate-100 shadow-xs"
                >
                  <a href="#offers">Our recovery approach ↓</a>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="md:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
                alt="Sunlight filtering through nature, symbol of clarity and recovery"
                className="w-full max-w-md h-72 sm:h-88 object-cover rounded-[32px] shadow-xl border-2 border-white/90"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. OUR APPROACH TO ADDICTION CARE */}
      <section id="offers" className="py-16 sm:py-20 border-b border-amber-200/40 scroll-mt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              A Gentle, Clinical Recovery Framework
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              No judgment, no moralizing. Pure clinical support and sustainable healing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Shame-Free Listening */}
            <div className="rounded-[28px] border border-rose-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-800">
                <HeartHandshake className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Shame-Free Listening
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                A space where you don't have to pretend. Talk openly about slips, cravings, and patterns without fear of disappointment.
              </p>
            </div>

            {/* Card 2: Root Cause Discovery */}
            <div className="rounded-[28px] border border-amber-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
                <Compass className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Root Cause Discovery
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Uncovering the underlying emotional triggers, trauma, or anxieties that fuel the urge to escape.
              </p>
            </div>

            {/* Card 3: Trigger & Craving Tools */}
            <div className="rounded-[28px] border border-sky-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800">
                <Shield className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Craving Response Plans
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Practical, in-the-moment cognitive and somatic tools to manage high-stress urges and break automatic loops.
              </p>
            </div>

            {/* Card 4: Long-Term Relapse Resilience */}
            <div className="rounded-[28px] border border-emerald-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <Sparkles className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Sustainable Freedom
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Rebuilding self-trust, restoring daily routines, and establishing a fulfilling lifestyle beyond dependency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AREAS OF SUPPORT */}
      <section className="py-16 sm:py-20 bg-[#FAF7EF] border-b border-amber-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-6 space-y-5 text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-950 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
                You Are Not Alone
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Taking the first step is the brave part.
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Whether you're exploring whether a habit has gotten out of hand, or you're seeking ongoing recovery maintenance, our licensed substance and addiction specialists meet you with clinical excellence and warmth.
              </p>
              <div className="pt-2">
                <Button asChild size="lg" className="h-11 px-7 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
                  <Link to="/doctors">Find An Addiction Specialist</Link>
                </Button>
              </div>
            </div>

            <div className="md:col-span-6 space-y-3">
              {[
                "Alcohol use and dependency patterns that feel hard to control",
                "Substance use and dependency (nicotine, prescription, or recreation)",
                "Digital addiction, chronic gaming, social media or screen burnout",
                "Impulsive and compulsive behaviors affecting finances or relationships",
                "Navigating relapse guilt and rebuilding family trust",
                "Creating supportive boundaries in work and social circles",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-rose-200/80 p-4 flex items-center gap-3 shadow-2xs hover:border-rose-400 transition-colors"
                >
                  <CheckCircle2 className="size-4 text-rose-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 4. 4-STEP PROCESS */}
      <section className="py-16 sm:py-24 border-b border-amber-200/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              A Private, Step-by-Step Pathway
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
              Complete confidentiality from booking to every one-on-one session.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-[28px] bg-[#FFBE0B] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-amber-900 shadow-xs">
                01
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Private Consultation
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Connect with verified therapists who specialize in behavioral health and dependency recovery.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-[28px] bg-[#F97316] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-orange-900 shadow-xs">
                02
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Honest Assessment
              </h3>
              <p className="text-xs font-medium text-orange-50 leading-relaxed">
                Map your patterns, identifying environmental and emotional triggers without blame or guilt.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-[28px] bg-[#38BDF8] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-sky-900 shadow-xs">
                03
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Grounding Strategies
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Build healthy coping substitutes and emotional tools to navigate distress when it peaks.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-[28px] bg-[#22C55E] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-emerald-900 shadow-xs">
                04
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Rebuilding Life
              </h3>
              <p className="text-xs font-medium text-emerald-50 leading-relaxed">
                Step into long-term vitality, renewed relationships, and confidence in your own strength.
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
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80"
                alt="Addiction Recovery Specialist at Durrmi"
                className="w-full max-w-sm h-80 sm:h-96 object-cover rounded-[32px] shadow-xl border-2 border-white"
              />
            </div>

            <div className="md:col-span-7 space-y-6 text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Compassionate Addiction Care Specialists
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                You don't have to carry the secrecy and exhaustion alone. Our clinical therapists are here to walk beside you, help you stabilize, and awaken your deep inner resilience.
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Meet Our Recovery Specialists</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
