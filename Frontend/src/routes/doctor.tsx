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
  Sparkles,
  Building2,
  Banknote,
  ShieldCheck,
  RefreshCw,
  Volume2,
  Trash2,
  ArrowUpDown,
  X,
} from "lucide-react";
import { ErrorState } from "@/components/common/ErrorState";
import { FullPageLoader, InlineLoader } from "@/components/common/Loading";
import { PageShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api/client";
import { appointmentService } from "@/services/appointment.service";
import { doctorService } from "@/services/doctor.service";
import { notificationService } from "@/services/notification.service";
import { opdQueueService } from "@/services/opd-queue.service";
import { prescriptionService } from "@/services/prescription.service";
import { paymentService } from "@/services/payment.service";
import { healthVaultService, type VaultFile } from "@/services/health-vault.service";
import { vitalsService } from "@/services/vitals.service";
import { formatDoctorDisplayName } from "@/lib/utils";
import { VitalsChartContainer } from "@/components/vitals/VitalsChartContainer";
import { generatePrescriptionPdf } from "@/lib/pdf/PrescriptionPdfTemplate";
import type { ApiError, AppointmentDto, AppointmentStatus, DoctorDto, HealthVitalDto, OpdQueueResponse, PrescriptionMedicine } from "@/lib/api/types";

export const Route = createFileRoute("/doctor")({
  head: () => ({
    meta: [
      { title: "Doctor Desk — MediSlot" },
      { name: "description", content: "Doctor workspace, patient profile inspection, and appointment management." },
    ],
  }),
  component: DoctorDeskPage,
});

function openFileSecurely(fileUrl: string, fileName: string = "medical_document") {
  if (!fileUrl) return;

  if (fileUrl.startsWith("data:")) {
    try {
      const parts = fileUrl.split(",");
      const mime = parts[0].match(/:(.*?);/)?.[1] || "application/octet-stream";
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName.endsWith(".pdf") || mime === "application/pdf" ? (fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`) : fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      window.open(fileUrl, "_blank");
    }
  } else {
    window.open(fileUrl, "_blank");
  }
}

function DoctorDeskPage() {
  const { user, isAuthenticated, isLoading: authLoading, hasRole } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | AppointmentStatus>("ALL");
  const [deskTab, setDeskTab] = useState<"OPD_QUEUE" | "ALL_APPOINTMENTS" | "PATIENT_RECORDS">("OPD_QUEUE");

  // Patient Profile Modal State
  const [inspectedPatient, setInspectedPatient] = useState<AppointmentDto | null>(null);
  const [patientVitalsList, setPatientVitalsList] = useState<HealthVitalDto[]>([]);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [sharedVaultFiles, setSharedVaultFiles] = useState<VaultFile[]>([]);

  const handleInspectPatient = async (appt: AppointmentDto) => {
    setInspectedPatient(appt);
    try {
      const files = await healthVaultService.getAppointmentSharedFiles(appt.id);
      setSharedVaultFiles(files);
    } catch {
      setSharedVaultFiles([]);
    }
  };

  // Document Preview Modal State
  const [previewDocAppt, setPreviewDocAppt] = useState<AppointmentDto | null>(null);

  // Sorting & Deletion State
  const [sortOrder, setSortOrder] = useState<"NEWEST" | "OLDEST">("NEWEST");
  const [apptToDelete, setApptToDelete] = useState<AppointmentDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Digital Prescription Writer State
  const [rxModalAppt, setRxModalAppt] = useState<AppointmentDto | null>(null);
  const [rxDiagnosis, setRxDiagnosis] = useState("");
  const [rxMedicines, setRxMedicines] = useState<PrescriptionMedicine[]>([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [rxLabTests, setRxLabTests] = useState("");
  const [rxFollowUpDate, setRxFollowUpDate] = useState("");
  const [rxNotes, setRxNotes] = useState("");
  const [isSavingRx, setIsSavingRx] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate({ to: "/login", search: { redirect: "/doctor" } });
      } else if (!hasRole(["DOCTOR"])) {
        navigate({ to: "/unauthorized" });
      }
    }
  }, [authLoading, isAuthenticated, hasRole, navigate]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [docProfile, setDocProfile] = useState<DoctorDto | null>(null);

  const fetchDoctorProfile = async () => {
    if (user?.id) {
      try {
        const prof = await doctorService.getDoctor(user.id);
        setDocProfile(prof);
      } catch {
        setDocProfile(null);
      }
    }
  };

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

  const [editingNotesAppt, setEditingNotesAppt] = useState<AppointmentDto | null>(null);
  const [notesText, setNotesText] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

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

  // OPD Queue State
  const [opdQueue, setOpdQueue] = useState<OpdQueueResponse | null>(null);
  const [isOpdLoading, setIsOpdLoading] = useState(false);

  const fetchTodayQueue = async () => {
    try {
      const q = await opdQueueService.getTodayQueue();
      setOpdQueue(q);
    } catch {
      setOpdQueue(null);
    }
  };

  const handleCallNextPatient = async () => {
    setIsOpdLoading(true);
    try {
      const q = await opdQueueService.callNextPatient();
      setOpdQueue(q);
      toast.success(q.currentlyServingPatientName ? `Now calling Token #${q.currentlyServingToken}: ${q.currentlyServingPatientName}` : "Next patient called!");
      loadDoctorAppointments();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "No more waiting patients in queue");
    } finally {
      setIsOpdLoading(false);
    }
  };

  const handleCompleteConsultation = async () => {
    setIsOpdLoading(true);
    try {
      const q = await opdQueueService.completeCurrentConsultation();
      setOpdQueue(q);
      toast.success("Consultation completed!");
      loadDoctorAppointments();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to complete consultation");
    } finally {
      setIsOpdLoading(false);
    }
  };

  const handleSkipPatient = async () => {
    setIsOpdLoading(true);
    try {
      const q = await opdQueueService.skipCurrentPatient();
      setOpdQueue(q);
      toast.info("Patient skipped in queue");
      loadDoctorAppointments();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to skip patient");
    } finally {
      setIsOpdLoading(false);
    }
  };

  const handleRefreshWorkspace = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadDoctorAppointments(), fetchDoctorProfile(), fetchTodayQueue()]);
      toast.success("Doctor Workspace Refreshed!");
    } catch {
      toast.error("Could not refresh workspace");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.id && isAuthenticated && hasRole(["DOCTOR"])) {
      fetchDoctorProfile();
      fetchTodayQueue();

      // Subscribe to 1ms SSE live OPD queue updates
      const backendUrl = import.meta.env.VITE_API_URL || "https://medislot-doctor-appointment-system.onrender.com/api/v1";
      const sseUrl = `${backendUrl}/doctors/queue/${user.id}/subscribe`;
      const eventSource = new EventSource(sseUrl);

      eventSource.addEventListener("opd-queue-update", (event) => {
        try {
          const data: OpdQueueResponse = JSON.parse(event.data);
          setOpdQueue(data);
          loadDoctorAppointments();
        } catch (e) {
          console.error("SSE parse error", e);
        }
      });

      return () => {
        eventSource.close();
      };
    }
  }, [user?.id, isAuthenticated, hasRole]);

  useEffect(() => {
    if (isAuthenticated && hasRole(["DOCTOR"])) {
      loadDoctorAppointments();
    }
  }, [isAuthenticated]);

  const handleUpdateStatus = async (appointmentId: string, status: AppointmentStatus) => {
    try {
      await appointmentService.updateStatus(appointmentId, status);
      const appt = appointments.find((a) => a.id === appointmentId);
      if (appt) {
        if (status === "CONFIRMED") {
          await notificationService.addNotification({
            userId: appt.patientId,
            title: "Appointment Confirmed! 🟢",
            message: `Dr. ${docProfile?.fullName || appt.doctorName || "your doctor"} confirmed your appointment for ${appt.date} (${appt.startTime}).`,
            type: "APPOINTMENT_CONFIRMED",
            targetUrl: "/appointments",
          });
        } else if (status === "CANCELLED" || status === "REJECTED") {
          await notificationService.addNotification({
            userId: appt.patientId,
            title: "Appointment Cancelled 🔴",
            message: `Your appointment with Dr. ${docProfile?.fullName || appt.doctorName || "your doctor"} for ${appt.date} was cancelled.`,
            type: "APPOINTMENT_CANCELLED",
            targetUrl: "/appointments",
          });
        }
      }
      toast.success(`Appointment status updated to ${status}`);
      await Promise.all([loadDoctorAppointments(), fetchTodayQueue()]);
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to update status");
    }
  };

  const handleOpenRxModal = (appt: AppointmentDto) => {
    setRxModalAppt(appt);
    setRxDiagnosis(appt.diagnosis || "");
    setRxLabTests(appt.labTests || "");
    setRxFollowUpDate(appt.followUpDate || "");
    setRxNotes(appt.notes || "");
    if (appt.prescriptionJson) {
      try {
        setRxMedicines(JSON.parse(appt.prescriptionJson));
      } catch {
        setRxMedicines([{ name: "", dosage: "", frequency: "", duration: "" }]);
      }
    } else {
      setRxMedicines([{ name: "", dosage: "", frequency: "", duration: "" }]);
    }
  };

  const handleSaveDigitalPrescription = async () => {
    if (!rxModalAppt) return;
    setIsSavingRx(true);
    try {
      const validMeds = rxMedicines.filter((m) => m.name.trim().length > 0);

      try {
        await prescriptionService.createPrescription({
          appointmentId: rxModalAppt.id,
          diagnosis: rxDiagnosis || "Clinical Consultation",
          symptoms: rxModalAppt.reason || "General Symptoms",
          medicines: validMeds.map((m) => ({
            medicineName: m.name || m.medicineName || "",
            dosage: m.dosage,
            frequency: m.frequency,
            timing: "After Meals",
            durationDays: m.duration || m.durationDays,
          })),
          labTestsRecommended: rxLabTests,
          clinicalAdvice: rxNotes,
          followUpDate: rxFollowUpDate || undefined,
        });
      } catch (e) {
        console.warn("REST prescription call fallback", e);
      }

      await appointmentService.savePrescription(rxModalAppt.id, {
        diagnosis: rxDiagnosis,
        prescriptionJson: validMeds.length > 0 ? JSON.stringify(validMeds) : undefined,
        labTests: rxLabTests,
        followUpDate: rxFollowUpDate,
        notes: rxNotes,
      });

      await notificationService.addNotification({
        userId: rxModalAppt.patientId,
        title: "Digital Prescription Ready 📄",
        message: `Dr. ${docProfile?.fullName || rxModalAppt.doctorName} has issued a digital PDF prescription for your visit.`,
        type: "PRESCRIPTION_GENERATED",
        targetUrl: "/appointments",
      });

      toast.success("Digital medical prescription issued & appointment completed!");
      setRxModalAppt(null);
      loadDoctorAppointments();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to issue prescription");
    } finally {
      setIsSavingRx(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return <FullPageLoader label="Verifying doctor credentials" />;
  }

  const totalPatients = appointments.length;
  const pendingCount = appointments.filter((a) => a.status === "PENDING").length;
  const confirmedCount = appointments.filter((a) => a.status === "CONFIRMED").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  const filteredAppointments = [...appointments]
    .filter((appt) => {
      if (selectedFilter === "ALL") return true;
      return appt.status === selectedFilter;
    })
    .sort((a, b) => {
      const dtA = `${a.date} ${a.startTime}`;
      const dtB = `${b.date} ${b.startTime}`;
      return sortOrder === "NEWEST" ? dtB.localeCompare(dtA) : dtA.localeCompare(dtB);
    });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Personalized Doctor Profile Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE] to-[#FAF8F5] p-6 sm:p-8 shadow-xs border border-amber-200">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shadow-xs">
                  <Stethoscope className="size-8 sm:size-10" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                  ✓
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Sparkles className="size-3 text-amber-600" /> Official Doctor Desk
                  </span>
                  {docProfile?.specialization ? (
                    <Badge variant="outline" className="border-teal-400/40 text-teal-200 text-xs">
                      {docProfile.specialization}
                    </Badge>
                  ) : null}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {formatDoctorDisplayName(user?.fullName)}
                </h1>

                <p className="text-xs sm:text-sm text-emerald-100/80 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                  {docProfile?.qualifications ? <span>{docProfile.qualifications}</span> : null}
                  {docProfile?.yearsOfExperience ? <span>• {docProfile.yearsOfExperience} Years Experience</span> : null}
                  {docProfile?.clinicName ? (
                    <span className="flex items-center gap-1">
                      • <Building2 className="size-3.5 text-emerald-400" /> {docProfile.clinicName}, {docProfile.city}
                    </span>
                  ) : null}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                  {docProfile?.consultationFee ? (
                    <span className="flex items-center gap-1 font-semibold text-emerald-300">
                      <Banknote className="size-3.5" /> Consultation Fee: ₹{docProfile.consultationFee}
                    </span>
                  ) : null}
                  {docProfile?.registrationNumber ? (
                    <span className="flex items-center gap-1 text-slate-300">
                      <ShieldCheck className="size-3.5 text-emerald-400" /> Reg No: {docProfile.registrationNumber}
                    </span>
                  ) : null}
                  <span className="flex items-center gap-1 text-slate-300">
                    <Mail className="size-3.5 text-emerald-400" /> {user?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Workspace Action Buttons */}
            <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
              <Button
                onClick={() => navigate({ to: "/doctor/availability" })}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-2 shadow-lg shadow-emerald-950/50 text-xs sm:text-sm"
              >
                <Calendar className="size-4" /> Manage Availability Slots
              </Button>
              <Button
                variant="outline"
                onClick={handleRefreshWorkspace}
                disabled={isRefreshing}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs sm:text-sm gap-2"
              >
                <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh Workspace"}
              </Button>
            </div>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex border-b border-border/80 space-x-2 pt-2">
          <button
            onClick={() => setDeskTab("OPD_QUEUE")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              deskTab === "OPD_QUEUE"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-t-xl"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="size-4" /> Today's OPD Queue 🔔
          </button>
          <button
            onClick={() => setDeskTab("ALL_APPOINTMENTS")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              deskTab === "ALL_APPOINTMENTS"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-t-xl"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="size-4" /> All Consultations ({appointments.length})
          </button>
          <button
            onClick={() => setDeskTab("PATIENT_RECORDS")}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              deskTab === "PATIENT_RECORDS"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-t-xl"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="size-4" /> Patient Medical Records 📂
          </button>
        </div>

        {/* Live OPD Token Queue Caller Panel */}
        {deskTab === "OPD_QUEUE" ? (
        <div className="rounded-2xl border border-emerald-500/40 bg-slate-900 text-white p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3.5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                <Activity className="size-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  Live OPD Token Queue Caller
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    TODAY: {new Date().toISOString().split("T")[0]}
                  </span>
                </h2>
                <p className="text-xs text-slate-300 font-medium">
                  Chronological patient tokens ordered by consultation start time today.
                </p>
              </div>
            </div>

            {/* Big Token Status Badge */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-emerald-500/30">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Currently Serving</div>
                <div className="text-sm font-black text-emerald-400">
                  {opdQueue?.currentlyServingToken ? `Token #${opdQueue.currentlyServingToken}` : "No Active Call"}
                </div>
              </div>
              <div className="text-2xl font-black text-emerald-300 bg-emerald-500/20 px-3.5 py-1 rounded-lg border border-emerald-500/40">
                {opdQueue?.currentlyServingToken || "-"}
              </div>
            </div>
          </div>

          {/* Active Patient Serving Card & Action Buttons */}
          <div className="grid sm:grid-cols-3 gap-4 bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-800">
            <div className="sm:col-span-2 space-y-1.5">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block">
                PATIENT IN CONSULTATION
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                {opdQueue?.currentlyServingPatientName ? opdQueue.currentlyServingPatientName : "Waiting for Next Patient..."}
              </h3>
              <p className="text-xs text-slate-300 font-medium pt-1">
                Remaining Patients Waiting Today: <strong className="text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">{opdQueue?.remainingPatients || 0}</strong> | Total Today: <span className="text-white font-bold">{opdQueue?.totalTokensToday || 0}</span>
                {(() => {
                  const todayStr = new Date().toISOString().split("T")[0];
                  const upcomingCount = appointments.filter((a) => a.date > todayStr && (a.status === "CONFIRMED" || a.status === "PENDING")).length;
                  return upcomingCount > 0 ? (
                    <span className="ml-2 text-teal-300 font-medium bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                      ℹ️ {upcomingCount} upcoming consultations scheduled for tomorrow/future
                    </span>
                  ) : null;
                })()}
              </p>
            </div>

            {/* Caller Controls */}
            <div className="flex flex-col gap-2.5 justify-center">
              <Button
                onClick={handleCallNextPatient}
                disabled={isOpdLoading || (opdQueue?.remainingPatients || 0) === 0}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black gap-2 text-xs sm:text-sm py-2.5 shadow-lg shadow-emerald-950/50"
              >
                <Volume2 className="size-4" /> 🔔 Call Next Patient
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCompleteConsultation}
                  disabled={isOpdLoading || !opdQueue?.currentlyServingToken}
                  className="text-xs font-bold text-emerald-300 border-emerald-500/40 bg-emerald-950/50 hover:bg-emerald-500/20"
                >
                  ✅ Complete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSkipPatient}
                  disabled={isOpdLoading || !opdQueue?.currentlyServingToken}
                  className="text-xs font-bold text-amber-300 border-amber-500/40 bg-amber-950/50 hover:bg-amber-500/20"
                >
                  ⏭️ Skip
                </Button>
              </div>
            </div>
          </div>
        </div>
        ) : null}

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

            {/* Filter Pills & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-2">
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

              {/* Sort Order Dropdown */}
              <div className="flex items-center gap-1.5 border-l pl-2.5 border-border">
                <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <ArrowUpDown className="size-3.5" /> Sort:
                </span>
                <Select value={sortOrder} onValueChange={(val: "NEWEST" | "OLDEST") => setSortOrder(val)}>
                  <SelectTrigger className="h-8 text-xs font-semibold w-[145px] rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEWEST">Newest First ⬇️</SelectItem>
                    <SelectItem value="OLDEST">Oldest First ⬆️</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              {filteredAppointments.map((appt) => {
                const queueItem = opdQueue?.queue?.find((q) => q.id === appt.id);
                const tokenNum = queueItem?.tokenNumber || appt.tokenNumber;
                const isInConsultation = appt.status === "IN_CONSULTATION";

                return (
                  <div
                    key={appt.id}
                    className={`flex flex-col lg:flex-row lg:items-center justify-between p-5 border rounded-xl transition-all gap-4 ${
                      isInConsultation
                        ? "bg-emerald-950/20 border-2 border-emerald-500/60 shadow-lg shadow-emerald-950/30"
                        : "bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        {tokenNum ? (
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                            Token #{tokenNum}
                          </span>
                        ) : null}
                        <span className="font-bold text-lg text-foreground">{appt.patientName}</span>
                        {appt.patientAge ? (
                          <Badge variant="outline" className="text-xs">
                            {appt.patientAge} Yrs ({appt.patientGender || "N/A"})
                          </Badge>
                        ) : null}

                        {(appt.patientTotalMissedVisits || 0) > 0 || (appt.patientNoShowCount || 0) > 0 ? (
                          <Badge variant="outline" className="text-xs font-bold border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 flex items-center gap-1">
                            ⚠️ High No-Show Risk ({appt.patientTotalMissedVisits || appt.patientNoShowCount} Missed Visits)
                          </Badge>
                        ) : null}

                        <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5 border border-border">
                          💳 {appt.paymentMode === "ONLINE_RAZORPAY" ? "ONLINE RAZORPAY" : "PAY AT CLINIC"} ({appt.paymentStatus || "PENDING"})
                        </Badge>

                        <Badge
                          className={isInConsultation ? "bg-emerald-500 text-slate-950 font-black animate-pulse" : ""}
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
                          {isInConsultation ? "🟢 IN CONSULTATION (IN CABIN)" : appt.status}
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

                    {appt.medicalDocumentUrl ? (
                      <div className="flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 p-2.5 rounded-lg">
                        <FileText className="size-4 text-teal-600 dark:text-teal-400" />
                        <span className="text-xs font-semibold text-foreground">
                          Attached Lab Report: {appt.medicalDocumentName || "Medical Record"}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[11px] ml-auto border-teal-500/40 text-teal-700 dark:text-teal-300"
                          onClick={() => setPreviewDocAppt(appt)}
                        >
                          View Document
                        </Button>
                      </div>
                    ) : null}

                    {appt.diagnosis ? (
                      <div className="text-xs text-emerald-900 dark:text-emerald-200 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/30 space-y-1">
                        <span className="font-bold block">Diagnosis: {appt.diagnosis}</span>
                        {appt.notes ? <p>Advice: {appt.notes}</p> : null}
                      </div>
                    ) : appt.notes ? (
                      <p className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                        <span className="font-semibold">Doctor Notes:</span> {appt.notes}
                      </p>
                    ) : null}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {appt.status === "PENDING" ? (
                      <>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-1 text-xs"
                          onClick={() => handleUpdateStatus(appt.id, "CONFIRMED")}
                        >
                          <CheckCircle2 className="size-3.5" /> Accept ✅
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1 text-xs font-bold"
                          onClick={async () => {
                            const reason = prompt("Enter reason for declining this booking request (e.g. Frequent No-Show Patient):", "Frequent No-Show Patient");
                            if (reason !== null) {
                              await paymentService.doctorRespond(appt.id, false, reason);
                              toast.info("Appointment declined by doctor.");
                              loadDoctorAppointments();
                            }
                          }}
                        >
                          <XCircle className="size-3.5" /> Decline ❌
                        </Button>
                      </>
                    ) : null}
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => handleInspectPatient(appt)}
                    >
                      <Eye className="size-4" /> View Patient Info
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-teal-500/40 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10"
                      onClick={() => handleOpenRxModal(appt)}
                    >
                      <Edit3 className="size-4" /> Write Digital Rx
                    </Button>

                    {(appt.diagnosis || appt.prescriptionJson) ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1.5 text-xs font-semibold"
                        onClick={() => generatePrescriptionPdf(appt)}
                      >
                        🖨️ Download PDF
                      </Button>
                    ) : null}

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

                    {/* Delete Appointment Record Button 🗑️ */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg shrink-0"
                      title="Delete / Cancel Consultation Record"
                      onClick={() => setApptToDelete(appt)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
            </div>
          )}
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

              {/* Shared Vault Records Section */}
              <div className="p-3.5 bg-teal-950/20 border border-teal-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    📎 Patient Shared Locker Records ({sharedVaultFiles.length})
                  </span>
                  <Badge variant="outline" className="border-teal-500/40 text-teal-300 text-[10px]">
                    Consent Granted
                  </Badge>
                </div>
                {sharedVaultFiles.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    No specific Vault medical records explicitly shared for this appointment.
                  </p>
                ) : (
                  <div className="space-y-2 pt-1">
                    {sharedVaultFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-2.5 rounded-lg bg-card border border-border flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="truncate">
                          <span className="font-semibold text-foreground block truncate">{file.fileName}</span>
                          <span className="text-[11px] text-muted-foreground">Category: {file.category}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (inspectedPatient) {
                              setPreviewDocAppt({
                                ...inspectedPatient,
                                medicalDocumentUrl: file.fileUrl,
                                medicalDocumentName: file.fileName,
                              });
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 font-bold shrink-0 transition-colors cursor-pointer"
                        >
                          📄 Open File
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                onClick={async () => {
                  if (inspectedPatient?.patientId) {
                    const list = await vitalsService.getPatientVitals(inspectedPatient.patientId);
                    setPatientVitalsList(list);
                    setShowVitalsModal(true);
                  }
                }}
              >
                📈 View Patient Health Vitals History
              </Button>
              <Button onClick={() => setInspectedPatient(null)}>Close Profile</Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Doctor Inspection - Patient Vitals Modal */}
      {showVitalsModal && inspectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background surface-panel border rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold">Patient Health Vitals & Metabolic Trends</h3>
                <p className="text-xs text-muted-foreground">
                  Patient: <span className="font-semibold">{inspectedPatient.patientName}</span>
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setShowVitalsModal(false)}>✕</Button>
            </div>

            <VitalsChartContainer
              vitals={patientVitalsList}
              onRefresh={() => {}}
              onOpenLogModal={() => {}}
              readOnly={true}
            />
          </div>
        </div>
      )}

      {/* Lab Report Preview Modal */}
      {previewDocAppt ? (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-background surface-panel border rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold">Patient Lab Report Preview</h3>
                <p className="text-xs text-muted-foreground">
                  Patient: <span className="font-semibold">{previewDocAppt.patientName}</span> | File: {previewDocAppt.medicalDocumentName}
                </p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setPreviewDocAppt(null)}>✕</Button>
            </div>

            <div className="max-h-96 overflow-auto border rounded-xl p-2 bg-muted/20 flex justify-center">
              {previewDocAppt.medicalDocumentUrl?.startsWith("data:image") ? (
                <img
                  src={previewDocAppt.medicalDocumentUrl}
                  alt="Medical Lab Report"
                  className="max-w-full h-auto rounded-lg object-contain"
                />
              ) : previewDocAppt.medicalDocumentUrl?.startsWith("data:application/pdf") ? (
                <iframe
                  src={previewDocAppt.medicalDocumentUrl}
                  title="PDF Lab Report"
                  className="w-full h-80 rounded-lg"
                />
              ) : (
                <div className="text-center py-10 space-y-3">
                  <FileText className="size-12 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">{previewDocAppt.medicalDocumentName || "Medical File Attached"}</p>
                  <Button asChild size="sm">
                    <a href={previewDocAppt.medicalDocumentUrl} download={previewDocAppt.medicalDocumentName || "lab_report"}>
                      Download File
                    </a>
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              {previewDocAppt.medicalDocumentUrl ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openFileSecurely(previewDocAppt.medicalDocumentUrl!, previewDocAppt.medicalDocumentName || "lab_report")}
                >
                  📥 Download / Open File
                </Button>
              ) : <div />}
              <Button onClick={() => setPreviewDocAppt(null)}>Close Preview</Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Interactive Digital Prescription Writer Modal */}
      {rxModalAppt ? (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-background surface-panel border rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-500/10 rounded-xl text-teal-600 dark:text-teal-400">
                  <Stethoscope className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Issue Digital Medical Prescription</h3>
                  <p className="text-xs text-muted-foreground">
                    Patient: <span className="font-semibold text-foreground">{rxModalAppt.patientName}</span> | Date: {rxModalAppt.date}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setRxModalAppt(null)}>✕</Button>
            </div>

            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {/* Diagnosis */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Clinical Diagnosis <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={rxDiagnosis}
                  onChange={(e) => setRxDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Sinusitis & Mild Fever"
                  className="w-full p-2.5 text-sm border rounded-lg bg-background"
                />
              </div>

              {/* Medicines Table Builder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Prescribed Oral Medications (Rx)
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => setRxMedicines([...rxMedicines, { name: "", dosage: "", frequency: "", duration: "" }])}
                  >
                    + Add Medicine
                  </Button>
                </div>

                <div className="space-y-2">
                  {rxMedicines.map((med, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-muted/30 p-2.5 rounded-lg border">
                      <input
                        type="text"
                        placeholder="Medicine Name (e.g. Amoxicillin 500mg)"
                        value={med.name}
                        onChange={(e) => {
                          const updated = [...rxMedicines];
                          updated[idx].name = e.target.value;
                          setRxMedicines(updated);
                        }}
                        className="col-span-4 p-2 text-xs border rounded-md bg-background"
                      />
                      <input
                        type="text"
                        placeholder="Dosage (e.g. 1 Capsule)"
                        value={med.dosage}
                        onChange={(e) => {
                          const updated = [...rxMedicines];
                          updated[idx].dosage = e.target.value;
                          setRxMedicines(updated);
                        }}
                        className="col-span-3 p-2 text-xs border rounded-md bg-background"
                      />
                      <input
                        type="text"
                        placeholder="Frequency (e.g. Twice Daily)"
                        value={med.frequency}
                        onChange={(e) => {
                          const updated = [...rxMedicines];
                          updated[idx].frequency = e.target.value;
                          setRxMedicines(updated);
                        }}
                        className="col-span-3 p-2 text-xs border rounded-md bg-background"
                      />
                      <div className="col-span-2 flex items-center gap-1">
                        <input
                          type="text"
                          placeholder="5 Days"
                          value={med.duration}
                          onChange={(e) => {
                            const updated = [...rxMedicines];
                            updated[idx].duration = e.target.value;
                            setRxMedicines(updated);
                          }}
                          className="w-full p-2 text-xs border rounded-md bg-background"
                        />
                        {rxMedicines.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => setRxMedicines(rxMedicines.filter((_, i) => i !== idx))}
                            className="text-destructive hover:bg-destructive/10 p-1 rounded-md text-xs font-bold shrink-0"
                          >
                            ✕
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Tests */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recommended Diagnostic / Lab Tests (Optional)
                </label>
                <input
                  type="text"
                  value={rxLabTests}
                  onChange={(e) => setRxLabTests(e.target.value)}
                  placeholder="e.g. CBC, Blood Sugar Fasting, Chest X-Ray"
                  className="w-full p-2.5 text-sm border rounded-lg bg-background"
                />
              </div>

              {/* Follow-up Date */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Follow-Up Date (Optional)
                </label>
                <input
                  type="date"
                  value={rxFollowUpDate}
                  onChange={(e) => setRxFollowUpDate(e.target.value)}
                  className="w-full p-2.5 text-sm border rounded-lg bg-background"
                />
              </div>

              {/* Notes / Advice */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  General Patient Advice & Instructions
                </label>
                <textarea
                  rows={2}
                  value={rxNotes}
                  onChange={(e) => setRxNotes(e.target.value)}
                  placeholder="e.g. Drink warm water, avoid cold items, rest for 3 days."
                  className="w-full p-2.5 text-sm border rounded-lg bg-background"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t pt-3">
              <Button variant="outline" onClick={() => setRxModalAppt(null)}>
                Cancel
              </Button>
              <Button disabled={isSavingRx} onClick={handleSaveDigitalPrescription} className="bg-teal-600 hover:bg-teal-700 text-white">
                {isSavingRx ? "Issuing Prescription..." : "Save & Issue Prescription"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {apptToDelete ? (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-panel w-full max-w-md p-6 rounded-2xl shadow-2xl border border-border space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-base">
                <Trash2 className="size-5" />
                <span>Delete Consultation Record</span>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setApptToDelete(null)} className="size-8 p-0 rounded-full">
                <X className="size-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to permanently cancel & remove this consultation record for <strong>{apptToDelete.patientName}</strong> on <strong>{apptToDelete.date} ({apptToDelete.startTime})</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setApptToDelete(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await appointmentService.cancel(apptToDelete.id);
                    toast.success("Consultation record deleted successfully!");
                    setApptToDelete(null);
                    await loadDoctorAppointments();
                  } catch (err) {
                    const apiErr = err as ApiError;
                    toast.error(apiErr.message || "Failed to delete consultation record.");
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="gap-1.5 rounded-xl font-bold"
              >
                <Trash2 className="size-4" /> {isDeleting ? "Deleting..." : "Delete Record"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  </div>
  );
}
