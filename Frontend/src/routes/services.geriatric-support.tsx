import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Brain, Sun, ShieldCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/services/geriatric-support")({
  head: () => ({
    meta: [
      { title: "Geriatric Support — Compassionate Care for Ageing | Durrmi" },
      {
        name: "description",
        content:
          "Compassionate geriatric mental health support for older adults. Emotional care for loneliness, grief, life transitions, and mental well-being.",
      },
    ],
  }),
  component: GeriatricSupportPage,
});

export function GeriatricSupportPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans pb-24 selection:bg-amber-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] py-16 sm:py-24 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-950 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
                <Sparkles className="size-3 text-emerald-600" /> Geriatric &amp; Senior Wellness
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Compassionate Care: Ageing With Dignity &amp; Peace.
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-600 max-w-xl leading-relaxed">
                Ageing comes with its own set of changes, and no one should face them alone. Geriatric support offers gentle, understanding care for older adults navigating emotional, mental, and life transitions that come with this stage.
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-700 max-w-xl leading-relaxed">
                A respectful, patient, and warm space to talk through loneliness, health changes, grief, and finding joy in everyday life.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Connect with a specialist</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 px-7 rounded-full border-slate-300 bg-white/90 text-slate-800 font-bold text-xs uppercase hover:bg-slate-100 shadow-xs"
                >
                  <a href="#offers">What we offer ↓</a>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="md:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
                alt="Older adult enjoying peaceful companionship and mental wellness"
                className="w-full max-w-md h-72 sm:h-88 object-cover rounded-[32px] shadow-xl border-2 border-white/90"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHAT WE OFFER SECTION */}
      <section id="offers" className="py-16 sm:py-20 border-b border-amber-200/40 scroll-mt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              What We Offer in Geriatric Support
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Gentle, holistic support centered on dignity, respect, and emotional connection.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* Card 1: Emotional Support */}
            <div className="rounded-[28px] border border-amber-200 bg-white p-7 shadow-sm hover:shadow-md transition-all space-y-4 text-left">
              <div className="size-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
                <Heart className="size-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Emotional Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Coping with loneliness, isolation, grief, loss of life partners or longtime friends, and navigating shifts in independence with empathy and active listening.
              </p>
            </div>

            {/* Card 2: Mental Well-Being */}
            <div className="rounded-[28px] border border-sky-200 bg-white p-7 shadow-sm hover:shadow-md transition-all space-y-4 text-left">
              <div className="size-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800">
                <Brain className="size-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Mental Well-Being
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Attentive care for late-life anxiety, memory concerns, cognitive changes, mood swings, and gentle reassurance for worry around health vulnerabilities.
              </p>
            </div>

            {/* Card 3: Life Transitions */}
            <div className="rounded-[28px] border border-emerald-200 bg-white p-7 shadow-sm hover:shadow-md transition-all space-y-4 text-left">
              <div className="size-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <Sun className="size-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Life Transitions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Support for personal growth, finding renewed purpose in retirement, fostering positivity, and building fulfilling and comforting new daily routines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHO CAN BENEFIT */}
      <section className="py-16 sm:py-20 bg-[#FAF7EF] border-b border-amber-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-6 space-y-5 text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Dignity &amp; Understanding
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Honoring a lifetime of stories and experiences.
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Ageing brings wisdom, but it can also bring feelings of being unheard or sidelined. Our geriatric therapists provide a patient, warm, and deeply respectful environment for both seniors and their families.
              </p>
              <div className="pt-2">
                <Button asChild size="lg" className="h-11 px-7 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
                  <Link to="/doctors">Find Senior Care Specialists</Link>
                </Button>
              </div>
            </div>

            <div className="md:col-span-6 space-y-3">
              {[
                "Loneliness and reduced social engagement after retirement",
                "Navigating grief, loss of a spouse, or loss of siblings",
                "Anxiety around physical mobility or changing health conditions",
                "Memory worries, cognitive disorientation, or emotional changes",
                "Family caregiver support and balancing independence with assistance",
                "Finding new meaning, connection, and joy in daily rituals",
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

      {/* 4. 4-STEP PROCESS */}
      <section className="py-16 sm:py-24 border-b border-amber-200/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Gentle Care In 4 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
              Designed with complete accessibility and zero stress for seniors and their families.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-[28px] bg-[#FFBE0B] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-amber-900 shadow-xs">
                01
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Initial Welcome
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Connect directly or have a family member assist with an easy scheduling process tailored to preference.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-[28px] bg-[#F97316] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-orange-900 shadow-xs">
                02
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Patient, Paced Talk
              </h3>
              <p className="text-xs font-medium text-orange-50 leading-relaxed">
                Sessions proceed at a calm, comfortable pace with specialists trained in geriatric psychology and empathy.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-[28px] bg-[#38BDF8] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-sky-900 shadow-xs">
                03
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Meaning &amp; Routine
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                We develop practical routines for daily engagement, cognitive stimulation, and mental relaxation.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-[28px] bg-[#22C55E] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-emerald-900 shadow-xs">
                04
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Ongoing Companionship
              </h3>
              <p className="text-xs font-medium text-emerald-50 leading-relaxed">
                Reliable continuity and caregiver communication so older adults always know someone is in their corner.
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
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=700&q=80"
                alt="Geriatric Care Consultant at Durrmi"
                className="w-full max-w-sm h-80 sm:h-96 object-cover rounded-[32px] shadow-xl border-2 border-white"
              />
            </div>

            <div className="md:col-span-7 space-y-6 text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Senior Care &amp; Geriatric Specialists
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Our consultants bring deep clinical expertise in elder care, grief processing, dementia support for families, and emotional well-being. Because mental health matters at every decade of life.
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Meet Our Senior Care Specialists</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
