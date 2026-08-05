import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Activity,
  AlertCircle,
  Eye,
  Edit3,
} from "lucide-react";
import { ErrorState } from "@/components/common/ErrorState";
import { FullPageLoader, InlineLoader } from "@/components/common/Loading";
import { PageShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import { appointmentService } from "@/services/appointment.service";
import type { ApiError, AppointmentDto, AppointmentStatus } from "@/lib/api/types";

export const Route = createFileRoute("/doctor")({
  head: () => ({
    meta: [
      { title: "Doctor Desk — MediSlot" },
      { name: "description", content: "Doctor workspace, patient profile inspection, and appointment management." },
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
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | AppointmentStatus>("ALL");

  // Patient Profile Modal State
  const [inspectedPatient, setInspectedPatient] = useState<AppointmentDto | null>(null);

  // Prescription / Notes Editing State
  const [editingNotesAppt, setEditingNotesAppt] = useState<AppointmentDto | null>(null);
  const [notesText, setNotesText] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

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

  const handleSaveNotes = async () => {
    if (!editingNotesAppt) return;
    setIsSavingNotes(true);
    try {
      await apiClient.patch(`/appointments/${editingNotesAppt.id}/notes`, { notes: notesText });
      toast.success("Prescription / Notes updated successfully");
      setEditingNotesAppt(null);
      setNotesText("");
      loadDoctorAppointments();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to save prescription notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return <FullPageLoader label="Verifying doctor credentials" />;
  }

  const totalPatients = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;
  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  const filteredAppointments = appointments.filter((appt) => {
    if (selectedFilter === "ALL") return true;
    return appt.status === selectedFilter;
  });

  return (
    <PageShell
      title={`Dr. ${user?.fullName ?? "Doctor"}'s Desk`}
      description="Manage patient consultations, inspect health profiles, and update status."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadDoctorAppointments}>
            Refresh
          </Button>
          <Button onClick={() => navigate({ to: "/doctor/availability" })}>
            Manage Availability Slots
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Doctor Stats Dashboard Header */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="surface-panel p-5 space-y-2 border-l-4 border-l-primary">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Patients</span>
              <Activity className="size-4 text-primary" />
            </div>
            <p className="text-3xl font-black text-foreground">{totalPatients}</p>
          </div>

          <div className="surface-panel p-5 space-y-2 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Approvals</span>
              <Clock className="size-4 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-foreground">{pendingCount}</p>
          </div>

          <div className="surface-panel p-5 space-y-2 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Confirmed</span>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-black text-foreground">{confirmedCount}</p>
          </div>

          <div className="surface-panel p-5 space-y-2 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Completed Visits</span>
              <Stethoscope className="size-4 text-blue-500" />
            </div>
            <p className="text-3xl font-black text-foreground">{completedCount}</p>
          </div>
        </div>

        {/* Assigned Patient Appointments Workspace */}
        <div className="surface-panel p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className="text-xl font-bold">Assigned Patient Consultations</h2>
              <p className="text-sm text-muted-foreground">
                Click on any patient to view their complete profile and medical details.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1 bg-muted/50 p-1 rounded-lg">
              {(["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setSelectedFilter(filterKey)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    selectedFilter === filterKey
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <InlineLoader label="Loading patient appointments" />
          ) : error ? (
            <ErrorState error={error} onRetry={loadDoctorAppointments} />
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground text-sm">
                No patient appointments found for filter: <span className="font-semibold">{selectedFilter}</span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-5 border rounded-xl hover:border-primary/50 transition-all gap-4 bg-card"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-lg text-foreground">{appt.patientName}</span>
                      {appt.patientAge ? (
                        <Badge variant="outline" className="text-xs">
                          {appt.patientAge} Yrs ({appt.patientGender || "N/A"})
                        </Badge>
                      ) : null}
                      <Badge
                        variant={
                          appt.status === "CONFIRMED"
                            ? "default"
                            : appt.status === "COMPLETED"
                            ? "secondary"
                            : appt.status === "PENDING"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {appt.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <Calendar className="size-4 text-primary" /> {appt.date}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        <Clock className="size-4 text-primary" /> {appt.startTime} - {appt.endTime}
                      </span>
                      {appt.patientPhone ? (
                        <span className="flex items-center gap-1.5">
                          <Phone className="size-3.5 text-muted-foreground" /> {appt.patientPhone}
                        </span>
                      ) : null}
                    </div>

                    {appt.reason ? (
                      <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg border">
                        <span className="font-semibold text-foreground">Reason for Visit:</span> {appt.reason}
                      </p>
                    ) : null}

                    {appt.notes ? (
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                        <span className="font-semibold">Doctor Notes / Prescription:</span> {appt.notes}
                      </p>
                    ) : null}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => setInspectedPatient(appt)}
                    >
                      <Eye className="size-4" /> View Patient Info
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => {
                        setEditingNotesAppt(appt);
                        setNotesText(appt.notes || "");
                      }}
                    >
                      <Edit3 className="size-4" /> Prescription
                    </Button>

                    {appt.status === "PENDING" ? (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleUpdateStatus(appt.id, "CONFIRMED")}
                        >
                          Confirm Slot
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(appt.id, "REJECTED")}
                        >
                          Reject
                        </Button>
                      </>
                    ) : appt.status === "CONFIRMED" ? (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleUpdateStatus(appt.id, "COMPLETED")}
                        >
                          Attended & Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-amber-700 dark:text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
                          onClick={() => handleUpdateStatus(appt.id, "MISSED")}
                        >
                          No-Show (Missed)
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Patient Full Profile Inspection Modal */}
      {inspectedPatient ? (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background surface-panel border rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <User className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{inspectedPatient.patientName}</h3>
                  <p className="text-xs text-muted-foreground">Patient Medical Profile</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setInspectedPatient(null)}>
                ✕
              </Button>
            </div>

            <div className="grid gap-4 text-sm">
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-xl">
                <div>
                  <span className="text-xs text-muted-foreground">Age / Gender</span>
                  <p className="font-semibold">
                    {inspectedPatient.patientAge ? `${inspectedPatient.patientAge} Years` : "Not set"} (
                    {inspectedPatient.patientGender || "N/A"})
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Date of Birth</span>
                  <p className="font-semibold">{inspectedPatient.patientDateOfBirth || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <Mail className="size-4 text-primary mt-0.5" />
                  <div>
                    <span className="text-xs text-muted-foreground">Email Address</span>
                    <p className="font-medium">{inspectedPatient.patientEmail || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="size-4 text-primary mt-0.5" />
                  <div>
                    <span className="text-xs text-muted-foreground">Contact Phone</span>
                    <p className="font-medium">{inspectedPatient.patientPhone || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="size-4 text-primary mt-0.5" />
                  <div>
                    <span className="text-xs text-muted-foreground">Residential Address & City</span>
                    <p className="font-medium">
                      {inspectedPatient.patientAddress || inspectedPatient.patientCity || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {inspectedPatient.reason ? (
                <div className="p-3 bg-card border rounded-xl space-y-1">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Chief Consultation Complaint
                  </span>
                  <p className="text-sm font-medium">{inspectedPatient.reason}</p>
                </div>
              ) : null}
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={() => setInspectedPatient(null)}>Close Profile</Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Doctor Prescription & Notes Dialog */}
      {editingNotesAppt ? (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background surface-panel border rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500">
                  <FileText className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Write Prescription / Clinical Notes</h3>
                  <p className="text-xs text-muted-foreground">
                    For patient: <span className="font-semibold">{editingNotesAppt.patientName}</span>
                  </p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setEditingNotesAppt(null)}>
                ✕
              </Button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Prescription Advice & Notes
              </label>
              <textarea
                rows={5}
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Enter prescription advice, dosage instructions, or consultation notes for the patient..."
                className="w-full p-3 border rounded-xl bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditingNotesAppt(null)}>
                Cancel
              </Button>
              <Button disabled={isSavingNotes} onClick={handleSaveNotes}>
                {isSavingNotes ? "Saving..." : "Save Prescription"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </PageShell>
  );
}
