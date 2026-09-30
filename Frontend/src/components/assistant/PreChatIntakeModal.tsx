import { useState } from "react";
import { Sparkles, HeartHandshake, ShieldCheck, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PreChatIntakeData } from "@/lib/api/types";

interface PreChatIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PreChatIntakeData) => void;
  onSkip: () => void;
}

const TOPICS = [
  { id: "Stress & Burnout", label: "Stress & Burnout", icon: "💼" },
  { id: "Anxiety", label: "Anxiety & Overthinking", icon: "⚡" },
  { id: "Relationships", label: "Couple & Relationships", icon: "🌱" },
  { id: "Sleep", label: "Sleep & Insomnia", icon: "🌙" },
  { id: "Depression and low mood", label: "Low Mood & Sadness", icon: "🌧️" },
  { id: "Career", label: "Career & Work Pressure", icon: "🎯" },
  { id: "ADHD", label: "ADHD & Attention", icon: "🧠" },
  { id: "Loneliness", label: "Loneliness & Isolation", icon: "🌿" },
];

const BUDGETS: Array<{ id: "under_1000" | "1000_to_2000" | "above_2000" | "any"; label: string; desc: string }> = [
  { id: "under_1000", label: "Under ₹1,000", desc: "Budget Friendly" },
  { id: "1000_to_2000", label: "₹1,000 - ₹2,000", desc: "Most Popular" },
  { id: "any", label: "Any Budget", desc: "View all Specialists" },
];

export function PreChatIntakeModal({ isOpen, onClose, onSubmit, onSkip }: PreChatIntakeModalProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<"under_1000" | "1000_to_2000" | "above_2000" | "any">("any");

  if (!isOpen) return null;

  const handleProceed = () => {
    onSubmit({
      topic: selectedTopic || undefined,
      budgetTier: selectedBudget,
      skipped: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-card border border-emerald-100 dark:border-emerald-950/60 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header gradient banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 pt-6 pb-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 text-xs font-medium text-emerald-50 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Durrmi AI Companion</span>
          </div>
          <h3 className="text-xl font-semibold tracking-tight">How can we support you today?</h3>
          <p className="text-xs text-emerald-100/90 mt-1">
            Pick a topic to help our AI personalize guidance and match therapists faster.
          </p>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Topic selection */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
              1. What's on your mind?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TOPICS.map((t) => {
                const isSelected = selectedTopic === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTopic(isSelected ? null : t.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/80 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200 shadow-sm"
                        : "border-border/60 hover:border-emerald-300 dark:hover:border-emerald-800 bg-background/50 hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <span className="text-base select-none">{t.icon}</span>
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget selection */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
              2. Preferred Consultation Budget
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BUDGETS.map((b) => {
                const isSelected = selectedBudget === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBudget(b.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/80 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200 shadow-sm"
                        : "border-border/60 hover:border-emerald-300 dark:hover:border-emerald-800 bg-background/50 hover:bg-muted/40 text-foreground"
                    }`}
                  >
                    <span className="text-xs font-semibold">{b.label}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{b.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy badge */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-emerald-50/50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>100% Confidential & Private. You are in control of your journey.</span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <Button
              onClick={handleProceed}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl py-2.5 text-sm font-medium shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              <span>Start Conversation</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <button
              type="button"
              onClick={onSkip}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1 font-medium transition-colors"
            >
              Skip and start chatting directly →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
