import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatTimeRange, isUpcomingSlot, getEffectiveAppointmentStatus } from "@/components/common/format";
import { formatDoctorDisplayName } from "@/lib/utils";
import { ErrorState } from "@/components/common/ErrorState";
import { FullPageLoader, InlineLoader } from "@/components/common/Loading";
import { PaginationControls } from "@/components/common/PaginationControls";
import { PageShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { appointmentService } from "@/services/appointment.service";
import { doctorService } from "@/services/doctor.service";
import { generatePrescriptionPdf } from "@/lib/pdf/PrescriptionPdfTemplate";
import { DoctorRatingModal } from "@/components/reviews/DoctorRatingModal";
import type { ApiError, AppointmentDto, AppointmentStatus, AvailabilitySlotDto, PageResponse } from "@/lib/api/types";

export const Route = createFileRoute("/appointments")({
  head: () => ({
    meta: [
      { title: "My Appointments — MediSlot" },
      { name: "description", content: "View and manage your appointments on MediSlot." },
    ],
  }),
  component: MyAppointmentsPage,
});

function MyAppointmentsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [appointmentsPage, setAppointmentsPage] = useState<PageResponse<AppointmentDto>>({
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 1,
  });

  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const [reschedulingAppt, setReschedulingAppt] = useState<AppointmentDto | null>(null);
  const [ratingModalAppt, setRatingModalAppt] = useState<AppointmentDto | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlotDto[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [isRescheduling, setIsRescheduling] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login", search: { redirect: "/appointments" } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const loadAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentService.myAppointments({
        page,
        size: 10,
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
      setAvailableSlots(slots.filter((s) => !s.booked && isUpcomingSlot(s.date, s.startTime)));
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
    return <FullPageLoader label="Loading session" />;
  }

  return (
    <PageShell title="My Appointments" description="Track, reschedule or cancel your booked clinic appointments.">
      <div className="surface-panel p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

        <div>
          {isLoading ? (
            <InlineLoader label="Fetching appointments" />
          ) : error ? (
            <ErrorState error={error} onRetry={loadAppointments} />
          ) : appointmentsPage.content.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground text-sm">No appointments found matching this filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
            {appointmentsPage.content.map((appt) => {
              const effStatus = getEffectiveAppointmentStatus(appt.status, appt.date, appt.startTime, appt.endTime);
              return (
                <div
                  key={appt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors gap-4 bg-card"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{formatDoctorDisplayName(appt.doctorName)}</span>
                      <span className="text-xs text-muted-foreground">({appt.specialization})</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Date: <span className="font-medium text-foreground">{appt.date}</span> | Time:{" "}
                      <span className="font-medium text-foreground">
                        {formatTimeRange(appt.startTime, appt.endTime)}
                      </span>
                    </p>
                    {appt.reason ? <p className="text-xs text-muted-foreground">Reason: {appt.reason}</p> : null}
                    {effStatus === "EXPIRED" ? (
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
                        💰 100% Full Refund Initiated (Doctor No-Response Fault)
                      </p>
                    ) : null}

                    {/* Live OPD Token Badge */}
                    {appt.tokenNumber ? (
                      <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-teal-950/40 via-emerald-950/30 to-slate-900 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm border border-emerald-500/30">
                            #{appt.tokenNumber}
                          </div>
                          <div>
                            <span className="font-bold text-emerald-300">OPD Token #{appt.tokenNumber}</span>
                            <p className="text-[11px] text-muted-foreground">
                              Chronological Consultation Token for {appt.date}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 bg-emerald-500/10 font-bold">
                          Token Assigned
                        </Badge>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        effStatus === "CONFIRMED"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20"
                          : effStatus === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                            : effStatus === "PENDING"
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                              : effStatus === "MISSED"
                                ? "bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/20"
                                : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}
                    >
                      {effStatus === "EXPIRED" ? "EXPIRED (NO RESPONSE)" : effStatus}
                    </span>

                    {(appt.diagnosis || appt.prescriptionJson) ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs gap-1 border-teal-500/40 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10 font-semibold"
                        onClick={() => generatePrescriptionPdf(appt)}
                      >
                        📄 Download Prescription PDF
                      </Button>
                    ) : null}

                    {effStatus === "COMPLETED" ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 text-xs gap-1.5 font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20"
                        onClick={() => setRatingModalAppt(appt)}
                      >
                        ⭐ Rate Doctor
                      </Button>
                    ) : null}

                    {(effStatus === "PENDING" || effStatus === "CONFIRMED") && isUpcomingSlot(appt.date, appt.startTime) ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openRescheduleModal(appt)}>
                          Reschedule
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleCancel(appt.id)}>
                          Cancel
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}

              <PaginationControls
                page={appointmentsPage.page}
                totalPages={appointmentsPage.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Doctor Rating Modal */}
      {ratingModalAppt && user && (
        <DoctorRatingModal
          doctorId={ratingModalAppt.doctorId}
          doctorName={ratingModalAppt.doctorName}
          patientId={user.id}
          patientName={user.fullName}
          appointmentId={ratingModalAppt.id}
          isOpen={!!ratingModalAppt}
          onClose={() => setRatingModalAppt(null)}
          onSuccess={loadAppointments}
        />
      )}

      {reschedulingAppt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="surface-panel w-full max-w-md p-6 space-y-4 rounded-xl">
            <h3 className="text-lg font-bold">Reschedule Appointment</h3>
            <p className="text-sm text-muted-foreground">
              Select a new open slot for <span className="font-semibold text-foreground">{reschedulingAppt.doctorName}</span>.
            </p>

            {availableSlots.length === 0 ? (
              <p className="text-xs text-destructive">No open slots available for this doctor.</p>
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
                    {slot.date} | {formatTimeRange(slot.startTime, slot.endTime)}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setReschedulingAppt(null)}>
                Cancel
              </Button>
              <Button disabled={!selectedSlotId || isRescheduling} onClick={handleRescheduleSubmit}>
                {isRescheduling ? "Rescheduling..." : "Confirm Reschedule"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
