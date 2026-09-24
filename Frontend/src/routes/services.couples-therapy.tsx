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
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-blue-950 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-300">
                Fix the Vibe, Not the Blame
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Relationship is cooked? Let's un-cook it!
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-600 max-w-lg leading-relaxed">
                A good relationship isn't about never struggling or always being perfect; it’s about understanding each other. No judgment, no sides, just real support to help your relationships thrive.
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-700 max-w-lg leading-relaxed">
                Every relationship has its plot twists. The arguments that keep repeating, the things left unsaid, the patterns nobody knows how to break. Couple &amp; family counselling is your space to actually work through it — together. Your people matter — and doing work together is the ultimate glow-up.
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
                Healing Era, unlocked- with support made for you.
              </h2>
              <div className="space-y-4 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                <p>
                  Every relationship hits a rough phase, and that's okay. Couple therapy is your safe space to actually get each other again. No sides, no blame, no judgment — just honest convos that turn tension into teamwork.
                </p>
                <p>
                  Whether you're fixing the "we need to talk" energy or just want to grow stronger together, this is where your relationship glow-up begins. Less arguing, more understanding. Because real love deserves real support. Strong relationships don’t mean perfection; it takes promises, ups and downs, and difficult conversations. The strong ones ask for help. Couples therapy = your relationship glow-up starts here.
                </p>
              </div>
            </div>

            {/* Right Column: Common Signs Pills */}
            <div className="md:col-span-6 space-y-4 text-left">
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                Don't wait for the common sign to appear, Service for a safe space to help.
              </h3>
              <div className="space-y-2.5">
                <div className="rounded-xl bg-[#FFF3D6] border border-amber-300/80 px-4 py-3 text-xs sm:text-sm font-bold text-amber-950 shadow-xs leading-relaxed">
                  Same fight, different day? We help you break the loop.
                </div>
                <div className="rounded-xl bg-[#FFE8D6] border border-orange-300/80 px-4 py-3 text-xs sm:text-sm font-bold text-orange-950 shadow-xs leading-relaxed">
                  When convos feel like talking to a wall, we help you both feel heard again. Real dialogue, zero shutdowns.
                </div>
                <div className="rounded-xl bg-[#E0F2FE] border border-sky-300/80 px-4 py-3 text-xs sm:text-sm font-bold text-sky-950 shadow-xs leading-relaxed">
                  Trust took a hit? We’ll help you rebuild it, piece by piece, at a pace that feels right for you.
                </div>
                <div className="rounded-xl bg-[#FFE4E6] border border-rose-300/80 px-4 py-3 text-xs sm:text-sm font-bold text-rose-950 shadow-xs leading-relaxed">
                  Piled-up thoughts and revisiting the past make you feel disconnected. Take a pause and connect with us, and we will help you connect again with each other.
                </div>
                <div className="rounded-xl bg-[#DCFCE7] border border-emerald-300/80 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-950 shadow-xs leading-relaxed">
                  Big changes hitting hard? We help you navigate the chaos as a team, not opponents. Working life, personal life and love life need to be balanced, and that’s where the relationship starts to get difficult. We help you to make it balanced.
                </div>
                <div className="rounded-xl bg-[#EDE9FE] border border-purple-300/80 px-4 py-3 text-xs sm:text-sm font-bold text-purple-950 shadow-xs leading-relaxed">
                  Therapy isn't just for when things break. Sometimes it's the flex that keeps you strong. Grow together, on purpose.
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
              Support without the wait. Support that feels simple & easy for bookings, sessions, conversations & the best plan for your well-being
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
                We have all verified professionals, which makes it easy for you to choose the best therapist for you and your partner.
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
                Sessions for both of you online or in the app. Working together works; join your session together from anywhere.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-[28px] bg-[#38BDF8] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform relative">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-sky-900 shadow-xs">
                03
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Start the Conversation
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Share thoughts; a friendly vibe and guided support make life easy and calm. Conversations with the right people always guide.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-[28px] bg-[#22C55E] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform relative lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-emerald-900 shadow-xs">
                04
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Build a plan together
              </h3>
              <p className="text-xs font-medium text-emerald-50 leading-relaxed">
                We help to make practical changes; building together makes the relationship strong & supportive. Relationships need growth too, and we are here for it.
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
                Couple Therapy Specialist
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                An Experienced Therapist gives the best support in every area of life. Different cultures, life phases, and family pressure. It’s your dating phase, married life or taking a turning point in life; life always gives you challenges and with a partner, everything becomes easy. Let’s learn and become abundant in life with our professionals.
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
