import { useState } from "react";
import { toast } from "sonner";
import { Activity, Heart, Scale, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { vitalsService } from "@/services/vitals.service";

interface VitalsLogModalProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function VitalsLogModal({ patientId, isOpen, onClose, onSuccess }: VitalsLogModalProps) {
  const today = new Date().toISOString().split("T")[0];

  const [logDate, setLogDate] = useState(today);
  const [fastingGlucose, setFastingGlucose] = useState("");
  const [ppGlucose, setPpGlucose] = useState("");
  const [systolicBp, setSystolicBp] = useState("");
  const [diastolicBp, setDiastolicBp] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("172");
  const [heartRateBpm, setHeartRateBpm] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Live BMI calculation
  const weightNum = parseFloat(weightKg);
  const heightNum = parseFloat(heightCm);
  let liveBmi: number | null = null;
  let bmiCategory: { label: string; color: string } | null = null;

  if (weightNum > 0 && heightNum > 0) {
    const heightM = heightNum / 100;
    liveBmi = parseFloat((weightNum / (heightM * heightM)).toFixed(1));
    if (liveBmi < 18.5) {
      bmiCategory = { label: "Underweight", color: "bg-blue-500/10 text-blue-600 border-blue-500/30" };
    } else if (liveBmi < 24.9) {
      bmiCategory = { label: "Normal (Healthy)", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" };
    } else if (liveBmi < 29.9) {
      bmiCategory = { label: "Overweight", color: "bg-amber-500/10 text-amber-600 border-amber-500/30" };
    } else {
      bmiCategory = { label: "Obese", color: "bg-rose-500/10 text-rose-600 border-rose-500/30" };
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await vitalsService.logVital({
        patientId,
        logDate: logDate || today,
        fastingGlucose: fastingGlucose ? parseFloat(fastingGlucose) : undefined,
        postPrandialGlucose: ppGlucose ? parseFloat(ppGlucose) : undefined,
        systolicBp: systolicBp ? parseInt(systolicBp, 10) : undefined,
        diastolicBp: diastolicBp ? parseInt(diastolicBp, 10) : undefined,
        weightKg: weightKg ? parseFloat(weightKg) : undefined,
        heightCm: heightCm ? parseFloat(heightCm) : undefined,
        heartRateBpm: heartRateBpm ? parseInt(heartRateBpm, 10) : undefined,
        notes: notes.trim() || undefined,
      });

      toast.success("Health Vitals logged successfully! 📈");
      onSuccess();
      onClose();
    } catch {
      toast.error("Could not save vitals. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in-50">
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Activity className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Log New Health Vitals</h2>
              <p className="text-xs text-muted-foreground">Record daily blood sugar, BP, weight, and heart rate.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Log Date */}
          <div className="space-y-1">
            <label className="font-semibold text-muted-foreground">Log Date</label>
            <Input type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)} required className="text-xs" />
          </div>

          {/* Blood Sugar Section */}
          <div className="space-y-2 p-3 bg-accent/30 rounded-lg border border-border/50">
            <span className="font-bold flex items-center gap-1.5 text-primary text-xs">
              🩸 Blood Glucose (Sugar)
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Fasting Sugar (mg/dL)</label>
                <Input
                  type="number"
                  placeholder="e.g. 105"
                  value={fastingGlucose}
                  onChange={(e) => setFastingGlucose(e.target.value)}
                  className="text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Post-Meal (PP) (mg/dL)</label>
                <Input
                  type="number"
                  placeholder="e.g. 140"
                  value={ppGlucose}
                  onChange={(e) => setPpGlucose(e.target.value)}
                  className="text-xs mt-1"
                />
              </div>
            </div>
          </div>

          {/* Blood Pressure & Heart Rate Section */}
          <div className="space-y-2 p-3 bg-accent/30 rounded-lg border border-border/50">
            <span className="font-bold flex items-center gap-1.5 text-rose-500 text-xs">
              <Heart className="size-3.5 fill-rose-500" /> Blood Pressure & Heart Rate
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-muted-foreground">Systolic (mmHg)</label>
                <Input
                  type="number"
                  placeholder="120"
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(e.target.value)}
                  className="text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Diastolic (mmHg)</label>
                <Input
                  type="number"
                  placeholder="80"
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(e.target.value)}
                  className="text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Pulse (bpm)</label>
                <Input
                  type="number"
                  placeholder="72"
                  value={heartRateBpm}
                  onChange={(e) => setHeartRateBpm(e.target.value)}
                  className="text-xs mt-1"
                />
              </div>
            </div>
          </div>

          {/* Weight & Height (BMI Auto-Calculation) */}
          <div className="space-y-2 p-3 bg-accent/30 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs">
                <Scale className="size-3.5" /> Body Weight & Height
              </span>
              {liveBmi && bmiCategory && (
                <Badge variant="outline" className={`text-[10px] ${bmiCategory.color}`}>
                  BMI: {liveBmi} ({bmiCategory.label})
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Weight (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 68.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="text-xs mt-1"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Height (cm)</label>
                <Input
                  type="number"
                  placeholder="e.g. 172"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="text-xs mt-1"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-muted-foreground">Clinical Notes / Symptoms (Optional)</label>
            <Input
              type="text"
              placeholder="e.g. Took morning walking, feeling fine"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-xs"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5 font-semibold">
              <Sparkles className="size-3.5" /> {isSubmitting ? "Saving..." : "Save Vitals Log"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
