import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  CheckCircle2,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Get In Touch With Us — Durrmi Mental Wellness" },
      {
        name: "description",
        content:
          "Connect with Durrmi — Safe & Trusted. Not sure where to begin? Begin with us for free. Get matched to the right expert for your emotions and well-being.",
      },
    ],
  }),
  component: ContactPage,
});

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    reason: "",
    specialisation: "",
    hearAbout: "",
    urgency: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans relative overflow-hidden pb-16 selection:bg-amber-200">
      
      {/* Decorative Subtle Background Dust / Confetti Specks */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="5%" cy="15%" r="2" fill="#718096" />
          <circle cx="12%" cy="35%" r="1.5" fill="#A0AEC0" />
          <circle cx="85%" cy="20%" r="2.5" fill="#CBD5E0" />
          <circle cx="92%" cy="45%" r="1.8" fill="#718096" />
          <rect x="7%" y="28%" width="6" height="2" rx="1" fill="#4A5568" transform="rotate(-15 7 28)" />
          <rect x="88%" y="30%" width="5" height="2" rx="1" fill="#4A5568" transform="rotate(25 88 30)" />
          <rect x="3%" y="60%" width="7" height="2" rx="1" fill="#CBD5E0" transform="rotate(10 3 60)" />
          <rect x="95%" y="65%" width="6" height="2" rx="1" fill="#A0AEC0" transform="rotate(-20 95 65)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 relative z-10">
        
        {/* TOP ROW: Header Title/Description on Left + Contact Direct Info on Right */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-8 sm:mb-12">
          
          {/* Top Left: Title & Copy (Replacing Lorem ipsum per design feedback) */}
          <div className="lg:col-span-8 space-y-3 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Get In Touch With Us
            </h1>
            <div className="space-y-2 max-w-xl text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
              <p>
                Not sure where to begin? Begin with us— for free. Get matched to the right expert for your emotions and well-being, and see what real support feels like.
              </p>
              <p className="font-extrabold text-amber-950">
                Value-focused: Real experts. Real support. Your first session is free.
              </p>
            </div>
          </div>

          {/* Top Right: Email Us At & Call Us At */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col justify-end lg:items-end gap-5 text-left lg:text-right">
            
            {/* Email Box */}
            <div className="flex items-start lg:justify-end gap-3 group">
              <div className="size-9 rounded-xl bg-amber-100/90 border border-amber-300 flex items-center justify-center text-[#FFBE0B] shrink-0 mt-0.5 shadow-2xs">
                <Mail className="size-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                  Email Us At
                </p>
                <a
                  href="mailto:Support@Durrmi.com"
                  className="text-xs sm:text-sm font-extrabold text-slate-900 hover:text-amber-700 transition-colors"
                >
                  Support@Durrmi.com
                </a>
                <p className="text-[10px] font-medium text-slate-500">
                  We'll get back in 24 hours
                </p>
              </div>
            </div>

            {/* Call Box */}
            <div className="flex items-start lg:justify-end gap-3 group">
              <div className="size-9 rounded-xl bg-amber-100/90 border border-amber-300 flex items-center justify-center text-[#FFBE0B] shrink-0 mt-0.5 shadow-2xs">
                <Phone className="size-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                  Call Us At
                </p>
                <a
                  href="tel:+919794500192"
                  className="text-xs sm:text-sm font-extrabold text-slate-900 hover:text-amber-700 transition-colors"
                >
                  +91 9794500192
                </a>
                <p className="text-[10px] font-medium text-slate-500">
                  Between 9 AM to 9 PM
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* MAIN BODY: Interactive Form Centered + Characters on Both Flanks */}
        <div className="relative">
          
          {/* Centered Contact Form */}
          <div className="max-w-xl mx-auto z-20 relative">
            {submitted ? (
              <div className="p-8 sm:p-10 text-center space-y-4 bg-white/95 rounded-[32px] border border-amber-300 shadow-xl backdrop-blur-xs">
                <CheckCircle2 className="size-14 text-emerald-600 mx-auto" />
                <h3 className="text-2xl font-black text-slate-900">
                  Thank You For Reaching Out!
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-sm mx-auto">
                  We have received your message. A care coordinator from Durrmi will reach back to you within 24 hours.
                </p>
                <Button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs px-8 h-10 shadow-xs"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Row 1: Full Name & Email */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <Input
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="h-11 rounded-xl bg-white/90 border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-500 focus-visible:ring-amber-400 shadow-2xs"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-11 rounded-xl bg-white/90 border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-500 focus-visible:ring-amber-400 shadow-2xs"
                  />
                </div>

                {/* Row 2: Phone No. & Reason for contacting */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <Input
                    type="tel"
                    placeholder="Phone No."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-11 rounded-xl bg-white/90 border-slate-300 text-xs font-medium text-slate-900 placeholder:text-slate-500 focus-visible:ring-amber-400 shadow-2xs"
                  />
                  <div className="relative">
                    <select
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="h-11 w-full rounded-xl bg-white/90 border border-slate-300 text-xs font-medium px-3.5 text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-2xs cursor-pointer"
                    >
                      <option value="">Reason for contacting</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Book A Session">Book A Session</option>
                      <option value="Free Consultation">Claim Free Consultation</option>
                      <option value="Specialist Recommendation">Therapist Recommendation</option>
                      <option value="B2B Corporate Wellness">Corporate Wellness / B2B</option>
                      <option value="Feedback">Feedback / Suggestions</option>
                    </select>
                    <ChevronDown className="size-3.5 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Row 3: Which specialisation are you interested in? */}
                <div className="relative">
                  <select
                    value={formData.specialisation}
                    onChange={(e) => setFormData({ ...formData, specialisation: e.target.value })}
                    className="h-11 w-full rounded-xl bg-white/90 border border-slate-300 text-xs font-medium px-3.5 text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-2xs cursor-pointer"
                  >
                    <option value="">Which specialisation are you interested in?</option>
                    <option value="Relationships">Relationships</option>
                    <option value="Trauma">Trauma</option>
                    <option value="ADHD">ADHD</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Depression and low mood">Depression and low mood</option>
                    <option value="Anxiety">Anxiety</option>
                    <option value="Sleep">Sleep</option>
                    <option value="Work">Work</option>
                    <option value="Loneliness">Loneliness</option>
                    <option value="Attention & Focus">Attention &amp; Focus</option>
                    <option value="Career">Career</option>
                    <option value="Stress & Burnout">Stress &amp; Burnout</option>
                    <option value="Substance & Focus">Substance &amp; Focus</option>
                    <option value="Daily Functioning">Daily Functioning</option>
                  </select>
                  <ChevronDown className="size-3.5 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
                </div>

                {/* Row 4: How did you hear about us? & How urgent is this? */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div className="relative">
                    <select
                      value={formData.hearAbout}
                      onChange={(e) => setFormData({ ...formData, hearAbout: e.target.value })}
                      className="h-11 w-full rounded-xl bg-white/90 border border-slate-300 text-xs font-medium px-3.5 text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-2xs cursor-pointer"
                    >
                      <option value="">How did you hear about us?</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Friends & Family">Friends &amp; Family</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Blog or Article">Blog or Article</option>
                      <option value="Offline Marketing">Offline Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="size-3.5 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      className="h-11 w-full rounded-xl bg-white/90 border border-slate-300 text-xs font-medium px-3.5 text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-2xs cursor-pointer"
                    >
                      <option value="">How urgent is this?</option>
                      <option value="Immediate">Immediate (Within 24 Hours)</option>
                      <option value="This Week">Within This Week</option>
                      <option value="Just Exploring">Just Exploring Options</option>
                    </select>
                    <ChevronDown className="size-3.5 text-slate-500 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Row 5: What's on your mind today? */}
                <div>
                  <Textarea
                    placeholder="What's on your mind today?"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full rounded-2xl bg-white/90 border-slate-300 text-xs font-medium p-4 text-slate-900 placeholder:text-slate-500 focus-visible:ring-amber-400 shadow-2xs"
                  />
                </div>

                {/* Social Media Links Row */}
                <div className="pt-2 flex items-center justify-between sm:justify-center sm:gap-6 text-xs font-bold text-slate-700">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-amber-800 transition-colors"
                  >
                    <Facebook className="size-4" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-amber-800 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="size-4 fill-current">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.17 1.17 2.12 2.34 2.37.95.23 1.98.05 2.79-.47.69-.43 1.16-1.13 1.29-1.93.11-.64.12-1.3.11-1.96V.02z" />
                    </svg>
                    <span>Tik Tok</span>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-amber-800 transition-colors"
                  >
                    <Linkedin className="size-4" />
                    <span>Linkedin</span>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-amber-800 transition-colors"
                  >
                    <Youtube className="size-4" />
                    <span>YouTube</span>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-amber-800 transition-colors"
                  >
                    <Twitter className="size-4" />
                    <span>Twitter</span>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-amber-800 transition-colors"
                  >
                    <Instagram className="size-4" />
                    <span>Instagram</span>
                  </a>
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex justify-center">
                  <Button
                    type="submit"
                    className="h-10 px-10 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm border border-amber-400/80 transition-transform active:scale-95"
                  >
                    Submit
                  </Button>
                </div>

              </form>
            )}
          </div>

          {/* Left Character & Speech Bubble */}
          <div className="hidden xl:block absolute -left-8 -bottom-10 w-72 pointer-events-none select-none z-10">
            <div className="relative">
              
              {/* Speech Bubble: "Just one call away." */}
              <div className="absolute -top-14 left-8 rounded-2xl border-2 border-slate-900 bg-[#FFECA8] px-3.5 py-1.5 shadow-sm transform -rotate-3 text-center">
                <p className="font-serif italic text-xs font-bold text-slate-900 tracking-tight leading-tight">
                  Just one<br />call away.
                </p>
                {/* Bubble Tail */}
                <div className="absolute -bottom-2 left-6 size-3 border-r-2 border-b-2 border-slate-900 bg-[#FFECA8] transform rotate-45" />
              </div>

              {/* Character Illustration SVG */}
              <svg viewBox="0 0 240 280" className="w-full h-auto drop-shadow-md">
                {/* Red/Brown Armchair Beanbag */}
                <ellipse cx="110" cy="200" rx="80" ry="70" fill="#B23A22" />
                <ellipse cx="110" cy="205" rx="72" ry="60" fill="#962D17" />
                
                {/* Hair */}
                <path d="M 100 85 C 80 85 75 115 75 130 C 75 145 85 150 90 150 C 95 150 100 140 100 130 Z" fill="#2D150B" />
                <circle cx="110" cy="98" r="26" fill="#2D150B" />
                
                {/* Face & Neck */}
                <path d="M 106 116 L 106 130 L 116 130 L 116 116 Z" fill="#E8A584" />
                <circle cx="112" cy="100" r="17" fill="#F2B89D" />
                <path d="M 118 94 C 122 98 122 104 118 108" stroke="#C97C5D" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="117" cy="102" r="2" fill="#1A1A1A" />
                
                {/* Yellow Sweater Top */}
                <path d="M 90 130 Q 115 125 140 130 L 155 190 Q 115 195 80 190 Z" fill="#FFBE0B" />
                
                {/* Arms gesturing forward */}
                <path d="M 140 135 Q 175 155 190 160 Q 175 170 145 160 Z" fill="#E5AA09" />
                <ellipse cx="192" cy="160" rx="8" ry="6" fill="#F2B89D" />
                
                {/* Green Trousers */}
                <path d="M 90 190 Q 120 195 150 190 L 165 240 L 135 245 L 125 205 L 115 245 L 85 240 Z" fill="#2A9D8F" />
                
                {/* Yellow Shoes */}
                <ellipse cx="80" cy="245" rx="14" ry="7" fill="#E9C46A" />
                <path d="M 70 240 Q 80 232 92 244 Z" fill="#D4A373" />
                <ellipse cx="170" cy="245" rx="14" ry="7" fill="#E9C46A" />
                <path d="M 160 240 Q 170 232 182 244 Z" fill="#D4A373" />

                {/* Small Potted Plant Beside Chair */}
                <path d="M 25 240 L 45 240 L 40 265 L 30 265 Z" fill="#E76F51" />
                <ellipse cx="35" cy="240" rx="11" ry="3" fill="#C45A3F" />
                <ellipse cx="30" cy="225" rx="12" ry="7" fill="#52796F" transform="rotate(-30 30 225)" />
                <ellipse cx="40" cy="225" rx="12" ry="7" fill="#52796F" transform="rotate(30 40 225)" />
                <ellipse cx="35" cy="215" rx="10" ry="6" fill="#354F52" />
              </svg>

            </div>
          </div>

          {/* Right Character & Speech Bubble */}
          <div className="hidden xl:block absolute -right-8 -bottom-10 w-72 pointer-events-none select-none z-10">
            <div className="relative">
              
              {/* Speech Bubble: "Tell me more" */}
              <div className="absolute -top-14 right-10 rounded-2xl border-2 border-slate-900 bg-[#FFECA8] px-4 py-1.5 shadow-sm transform rotate-3 text-center">
                <p className="font-serif italic text-xs font-bold text-slate-900 tracking-tight leading-tight">
                  Tell me<br />more
                </p>
                {/* Bubble Tail */}
                <div className="absolute -bottom-2 right-6 size-3 border-l-2 border-b-2 border-slate-900 bg-[#FFECA8] transform -rotate-45" />
              </div>

              {/* Character Illustration SVG */}
              <svg viewBox="0 0 240 280" className="w-full h-auto drop-shadow-md">
                {/* Red/Orange Beanbag Armchair */}
                <ellipse cx="130" cy="200" rx="80" ry="70" fill="#B23A22" />
                <ellipse cx="130" cy="205" rx="72" ry="60" fill="#962D17" />
                
                {/* Long Dark Ponytail Hair */}
                <path d="M 120 75 C 95 75 90 115 90 150 C 90 160 100 165 105 165 Z" fill="#1A1A1A" />
                <circle cx="130" cy="92" r="26" fill="#1A1A1A" />
                <path d="M 145 95 C 160 105 165 125 160 145 Z" fill="#1A1A1A" />
                
                {/* Face & Neck */}
                <path d="M 125 112 L 125 128 L 135 128 L 135 112 Z" fill="#E8A584" />
                <circle cx="128" cy="96" r="17" fill="#F2B89D" />
                <path d="M 122 92 C 118 96 118 102 122 106" stroke="#C97C5D" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="122" cy="98" r="2" fill="#1A1A1A" />
                
                {/* Yellow/Peach Dress Torso */}
                <path d="M 110 128 Q 130 124 150 128 L 162 185 Q 130 192 98 185 Z" fill="#F4A261" />
                
                {/* Arms in Lap */}
                <path d="M 110 132 Q 95 155 115 175 Q 145 175 150 155 Z" fill="#E76F51" />
                <circle cx="130" cy="170" r="7" fill="#F2B89D" />

                {/* Dark Green Trousers / Shoes */}
                <path d="M 98 185 Q 130 192 162 185 L 170 240 L 140 245 L 130 202 L 120 245 L 90 240 Z" fill="#2A9D8F" />
                
                {/* Green/Brown Shoes */}
                <ellipse cx="85" cy="245" rx="14" ry="7" fill="#264653" />
                <path d="M 75 240 Q 85 232 97 244 Z" fill="#1D3557" />
                <ellipse cx="175" cy="245" rx="14" ry="7" fill="#264653" />
                <path d="M 165 240 Q 175 232 187 244 Z" fill="#1D3557" />
              </svg>

            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM ORGANIC ARTISTIC GROUND / PATH */}
      <div className="w-full relative -mt-8 sm:-mt-12 pointer-events-none">
        <svg
          viewBox="0 0 1440 220"
          className="w-full h-auto min-h-[140px] object-cover"
          preserveAspectRatio="none"
        >
          {/* Organic Sand/Yellow Ground Shape */}
          <path
            d="M -20 180 Q 200 40 450 120 T 950 80 T 1460 170 L 1460 240 L -20 240 Z"
            fill="#F6E7B9"
            stroke="#2D3748"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Secondary Organic Path Contour Lines */}
          <path
            d="M 50 160 Q 280 80 520 140 T 1000 110 T 1400 160"
            fill="none"
            stroke="#2D3748"
            strokeWidth="1.8"
            strokeDasharray="4 2"
            opacity="0.6"
          />
          <path
            d="M 10 200 Q 350 110 680 180 T 1200 150"
            fill="none"
            stroke="#2D3748"
            strokeWidth="1.5"
            opacity="0.4"
          />
        </svg>
      </div>

    </div>
  );
}
