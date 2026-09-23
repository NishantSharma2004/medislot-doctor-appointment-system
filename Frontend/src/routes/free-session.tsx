import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Clock, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/free-session")({
  head: () => ({
    meta: [
      { title: "Your First Session Is On Us — Durrmi" },
      {
        name: "description",
        content:
          "Talk to a verified Durrmi consultant for free — see for yourself why people trust us. Zero commitment. 4 simple steps to clarity.",
      },
    ],
  }),
  component: FreeSessionPage,
});

export function FreeSessionPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-800 font-sans selection:bg-amber-200">
      {/* 1. HERO SECTION (Matching Free Session_v2.0 Figma Design) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FAF8F3] py-16 sm:py-24 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/90 border border-amber-300/80 px-3.5 py-1 text-xs font-bold text-amber-900 tracking-wide">
                <Sparkles className="size-3.5 text-amber-600" />
                <span>100% Free • No Credit Card Required</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Your First<br />
                Session Is On Us.
              </h1>

              <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-600 leading-relaxed max-w-xl">
                Talk to a verified Durrmi consultant for free — see for yourself why people trust us. Zero commitment.
              </p>

              {/* Action Button */}
              <div className="pt-2">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/40"
                >
                  <Link to="/doctors">
                    Book your free session
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>Licensed Consultants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-amber-600" />
                  <span>30-Min Clarity Call</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="size-4 text-sky-600" />
                  <span>Zero Obligation</span>
                </div>
              </div>
            </div>

            {/* Right Vector Illustration (Two People Talking in Beanbags with Potted Plant) */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="w-full max-w-lg relative">
                <svg
                  viewBox="0 0 600 420"
                  className="w-full h-auto drop-shadow-xl select-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Subtle Background Glow / Shadow */}
                  <ellipse cx="300" cy="390" rx="270" ry="24" fill="#E2D9C8" opacity="0.45" />

                  {/* ============================================================== */}
                  {/* LEFT PERSON: Sitting in Terracotta Beanbag Chair                 */}
                  {/* ============================================================== */}
                  {/* Beanbag Left */}
                  <ellipse cx="195" cy="275" rx="115" ry="90" fill="#E27244" />
                  <ellipse cx="195" cy="285" rx="100" ry="75" fill="#D36031" />
                  <path d="M 120 250 Q 180 320 280 260" stroke="#B8491E" strokeWidth="4" strokeLinecap="round" opacity="0.3" />

                  {/* Left Person Hair & Head */}
                  <circle cx="210" cy="120" r="28" fill="#5A3825" />
                  <path d="M 188 120 C 188 95 210 92 232 105 C 238 120 236 138 230 144 C 218 140 198 138 188 120 Z" fill="#422818" />
                  {/* Face */}
                  <ellipse cx="220" cy="125" rx="18" ry="20" fill="#F8C39E" />
                  {/* Face features: eyebrow, eye, smiling lips */}
                  <path d="M 218 120 Q 224 118 229 121" stroke="#3A2012" strokeWidth="2.5" strokeLinecap="round" />
                  <ellipse cx="226" cy="124" rx="2.5" ry="2.5" fill="#2B180E" />
                  <path d="M 222 135 Q 227 140 232 136" stroke="#C26A4A" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Yellow Sweater / Top (Body) */}
                  <path
                    d="M 175 160 C 160 175 145 205 155 240 C 185 248 240 248 270 235 C 275 200 265 170 250 160 Z"
                    fill="#F7C948"
                  />
                  {/* Collar */}
                  <path d="M 205 152 Q 220 162 235 152" stroke="#E2B12D" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Right Arm (Gesturing forward towards client) */}
                  <path
                    d="M 250 175 Q 295 185 320 170"
                    stroke="#F7C948"
                    strokeWidth="24"
                    strokeLinecap="round"
                  />
                  {/* Hand */}
                  <ellipse cx="325" cy="168" rx="10" ry="8" fill="#F8C39E" />

                  {/* Left Arm resting */}
                  <path
                    d="M 175 175 Q 160 215 180 230"
                    stroke="#E2B12D"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />

                  {/* Olive Green Trousers / Legs */}
                  <path
                    d="M 160 235 C 150 265 170 300 235 285 C 265 280 270 245 265 235 Z"
                    fill="#4D7C0F"
                  />
                  <path
                    d="M 180 260 Q 220 310 265 295 L 290 280 L 260 260 Z"
                    fill="#365314"
                  />

                  {/* Yellow Boots / Shoes */}
                  <path
                    d="M 265 285 L 285 280 Q 305 305 315 315 Q 285 330 260 320 Z"
                    fill="#FACC15"
                  />
                  <path
                    d="M 225 285 L 245 280 Q 260 315 270 325 Q 240 335 220 320 Z"
                    fill="#EAB308"
                  />

                  {/* ============================================================== */}
                  {/* MIDDLE: Terracotta Plant Pot with Lush Monstera Leaves          */}
                  {/* ============================================================== */}
                  {/* Pot Body */}
                  <path
                    d="M 285 260 L 320 260 L 315 330 L 290 330 Z"
                    fill="#DC2626"
                  />
                  <ellipse cx="302" cy="260" rx="18" ry="6" fill="#B91C1C" />
                  {/* Lush Leaves */}
                  <path
                    d="M 298 258 Q 265 220 260 185 Q 285 195 298 250"
                    fill="#65A30D"
                  />
                  <path
                    d="M 298 255 Q 255 245 245 275 Q 275 275 298 255"
                    fill="#4D7C0F"
                  />
                  <path
                    d="M 302 258 Q 320 200 335 175 Q 338 215 304 258"
                    fill="#84CC16"
                  />
                  <path
                    d="M 304 258 Q 345 235 365 250 Q 340 268 304 258"
                    fill="#4D7C0F"
                  />
                  {/* Central stem */}
                  <path d="M 302 260 L 302 205" stroke="#365314" strokeWidth="3" strokeLinecap="round" />

                  {/* ============================================================== */}
                  {/* RIGHT PERSON: Sitting in Terracotta Beanbag Chair                */}
                  {/* ============================================================== */}
                  {/* Beanbag Right */}
                  <ellipse cx="445" cy="275" rx="100" ry="85" fill="#E27244" />
                  <ellipse cx="445" cy="285" rx="88" ry="70" fill="#D36031" />
                  <path d="M 385 270 Q 445 325 515 260" stroke="#B8491E" strokeWidth="4" strokeLinecap="round" opacity="0.3" />

                  {/* Right Person Hair (Black Long Hair with stylish bangs) */}
                  <circle cx="435" cy="130" r="26" fill="#1C1917" />
                  <path
                    d="M 410 120 C 410 95 445 92 460 110 C 470 125 468 175 455 185 C 445 190 435 170 430 150 Z"
                    fill="#0C0A09"
                  />
                  {/* Face */}
                  <ellipse cx="424" cy="135" rx="16" ry="18" fill="#F8C39E" />
                  {/* Face features facing left towards speaker */}
                  <path d="M 422 130 Q 417 128 413 131" stroke="#3A2012" strokeWidth="2.5" strokeLinecap="round" />
                  <ellipse cx="416" cy="134" rx="2.5" ry="2.5" fill="#2B180E" />
                  <path d="M 420 144 Q 415 147 410 144" stroke="#C26A4A" strokeWidth="2" strokeLinecap="round" />

                  {/* Yellow Dress / Tunic */}
                  <path
                    d="M 415 160 C 405 180 395 210 400 240 C 425 248 465 245 480 230 C 485 195 470 170 450 160 Z"
                    fill="#F59E0B"
                  />
                  {/* Arms resting on lap */}
                  <path
                    d="M 445 175 Q 425 210 410 220"
                    stroke="#D97706"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  <ellipse cx="405" cy="222" rx="9" ry="8" fill="#F8C39E" />

                  {/* Green Pants / Skirt Bottom */}
                  <path
                    d="M 400 240 C 390 270 410 300 455 290 C 475 285 480 260 480 230 Z"
                    fill="#15803D"
                  />

                  {/* Dark Green Shoes */}
                  <path
                    d="M 405 290 Q 380 315 375 325 Q 405 330 425 315 Z"
                    fill="#14532D"
                  />
                  <path
                    d="M 445 290 Q 425 315 420 325 Q 445 330 465 315 Z"
                    fill="#166534"
                  />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. 4-STEPS BREAKDOWN SECTION (Exact content from Screenshot 3 + Figma layout) */}
      <section className="bg-[#FAF7EF] py-20 sm:py-28 border-t border-amber-200/50 overflow-hidden relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center space-y-16">
          
          {/* Section Header */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Steps to breakdown your freebie sessions.
            </h2>
            <p className="text-sm sm:text-base font-semibold text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Thinking about consulting or building with us- well, we are here to shape your next-generation, in 4-steps era.
            </p>
          </div>

          {/* Stepped Cards Container with Curved Dashed Connectors */}
          <div className="relative max-w-4xl mx-auto">
            
            {/* SVG Curved Dashed Connectors (Visible on md and up) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
              viewBox="0 0 800 620"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Connector 1 -> 2 (From top card 01 to card 02) */}
              <path
                d="M 370 120 C 440 100, 430 150, 480 160"
                stroke="#94A3B8"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
              {/* Connector 2 -> 3 (From card 02 sweeping down-left to card 03) */}
              <path
                d="M 440 280 C 370 310, 390 350, 350 380"
                stroke="#94A3B8"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
              {/* Connector 3 -> 4 (From card 03 to card 04) */}
              <path
                d="M 370 460 C 440 440, 430 490, 480 500"
                stroke="#94A3B8"
                strokeWidth="2.5"
                strokeDasharray="6 6"
              />
            </svg>

            {/* 2x2 Staggered Stepped Flow Grid */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-x-14 md:gap-y-12 relative z-10 text-left">
              
              {/* Card 01: Lock in your slot */}
              <div className="rounded-[28px] border-2 border-[#FDE68A] bg-white shadow-lg overflow-hidden hover:-translate-y-1.5 transition-all duration-300">
                {/* Yellow Top Banner Cap */}
                <div className="h-4 w-full bg-[#FDE68A]" />
                <div className="p-7 sm:p-8 space-y-4">
                  <span className="block text-3xl sm:text-4xl font-black text-amber-500 tracking-tight">
                    01
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Lock in your slot
                  </h3>
                  <div className="h-[1px] w-full bg-slate-200" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                    pick your time and lock it down, no hesitation.
                  </p>
                </div>
              </div>

              {/* Card 02: Vibe-check your match (offset slightly down on desktop) */}
              <div className="rounded-[28px] border-2 border-[#93C5FD] bg-white shadow-lg overflow-hidden hover:-translate-y-1.5 transition-all duration-300 md:mt-10">
                {/* Sky Blue Top Banner Cap */}
                <div className="h-4 w-full bg-[#93C5FD]" />
                <div className="p-7 sm:p-8 space-y-4">
                  <span className="block text-3xl sm:text-4xl font-black text-sky-500 tracking-tight">
                    02
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Vibe-check your match
                  </h3>
                  <div className="h-[1px] w-full bg-slate-200" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                    Meet your guide and make sure the energy is 100%.
                  </p>
                </div>
              </div>

              {/* Card 03: Hop on the session */}
              <div className="rounded-[28px] border-2 border-[#FED7AA] bg-white shadow-lg overflow-hidden hover:-translate-y-1.5 transition-all duration-300">
                {/* Orange/Peach Top Banner Cap */}
                <div className="h-4 w-full bg-[#FED7AA]" />
                <div className="p-7 sm:p-8 space-y-4">
                  <span className="block text-3xl sm:text-4xl font-black text-orange-500 tracking-tight">
                    03
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Hop on the session
                  </h3>
                  <div className="h-[1px] w-full bg-slate-200" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                    show up, tap in &amp; let’s get to work.
                  </p>
                </div>
              </div>

              {/* Card 04: Secure the clarity (offset slightly down on desktop) */}
              <div className="rounded-[28px] border-2 border-[#C7D2FE] bg-white shadow-lg overflow-hidden hover:-translate-y-1.5 transition-all duration-300 md:mt-10">
                {/* Periwinkle/Indigo Top Banner Cap */}
                <div className="h-4 w-full bg-[#C7D2FE]" />
                <div className="p-7 sm:p-8 space-y-4">
                  <span className="block text-3xl sm:text-4xl font-black text-indigo-500 tracking-tight">
                    04
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Secure the clarity
                  </h3>
                  <div className="h-[1px] w-full bg-slate-200" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                    walk away with zero confusion and a total vision.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Freebie CTA Card */}
          <div className="pt-8">
            <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-200/80 p-8 sm:p-10 max-w-3xl mx-auto shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Ready to vibe-check your therapist?
                  </h3>
                  <p className="text-sm font-semibold text-slate-600">
                    Find the specialist who aligns with your goals in under 2 minutes.
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="shrink-0 h-12 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-amber-500/40"
                >
                  <Link to="/doctors">
                    Book Free Session <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
