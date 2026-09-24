import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, HeartHandshake, ShieldCheck, MessageCircle, CheckCircle2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/services/relationship-connection")({
  head: () => ({
    meta: [
      { title: "Relationship & Connection Therapy — Durrmi Mental Wellness" },
      {
        name: "description",
        content:
          "Unresolved emotions do not stay silent; it leaks through every conversation. Rebuild intimacy, communication, and emotional connection at Durrmi.",
      },
    ],
  }),
  component: RelationshipConnectionPage,
});

export function RelationshipConnectionPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans pb-24 selection:bg-amber-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] py-16 sm:py-24 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-7 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-purple-950 bg-purple-100 px-3.5 py-1 rounded-full border border-purple-300">
                <Sparkles className="size-3 text-purple-600" /> Emotional Intimacy &amp; Deep Bonds
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Relationship / Connection
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-bold text-amber-950 leading-snug">
                Unresolved emotions do not stay silent; it leaks through every conversation. Working together will help.
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xl leading-relaxed">
                When feelings are suppressed, they show up as passive aggression, emotional withdrawal, or endless repetitive arguments. Our relationship specialists help you bring unspoken emotions to the surface safely, transforming distance into genuine understanding.
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
                  <a href="#offers">What it helps with ↓</a>
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="md:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1522543558187-768b6df7c25c?auto=format&fit=crop&w=800&q=80"
                alt="Two people communicating with empathy and understanding"
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
              Rebuilding True Connection
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Clear the emotional clutter so genuine affection and partnership can breathe again.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Pattern Recognition */}
            <div className="rounded-[28px] border border-purple-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-800">
                <RefreshCw className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Pattern Recognition
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Spotting the automatic triggers and communication loops that cause emotional shutdowns and repetitive friction.
              </p>
            </div>

            {/* Card 2: Safe Dialogue */}
            <div className="rounded-[28px] border border-amber-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
                <MessageCircle className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Safe Dialogue
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Learning to express vulnerable needs and difficult feelings without fear of escalation, blame, or dismissal.
              </p>
            </div>

            {/* Card 3: Emotional Reconnection */}
            <div className="rounded-[28px] border border-rose-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-800">
                <HeartHandshake className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Emotional Reconnection
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Rebuilding intimacy and emotional presence from the ground up, reviving the warmth that brought you together.
              </p>
            </div>

            {/* Card 4: Healthy Boundaries */}
            <div className="rounded-[28px] border border-emerald-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
              <div className="size-11 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Healthy Boundaries
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Nurturing a healthy bond where both individuals feel respected, autonomous, and deeply supported.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMMON SIGNS WE HELP NAVIGATE */}
      <section className="py-16 sm:py-20 bg-[#FAF7EF] border-b border-amber-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            
            <div className="md:col-span-6 space-y-5 text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-950 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
                Break The Loop
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Stop walking on eggshells. Start understanding each other.
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Small irritations are rarely about what just happened — they are about the emotional weight carried underneath. Our certified relationship counselors provide the objective, neutral space you need to reset the vibe.
              </p>
              <div className="pt-2">
                <Button asChild size="lg" className="h-11 px-7 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm">
                  <Link to="/doctors">Find A Relationship Specialist</Link>
                </Button>
              </div>
            </div>

            <div className="md:col-span-6 space-y-3">
              {[
                "Conversations that turn into the exact same argument every week",
                "Emotional distance, silence, or feeling like roommates instead of partners",
                "Rebuilding trust after emotional disconnect or secrecy",
                "Navigating major milestones: moving in, marriage, parenthood, or family boundaries",
                "Feeling unheard or misunderstood despite explaining yourself repeatedly",
                "Wanting to proactively strengthen your bond before resentments build",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-purple-200/80 p-4 flex items-center gap-3 shadow-2xs hover:border-purple-400 transition-colors"
                >
                  <CheckCircle2 className="size-4 text-purple-600 shrink-0" />
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
              How Connection Therapy Works
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
              Step into an honest, no-judgment space designed to turn tension into teamwork.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-[28px] bg-[#FFBE0B] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-amber-900 shadow-xs">
                01
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Choose An Expert
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Connect with therapists specialized in relational dynamics, attachment styles, and conflict mediation.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-[28px] bg-[#F97316] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-orange-900 shadow-xs">
                02
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Air What's Unspoken
              </h3>
              <p className="text-xs font-medium text-orange-50 leading-relaxed">
                A safe, mediated atmosphere where each voice is listened to without fear of defensiveness or shame.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-[28px] bg-[#38BDF8] p-6 text-left shadow-lg text-slate-950 space-y-4 hover:-translate-y-1 transition-transform">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-sky-900 shadow-xs">
                03
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Learn The Tools
              </h3>
              <p className="text-xs font-medium text-slate-900 leading-relaxed">
                Practice de-escalation techniques, active listening habits, and emotional validation tools.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-[28px] bg-[#22C55E] p-6 text-left shadow-lg text-white space-y-4 hover:-translate-y-1 transition-transform lg:mt-6">
              <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-black text-emerald-900 shadow-xs">
                04
              </span>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Deepen The Bond
              </h3>
              <p className="text-xs font-medium text-emerald-50 leading-relaxed">
                Experience the ease of natural communication and renewed intimacy in your everyday life.
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
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80"
                alt="Relationship Specialist at Durrmi"
                className="w-full max-w-sm h-80 sm:h-96 object-cover rounded-[32px] shadow-xl border-2 border-white"
              />
            </div>

            <div className="md:col-span-7 space-y-6 text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Experienced Relationship Specialists
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                Every bond deserves room to cook and level up. Whether you are in the dating phase, married life, or at a major turning point, our specialists walk beside you to foster healthy, lasting intimacy.
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
                >
                  <Link to="/doctors">Meet Our Relationship Therapists</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
