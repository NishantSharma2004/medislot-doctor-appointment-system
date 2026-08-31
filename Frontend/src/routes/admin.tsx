import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ErrorState } from "@/components/common/ErrorState";
import { FullPageLoader, InlineLoader } from "@/components/common/Loading";
import { PageShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { adminService } from "@/services/admin.service";
import type { ApiError, AppointmentDto, DoctorDto, UserDto } from "@/lib/api/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Operations — Durrmi" },
      { name: "description", content: "Clinic metrics, doctor management and audit controls." },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading, hasRole } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"doctors" | "patients" | "appointments">("doctors");
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [patients, setPatients] = useState<UserDto[]>([]);
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate({ to: "/login", search: { redirect: "/admin" } });
      } else if (!hasRole(["ADMIN"])) {
        navigate({ to: "/unauthorized" });
      }
    }
  }, [authLoading, isAuthenticated, hasRole, navigate]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === "doctors") {
        const res = await adminService.listDoctors(0, 20);
        setDoctors(res.content || []);
      } else if (activeTab === "patients") {
        const res = await adminService.listPatients(0, 20);
        setPatients(res.content || []);
      } else {
        const res = await adminService.listAppointments(0, 20);
        setAppointments(res.content || []);
      }
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && hasRole(["ADMIN"])) {
      loadData();
    }
  }, [isAuthenticated, activeTab]);

  if (authLoading || !isAuthenticated) {
    return <FullPageLoader label="Verifying administrator role" />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold border border-amber-300">
            🛡️ System Administration Control Panel
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Inspect all registered doctors, patient accounts, and clinic consultation records.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex border-b border-amber-200/60 gap-4">
            <button
              onClick={() => setActiveTab("doctors")}
              className={`pb-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all ${
                activeTab === "doctors" ? "border-amber-600 text-amber-900" : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Doctors Directory
            </button>
            <button
              onClick={() => setActiveTab("patients")}
              className={`pb-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all ${
                activeTab === "patients" ? "border-amber-600 text-amber-900" : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Registered Patients
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`pb-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all ${
                activeTab === "appointments" ? "border-amber-600 text-amber-900" : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Clinic Appointments
            </button>
          </div>

          {isLoading ? (
            <InlineLoader label="Loading records" />
          ) : error ? (
            <ErrorState error={error} onRetry={loadData} />
          ) : activeTab === "doctors" ? (
            <div className="space-y-3">
              {doctors.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-4 border border-slate-200/80 rounded-2xl bg-amber-50/40">
                  <div>
                    <p className="font-extrabold text-sm text-slate-900">{d.fullName}</p>
                    <p className="text-xs text-slate-600 font-medium">
                      {d.specialization} · {d.clinicName}, {d.city}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                    Active Doctor
                  </span>
                </div>
              ))}
            </div>
          ) : activeTab === "patients" ? (
            <div className="space-y-3">
              {patients.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 border border-slate-200/80 rounded-2xl bg-[#FFFDF9]">
                  <div>
                    <p className="font-extrabold text-sm text-slate-900">{p.fullName}</p>
                    <p className="text-xs text-slate-600 font-medium">{p.email} | {p.phone || "No phone"}</p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    {p.role}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4 border border-slate-200/80 rounded-2xl text-sm bg-white">
                  <div>
                    <p className="font-extrabold text-slate-900">
                      {a.patientName} with {a.doctorName}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">
                      {a.date} ({a.startTime} - {a.endTime})
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    Status: {a.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
