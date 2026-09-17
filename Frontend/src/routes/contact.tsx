import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Durrmi Mental Wellness" },
      {
        name: "description",
        content:
          "Have questions or need support? Get in touch with Durrmi. Send a message, email Support@Durrmi.Com or call +91 9784500193.",
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
    <div className="min-h-screen bg-[#FAF8F3] text-slate-900 font-sans pb-24">
      {/* 1. HEADER BANNER */}
      <section className="bg-[#FAF8F3] py-12 sm:py-16 border-b border-amber-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-300/60">
            <div>
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
                Contact Us
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-md leading-relaxed text-left md:text-right">
              We are here to help you navigate your mental wellness journey. Reach out anytime with any questions or support needed.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FORM & PHOTO CARD SECTION */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Interactive Form */}
            <div className="lg:col-span-7 bg-white/60 p-6 sm:p-8 rounded-[32px] border border-amber-200/80 shadow-sm space-y-6">
              {submitted ? (
                <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
                  <h3 className="text-2xl font-black text-slate-900">Thank You For Reaching Out!</h3>
                  <p className="text-xs text-slate-700 font-medium">
                    We've received your message. Our care advisors will reach back to you within 24 hours.
                  </p>
                  <Button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    size="sm"
                    className="rounded-full bg-[#FFBE0B] text-slate-950 font-extrabold text-xs"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="h-12 rounded-xl bg-white border-slate-200 text-xs font-medium"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12 rounded-xl bg-white border-slate-200 text-xs font-medium"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Phone.No."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 rounded-xl bg-white border-slate-200 text-xs font-medium"
                    />
                    <select
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="h-12 rounded-xl bg-white border border-slate-200 text-xs font-medium px-3 text-slate-700 w-full"
                    >
                      <option value="">Reason for contacting</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Therapist Matching">Therapist Matching</option>
                      <option value="Booking Help">Booking Help</option>
                      <option value="Corporate Plan">Corporate Plan</option>
                    </select>
                  </div>

                  <select
                    value={formData.specialisation}
                    onChange={(e) => setFormData({ ...formData, specialisation: e.target.value })}
                    className="h-12 rounded-xl bg-white border border-slate-200 text-xs font-medium px-3 text-slate-700 w-full"
                  >
                    <option value="">Which specialisation are you Interested in?</option>
                    <option value="Anxiety & Stress Therapy">Anxiety & Stress Therapy</option>
                    <option value="Depression & Mood Care">Depression & Mood Care</option>
                    <option value="Couples & Family Counseling">Couples & Family Counseling</option>
                    <option value="Trauma & Emotional Healing">Trauma & Emotional Healing</option>
                    <option value="Child & Teen Psychology">Child & Teen Psychology</option>
                  </select>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <select
                      value={formData.hearAbout}
                      onChange={(e) => setFormData({ ...formData, hearAbout: e.target.value })}
                      className="h-12 rounded-xl bg-white border border-slate-200 text-xs font-medium px-3 text-slate-700 w-full"
                    >
                      <option value="">How did you hear about us?</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Friend or Family">Friend or Family</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Doctor Recommendation">Doctor Recommendation</option>
                    </select>

                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      className="h-12 rounded-xl bg-white border border-slate-200 text-xs font-medium px-3 text-slate-700 w-full"
                    >
                      <option value="">How urgent is this?</option>
                      <option value="Low">Low — Just exploring</option>
                      <option value="Medium">Medium — Within this week</option>
                      <option value="High">High — Need immediate slot</option>
                    </select>
                  </div>

                  <Textarea
                    placeholder="What's on your mind today?"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="rounded-xl bg-white border-slate-200 text-xs font-medium p-4"
                  />

                  {/* Social Handles */}
                  <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer">🌐 Facebook</span>
                    <span className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer">🎵 TikTok</span>
                    <span className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer">💼 LinkedIn</span>
                    <span className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer">📸 Instagram</span>
                    <span className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer">🐦 Twitter</span>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 px-8 rounded-full bg-[#FFBE0B] hover:bg-[#E5AA09] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md border border-amber-400"
                    >
                      Submit ↗
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Decorative Photo Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              {/* Orange Starburst Accent Top Right */}
              <div className="absolute -top-6 -right-4 z-20 text-orange-500">
                <svg viewBox="0 0 100 100" className="size-16 drop-shadow-md">
                  <path fill="#FF6B4A" d="M50 0 L60 35 L95 20 L75 50 L100 70 L65 75 L60 100 L40 75 L5 80 L25 50 L0 30 L35 30 Z" />
                </svg>
              </div>

              {/* Pink Flower Accent Bottom Left */}
              <div className="absolute -bottom-6 -left-4 z-20 text-pink-400">
                <svg viewBox="0 0 100 100" className="size-16 drop-shadow-md">
                  <path fill="#FF6584" d="M50 15 C65 -5 95 25 75 50 C95 75 65 105 50 85 C35 105 5 75 25 50 C5 25 35 -5 50 15 Z" />
                </svg>
              </div>

              <div className="w-full h-[480px] sm:h-[540px] rounded-[36px] overflow-hidden shadow-xl border-4 border-white relative">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
                  alt="Happy friends"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. BOTTOM CONTACT INFO BOX: Have A Question? Talk To Us */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FFFDF5] rounded-[36px] border-2 border-amber-200/80 p-8 sm:p-12 text-center shadow-sm space-y-8">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Have A Question? Talk To Us
            </h2>

            <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto pt-4">
              {/* Email Box */}
              <div className="space-y-3 p-6 rounded-3xl bg-white border border-amber-200 shadow-2xs">
                <div className="mx-auto size-14 rounded-2xl bg-amber-100 flex items-center justify-center text-[#FFBE0B]">
                  <Mail className="size-8 text-[#FFBE0B]" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Email Us At</h3>
                <p className="text-base font-extrabold text-amber-950">Support@Durrmi.Com</p>
                <p className="text-xs font-medium text-slate-500">and we'll get back to you in 24 hours</p>
              </div>

              {/* Phone Box */}
              <div className="space-y-3 p-6 rounded-3xl bg-white border border-amber-200 shadow-2xs">
                <div className="mx-auto size-14 rounded-2xl bg-amber-100 flex items-center justify-center text-[#FFBE0B]">
                  <Phone className="size-8 text-[#FFBE0B]" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Call Us At</h3>
                <p className="text-base font-extrabold text-amber-950">+91 9784500193</p>
                <p className="text-xs font-medium text-slate-500">between 9 AM to 9 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
