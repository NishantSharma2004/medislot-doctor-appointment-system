import { useState, useEffect } from "react";
import { Pill, CheckCircle2, Clock, Plus, Sun, Moon, Sunrise, Undo2, AlertCircle, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DosageTiming, PillLogDto } from "@/lib/api/types";
import { pillService } from "@/services/pill.service";
import { AddPillModal } from "./AddPillModal";

function formatTakenTime(isoString?: string): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface PillTrackerContainerProps {
  userId?: string;
  compact?: boolean;
}

export function PillTrackerContainer({ userId, compact = false }: PillTrackerContainerProps) {
  const [pills, setPills] = useState<PillLogDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stats, setStats] = useState({ totalPills: 0, takenPills: 0, adherencePercentage: 100 });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await pillService.getPillsForDate(userId);
      setPills(data);
      const adherence = await pillService.getAdherenceStats(userId);
      setStats(adherence);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleToggle = async (pill: PillLogDto) => {
    try {
      const updated = await pillService.togglePillTaken(pill.id);
      if (updated.taken) {
        toast.success(`Marked ${pill.medicineName} as Taken! 💊`, {
          description: `Logged at ${formatTakenTime(updated.takenAt)}`,
        });
      } else {
        toast.info(`Undone ${pill.medicineName} dosage.`);
      }
      loadData();
    } catch {
      toast.error("Failed to update pill status.");
    }
  };

  const morningPills = pills.filter((p) => p.timing === "MORNING");
  const afternoonPills = pills.filter((p) => p.timing === "AFTERNOON");
  const nightPills = pills.filter((p) => p.timing === "NIGHT");

  if (loading) {
    return (
      <div className="surface-panel p-6 text-center text-muted-foreground animate-pulse">
        <Pill className="size-8 mx-auto mb-2 opacity-50 animate-bounce" />
        <p className="text-xs">Loading medicine reminders schedule...</p>
      </div>
    );
  }

  // Compact Widget for Dashboard Overview
  if (compact) {
    return (
      <div className="surface-panel p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Pill className="size-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Today's Medicine Tracker</h3>
              <p className="text-[11px] text-muted-foreground">{stats.takenPills} of {stats.totalPills} taken today</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`font-bold text-xs px-2.5 py-0.5 ${
              stats.adherencePercentage >= 80
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-600 border-amber-500/30"
            }`}
          >
            {stats.adherencePercentage}% Adherence
          </Badge>
        </div>

        <div className="space-y-2">
          {pills.slice(0, 3).map((pill) => (
            <div
              key={pill.id}
              onClick={() => handleToggle(pill)}
              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-all ${
                pill.taken
                  ? "bg-emerald-500/5 border-emerald-500/30 opacity-80"
                  : "bg-background border-border/60 hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  className={`size-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                    pill.taken
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "border-muted-foreground/40 hover:border-primary"
                  }`}
                >
                  {pill.taken && <Check className="size-3 stroke-[3]" />}
                </button>
                <div className="min-w-0">
                  <p className={`font-semibold truncate ${pill.taken ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {pill.medicineName}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{pill.dosage}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-[9px] uppercase tracking-wider shrink-0">
                {pill.timing}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="surface-panel p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Pill className="size-5 text-primary" />
            <h2 className="font-bold text-lg text-foreground">Daily Medicine Intake Schedule</h2>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold">
              Today
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground max-w-xl">
            Track your daily prescription dosages, mark pills taken, and maintain high health adherence for better recovery.
          </p>
        </div>

        {/* Adherence Score Widget */}
        <div className="flex items-center gap-4 bg-background/80 p-3 rounded-xl border border-border shadow-xs">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Dosage Adherence</p>
            <p className="text-xl font-extrabold text-foreground">{stats.adherencePercentage}%</p>
          </div>
          <div className="w-24 bg-muted h-3 rounded-full overflow-hidden border border-border/40">
            <div
              className={`h-full transition-all duration-500 ${
                stats.adherencePercentage >= 80 ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${stats.adherencePercentage}%` }}
            />
          </div>
          <Button size="sm" onClick={() => setShowAddModal(true)} className="gap-1.5 font-bold text-xs h-9">
            <Plus className="size-3.5" /> Add Reminder
          </Button>
        </div>
      </div>

      {/* 3 Dosage Timeline Sections */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Morning Section */}
        <PillTimingSection
          title="Morning Dosage"
          timeRange="8:00 AM - 11:00 AM"
          icon={<Sunrise className="size-4 text-amber-500" />}
          pills={morningPills}
          onToggle={handleToggle}
        />

        {/* Afternoon Section */}
        <PillTimingSection
          title="Afternoon Dosage"
          timeRange="1:00 PM - 3:00 PM"
          icon={<Sun className="size-4 text-orange-500" />}
          pills={afternoonPills}
          onToggle={handleToggle}
        />

        {/* Night Section */}
        <PillTimingSection
          title="Night Dosage"
          timeRange="8:00 PM - 10:00 PM"
          icon={<Moon className="size-4 text-indigo-400" />}
          pills={nightPills}
          onToggle={handleToggle}
        />
      </div>

      <AddPillModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        userId={userId}
        onSuccess={loadData}
      />
    </div>
  );
}

function PillTimingSection({
  title,
  timeRange,
  icon,
  pills,
  onToggle,
}: {
  title: string;
  timeRange: string;
  icon: React.ReactNode;
  pills: PillLogDto[];
  onToggle: (pill: PillLogDto) => void;
}) {
  const completedCount = pills.filter((p) => p.taken).length;

  return (
    <div className="surface-panel p-5 space-y-4 border border-border/80 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-muted/60 flex items-center justify-center">{icon}</div>
            <div>
              <h3 className="font-bold text-sm text-foreground">{title}</h3>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" /> {timeRange}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px] font-semibold">
            {completedCount}/{pills.length} Done
          </Badge>
        </div>

        {/* Pills List */}
        <div className="space-y-2.5">
          {pills.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground/60 border border-dashed rounded-lg">
              No medicines scheduled for this timing.
            </div>
          ) : (
            pills.map((pill) => (
              <div
                key={pill.id}
                className={`p-3 rounded-xl border transition-all space-y-2 ${
                  pill.taken
                    ? "bg-emerald-500/5 border-emerald-500/30 opacity-85"
                    : "bg-background border-border/80 hover:border-primary/40 shadow-2xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold ${pill.taken ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {pill.medicineName}
                    </h4>
                    <p className="text-[11px] text-primary font-medium mt-0.5">{pill.dosage}</p>
                    {pill.notes && <p className="text-[10px] text-muted-foreground italic mt-0.5">"{pill.notes}"</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <span className="text-[10px] text-muted-foreground">
                    {pill.doctorName ? `Rx: ${pill.doctorName}` : "Custom Reminder"}
                  </span>
                  <Button
                    size="sm"
                    variant={pill.taken ? "outline" : "default"}
                    onClick={() => onToggle(pill)}
                    className={`h-7 text-[11px] font-bold gap-1.5 px-2.5 ${
                      pill.taken
                        ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {pill.taken ? (
                      <>
                        <CheckCircle2 className="size-3.5 text-emerald-500" /> Taken ({formatTakenTime(pill.takenAt)})
                      </>
                    ) : (
                      <>
                        <Check className="size-3.5" /> Mark Taken
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
