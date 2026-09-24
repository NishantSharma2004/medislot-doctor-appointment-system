import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Smile, Compass, Users, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/services/child-adolescent-therapy")({
  head: () => ({
    meta: [
      { title: "Child & Adolescent Therapy — Durrmi Mental Wellness" },
      {
        name: "description",
        content:
          "Support for every stage of growing up. Safe, gentle, age-tailored child and adolescent therapy for emotions, behaviour, and school challenges.",
      },
    ],
  }),
  component: ChildAdolescentTherapyPage,
});

export function ChildAdolescentTherapyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans pb-24 selection:bg-amber-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] py-16 sm:py-24 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-orange-950 bg-orange-100 px-3.5 py-1 rounded-full border border-orange-300">
                <Sparkles className="size-3 text-orange-600" /> Child &amp; Teen Mental Health
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Support for Every Stage of Growing Up.
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-600 max-w-xl leading-relaxed">
                Growing up isn’t easy — and neither is watching your child struggle. From school stress to big emotions and changing behaviour, kids and teens face challenges they don’t always have the words for. Child &amp; adolescent therapy gives them a safe, supportive space to be understood and helped through it all.
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-700 max-w-xl leading-relaxed">
                Our approach meets children where they are — gentle, patient, and tailored to their age and stage of development. Every child deserves to feel heard, supported and capable — at every step of their journey.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Book a consultation</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-11 px-7 rounded-full border-slate-300 bg-white/90 text-slate-800 font-bold text-xs uppercase hover:bg-slate-100 shadow-xs"
                >
                  <a href="#benefits">What it helps with ↓</a>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="md:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
                alt="Child learning and smiling in a supportive caring session"
                className="w-full max-w-md h-72 sm:h-88 object-cover rounded-[32px] shadow-xl border-2 border-white/90"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. CALLOUT BANNER */}
      <section className="bg-[#FFF4E5] py-6 border-b border-orange-200/70">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm sm:text-base font-extrabold text-orange-950 tracking-tight">
            🌟 A safe space where your child can grow, heal, and thrive.
          </p>
        </div>
      </section>

      {/* 3. WHAT IT HELPS WITH SECTION */}
      <section id="benefits" className="py-16 sm:py-20 border-b border-amber-200/40 scroll-mt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              What Child &amp; Adolescent Therapy Helps With
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Targeted support navigating social, academic, and internal pressures with care.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Academic Challenges */}
            <div className="rounded-[28px] border border-amber-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
                <BookOpen className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Academic Challenges
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Handling test anxiety, attention difficulties, perfectionism stress, and school-related performance pressures.
              </p>
            </div>

            {/* Card 2: Behavioural Concerns */}
            <div className="rounded-[28px] border border-sky-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-800">
                <Compass className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Behavioural Concerns
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Understanding underlying emotional triggers, reducing defiance, and guiding positive behavioural changes.
              </p>
            </div>

            {/* Card 3: Emotional Navigation */}
            <div className="rounded-[28px] border border-rose-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-800">
                <Smile className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Emotional Navigation
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Equipping young minds to express and manage big feelings — anxiety, anger, sadness, and self-doubt — in healthy ways.
              </p>
            </div>

            {/* Card 4: Family Involvement */}
            <div className="rounded-[28px] border border-emerald-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <Users className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Family Involvement
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Equipping parents with practical tools, strategies, and communicative insights to nurture trust and healing at home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RECOGNIZING COMMON SIGNS */}
      <section className="py-16 sm:py-20 bg-[#FAF7EF] border-b border-amber-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-6 space-y-5 text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-orange-950 bg-orange-100 px-3 py-1 rounded-full border border-orange-300">
                Gentle Support
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Early support transforms young lives.
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                When children feel overwhelmed, it often shows up in their behaviour, sleep, or grades before they have the vocabulary to explain it. Our child psychologists build a playful, safe bond where children feel seen, not judged.
              </p>
              <div className="pt-2">
                <Button asChild size="lg" className="h-11 px-7 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
                  <Link to="/doctors">Find A Child Psychologist</Link>
                </Button>
              </div>
            </div>

            <div className="md:col-span-6 space-y-3">
              {[
                "Sudden withdrawal, silence, or hiding in their room",
                "Severe worry over exams, perfectionism, or school refusal",
                "Frequent tantrums, angry outbursts, or irritability",
                "Trouble making or keeping friends, feeling bullied or left out",
                "Changes in appetite, sleep issues, or chronic tummy aches without illness",
                "Difficulty coping with family changes, separation, or loss",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-amber-200/80 p-4 flex items-center gap-3 shadow-2xs hover:border-amber-400 transition-colors"
                >
                  <CheckCircle2 className="size-4 text-orange-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{item}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5. 4-STEP PROCESS */}
      <section className="py-16 sm:py-24 border-b border-amber-200/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How Child &amp; Adolescent Care Works
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
              Tailored to children's developmental age — from expressive play therapy to adolescent talk sessions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-[28px] bg-[#FFBE0B] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-amber-900 shadow-xs">
                01
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Parent Consultation
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Initial conversation with parents to understand development, school feedback, and your child's emotional world.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-[28px] bg-[#F97316] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-orange-900 shadow-xs">
                02
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Child-Friendly Sessions
              </h3>
              <p className="text-xs font-medium text-orange-50 leading-relaxed">
                Art, play, and age-adapted conversation where your child feels totally comfortable and respected.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-[28px] bg-[#38BDF8] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-sky-900 shadow-xs">
                03
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Skill &amp; Emotion Tools
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                We equip them with relatable techniques to calm anxieties, self-soothe, and navigate social hurdles.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-[28px] bg-[#22C55E] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-emerald-900 shadow-xs">
                04
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Home Guidance For Parents
              </h3>
              <p className="text-xs font-medium text-emerald-50 leading-relaxed">
                Periodic reviews with actionable tips so family members reinforce healthy emotional routines at home.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SPECIALIST SPOTLIGHT */}
      <section className="py-16 sm:py-24 bg-[#FAF7EF]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1594824813572-87f54cbbdff9?auto=format&fit=crop&w=700&q=80"
                alt="Child & Adolescent Specialist at Durrmi"
                className="w-full max-w-sm h-80 sm:h-96 object-cover rounded-[32px] shadow-xl border-2 border-white"
              />
            </div>

            <div className="md:col-span-7 space-y-6 text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Dedicated Child &amp; Adolescent Therapists
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Our licensed child therapists specialize in developmental milestones, cognitive behavioral therapy for young people, and parent-child relational support. Every young person deserves someone who listens without reason and builds their inner resilience.
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Find A Specialist For Your Child</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
