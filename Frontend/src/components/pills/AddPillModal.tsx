import { useState } from "react";
import { Pill, Plus, X, Sun, Moon, Sunrise, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DosageTiming } from "@/lib/api/types";
import { pillService } from "@/services/pill.service";

interface AddPillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  onSuccess: () => void;
}

export function AddPillModal({ open, onOpenChange, userId, onSuccess }: AddPillModalProps) {
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("1 Tablet after meal");
  const [timing, setTiming] = useState<DosageTiming>("MORNING");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim()) {
      toast.error("Please enter medicine name.");
      return;
    }

    setSaving(true);
    try {
      await pillService.addPill({
        userId,
        medicineName: medicineName.trim(),
        dosage: dosage.trim() || "1 Tablet",
        timing,
        notes: notes.trim() || undefined,
        date: new Date().toISOString().split("T")[0],
      });

      toast.success(`Added ${medicineName} to ${timing.toLowerCase()} schedule! 💊`);
      setMedicineName("");
      setNotes("");
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Failed to add medicine reminder.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Pill className="size-4" />
            </div>
            Add Medicine Reminder
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Medicine Name */}
          <div className="space-y-1.5">
            <Label htmlFor="medName" className="text-xs font-semibold">
              Medicine / Supplement Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="medName"
              placeholder="e.g. Paracetamol 500mg or Vitamin C"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              required
            />
          </div>

          {/* Dosage & Timing Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="dosage" className="text-xs font-semibold">Dosage Instruction</Label>
              <Input
                id="dosage"
                placeholder="e.g. 1 Tablet after meal"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="timing" className="text-xs font-semibold">Dosage Schedule</Label>
              <Select value={timing} onValueChange={(v) => setTiming(v as DosageTiming)}>
                <SelectTrigger id="timing" className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MORNING">🌅 Morning (8:00 AM)</SelectItem>
                  <SelectItem value="AFTERNOON">☀️ Afternoon (1:30 PM)</SelectItem>
                  <SelectItem value="NIGHT">🌙 Night (9:00 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Optional Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold">Notes / Purpose (Optional)</Label>
            <Input
              id="notes"
              placeholder="e.g. Take with warm milk or for knee pain"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving} className="gap-1.5 font-bold">
              <Plus className="size-4" /> Save Reminder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
