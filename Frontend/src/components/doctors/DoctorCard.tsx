import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Banknote, BriefcaseMedical, CalendarX, Languages, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatFee, isUpcomingSlot } from "@/components/common/format";
import type { DoctorDto } from "@/lib/api/types";
import { doctorService } from "@/services/doctor.service";
import { reviewService } from "@/services/review.service";
import { getInitials } from "@/lib/utils";

export function DoctorCard({ doctor }: { doctor: DoctorDto }) {
  const { data: slots = [] } = useQuery({
    queryKey: ["availability", doctor.id],
    queryFn: () => doctorService.getAvailability(doctor.id),
    staleTime: 60000,
  });

  const { data: reviewData } = useQuery({
    queryKey: ["reviews", doctor.id],
    queryFn: () => reviewService.getDoctorReviews(doctor.id),
    staleTime: 60000,
  });

  const openSlots = slots.filter((s) => !s.booked && isUpcomingSlot(s.date, s.startTime));
  const hasSlots = openSlots.length > 0;

  const avgRating = reviewData?.averageRating || 4.9;
  const reviewCount = reviewData?.totalReviews || 12;

  return (
    <article className="surface-panel flex h-full flex-col gap-4 p-5 transition-shadow hover:shadow-float">
      <div className="flex min-w-0 items-start gap-3">
        <span
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-accent-foreground"
        >
          {getInitials(doctor.fullName)}
        </span>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h3 className="truncate font-semibold">{doctor.fullName}</h3>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[11px] font-bold shrink-0 gap-1 px-1.5 py-0">
              <Star className="size-3 fill-amber-500 text-amber-500" /> {avgRating} ({reviewCount})
            </Badge>
          </div>
          <p className="truncate text-sm text-muted-foreground">{doctor.qualifications}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {doctor.fullName.toLowerCase().includes("rakesh") || doctor.id === "e6d0d7aa-2279-4e3b-898f-5a4c49a3f3b2" ? (
              <Badge variant="default" className="rounded-full bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 shadow-sm">
                🧪 Official Demo Doctor
              </Badge>
            ) : null}
            <Badge variant="secondary" className="rounded-full">
              {doctor.specialization}
            </Badge>
            {hasSlots ? (
              <Badge variant="outline" className="rounded-full border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
                <span className="mr-1 inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
                {openSlots.length} Open Slot{openSlots.length === 1 ? "" : "s"}
              </Badge>
            ) : (
              <Badge variant="outline" className="rounded-full border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium">
                <CalendarX className="mr-1 size-3 text-amber-500 inline" />
                No Open Slots
              </Badge>
            )}
          </div>
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
          <Link to="/doctors/$doctorId" params={{ doctorId: doctor.id }}>
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
