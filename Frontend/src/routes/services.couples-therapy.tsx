import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services/couples-therapy")({
  head: () => ({
    meta: [
      { title: "Couples & Relationship Therapy — Durrmi" },
      {
        name: "description",
        content:
          "Navigate conflicts, rebuild trust, and deepen your emotional connection. Connect with licensed couples therapists at Durrmi.",
      },
    ],
  }),
  component: CouplesTherapyPage,
});

export function CouplesTherapyPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans pb-24 selection:bg-amber-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] py-16 sm:py-24 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Struggling to Connect With Your Partner? We Can Help.
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-600 max-w-lg leading-relaxed">
                Whether you're feeling disconnected or stuck in old patterns, our licensed therapists are here to guide you through it, together.
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Book a session</Link>
                </Button>
              </div>
            </div>

            {/* Right Couple Image */}
            <div className="md:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80"
                alt="Happy couple smiling together outdoors"
                className="w-full max-w-md h-72 sm:h-84 object-cover rounded-[32px] shadow-xl border-2 border-white/80"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. UNDERSTANDING COUPLES THERAPY & COMMON SIGNS */}
      <section className="py-16 sm:py-20 border-b border-amber-200/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Understanding */}
            <div className="md:col-span-6 space-y-5 text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Understanding Couples Therapy
              </h2>
              <div className="space-y-4 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                <p>
                  Every relationship faces challenges — communication breakdowns, recurring conflicts, trust issues, or simply growing apart. Couples therapy creates a safe, neutral space for partners to be heard, understand each other's needs, and work through challenges with guidance instead of guesswork.
                </p>
                <p>
                  Whether you're trying to resolve a specific conflict or strengthen your relationship long-term, our consultants help you navigate it together.
                </p>
              </div>
            </div>

            {/* Right Column: Common Signs Pills */}
            <div className="md:col-span-6 space-y-4 text-left">
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Common Signs This Service Can Help With:
              </h3>
              <div className="space-y-2.5">
                <div className="rounded-xl bg-[#FFF3D6] border border-amber-300/80 px-4 py-3 text-xs sm:text-sm font-bold text-amber-950 shadow-xs">
                  Frequent arguments or unresolved conflict
                </div>
                <div className="rounded-xl bg-[#FFE8D6] border border-orange-300/80 px-4 py-3 text-xs sm:text-sm font-bold text-orange-950 shadow-xs">
                  Communication that feels stuck
                </div>
                <div className="rounded-xl bg-[#E0F2FE] border border-sky-300/80 px-4 py-3 text-xs sm:text-sm font-bold text-sky-950 shadow-xs">
                  Trust issues or difficulty rebuilding after a breach
                </div>
                <div className="rounded-xl bg-[#FFE4E6] border border-rose-300/80 px-4 py-3 text-xs sm:text-sm font-bold text-rose-950 shadow-xs">
                  Feeling disconnected or like roommates
                </div>
                <div className="rounded-xl bg-[#DCFCE7] border border-emerald-300/80 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-950 shadow-xs">
                  Major life transitions putting stress on the relationship
                </div>
                <div className="rounded-xl bg-[#EDE9FE] border border-purple-300/80 px-4 py-3 text-xs sm:text-sm font-bold text-purple-950 shadow-xs">
                  Wanting to strengthen the bond before a crisis
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. GETTING SUPPORT IS SIMPLE (4-STEP PROCESS) */}
      <section className="py-16 sm:py-24 bg-[#FAF7EF] border-b border-amber-200/50 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Getting Support Is Simple
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
              Whether you consult with us or build with us — you'll be shaping how consultancy works for the next generation.
            </p>
          </div>

          {/* 4 Stepped Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="rounded-[28px] bg-[#FFBE0B] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform relative">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-amber-900 shadow-xs">
                01
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Choose Your Consultant
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Browse our verified consultants specializing in couple therapy.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-[28px] bg-[#F97316] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform relative lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-orange-900 shadow-xs">
                02
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Book A Session Together
              </h3>
              <p className="text-xs font-medium text-orange-50 leading-relaxed">
                Pick a time that works for both of you, online or via app.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-[28px] bg-[#38BDF8] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform relative">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-sky-900 shadow-xs">
                03
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Start The Conversation
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Share your perspectives in a safe, neutral space with guided support.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-[28px] bg-[#22C55E] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform relative lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-emerald-900 shadow-xs">
                04
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Build A Plan Together
              </h3>
              <p className="text-xs font-medium text-emerald-50 leading-relaxed">
                Work toward practical tools and stronger communication, at your own pace.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. CONSULTANTS SPECIALIZING IN COUPLES SUPPORT */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            {/* Therapist Portrait */}
            <div className="md:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80"
                alt="Consultant specializing in couples counseling"
                className="w-full max-w-sm h-80 sm:h-96 object-cover rounded-[32px] shadow-xl border-2 border-white"
              />
            </div>

            {/* Content & CTA */}
            <div className="md:col-span-7 space-y-6 text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Consultants Specializing in Couples Support
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Our experienced therapists specialize in supporting couples at every stage of their relationship and life stages. Whether you're working through conflict or navigating major life changes, you'll find compassionate listening and expertise here.
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Meet our specialists</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
