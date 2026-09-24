import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, HeartHandshake, ShieldCheck, Compass, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/services/individual-therapy")({
  head: () => ({
    meta: [
      { title: "Individual Therapy — Dedicated Space for You | Durrmi" },
      {
        name: "description",
        content:
          "Culturally inclusive and trauma-informed 1-on-1 therapy. Work through what is weighing on you with licensed psychotherapists at Durrmi.",
      },
    ],
  }),
  component: IndividualTherapyPage,
});

export function IndividualTherapyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans pb-24 selection:bg-amber-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] py-16 sm:py-24 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300">
                <Sparkles className="size-3 text-amber-600" /> 1-on-1 Individual Therapy
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Your dedicated space — just you and your therapist.
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-600 max-w-xl leading-relaxed">
                Individual therapy is your dedicated space — just you and a professional who's fully present for your journey. It's culturally inclusive and trauma-informed, meaning you're met with understanding, respect and care that honours your background, your story, and your pace.
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-700 max-w-xl leading-relaxed">
                Together, you'll work through what's weighing on you, uncover new perspectives, and build the tools to move forward with clarity and confidence.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Book a session</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 px-7 rounded-full border-slate-300 bg-white/90 text-slate-800 font-bold text-xs uppercase hover:bg-slate-100 shadow-xs"
                >
                  <a href="#offers">What it offers ↓</a>
                </Button>
              </div>
            </div>

            {/* Right Illustration/Image */}
            <div className="md:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                alt="Individual in a peaceful, supportive therapy session"
                className="w-full max-w-md h-72 sm:h-88 object-cover rounded-[32px] shadow-xl border-2 border-white/90"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHAT IT OFFERS SECTION */}
      <section id="offers" className="py-16 sm:py-20 border-b border-amber-200/40 scroll-mt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              What Individual Therapy Offers
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Personalized, gentle care built around your reality — not one-size-fits-all advice.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="rounded-[28px] border border-amber-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
                <HeartHandshake className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Personalised Care
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Sessions shaped entirely around your personal goals, life challenges, and immediate emotional needs.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-[28px] border border-sky-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800">
                <Compass className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Culturally Inclusive
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Support that honors and respects who you are, your family background, cultural identity, and lived experiences.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-[28px] border border-emerald-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Trauma-Informed
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Safe, gentle and paced for you. Zero pressure to revisit old wounds before you feel ready and grounded.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-[28px] border border-purple-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-800">
                <Sparkles className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Real Growth
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Evidence-based tools and profound self-insight for navigating every challenge, turning point, and transition in life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMMON CONCERNS WE ADDRESS */}
      <section className="py-16 sm:py-20 bg-[#FAF7EF] border-b border-amber-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-6 space-y-5 text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                Safe &amp; Confidential
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                You were never meant to carry it all on your own.
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Whether you're fighting chronic anxiety, untangling depression and low mood, dealing with workplace burnout, or questioning who you are at a crossroads — our licensed individual therapists walk beside you.
              </p>
              <div className="pt-2">
                <Button asChild size="lg" className="h-11 px-7 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
                  <Link to="/doctors">Explore Individual Therapists</Link>
                </Button>
              </div>
            </div>

            <div className="md:col-span-6 space-y-3">
              {[
                "Persistent anxiety, overthinking, and feeling on edge",
                "Low energy, loss of motivation, and low mood loops",
                "Navigating grief, loss, or overwhelming life transitions",
                "Burnout, work exhaustion, and boundaries at work & home",
                "Healing from past emotional wounds and relationship trauma",
                "Building genuine self-worth, emotional safety, and clarity",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-amber-200/80 p-4 flex items-center gap-3 shadow-2xs hover:border-amber-400 transition-colors"
                >
                  <CheckCircle2 className="size-4 text-amber-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 4. SIMPLE 4-STEP PROCESS */}
      <section className="py-16 sm:py-24 border-b border-amber-200/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Starting Is Simple &amp; Stress-Free
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
              No complicated hoops. Book a session at your convenience and meet your therapist online or in-app.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-[28px] bg-[#FFBE0B] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-amber-900 shadow-xs">
                01
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Find Your Match
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Filter verified specialists by concern, approach, and background to choose the right professional for you.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-[28px] bg-[#F97316] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-orange-900 shadow-xs">
                02
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Book A Time Slot
              </h3>
              <p className="text-xs font-medium text-orange-50 leading-relaxed">
                Choose a time that fits into your day. Secure instant confirmation with 100% transparent pricing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-[28px] bg-[#38BDF8] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-sky-900 shadow-xs">
                03
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Meet In Confidence
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Join your private video session. Share as much or as little as you want, completely free of judgment.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-[28px] bg-[#22C55E] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-emerald-900 shadow-xs">
                04
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Step-by-Step Growth
              </h3>
              <p className="text-xs font-medium text-emerald-50 leading-relaxed">
                Walk away with personalized coping tools, fresh perspectives, and unwavering presence for your path ahead.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. CONSULTANT SPOTLIGHT CTA */}
      <section className="py-16 sm:py-24 bg-[#FAF7EF]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=80"
                alt="Individual Psychotherapist at Durrmi"
                className="w-full max-w-sm h-80 sm:h-96 object-cover rounded-[32px] shadow-xl border-2 border-white"
              />
            </div>

            <div className="md:col-span-7 space-y-6 text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Connect With An Individual Therapist Today
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Your feelings are valid, and your mind deserves attentive care. Whether this is your very first session or you're returning to therapy, our compassionate consultants are ready to listen without reason and walk beside you.
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Meet Our Therapists</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
