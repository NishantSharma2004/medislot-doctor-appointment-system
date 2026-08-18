import { useState } from "react";
import { Star, ShieldCheck, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { reviewService } from "@/services/review.service";

interface DoctorRatingModalProps {
  doctorId: string;
  doctorName: string;
  patientId?: string;
  patientName?: string;
  appointmentId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DoctorRatingModal({
  doctorId,
  doctorName,
  patientId = "patient-anon",
  patientName = "Verified Patient",
  appointmentId,
  isOpen,
  onClose,
  onSuccess,
}: DoctorRatingModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a short review comment before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.addReview({
        doctorId,
        patientId,
        patientName,
        appointmentId,
        rating,
        comment: comment.trim(),
        verifiedPatient: true,
      });

      toast.success(`Thank you! Your ${rating}-star review for ${doctorName} has been published! ⭐`);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error("Could not submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in-50">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-base font-bold flex items-center gap-1.5 text-foreground">
              <Star className="size-4 text-amber-500 fill-amber-500" /> Rate & Review Consultation
            </h2>
            <p className="text-xs text-muted-foreground">
              Doctor: <strong className="text-foreground">{doctorName}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Verified Badge Banner */}
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-700 dark:text-emerald-300 text-xs">
          <ShieldCheck className="size-4 shrink-0" />
          <span>Your review will be tagged as <strong>✓ Verified Patient</strong> from your completed appointment.</span>
        </div>

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Interactive Star Picker */}
          <div className="space-y-1 text-center py-2">
            <label className="text-xs font-semibold text-muted-foreground block">Select Rating Star</label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`size-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-amber-500 fill-amber-500 drop-shadow-xs"
                        : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block pt-1">
              {rating === 5 ? "⭐⭐⭐⭐⭐ Outstanding" : rating === 4 ? "⭐⭐⭐⭐ Very Good" : rating === 3 ? "⭐⭐⭐ Good" : "⭐⭐ Needs Improvement"}
            </span>
          </div>

          {/* Written Feedback */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Your Written Review / Feedback</label>
            <textarea
              rows={3}
              placeholder="How was your consultation experience? Doctor diagnosis, punctuality, treatment advice..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs rounded-md border border-input bg-background p-2.5 shadow-xs focus:ring-1 focus:ring-primary outline-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5 font-semibold bg-amber-500 hover:bg-amber-600 text-white">
              <Sparkles className="size-3.5" /> {isSubmitting ? "Publishing..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
