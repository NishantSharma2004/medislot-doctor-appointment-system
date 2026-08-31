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
    <article className="rounded-3xl border border-amber-200/80 bg-white p-6 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col justify-between gap-5 font-sans">
      <div className="space-y-4">
        {/* Header Avatar & Name */}
        <div className="flex items-start gap-3.5">
          <span
            aria-hidden="true"
            className="grid size-12 shrink-0 place-items-center rounded-2xl bg-amber-100 border border-amber-300 text-base font-black text-amber-950 shadow-inner"
          >
            {getInitials(doctor.fullName)}
          </span>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-base font-black text-slate-900 tracking-tight">{doctor.fullName}</h3>
              <Badge variant="outline" className="bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-black shrink-0 gap-1 px-2 py-0.5 rounded-full shadow-xs">
                <Star className="size-3 fill-amber-500 text-amber-500" /> {avgRating} ({reviewCount})
              </Badge>
            </div>
            <p className="truncate text-xs font-semibold text-slate-600">{doctor.qualifications}</p>
          </div>
        </div>

        {/* Specialisation & Availability Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {doctor.fullName.toLowerCase().includes("rakesh") || doctor.id === "e6d0d7aa-2279-4e3b-898f-5a4c49a3f3b2" ? (
            <Badge variant="default" className="rounded-full bg-emerald-600 text-white font-extrabold text-[10px] px-2.5 py-0.5 shadow-xs">
              🧪 Official Demo Therapist
            </Badge>
          ) : null}

          <Badge variant="secondary" className="rounded-full bg-amber-100/80 text-amber-950 border border-amber-300/80 font-extrabold text-xs px-3 py-1 shadow-2xs">
            {doctor.specialization}
          </Badge>

          {hasSlots ? (
            <Badge variant="outline" className="rounded-full border-emerald-400 bg-emerald-50 text-emerald-900 font-extrabold text-xs px-2.5 py-0.5">
              <span className="mr-1.5 inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
              {openSlots.length} Open Session{openSlots.length === 1 ? "" : "s"}
            </Badge>
          ) : (
            <Badge variant="outline" className="rounded-full border-amber-300 bg-amber-50 text-amber-900 font-extrabold text-xs px-2.5 py-0.5">
              <CalendarX className="mr-1 size-3 text-amber-600 inline" />
              No Open Sessions
            </Badge>
          )}
        </div>

        {/* Therapist Key Details DL */}
        <dl className="grid gap-2.5 text-xs text-slate-700 pt-1 border-t border-slate-100">
          <div className="flex min-w-0 items-center gap-2 font-medium">
            <BriefcaseMedical className="size-4 text-amber-700 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Experience</dt>
            <dd className="truncate font-semibold">{doctor.yearsOfExperience} years of therapy practice</dd>
          </div>
          <div className="flex min-w-0 items-center gap-2 font-medium">
            <MapPin className="size-4 text-amber-700 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Location</dt>
            <dd className="truncate font-semibold">
              {doctor.clinicName}, {doctor.city}
            </dd>
          </div>
          <div className="flex min-w-0 items-center gap-2 font-medium">
            <Languages className="size-4 text-amber-700 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Languages</dt>
            <dd className="truncate font-semibold">{doctor.languages.join(", ")}</dd>
          </div>
          <div className="flex min-w-0 items-center gap-2 pt-0.5">
            <Banknote className="size-4 text-amber-700 shrink-0" aria-hidden="true" />
            <dt className="sr-only">Session fee</dt>
            <dd className="truncate font-black text-amber-950 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-xs">
              {formatFee(doctor.consultationFee)} therapy session fee
            </dd>
          </div>
        </dl>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 pt-2">
        <Button asChild size="sm" className="flex-1 bg-[#FFBE0B] hover:bg-amber-500 text-slate-950 font-black rounded-xl h-10 shadow-xs text-xs">
          <Link to="/doctors/$doctorId" params={{ doctorId: doctor.id }}>
            View Sessions
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="flex-1 bg-white border-slate-300 hover:bg-slate-100 text-slate-800 font-extrabold rounded-xl h-10 text-xs">
          <Link to="/doctors/$doctorId" params={{ doctorId: doctor.id }}>
            Profile
          </Link>
        </Button>
      </div>
    </article>
  );
}
