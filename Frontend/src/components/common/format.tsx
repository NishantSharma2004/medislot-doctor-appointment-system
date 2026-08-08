import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  PENDING: "bg-warning/15 text-warning-foreground border-warning/40",
  CONFIRMED: "bg-success/15 text-success border-success/40",
  COMPLETED: "bg-info/15 text-info border-info/40",
  REJECTED: "bg-destructive/10 text-destructive border-destructive/30",
  CANCELLED: "bg-muted text-muted-foreground border-border",
};

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: "Pending confirmation",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <Badge variant="outline" className={cn("rounded-full font-medium", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatShortDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  return parsed.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

export function formatFee(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr ? parseInt(mStr, 10) : 0;
  if (isNaN(h)) return timeStr;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  const formattedMinutes = m < 10 ? `0${m}` : `${m}`;
  return `${h}:${formattedMinutes} ${ampm}`;
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTime(startTime)} – ${formatTime(endTime)}`;
}

export function isUpcomingSlot(dateStr: string, startTimeStr: string): boolean {
  if (!dateStr || !startTimeStr) return true;
  try {
    const formattedStartTime = startTimeStr.length === 5 ? `${startTimeStr}:00` : startTimeStr;
    const slotDateTime = new Date(`${dateStr}T${formattedStartTime}`);
    return slotDateTime.getTime() > Date.now();
  } catch {
    return true;
  }
}

export function getEffectiveAppointmentStatus(
  status: string | AppointmentStatus,
  dateStr?: string,
  startTimeStr?: string,
  endTimeStr?: string,
): string {
  if (!status) return "PENDING";
  const upper = String(status).toUpperCase();
  if (upper === "PENDING" || upper === "CONFIRMED") {
    const timeToCheck = endTimeStr || startTimeStr;
    if (dateStr && timeToCheck && !isUpcomingSlot(dateStr, timeToCheck)) {
      return upper === "PENDING" ? "EXPIRED" : "MISSED";
    }
  }
  return upper;
}
