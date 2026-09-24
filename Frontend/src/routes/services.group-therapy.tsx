import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, MessageSquareHeart, ShieldCheck, CheckCircle2, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/services/group-therapy")({
  head: () => ({
    meta: [
      { title: "Group Therapy & Support Circles — Durrmi Mental Wellness" },
      {
        name: "description",
        content:
          "Not alone in this. Therapist-led weekly support groups to lift each other through anxiety, grief, relationships, and shared challenges at Durrmi.",
      },
    ],
  }),
  component: GroupTherapyPage,
});

export function GroupTherapyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans pb-24 selection:bg-amber-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] py-16 sm:py-24 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-teal-950 bg-teal-100 px-3.5 py-1 rounded-full border border-teal-300">
                <Users className="size-3 text-teal-700" /> Weekly Community Support Circles
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Group Therapy
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-bold text-teal-950 leading-snug">
                Not alone in this. A support group that meets weekly to lift each other through similar challenges.
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xl leading-relaxed">
                Isolation makes burdens heavier. When you sit in a room — virtual or in-person — with others walking through the exact same struggle, something shifts. You realize you were never broken, and you were never meant to carry it alone.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Join a support group</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 px-7 rounded-full border-slate-300 bg-white/90 text-slate-800 font-bold text-xs uppercase hover:bg-slate-100 shadow-xs"
                >
                  <a href="#offers">How circles work ↓</a>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="md:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
                alt="Supportive group of peers sharing and uplifting each other"
                className="w-full max-w-md h-72 sm:h-88 object-cover rounded-[32px] shadow-xl border-2 border-white/90"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHAT GROUP THERAPY OFFERS SECTION */}
      <section id="offers" className="py-16 sm:py-20 border-b border-amber-200/40 scroll-mt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              The Power of Healing Together
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Therapist-facilitated peer groups where genuine belonging replaces shame.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Shared Belonging */}
            <div className="rounded-[28px] border border-teal-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800">
                <Users className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Shared Belonging
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Break the illusion that nobody else feels the way you do. Experience the deep relief of shared experience.
              </p>
            </div>

            {/* Card 2: Diverse Perspectives */}
            <div className="rounded-[28px] border border-amber-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
                <MessageSquareHeart className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Diverse Perspectives
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Gain practical coping wisdom, unexpected insights, and encouragement from peers walking similar roads.
              </p>
            </div>

            {/* Card 3: Licensed Facilitator */}
            <div className="rounded-[28px] border border-sky-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Licensed Facilitation
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Every circle is guided by a qualified clinical psychologist to ensure emotional safety, fairness, and depth.
              </p>
            </div>

            {/* Card 4: Accessible Consistency */}
            <div className="rounded-[28px] border border-emerald-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <HeartHandshake className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Accessible Growth
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Receive ongoing weekly support and genuine friendship at an affordable rate that fits smoothly into life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ACTIVE SUPPORT CIRCLES */}
      <section className="py-16 sm:py-20 bg-[#FAF7EF] border-b border-amber-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-6 space-y-5 text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-950 bg-teal-100 px-3 py-1 rounded-full border border-teal-300">
                Weekly Circles
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Find the circle that speaks to your reality.
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Our support circles are capped at small intimate numbers (6 to 10 participants) to maintain complete intimacy and psychological safety. Join a circle tailored to your challenge.
              </p>
              <div className="pt-2">
                <Button asChild size="lg" className="h-11 px-7 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
                  <Link to="/doctors">Explore Support Circles</Link>
                </Button>
              </div>
            </div>

            <div className="md:col-span-6 space-y-3">
              {[
                "Anxiety & Overthinking Circle — weekly somatic calming and shared grounding",
                "Grief & Bereavement Circle — holding space for loss and loving memory",
                "Young Adults & Career Transitions — navigating identity, burnout, and purpose",
                "Breakup & Relationship Recovery — healing after heartbreak with peer empathy",
                "New Parents Circle — post-partum emotions, relationship strain, and adjustments",
                "Men's & Women's Vulnerability Circles — honest talk free from societal expectations",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-teal-200/80 p-4 flex items-center gap-3 shadow-2xs hover:border-teal-400 transition-colors"
                >
                  <CheckCircle2 className="size-4 text-teal-600 shrink-0" />
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
              Joining A Group Is Easy
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
              Find your circle, meet your facilitator, and experience community healing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-[28px] bg-[#FFBE0B] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-amber-900 shadow-xs">
                01
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Select Your Topic
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Browse our active weekly circles: anxiety, grief, relationships, or burnout support.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-[28px] bg-[#F97316] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-orange-900 shadow-xs">
                02
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                1-on-1 Pre-Check
              </h3>
              <p className="text-xs font-medium text-orange-50 leading-relaxed">
                A brief 15-minute chat with the therapist facilitator to ensure the circle matches your needs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-[28px] bg-[#38BDF8] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-sky-900 shadow-xs">
                03
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Meet Weekly
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Join your scheduled 75-minute confidential session online or at local clinic spaces.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-[28px] bg-[#22C55E] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-emerald-900 shadow-xs">
                04
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Lift Each Other
              </h3>
              <p className="text-xs font-medium text-emerald-50 leading-relaxed">
                Form lasting bonds, exchange insights, and watch your resilience expand week by week.
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
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=80"
                alt="Group Therapy Facilitator at Durrmi"
                className="w-full max-w-sm h-80 sm:h-96 object-cover rounded-[32px] shadow-xl border-2 border-white"
              />
            </div>

            <div className="md:col-span-7 space-y-6 text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Certified Group Facilitators
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Holding space for multiple voices requires warmth, precision, and deep emotional attunement. Our facilitators guide every conversation with safety, empathy, and evidence-based exercises.
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Find An Open Circle</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
