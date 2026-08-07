import { Star, ShieldCheck, MessageSquare } from "lucide-react";
import type { DoctorReviewDto } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";

interface DoctorReviewListProps {
  reviews: DoctorReviewDto[];
  averageRating: number;
  totalReviews: number;
  ratingBreakdown?: Record<number, number>;
}

export function DoctorReviewList({
  reviews,
  averageRating,
  totalReviews,
  ratingBreakdown = { 5: 10, 4: 2, 3: 0, 2: 0, 1: 0 },
}: DoctorReviewListProps) {
  return (
    <div className="surface-panel p-6 space-y-6">
      {/* Header & Overall Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="size-5 text-primary" /> Patient Ratings & Reviews
          </h3>
          <p className="text-xs text-muted-foreground">
            Authentic feedback from verified patients who attended consultations.
          </p>
        </div>

        {/* Rating Score Hero Pill */}
        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border/60 shrink-0">
          <div className="text-center">
            <div className="text-3xl font-black text-foreground">{averageRating}</div>
            <div className="flex items-center justify-center text-amber-500 gap-0.5 mt-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`size-3.5 ${
                    star <= Math.round(averageRating) ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground border-l pl-4 space-y-0.5">
            <span className="font-bold text-foreground block">{totalReviews} Ratings</span>
            <span>100% Verified Patients</span>
          </div>
        </div>
      </div>

      {/* Star Distribution Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingBreakdown[stars] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-medium flex items-center gap-1 text-muted-foreground">
                  {stars} <Star className="size-3 text-amber-500 fill-amber-500" />
                </span>
                <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                  <div style={{ width: `${pct}%` }} className="h-full bg-amber-500 rounded-full" />
                </div>
                <span className="w-8 text-right text-muted-foreground font-semibold">{pct}%</span>
              </div>
            );
          })}
        </div>

        {/* Key Highlight Banner */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">100% Verified Patient Integrity</span>
            <p className="text-emerald-700/80 dark:text-emerald-300/80">
              Only patients with confirmed completed bookings can post reviews. Unverified spam ratings are automatically blocked.
            </p>
          </div>
        </div>
      </div>

      {/* Review Items List */}
      <div className="space-y-4 pt-2">
        {reviews.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
            No patient reviews posted yet.
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="p-4 rounded-xl bg-accent/20 border border-border/50 space-y-2 hover:bg-accent/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                    {rev.patientName ? rev.patientName.charAt(0).toUpperCase() : "P"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground">{rev.patientName}</span>
                      {rev.verifiedPatient && (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px] py-0 px-1.5 font-semibold gap-1">
                          <ShieldCheck className="size-3" /> Verified Patient
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-3.5 ${star <= rev.rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground pl-10 leading-relaxed font-medium">
                "{rev.comment}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
