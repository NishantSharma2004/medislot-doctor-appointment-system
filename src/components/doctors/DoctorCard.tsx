import { Link } from "@tanstack/react-router";
import { Banknote, BriefcaseMedical, Languages, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatFee } from "@/components/common/format";
import type { DoctorDto } from "@/lib/api/types";

function initials(name: string) {
  return name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function DoctorCard({ doctor }: { doctor: DoctorDto }) {
  return (
    <article className="surface-panel flex h-full flex-col gap-4 p-5 transition-shadow hover:shadow-float">
      <div className="flex min-w-0 items-start gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-accent-foreground"
        >
          {initials(doctor.fullName)}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{doctor.fullName}</h3>
          <p className="truncate text-sm text-muted-foreground">{doctor.qualifications}</p>
          <Badge variant="secondary" className="mt-2 rounded-full">
            {doctor.specialization}
          </Badge>
        </div>
      </div>

      <dl className="grid gap-2 text-sm text-muted-foreground">
        <div className="flex min-w-0 items-center gap-2">
          <BriefcaseMedical className="size-4 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Experience</dt>
          <dd className="truncate">{doctor.yearsOfExperience} years of practice</dd>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Location</dt>
          <dd className="truncate">
            {doctor.clinicName}, {doctor.city}
          </dd>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <Languages className="size-4 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Languages</dt>
          <dd className="truncate">{doctor.languages.join(", ")}</dd>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <Banknote className="size-4 shrink-0" aria-hidden="true" />
          <dt className="sr-only">Consultation fee</dt>
          <dd className="truncate font-medium text-foreground">
            {formatFee(doctor.consultationFee)} consultation fee
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap gap-2">
        <Button asChild size="sm" className="flex-1">
          <Link to="/doctors/$doctorId/slots" params={{ doctorId: doctor.id }}>
            View slots
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="flex-1">
          <Link to="/doctors/$doctorId" params={{ doctorId: doctor.id }}>
            Profile
          </Link>
        </Button>
      </div>
    </article>
  );
}
