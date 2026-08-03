import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ErrorState } from "@/components/common/ErrorState";
import { FullPageLoader, InlineLoader } from "@/components/common/Loading";
import { PageShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import type { ApiError, AvailabilitySlotDto } from "@/lib/api/types";

export const Route = createFileRoute("/doctor_/availability")({
  head: () => ({
    meta: [
      { title: "Manage Availability — MediSlot" },
      { name: "description", content: "Create and publish doctor availability slots." },
    ],
  }),
  component: DoctorAvailabilityPage,
});

function DoctorAvailabilityPage() {
  const { user, isAuthenticated, isLoading: authLoading, hasRole } = useAuth();
  const navigate = useNavigate();

  const [slots, setSlots] = useState<AvailabilitySlotDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotMinutes, setSlotMinutes] = useState(30);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate({ to: "/login", search: { redirect: "/doctor/availability" } });
      } else if (!hasRole(["DOCTOR"])) {
        navigate({ to: "/unauthorized" });
      }
    }
  }, [authLoading, isAuthenticated, hasRole, navigate]);

  const loadSlots = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<AvailabilitySlotDto[]>(`/doctors/${user.id}/availability`);
      setSlots(data || []);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && hasRole(["DOCTOR"])) {
      loadSlots();
    }
  }, [isAuthenticated, user]);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    setIsCreating(true);
    try {
      await apiClient.post("/doctors/availability", {
        date,
        startTime,
        endTime,
        slotMinutes,
      });
      toast.success("Availability slot created");
      loadSlots();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to create slot");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      await apiClient.delete(`/doctors/availability/${slotId}`);
      toast.success("Slot deleted");
      loadSlots();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to delete slot");
    }
  };

  if (authLoading || !isAuthenticated) {
    return <FullPageLoader label="Checking credentials" />;
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const handleSeedQuickSlots = async (targetDateStr: string) => {
    setIsCreating(true);
    try {
      await apiClient.post("/doctors/availability", {
        date: targetDateStr,
        startTime: "09:00",
        endTime: "17:00",
        slotMinutes: 30,
      });
      toast.success(`Slots created for ${targetDateStr}`);
      loadSlots();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to seed slots");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <PageShell title="Manage Availability" description="Publish open consultation slots for patient booking.">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="surface-panel p-6 space-y-4 md:col-span-1">
          <div className="space-y-2">
            <h2 className="text-lg font-bold">Quick Slot Publisher</h2>
            <p className="text-xs text-muted-foreground">Instantly seed 8 slots (9:00 AM - 5:00 PM) for patients.</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button size="sm" variant="outline" disabled={isCreating} onClick={() => handleSeedQuickSlots(todayStr)}>
                + Today Slots
              </Button>
              <Button size="sm" variant="outline" disabled={isCreating} onClick={() => handleSeedQuickSlots(tomorrowStr)}>
                + Tomorrow
              </Button>
            </div>
          </div>

          <hr className="my-3 border-border" />

          <h2 className="text-lg font-bold">Add Custom Slot Window</h2>
          <form onSubmit={handleCreateSlot} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="slot-date">Date</Label>
              <Input
                id="slot-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="slot-minutes">Slot Duration (Minutes)</Label>
              <Input
                id="slot-minutes"
                type="number"
                min={10}
                max={120}
                value={slotMinutes}
                onChange={(e) => setSlotMinutes(Number(e.target.value))}
                required
              />
            </div>
            <Button type="submit" disabled={isCreating} className="w-full">
              {isCreating ? "Publishing slots..." : "Publish Slots"}
            </Button>
          </form>
        </div>

        <div className="surface-panel p-6 space-y-4 md:col-span-2">
          <h2 className="text-lg font-bold">Published Availability Slots</h2>
          {isLoading ? (
            <InlineLoader label="Loading published slots" />
          ) : error ? (
            <ErrorState error={error} onRetry={loadSlots} />
          ) : slots.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground text-sm">No availability slots published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3 border rounded-md flex items-center justify-between gap-2 bg-card"
                >
                  <div className="text-sm">
                    <span className="font-semibold block">{slot.date}</span>
                    <span className="text-xs text-muted-foreground">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        slot.booked ? "bg-amber-500/10 text-amber-600" : "bg-green-500/10 text-green-600"
                      }`}
                    >
                      {slot.booked ? "Booked" : "Available"}
                    </span>
                    {!slot.booked ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteSlot(slot.id)}
                      >
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
