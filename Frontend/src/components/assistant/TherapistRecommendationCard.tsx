import { Link } from "@tanstack/react-router";
import { Calendar, Star, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import type { DoctorMatchInfo } from "@/lib/api/types";

interface TherapistRecommendationCardProps {
  doctorMatch: DoctorMatchInfo;
  matchedSpecialty?: string;
  maxBudget?: number;
}

export function TherapistRecommendationCard({
  doctorMatch,
  matchedSpecialty,
  maxBudget,
}: TherapistRecommendationCardProps) {
  const targetSpecialty = matchedSpecialty || doctorMatch.specialization;

  return (
    <div className="mt-3 p-3.5 bg-gradient-to-br from-emerald-50/70 via-background to-teal-50/50 dark:from-emerald-950/30 dark:via-card dark:to-teal-950/20 border border-emerald-200/90 dark:border-emerald-800/60 rounded-2xl shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-200 font-semibold text-sm flex-shrink-0">
            {doctorMatch.doctorName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-sm font-semibold text-foreground tracking-tight">
                {doctorMatch.doctorName}
              </h4>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200">
                <UserCheck className="w-2.5 h-2.5" />
                Verified Specialist
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{doctorMatch.specialization}</p>
            {doctorMatch.qualifications && (
              <p className="text-[11px] text-muted-foreground/80">{doctorMatch.qualifications}</p>
            )}
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            ₹{doctorMatch.consultationFee}
          </div>
          <div className="text-[10px] text-muted-foreground">per session</div>
        </div>
      </div>

      {doctorMatch.reason && (
        <div className="mt-2 text-xs text-muted-foreground bg-background/80 dark:bg-card/80 p-2 rounded-xl border border-border/50">
          <span className="font-medium text-foreground">Why this match: </span>
          {doctorMatch.reason}
        </div>
      )}

      <div className="mt-3 pt-2.5 border-t border-emerald-100 dark:border-emerald-900/50 flex flex-wrap items-center justify-between gap-2">
        <Link
          to="/doctors"
          search={{
            specialization: targetSpecialty,
            maxFee: maxBudget,
          }}
          className="text-xs font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 inline-flex items-center gap-1 cursor-pointer"
        >
          <span>View all {targetSpecialty} doctors</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {doctorMatch.doctorId ? (
          <Link
            to="/doctors/$doctorId"
            params={{ doctorId: doctorMatch.doctorId }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-medium shadow-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book 1-on-1 Session</span>
          </Link>
        ) : (
          <Link
            to="/doctors"
            search={{
              specialization: targetSpecialty,
              maxFee: maxBudget,
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-medium shadow-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book 1-on-1 Session</span>
          </Link>
        )}
      </div>
    </div>
  );
}
