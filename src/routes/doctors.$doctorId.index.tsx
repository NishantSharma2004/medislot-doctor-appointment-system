import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Banknote, BadgeCheck, CalendarClock, Languages, MapPin } from "lucide-react";
import { formatFee } from "@/components/common/format";
import { ErrorState } from "@/components/common/ErrorState";
import { FullPageLoader } from "@/components/common/Loading";
import { PageShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ApiError } from "@/lib/api/types";
import { doctorService } from "@/services/doctor.service";

export const Route = createFileRoute("/doctors/$doctorId/")({
  head: () => ({
    meta: [
      { title: "Doctor profile — MediSlot" },
      {
        name: "description",
        content: "Review a doctor's qualifications, clinic, languages and consultation fee before booking.",
      },
      { property: "og:title", content: "Doctor profile — MediSlot" },
      { property: "og:description", content: "Review doctor details before booking an appointment." },
    ],
  }),
  component: DoctorProfilePage,
});

function DoctorProfilePage() {
  const { doctorId } = Route.useParams();
  const doctorQuery = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: () => doctorService.getDoctor(doctorId),
  });
  const availabilityQuery = useQuery({
    queryKey: ["availability", doctorId],
    queryFn: () => doctorService.getAvailability(doctorId),
  });

  if (doctorQuery.isPending) return <FullPageLoader label="Loading doctor profile" />;
  if (doctorQuery.error)
    return (
      <PageShell title="Doctor profile">
        <ErrorState error={doctorQuery.error as ApiError} onRetry={() => doctorQuery.refetch()} />
      </PageShell>
    );

  const doctor = doctorQuery.data!;
  const openSlots = (availabilityQuery.data ?? []).filter((slot) => !slot.booked).length;

  return (
    <PageShell
      title={doctor.fullName}
      description={`${doctor.specialization} · ${doctor.clinicName}, ${doctor.city}`}
      actions={
        <Button asChild>
          <Link to="/doctors/$doctorId/slots" params={{ doctorId }}>
            View available slots
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <article className="surface-panel space-y-6 p-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              About this doctor
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{doctor.about}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Qualifications
            </h2>
            <p className="mt-2 text-sm">{doctor.qualifications}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {doctor.yearsOfExperience} years of practice
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-full">
              {doctor.specialization}
            </Badge>
            {doctor.languages.map((language) => (
              <Badge key={language} variant="outline" className="rounded-full">
                {language}
              </Badge>
            ))}
          </div>
        </article>

        <aside className="surface-panel h-fit space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Consultation details
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Banknote className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt className="text-muted-foreground">Consultation fee</dt>
                <dd className="font-medium">{formatFee(doctor.consultationFee)}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt className="text-muted-foreground">Clinic</dt>
                <dd className="font-medium">
                  {doctor.clinicName}, {doctor.city}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Languages className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt className="text-muted-foreground">Languages</dt>
                <dd className="font-medium">{doctor.languages.join(", ")}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt className="text-muted-foreground">Medical registration</dt>
                <dd className="font-medium">{doctor.registrationNumber}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CalendarClock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt className="text-muted-foreground">Open slots published</dt>
                <dd className="font-medium">
                  {availabilityQuery.isPending ? "Checking…" : `${openSlots} available`}
                </dd>
              </div>
            </div>
          </dl>

          <Button asChild className="w-full">
            <Link to="/doctors/$doctorId/slots" params={{ doctorId }}>
              Choose a slot
            </Link>
          </Button>
        </aside>
      </div>
    </PageShell>
  );
}
