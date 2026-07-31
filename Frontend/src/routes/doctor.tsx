import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ErrorState } from "@/components/common/ErrorState";
import { FullPageLoader, InlineLoader } from "@/components/common/Loading";
import { PageShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import { appointmentService } from "@/services/appointment.service";
import type { ApiError, AppointmentDto, AppointmentStatus } from "@/lib/api/types";

export const Route = createFileRoute("/doctor")({
  head: () => ({
    meta: [
      { title: "Doctor Desk — MediSlot" },
      { name: "description", content: "Doctor schedule and appointment status management." },
    ],
  }),
  component: DoctorDeskPage,
});

function DoctorDeskPage() {
  const { user, isAuthenticated, isLoading: authLoading, hasRole } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate({ to: "/login", search: { redirect: "/doctor" } });
      } else if (!hasRole(["DOCTOR"])) {
        navigate({ to: "/unauthorized" });
      }
    }
  }, [authLoading, isAuthenticated, hasRole, navigate]);

  const loadDoctorAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<{ content: AppointmentDto[] }>("/doctors/appointments");
      setAppointments(data.content || []);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && hasRole(["DOCTOR"])) {
      loadDoctorAppointments();
    }
  }, [isAuthenticated]);

  const handleUpdateStatus = async (appointmentId: string, status: AppointmentStatus) => {
    try {
      await appointmentService.updateStatus(appointmentId, status);
      toast.success(`Appointment status updated to ${status}`);
      loadDoctorAppointments();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to update status");
    }
  };

  if (authLoading || !isAuthenticated) {
    return <FullPageLoader label="Verifying doctor credentials" />;
  }

  return (
    <PageShell
      title="Doctor Desk"
      description="Manage patient appointments assigned to you and update status."
      actions={
        <Button onClick={() => navigate({ to: "/doctor/availability" })}>
          Manage Availability Slots
        </Button>
      }
    >
      <div className="surface-panel p-6 space-y-4">
        <h2 className="text-xl font-bold">Assigned Patient Appointments</h2>

        {isLoading ? (
          <InlineLoader label="Loading patient appointments" />
        ) : error ? (
          <ErrorState error={error} onRetry={loadDoctorAppointments} />
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground text-sm">No patient appointments assigned to you yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors gap-4"
              >
                <div className="space-y-1">
                  <span className="font-semibold text-foreground">{appt.patientName}</span>
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

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {appt.status}
                  </span>
                  {appt.status === "PENDING" ? (
                    <>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleUpdateStatus(appt.id, "CONFIRMED")}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdateStatus(appt.id, "CANCELLED")}
                      >
                        Reject
                      </Button>
                    </>
                  ) : appt.status === "CONFIRMED" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(appt.id, "COMPLETED")}
                    >
                      Mark Completed
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
