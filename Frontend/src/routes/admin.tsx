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
      { title: "Admin Operations — MediSlot" },
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
    <PageShell title="Admin Control Center" description="System administration, provider status and clinic overview.">
      <div className="surface-panel p-6 space-y-6">
        <div className="flex border-b gap-4">
          <button
            onClick={() => setActiveTab("doctors")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "doctors" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            Doctors Directory
          </button>
          <button
            onClick={() => setActiveTab("patients")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "patients" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            Registered Patients
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "appointments" ? "border-primary text-primary" : "border-transparent text-muted-foreground"
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
              <div key={d.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold text-sm">{d.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.specialization} · {d.clinicName}, {d.city}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                  Active
                </span>
              </div>
            ))}
          </div>
        ) : activeTab === "patients" ? (
          <div className="space-y-3">
            {patients.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold text-sm">{p.fullName}</p>
                  <p className="text-xs text-muted-foreground">{p.email} | {p.phone || "No phone"}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {p.role}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 border rounded-lg text-sm">
                <div>
                  <p className="font-semibold">
                    {a.patientName} with {a.doctorName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.date} ({a.startTime} - {a.endTime})
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
