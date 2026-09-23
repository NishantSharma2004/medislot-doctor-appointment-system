import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { defaultHomePageCmsData } from "@/lib/api/cms-content";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & Plans — Durrmi Mental Wellness" },
      {
        name: "description",
        content:
          "Explore single sessions, multi-session bundles, complete care packages, and corporate plans with transparent pricing at Durrmi.",
      },
    ],
  }),
  component: PricingPage,
});

export function PricingPage() {
  const cmsPricing = defaultHomePageCmsData.pricing;
  const categories = cmsPricing.categories || [
    "Relationship Recovery",
    "Weekly Support",
    "Anxiety Care",
    "Stress Management Journey",
    "Depression Support",
    "Couples Therapy",
  ];
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  // Dynamic price adjustment multipliers for category tabs
  const getMultiplier = (cat: string) => {
    switch (cat) {
      case "Weekly Support":
        return 0.9;
      case "Anxiety Care":
        return 1.0;
      case "Stress Management Journey":
        return 1.1;
      case "Depression Support":
        return 1.05;
      case "Couples Therapy":
        return 1.4;
      default:
        return 1.0;
    }
  };

  const currentMultiplier = getMultiplier(activeCategory);

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans pb-24">
      {/* 1. HERO BANNER: Care That Fits Where You Are (Image 1) */}
      <section className="bg-[#FAF8F3] py-16 sm:py-24 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                {cmsPricing.heroTitle || "Care that fits your well-being"}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed max-w-xl">
                {cmsPricing.heroSubtitle ||
                  "Durrmi provides you with multiple sessions and a single session at your convenience. Talk to our therapists now. -Let us not compromise your well-being"}
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md border border-amber-400"
                >
                  <a href="#plans">{cmsPricing.heroCtaLabel || "FIND YOUR BEST PLAN"}</a>
                </Button>
              </div>
            </div>

            {/* Right Column: Therapist & Client Vector SVG Illustrations */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md h-64 sm:h-72 flex items-center justify-center">
                {/* SVG Character Group */}
                <svg viewBox="0 0 450 250" className="w-full h-full drop-shadow-sm">
                  {/* Left Character: Female Therapist sitting in Beanbag */}
                  <g transform="translate(40, 20)">
                    {/* Orange Beanbag */}
                    <path d="M 30 110 C 10 130 10 180 40 195 C 70 210 110 200 120 170 C 130 140 110 110 70 105 Z" fill="#D95D39" />
                    
                    {/* Trousers - Yellow */}
                    <path d="M 55 140 Q 75 160 85 190 L 115 190 Q 95 155 75 140 Z" fill="#F4A261" />
                    
                    {/* Torso - Brown Shirt */}
                    <path d="M 45 90 Q 65 80 85 90 L 75 140 Q 55 140 45 90 Z" fill="#8B4513" />
                    <path d="M 65 90 L 75 110 L 60 110 Z" fill="#E9C46A" /> {/* Scarf */}
                    
                    {/* Head & Hair */}
                    <circle cx="60" cy="60" r="18" fill="#1A1A1A" />
                    <circle cx="65" cy="62" r="14" fill="#F2B89D" />
                    <path d="M 50 50 Q 60 45 70 52 C 55 60 50 70 48 85" fill="#1A1A1A" />
                    
                    {/* Arms & Clipboard */}
                    <path d="M 60 105 Q 85 115 100 110" stroke="#8B4513" strokeWidth="12" strokeLinecap="round" />
                    <rect x="90" y="95" width="22" height="30" rx="3" fill="#E76F51" />
                    <rect x="94" y="100" width="14" height="20" rx="1" fill="#FFFFFF" />
                    
                    {/* Red Shoes */}
                    <ellipse cx="120" cy="192" rx="12" ry="6" fill="#E76F51" />
                    <ellipse cx="90" cy="192" rx="12" ry="6" fill="#E76F51" />
                  </g>

                  {/* Right Character: Thoughtful Client sitting in Beanbag */}
                  <g transform="translate(230, 20)">
                    {/* Orange Beanbag */}
                    <path d="M 40 105 C 10 115 10 175 40 195 C 70 210 120 195 125 160 C 130 125 100 100 60 105 Z" fill="#F4A261" />
                    
                    {/* Trousers - Brown */}
                    <path d="M 50 145 Q 60 180 70 195 L 100 195 Q 85 155 70 145 Z" fill="#6B3A19" />
                    
                    {/* Torso - Dark Green Sweater */}
                    <path d="M 40 95 Q 65 85 90 95 L 75 145 Q 50 145 40 95 Z" fill="#2A9D8F" />
                    
                    {/* Head & Grey Hair */}
                    <circle cx="70" cy="60" r="16" fill="#B0BEC5" />
                    <circle cx="66" cy="62" r="13" fill="#F2B89D" />
                    <path d="M 56 50 Q 70 45 78 55" stroke="#90A4AE" strokeWidth="5" fill="none" />
                    
                    {/* Arms gesturing */}
                    <path d="M 55 105 Q 30 115 15 110" stroke="#2A9D8F" strokeWidth="10" strokeLinecap="round" />
                    <circle cx="12" cy="110" r="5" fill="#F2B89D" />
                    
                    {/* Yellow Shoes */}
                    <ellipse cx="70" cy="197" rx="14" ry="7" fill="#E9C46A" />
                    <ellipse cx="102" cy="197" rx="14" ry="7" fill="#E9C46A" />
                  </g>
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CHOOSE WHAT FEELS BEST FOR YOU (Matching Image 1) */}
      <section id="plans" className="py-16 sm:py-20 scroll-mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              {cmsPricing.plansHeaderTitle || "Choose what your heart is ready for"}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-xl mx-auto leading-relaxed">
              {cmsPricing.plansHeaderSubtitle ||
                "Start your journey with a few simple steps with our Experts"}
            </p>
          </div>

          {/* FILTER PILLS (3 Multi-Row Category Cloud matching Image 1) */}
          <div className="pt-6 space-y-2.5 max-w-5xl mx-auto">
            {/* Row 1 */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {[
                "Relationship Recovery",
                "Weekly Support",
                "Anxiety Care",
                "Stress Management Journey",
                "Depression Support",
                "Couples Therapy",
              ].map((cat, idx) => {
                const isActive = cat === activeCategory;
                return (
                  <button
                    key={`row1-${idx}-${cat}`}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs whitespace-nowrap ${
                      isActive
                        ? "bg-[#FCE6A6] text-slate-950 border-2 border-amber-400 scale-105 shadow-sm"
                        : "bg-white text-slate-700 border border-slate-200/90 hover:bg-amber-50 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {[
                "Stress Management Journey",
                "Weekly Support",
                "Depression Support",
                "Couples Therapy",
                "Anxiety Care",
                "Relationship Recovery",
              ].map((cat, idx) => {
                const isActive = cat === activeCategory;
                return (
                  <button
                    key={`row2-${idx}-${cat}`}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs whitespace-nowrap ${
                      isActive
                        ? "bg-[#FCE6A6] text-slate-950 border-2 border-amber-400 scale-105 shadow-sm"
                        : "bg-white text-slate-700 border border-slate-200/90 hover:bg-amber-50 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Row 3 */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {[
                "Depression Support",
                "Anxiety Care",
                "Stress Management Journey",
                "Couples Therapy",
                "Weekly Support",
                "Relationship Recovery",
              ].map((cat, idx) => {
                const isActive = cat === activeCategory;
                return (
                  <button
                    key={`row3-${idx}-${cat}`}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs whitespace-nowrap ${
                      isActive
                        ? "bg-[#FCE6A6] text-slate-950 border-2 border-amber-400 scale-105 shadow-sm"
                        : "bg-white text-slate-700 border border-slate-200/90 hover:bg-amber-50 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4 PLAN CARDS GRID */}
          <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch text-left">
            
            {/* Card 1: Single Session (Yellow Accent) */}
            <div className="rounded-[28px] border-2 border-amber-400 bg-white p-6 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#FFBE0B]" />
              <div className="space-y-4 pt-2">
                <h3 className="text-xl font-black text-slate-900">Single Session</h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  One focused session with a consultant.
                </p>
                <div className="pt-2">
                  <p className="text-3xl font-black text-slate-900">
                    ₹{Math.round(1200 * currentMultiplier).toLocaleString()}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">per session</p>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-3 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <span className="size-4.5 rounded bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                    <span>Know the price before you tap book</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-4.5 rounded bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                    <span>Handpick your consultant + the time that fits your life.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-4.5 rounded bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                    <span>One and done — no subscriptions, no commitment</span>
                  </li>
                </ul>
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8 rounded-full border border-slate-900 bg-white text-slate-900 font-extrabold hover:bg-slate-100 text-xs h-11 w-full">
                <Link to="/doctors">Book a session</Link>
              </Button>
            </div>

            {/* Card 2: 1-Hour Session (Orange Accent) */}
            <div className="rounded-[28px] border-2 border-orange-400 bg-white p-6 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#FF9F43]" />
              <div className="space-y-4 pt-2">
                <h3 className="text-xl font-black text-slate-900">1-Hour Session</h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  One focused session with a consultant.
                </p>
                <div className="pt-2">
                  <p className="text-3xl font-black text-slate-900">
                    ₹{Math.round(1800 * currentMultiplier).toLocaleString()}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">per session</p>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-3 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <span className="size-4.5 rounded bg-[#FF9F43] text-white flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                    <span>Single sessions-no strings attached</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-4.5 rounded bg-[#FF9F43] text-white flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                    <span>See the rates-before you book- no surprises.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-4.5 rounded bg-[#FF9F43] text-white flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                    <span>Choose your consultant & limit slot.</span>
                  </li>
                </ul>
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8 rounded-full border border-slate-900 bg-white text-slate-900 font-extrabold hover:bg-slate-100 text-xs h-11 w-full">
                <Link to="/doctors">Book a session</Link>
              </Button>
            </div>

            {/* Card 3: 5 Sessions Package (Blue Accent) */}
            <div className="rounded-[28px] border-2 border-[#7BBDF7] bg-white p-6 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#7BBDF7]" />
              <div className="space-y-4 pt-2">
                <h3 className="text-xl font-black text-slate-900">5 Sessions Package</h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  One focused session with a consultant.
                </p>
                <div className="pt-2">
                  <p className="text-3xl font-black text-slate-900">
                    ₹{Math.round(5000 * currentMultiplier).toLocaleString()}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">per 5 session</p>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-3 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <span className="size-4.5 rounded bg-[#7BBDF7] text-white flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                    <span>Just one session, cancel-anytime energy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-4.5 rounded bg-[#7BBDF7] text-white flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                    <span>Full transparency: rate's on the table upfront</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-4.5 rounded bg-[#7BBDF7] text-white flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                    <span>You're in control — choose who and when</span>
                  </li>
                </ul>
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8 rounded-full border border-slate-900 bg-white text-slate-900 font-extrabold hover:bg-slate-100 text-xs h-11 w-full">
                <Link to="/doctors">Book a session</Link>
              </Button>
            </div>

            {/* Card 4: Full-Time Therapists (Green Accent) */}
            <div className="rounded-[28px] border-2 border-emerald-400 bg-white p-6 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#2ECC71]" />
              <div className="space-y-4 pt-2">
                <h3 className="text-xl font-black text-slate-900">Full-Time Therapists</h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  One focused session with a consultant.
                </p>
                <div className="pt-2">
                  <p className="text-3xl font-black text-slate-900">
                    ₹{Math.round(1200 * currentMultiplier).toLocaleString()}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">per session</p>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-3 border-t border-slate-100">
                  <li className="flex items-center gap-2">
                    <span className="size-4.5 rounded bg-[#2ECC71] text-white flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                    <span>No rotating door — the same trusted face each time</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-4.5 rounded bg-[#2ECC71] text-white flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                    <span>All-in on your progress, full-time.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-4.5 rounded bg-[#2ECC71] text-white flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                    <span>Dedicated therapists, fully in your corner</span>
                  </li>
                </ul>
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8 rounded-full border border-slate-900 bg-white text-slate-900 font-extrabold hover:bg-slate-100 text-xs h-11 w-full">
                <Link to="/doctors">Book a session</Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CORPORATE PLAN BANNER (Matching Image 1) */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-slate-200/90 bg-white p-8 sm:p-10 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {cmsPricing.corporateBanner?.title || "Let our care team take the initiative with full course support"}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-xl leading-relaxed">
                {cmsPricing.corporateBanner?.description ||
                  "One simple plan with complete care: this all-in-one bundle brings everything together."}
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="h-11 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 shadow-md border border-amber-400"
            >
              <Link to="/b2b">Contact sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. THE COMPLETE CARE BUNDLE (Image 5) */}
      <section className="bg-[#FDEBB2]/90 py-20 mt-10 border-t border-amber-300">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {cmsPricing.completeCareBundle?.title || "THE TOTAL CARE PLAN"}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#5C4105] max-w-md mx-auto">
            {cmsPricing.completeCareBundle?.subtitle ||
              "It will be based on therapist, on the session & time."}
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto text-left">
            {/* Card 1: Monthly Package ₹12,000 */}
            <div className="rounded-[28px] border-2 border-amber-400 bg-[#FFFDF5] p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#FFBE0B]" />
              <div className="space-y-4 pt-2">
                <h3 className="text-2xl font-black text-slate-900">Monthly Package</h3>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  One focused session with a consultant.
                </p>
                <div className="pt-2">
                  <p className="text-3xl sm:text-4xl font-black text-slate-900">Starts At ₹12,000</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-1">per session</p>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-4 border-t border-amber-200/60">
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Single session, no commitment</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Rate shown upfront before booking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Pick the consultant and slot</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Single session, no commitment</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Pick the consultant and slot</span>
                  </li>
                </ul>
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8 rounded-full border-2 border-slate-900 bg-white text-slate-900 font-extrabold hover:bg-slate-100 text-xs h-12 w-full">
                <Link to="/doctors">Book a session</Link>
              </Button>
            </div>

            {/* Card 2: Monthly Package ₹15,000 */}
            <div className="rounded-[28px] border-2 border-amber-400 bg-[#FFFDF5] p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#FFBE0B]" />
              <div className="space-y-4 pt-2">
                <h3 className="text-2xl font-black text-slate-900">Monthly Package</h3>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  One focused session with a consultant.
                </p>
                <div className="pt-2">
                  <p className="text-3xl sm:text-4xl font-black text-slate-900">Starts At ₹15,000</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-1">per session</p>
                </div>
                <ul className="space-y-2.5 text-xs font-semibold text-slate-700 pt-4 border-t border-amber-200/60">
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Single session, no commitment</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Rate shown upfront before booking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Pick the consultant and slot</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Single session, no commitment</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded bg-[#FFBE0B] text-slate-950 flex items-center justify-center shrink-0 font-bold text-xs">✓</span>
                    <span>Pick the consultant and slot</span>
                  </li>
                </ul>
              </div>
              <Button asChild size="lg" variant="outline" className="mt-8 rounded-full border-2 border-slate-900 bg-white text-slate-900 font-extrabold hover:bg-slate-100 text-xs h-12 w-full">
                <Link to="/doctors">Book a session</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
