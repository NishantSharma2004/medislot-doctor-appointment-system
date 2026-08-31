import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Clock3,
  XCircle,
  ArrowRight,
  Search,
  FileText,
  PhoneCall,
  Activity,
  Sparkles,
  User,
  ShieldCheck,
  Building2,
  CalendarCheck2,
  Pill,
} from "lucide-react";
import { formatTimeRange, isUpcomingSlot, getEffectiveAppointmentStatus } from "@/components/common/format";
import { formatDoctorDisplayName } from "@/lib/utils";
import { BackButton } from "@/components/common/BackButton";
import { ErrorState } from "@/components/common/ErrorState";
import { FullPageLoader, InlineLoader } from "@/components/common/Loading";
import { generatePrescriptionPdf } from "@/lib/pdf/PrescriptionPdfTemplate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { appointmentService } from "@/services/appointment.service";
import { doctorService } from "@/services/doctor.service";
import { vitalsService } from "@/services/vitals.service";
import { VitalsChartContainer } from "@/components/vitals/VitalsChartContainer";
import { VitalsLogModal } from "@/components/vitals/VitalsLogModal";
import { PillTrackerContainer } from "@/components/pills/PillTrackerContainer";
import type { ApiError, AppointmentDto, AvailabilitySlotDto, HealthVitalDto, PageResponse } from "@/lib/api/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Patient Dashboard — Durrmi" },
      { name: "description", content: "Interactive health command center, upcoming appointments, and clinic shortcuts." },
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
    size: 50,
    totalElements: 0,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  // Vitals & Pill State
  const [vitals, setVitals] = useState<HealthVitalDto[]>([]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "VITALS" | "PILLS">("OVERVIEW");

  const [reschedulingAppt, setReschedulingAppt] = useState<AppointmentDto | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlotDto[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [isRescheduling, setIsRescheduling] = useState(false);

  const loadVitals = async () => {
    if (user?.id) {
      const list = await vitalsService.getPatientVitals(user.id);
      setVitals(list);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadVitals();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate({ to: "/login", search: { redirect: "/dashboard" } });
    } else if (!authLoading && user?.role === "DOCTOR") {
      navigate({ to: "/doctor", replace: true });
    } else if (!authLoading && user?.role === "ADMIN") {
      navigate({ to: "/admin", replace: true });
    }
  }, [authLoading, isAuthenticated, user?.role, navigate]);

  const loadAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentService.myAppointments({
        page: 0,
        size: 50,
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
  }, [isAuthenticated]);

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
    return <FullPageLoader label="Loading account session" />;
  }

  const allAppointments = appointmentsPage.content;
  const upcomingAppts = allAppointments.filter((a) => {
    const st = getEffectiveAppointmentStatus(a.status, a.date, a.startTime, a.endTime);
    return (st === "PENDING" || st === "CONFIRMED") && isUpcomingSlot(a.date, a.startTime);
  });
  const completedAppts = allAppointments.filter((a) => getEffectiveAppointmentStatus(a.status, a.date, a.startTime, a.endTime) === "COMPLETED");
  const pendingAppts = allAppointments.filter((a) => {
    const st = getEffectiveAppointmentStatus(a.status, a.date, a.startTime, a.endTime);
    return st === "PENDING" && isUpcomingSlot(a.date, a.startTime);
  });
  const missedOrExpiredAppts = allAppointments.filter((a) => {
    const st = getEffectiveAppointmentStatus(a.status, a.date, a.startTime, a.endTime);
    return st === "MISSED" || st === "EXPIRED" || st === "CANCELLED" || st === "REJECTED";
  });

  const nextAppointment = upcomingAppts.length > 0 ? upcomingAppts[0] : null;
  const totalCount = allAppointments.length;

  const completedPct = totalCount > 0 ? Math.round((completedAppts.length / totalCount) * 100) : 0;
  const upcomingPct = totalCount > 0 ? Math.round((upcomingAppts.length / totalCount) * 100) : 0;
  const pendingPct = totalCount > 0 ? Math.round((pendingAppts.length / totalCount) * 100) : 0;
  const missedPct = totalCount > 0 ? Math.round((missedOrExpiredAppts.length / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <BackButton />

        {/* Hero Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE] to-[#FAF8F5] p-6 sm:p-8 shadow-xs border border-amber-200">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold border border-amber-300">
                  <ShieldCheck className="size-3.5 text-amber-600" /> Patient Command Center
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Welcome back, {user?.fullName}! 👋
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl font-medium">
                Track your upcoming clinic visits, manage appointment schedules, and explore verified medical specialists.
              </p>
            </div>

            {/* Quick Profile Pill */}
            <div className="bg-white p-4 rounded-2xl border border-amber-200 text-xs space-y-2 shrink-0 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <User className="size-4 text-amber-600" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 pt-1.5 border-t border-slate-100 gap-4">
                <span>Role: <strong className="text-amber-900">{user?.role}</strong></span>
                <span>Phone: <strong className="text-slate-900">{user?.phone || "N/A"}</strong></span>
              </div>
            </div>
          </div>
        </div>

      {/* 4 Interactive Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Upcoming */}
        <div className="surface-panel p-5 space-y-2 relative overflow-hidden group hover:border-teal-500/50 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Upcoming</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
              <Calendar className="size-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{upcomingAppts.length}</span>
            {upcomingAppts.length > 0 ? (
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                <Sparkles className="size-3 mr-1" /> Active
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">No visits due</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground pt-1 border-t border-border/40">Confirmed & upcoming slots</p>
        </div>

        {/* Stat 2: Completed */}
        <div className="surface-panel p-5 space-y-2 relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completed</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{completedAppts.length}</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Visits attended</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1 border-t border-border/40">Successful consultations</p>
        </div>

        {/* Stat 3: Pending */}
        <div className="surface-panel p-5 space-y-2 relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Doctor</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <Clock3 className="size-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{pendingAppts.length}</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Awaiting review</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1 border-t border-border/40">Doctor confirmation pending</p>
        </div>

        {/* Stat 4: Missed / Cancelled */}
        <div className="surface-panel p-5 space-y-2 relative overflow-hidden group hover:border-orange-500/50 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Missed / Expired</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
              <AlertCircle className="size-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">{missedOrExpiredAppts.length}</span>
            <span className="text-xs text-muted-foreground">Past & cancelled</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1 border-t border-border/40">No-shows or cancelled</p>
        </div>
      </div>

      {/* Primary Dashboard View Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("OVERVIEW")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "OVERVIEW" ? "bg-primary text-primary-foreground shadow-xs" : "bg-card text-muted-foreground hover:text-foreground border border-border/60"
          }`}
        >
          <Calendar className="size-4" /> Appointments Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("VITALS")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "VITALS" ? "bg-primary text-primary-foreground shadow-xs" : "bg-card text-muted-foreground hover:text-foreground border border-border/60"
          }`}
        >
          <Activity className="size-4 text-emerald-400" /> 📈 Health Vitals & Charts
          {vitals.length > 0 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-white/20 text-white">
              {vitals.length} Logs
            </Badge>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("PILLS")}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "PILLS" ? "bg-primary text-primary-foreground shadow-xs" : "bg-card text-muted-foreground hover:text-foreground border border-border/60"
          }`}
        >
          <Pill className="size-4 text-sky-400" /> 💊 Medicine & Pill Tracker
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-sky-500/20 text-sky-300">
            Daily Rx
          </Badge>
        </button>
      </div>

      {activeTab === "PILLS" ? (
        <PillTrackerContainer userId={user?.id} />
      ) : activeTab === "VITALS" ? (
        <VitalsChartContainer
          vitals={vitals}
          onRefresh={loadVitals}
          onOpenLogModal={() => setIsLogModalOpen(true)}
        />
      ) : (
        <>
          {/* Visual Analytics Distribution Bar */}
          {totalCount > 0 ? (
        <div className="surface-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wide uppercase text-muted-foreground flex items-center gap-2">
              <Activity className="size-4 text-teal-500" /> Appointment Health Analytics
            </h2>
            <span className="text-xs text-muted-foreground">Total Bookings: <strong>{totalCount}</strong></span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
            {completedPct > 0 ? (
              <div style={{ width: `${completedPct}%` }} className="bg-emerald-500 transition-all duration-500" title={`Completed: ${completedPct}%`} />
            ) : null}
            {upcomingPct > 0 ? (
              <div style={{ width: `${upcomingPct}%` }} className="bg-teal-500 transition-all duration-500" title={`Upcoming: ${upcomingPct}%`} />
            ) : null}
            {pendingPct > 0 ? (
              <div style={{ width: `${pendingPct}%` }} className="bg-amber-500 transition-all duration-500" title={`Pending: ${pendingPct}%`} />
            ) : null}
            {missedPct > 0 ? (
              <div style={{ width: `${missedPct}%` }} className="bg-orange-500 transition-all duration-500" title={`Missed/Cancelled: ${missedPct}%`} />
            ) : null}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs gap-4 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Completed ({completedAppts.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-teal-500" />
              <span className="text-muted-foreground">Upcoming ({upcomingAppts.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Pending ({pendingAppts.length})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-orange-500" />
              <span className="text-muted-foreground">Missed/Cancelled ({missedOrExpiredAppts.length})</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Next Appointment Spotlight Hero Card */}
      {nextAppointment ? (
        <div className="surface-panel p-6 border-l-4 border-l-teal-500 space-y-4 shadow-md bg-gradient-to-r from-teal-500/5 via-card to-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-teal-500 text-white hover:bg-teal-600 px-3 py-0.5 text-xs font-bold">
                <CalendarCheck2 className="size-3.5 mr-1" /> Next Consultation Spotlight
              </Badge>
              <Badge variant="outline" className="text-xs font-semibold">
                {nextAppointment.status}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">Scheduled Consultation</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">{nextAppointment.doctorName}</h3>
              <p className="text-sm font-medium text-teal-700 dark:text-teal-400">{nextAppointment.specialization}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1 font-semibold text-foreground bg-muted/60 px-3 py-1 rounded-lg">
                  <Calendar className="size-3.5 text-teal-600" /> {nextAppointment.date}
                </span>
                <span className="flex items-center gap-1 font-semibold text-foreground bg-muted/60 px-3 py-1 rounded-lg">
                  <Clock className="size-3.5 text-teal-600" /> {formatTimeRange(nextAppointment.startTime, nextAppointment.endTime)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => openRescheduleModal(nextAppointment)}>
                Reschedule
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => handleCancel(nextAppointment.id)}
              >
                Cancel Visit
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Today's Medicine Quick Tracker Widget */}
      <PillTrackerContainer userId={user?.id} compact />

      {/* Quick Actions & Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shortcut 1 */}
        <Link
          to="/doctors"
          className="surface-panel p-5 flex items-center justify-between group hover:border-primary/50 transition-all shadow-xs"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Search className="size-4 text-teal-600" /> Find & Book Doctor
            </h3>
            <p className="text-xs text-muted-foreground">Search cardiology, dermatology, & more</p>
          </div>
          <ArrowRight className="size-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
        </Link>

        {/* Shortcut 2 */}
        <Link
          to="/appointments"
          className="surface-panel p-5 flex items-center justify-between group hover:border-primary/50 transition-all shadow-xs"
        >
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <FileText className="size-4 text-emerald-600" /> All Appointments History
            </h3>
            <p className="text-xs text-muted-foreground">View full paginated log & filters</p>
          </div>
          <ArrowRight className="size-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
        </Link>

        {/* Shortcut 3 */}
        <div className="surface-panel p-5 flex items-center justify-between group shadow-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <PhoneCall className="size-4 text-amber-600" /> Clinic Emergency Help
            </h3>
            <p className="text-xs text-muted-foreground">Contact Durrmi Helpline (24x7)</p>
          </div>
          <Badge variant="outline" className="text-xs">24/7 Active</Badge>
        </div>
      </div>

      {/* Recent Appointments Snippet & View All Link */}
      <div className="surface-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Appointments Overview</h2>
            <p className="text-xs text-muted-foreground">Snapshot of your latest consultation requests.</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-primary font-semibold">
            <Link to="/appointments">
              View All Appointments <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <InlineLoader label="Fetching recent activity" />
        ) : error ? (
          <ErrorState error={error} onRetry={loadAppointments} />
        ) : allAppointments.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-xl">
            <p className="text-muted-foreground text-sm">No appointment history found.</p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link to="/doctors">Book Your First Consultation</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {allAppointments.slice(0, 5).map((appt) => {
              const effStatus = getEffectiveAppointmentStatus(appt.status, appt.date, appt.startTime, appt.endTime);
              return (
                <div
                  key={appt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:border-primary/40 transition-colors gap-3 bg-card"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{formatDoctorDisplayName(appt.doctorName)}</span>
                      <span className="text-xs text-muted-foreground">({appt.specialization})</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Date: <span className="font-medium text-foreground">{appt.date}</span> | Time:{" "}
                      <span className="font-medium text-foreground">{formatTimeRange(appt.startTime, appt.endTime)}</span>
                    </p>
                    {effStatus === "EXPIRED" ? (
                      <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        💰 100% Full Refund Initiated (Doctor No-Response)
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-3">
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
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </>
      )}

      {/* Vitals Log Modal */}
      {user?.id && (
        <VitalsLogModal
          patientId={user.id}
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          onSuccess={loadVitals}
        />
      )}

      {/* Reschedule Modal */}
      {reschedulingAppt ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="surface-panel w-full max-w-lg p-6 space-y-4">
            <h2 className="text-lg font-bold">Reschedule Appointment</h2>
            <p className="text-sm text-muted-foreground">
              Select a new available slot with <span className="font-medium">{reschedulingAppt.doctorName}</span>.
            </p>

            {availableSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No other available slots for this doctor.</p>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2">
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
  </div>
  );
}

