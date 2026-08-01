import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BackButton } from "@/components/common/BackButton";
import { ErrorState } from "@/components/common/ErrorState";
import { FullPageLoader, InlineLoader } from "@/components/common/Loading";
import { PaginationControls } from "@/components/common/PaginationControls";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { appointmentService } from "@/services/appointment.service";
import { doctorService } from "@/services/doctor.service";
import type { ApiError, AppointmentDto, AppointmentStatus, AvailabilitySlotDto, PageResponse } from "@/lib/api/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — MediSlot" },
      { name: "description", content: "Manage your MediSlot appointments and profile." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [appointmentsPage, setAppointmentsPage] = useState<PageResponse<AppointmentDto>>({
    content: [],
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 1,
  });

  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const [reschedulingAppt, setReschedulingAppt] = useState<AppointmentDto | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlotDto[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [isRescheduling, setIsRescheduling] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login", search: { redirect: "/dashboard" } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentService.myAppointments({
        page,
        size: 5,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      setAppointmentsPage(data);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated, page, statusFilter]);

  const handleCancel = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await appointmentService.cancel(appointmentId);
      toast.success("Appointment cancelled successfully");
      loadAppointments();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to cancel appointment");
    }
  };

  const openRescheduleModal = async (appt: AppointmentDto) => {
    setReschedulingAppt(appt);
    setSelectedSlotId("");
    try {
      const slots = await doctorService.getAvailability(appt.doctorId);
      setAvailableSlots(slots.filter((s) => !s.booked));
    } catch {
      setAvailableSlots([]);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!reschedulingAppt || !selectedSlotId) return;
    setIsRescheduling(true);
    try {
      await appointmentService.reschedule(reschedulingAppt.id, selectedSlotId);
      toast.success("Appointment rescheduled successfully");
      setReschedulingAppt(null);
      loadAppointments();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to reschedule appointment");
    } finally {
      setIsRescheduling(false);
    }
  };

  if (authLoading || (!isAuthenticated && !user)) {
    return <FullPageLoader label="Loading account session" />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <BackButton />
      {/* User Profile Overview Header */}
      <div className="surface-panel p-6">
        <h1 className="text-2xl font-bold tracking-tight">Account Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, <span className="font-semibold text-foreground">{user?.fullName}</span>
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4 text-sm">
          <div>
            <span className="text-muted-foreground block text-xs">Email Address</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">Phone Number</span>
            <span className="font-medium">{user?.phone || "Not provided"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs">Account Role</span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Appointments Management Section */}
      <div className="surface-panel p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">My Appointments</h2>
            <p className="text-sm text-muted-foreground">View and manage your upcoming or past clinic appointments.</p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-muted p-1 rounded-lg">
            {(["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(0);
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  statusFilter === status
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-6">
          {isLoading ? (
            <InlineLoader label="Fetching appointments" />
          ) : error ? (
            <ErrorState error={error} onRetry={loadAppointments} />
          ) : appointmentsPage.content.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground text-sm">No appointments found matching this status.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointmentsPage.content.map((appt) => (
                <div
                  key={appt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{appt.doctorName}</span>
                      <span className="text-xs text-muted-foreground">({appt.specialization})</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Date: <span className="font-medium text-foreground">{appt.date}</span> | Time:{" "}
                      <span className="font-medium text-foreground">
                        {appt.startTime} - {appt.endTime}
                      </span>
                    </p>
                    {appt.reason ? (
                      <p className="text-xs text-muted-foreground">Reason: {appt.reason}</p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        appt.status === "CONFIRMED"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : appt.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                            : appt.status === "CANCELLED"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {appt.status}
                    </span>

                    {appt.status !== "CANCELLED" && appt.status !== "COMPLETED" ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRescheduleModal(appt)}
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(appt.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              <PaginationControls
                page={appointmentsPage.page}
                totalPages={appointmentsPage.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {reschedulingAppt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="surface-panel w-full max-w-md p-6 space-y-4 rounded-xl">
            <h3 className="text-lg font-bold">Reschedule Appointment</h3>
            <p className="text-sm text-muted-foreground">
              Select a new available time slot for <span className="font-semibold text-foreground">{reschedulingAppt.doctorName}</span>.
            </p>

            {availableSlots.length === 0 ? (
              <p className="text-xs text-destructive">No open slots currently available for this doctor.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`w-full text-left p-3 rounded-md border text-sm transition-colors ${
                      selectedSlotId === slot.id
                        ? "border-primary bg-primary/10 font-semibold"
                        : "border-input hover:bg-accent"
                    }`}
                  >
                    {slot.date} | {slot.startTime} - {slot.endTime}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setReschedulingAppt(null)}>
                Cancel
              </Button>
              <Button
                disabled={!selectedSlotId || isRescheduling}
                onClick={handleRescheduleSubmit}
              >
                {isRescheduling ? "Rescheduling..." : "Confirm Reschedule"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
