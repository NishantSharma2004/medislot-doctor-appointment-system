import { DurrmiLogoIcon } from "@/components/common/DurrmiLogo";

interface SuggestedQuestionChipsProps {
  questions?: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestionChips({ questions, onSelect, disabled }: SuggestedQuestionChipsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="mt-2.5 space-y-1.5 animate-in fade-in slide-in-from-bottom-1 duration-200">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
        <DurrmiLogoIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>Related Questions you can ask:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(q)}
            className="text-left text-xs bg-emerald-50/80 hover:bg-emerald-100/90 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-800/60 px-3 py-1.5 rounded-full transition-all duration-150 hover:shadow-xs active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
