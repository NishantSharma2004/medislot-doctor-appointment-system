import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Durrmi" },
      {
        name: "description",
        content:
          "Learn about Durrmi's mission, our core values of trust and transparency, and meet our leadership team dedicated to empowering mental well-being.",
      },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans pb-24 selection:bg-amber-200">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] py-16 sm:py-24 border-b border-amber-200/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6 relative">
          {/* Subtle Decorative Starburst */}
          <div className="absolute top-0 left-1/4 -translate-y-8 size-8 text-amber-400 opacity-60 hidden sm:block">
            ✦
          </div>
          <div className="absolute top-1/2 right-10 size-10 text-emerald-500 opacity-50 hidden sm:block">
            ✸
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Trusted<br />
            Consultancy, Built<br />
            For Real People
          </h1>

          <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-600 max-w-xl mx-auto leading-relaxed">
            Durrmi connects you with verified consultants — so getting the right guidance is simple, transparent, and always within reach.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="h-11 px-7 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/30"
            >
              <Link to="/doctors">Book a free session</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 px-7 rounded-full border-slate-400/80 bg-white/90 text-slate-800 hover:bg-slate-100 text-xs font-bold shadow-xs"
            >
              <Link to="/#why-durrmi">Explore Specialisations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. OVERLAPPING DUAL VALUE CARDS (WHY WE STARTED & WHAT WE STAND FOR) */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            
            {/* Top Card: Why We Started Durrmi */}
            <div className="rounded-[32px] border-2 border-amber-400/80 bg-[#FFDF80] p-6 sm:p-10 shadow-lg relative overflow-hidden">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4 text-left">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Why We Started Durrmi
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                    Durrmi began with a simple frustration: finding the right professional to consult shouldn't feel like guesswork. Too often, people spend hours scrolling through disconnected directories, wondering who is truly qualified, or putting off support because the process feels intimidating.
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                    We built Durrmi to change that — creating a single, trusted place where anyone can find verified, empathetic guidance with total clarity on pricing, approach, and fit.
                  </p>
                </div>
                <div className="md:col-span-5 flex justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80"
                    alt="Two women conversing comfortably"
                    className="w-full h-56 sm:h-64 object-cover rounded-2xl shadow-md border-2 border-white/60"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Card: What We Stand For */}
            <div className="rounded-[32px] border-2 border-orange-300/80 bg-[#FCE0C6] p-6 sm:p-10 shadow-lg relative overflow-hidden">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 order-2 md:order-1 flex justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=80"
                    alt="Counseling and support session"
                    className="w-full h-56 sm:h-64 object-cover rounded-2xl shadow-md border-2 border-white/60"
                  />
                </div>
                <div className="md:col-span-7 order-1 md:order-2 space-y-4 text-left">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    What We Stand For
                  </h2>
                  <div className="space-y-3.5 text-xs sm:text-sm">
                    <div>
                      <h3 className="font-black text-slate-900">✦ Trust First</h3>
                      <p className="font-medium text-slate-700 leading-relaxed">
                        Verification isn't a checkbox for us — it's the foundation of everything we build.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900">✦ Transparency Always</h3>
                      <p className="font-medium text-slate-700 leading-relaxed">
                        Clear pricing, clear processes, no hidden terms — for consultants and clients alike.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900">✦ People Over Process</h3>
                      <p className="font-medium text-slate-700 leading-relaxed">
                        Technology should make things simpler, not colder. We design with empathy at the core.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900">✦ Continuous Growth</h3>
                      <p className="font-medium text-slate-700 leading-relaxed">
                        For our consultants, our team, and the people we serve — we're always improving.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MEET OUR LEADERSHIP SECTION */}
      <section className="py-16 sm:py-20 border-t border-amber-200/50 bg-[#FAF7EF]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Meet Our Leadership
            </h2>
          </div>

          {/* Leader 1: Devansh Sharma */}
          <div className="grid md:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
            <div className="md:col-span-5 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                alt="Devansh Sharma - Founder & CEO"
                className="w-64 sm:w-72 h-80 sm:h-96 object-cover rounded-[28px] shadow-lg border-2 border-white"
              />
            </div>
            <div className="md:col-span-7 space-y-4 text-left">
              <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed italic">
                "We Built Durrmi Because Trust Shouldn't Be Optional When You're Looking For Guidance That Matters. Every Consultant On Our Platform Is Verified For A Reason — Because People Deserve To Know Exactly Who They're Talking To, And Why They Can Rely On Them. That's Not Just Our Process, It's Our Promise."
              </p>
              <div className="pt-2">
                <h3 className="text-lg font-black text-slate-900">Devansh Sharma,</h3>
                <p className="text-xs font-extrabold text-amber-800">Founder & CEO</p>
              </div>
            </div>
          </div>

          {/* Leader 2: Nikita Sharma */}
          <div className="grid md:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
            <div className="md:col-span-7 order-2 md:order-1 space-y-4 text-left">
              <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed italic">
                "Technology Should Remove Friction, Not Add To It. At Durrmi, We're Not Just Building A Platform — We're Building The Infrastructure That Makes Verification, Matching, And Communication Feel Effortless, So Our Consultants Can Focus On What They Do Best And Our Users Never Have To Second-Guess Who They're Working With."
              </p>
              <div className="pt-2">
                <h3 className="text-lg font-black text-slate-900">Nikita Sharma,</h3>
                <p className="text-xs font-extrabold text-amber-800">Co-Founder & CTO</p>
              </div>
            </div>
            <div className="md:col-span-5 order-1 md:order-2 flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
                alt="Nikita Sharma - Co-Founder & CTO"
                className="w-64 sm:w-72 h-80 sm:h-96 object-cover rounded-[28px] shadow-lg border-2 border-white"
              />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
