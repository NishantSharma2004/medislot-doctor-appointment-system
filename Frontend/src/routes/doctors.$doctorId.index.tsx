import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Banknote, BadgeCheck, CalendarClock, Languages, MapPin, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatFee, formatTimeRange, isUpcomingSlot } from "@/components/common/format";
import { ErrorState } from "@/components/common/ErrorState";
import { FullPageLoader, InlineLoader } from "@/components/common/Loading";
import { PageShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import type { ApiError, AvailabilitySlotDto } from "@/lib/api/types";
import { appointmentService } from "@/services/appointment.service";
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
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlotDto | null>(null);
  const [reason, setReason] = useState("");
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const doctorQuery = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: () => doctorService.getDoctor(doctorId),
  });

  const availabilityQuery = useQuery({
    queryKey: ["doctor-availability", doctorId],
    queryFn: () => doctorService.getAvailability(doctorId),
  });

  if (doctorQuery.isPending) return <FullPageLoader label="Loading doctor profile" />;
  if (doctorQuery.error)
    return (
      <PageShell title="Doctor profile">
        <ErrorState
          error={doctorQuery.error as unknown as ApiError}
          onRetry={() => doctorQuery.refetch()}
        />
      </PageShell>
    );

  const doctor = doctorQuery.data!;
  const availableSlots = (availabilityQuery.data ?? []).filter((slot) => !slot.booked && isUpcomingSlot(slot.date, slot.startTime));

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: `/doctors/${doctorId}` } });
      return;
    }
    if (!selectedSlot) return;

    setIsBooking(true);
    setBookingError(null);
    try {
      await appointmentService.book({
        doctorId: doctor.id,
        slotId: selectedSlot.id,
        reason: reason.trim() || undefined,
        medicalDocumentUrl: documentUrl || undefined,
        medicalDocumentName: documentName || undefined,
      });
      toast.success(`Appointment booked with ${doctor.fullName}`);
      setSelectedSlot(null);
      setReason("");
      setDocumentUrl(null);
      setDocumentName(null);
      availabilityQuery.refetch();
      navigate({ to: "/dashboard" });
    } catch (err) {
      const apiErr = err as ApiError;
      const isTrueSlotConflict = apiErr.code === "SLOT_NOT_AVAILABLE" || apiErr.code === "SLOT_ALREADY_BOOKED";
      if (isTrueSlotConflict) {
        setBookingError("This slot was just booked by another patient! Please select another available slot.");
        setSelectedSlot(null);
        availabilityQuery.refetch();
      } else {
        setBookingError(null);
        toast.error(apiErr.message || "Could not book appointment");
      }
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <PageShell
      title={doctor.fullName}
      description={`${doctor.specialization} · ${doctor.clinicName}, ${doctor.city}`}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
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

          {/* Bookable Time Slots Section */}
          <section className="surface-panel p-6 space-y-4" id="slots-section">
            {bookingError ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 rounded-lg flex items-center justify-between gap-2 text-sm font-medium">
                <span>⚠️ {bookingError}</span>
                <Button size="sm" variant="ghost" onClick={() => setBookingError(null)}>
                  Dismiss
                </Button>
              </div>
            ) : null}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Select an Available Time Slot</h2>
                <p className="text-sm text-muted-foreground">
                  Pick an open slot below to confirm your consultation.
                </p>
              </div>
              <Badge variant="outline" className="rounded-full">
                {availableSlots.length} Open Slots
              </Badge>
            </div>

            {availabilityQuery.isPending ? (
              <InlineLoader label="Loading available slots" />
            ) : availabilityQuery.error ? (
              <ErrorState error={availabilityQuery.error as unknown as ApiError} onRetry={() => availabilityQuery.refetch()} />
            ) : (availabilityQuery.data ?? []).filter((slot) => isUpcomingSlot(slot.date, slot.startTime)).length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground">No slots published for this doctor yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(availabilityQuery.data ?? [])
                  .filter((slot) => isUpcomingSlot(slot.date, slot.startTime))
                  .map((slot) => {
                    const isBooked = slot.booked || slot.status === "BOOKED";
                    const isSelected = selectedSlot?.id === slot.id;

                    if (isBooked) {
                      return (
                        <div
                          key={slot.id}
                          onClick={() => toast.warning("This slot is already booked by another patient. Please choose an available slot.")}
                          className="p-3 rounded-lg border border-border/40 bg-muted/50 cursor-not-allowed opacity-75 flex flex-col gap-1 select-none"
                          title="Already Booked"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">{slot.date}</span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10">
                              Already Booked
                            </Badge>
                          </div>
                          <span className="text-sm font-medium line-through text-muted-foreground">
                            {formatTimeRange(slot.startTime, slot.endTime)}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-lg border text-left transition-all flex flex-col gap-1 ${
                          isSelected
                            ? "border-primary bg-primary/10 font-semibold shadow-xs ring-2 ring-primary/30"
                            : "border-input hover:bg-accent hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-primary">{slot.date}</span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            Available
                          </Badge>
                        </div>
                        <span className="text-sm font-medium">
                          {formatTimeRange(slot.startTime, slot.endTime)}
                        </span>
                      </button>
                    );
                  })}
              </div>
            )}

            {selectedSlot ? (
              <div className="mt-4 border-t pt-4 space-y-4 bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">
                    Selected Slot: {selectedSlot.date} ({formatTimeRange(selectedSlot.startTime, selectedSlot.endTime)})
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSlot(null)}>
                    Change
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reason-input" className="text-xs font-medium text-muted-foreground">
                    Reason for visit (optional)
                  </label>
                  <Textarea
                    id="reason-input"
                    placeholder="Briefly describe your symptoms or reason for visit..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <FileText className="size-3.5 text-primary" /> Upload Lab Report / Medical Records (Optional, Max 5MB)
                  </label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("File size must be smaller than 5MB");
                          return;
                        }
                        setDocumentName(file.name);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setDocumentUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs file:text-xs file:font-semibold file:bg-primary/10 file:text-primary file:border-0 file:rounded-md file:mr-2 cursor-pointer"
                  />
                  {documentName ? (
                    <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-0.5">
                      <CheckCircle2 className="size-3" /> Attached: {documentName}
                    </p>
                  ) : null}
                </div>

                <Button className="w-full gap-2" disabled={isBooking} onClick={handleBooking}>
                  {isBooking ? (
                    "Booking appointment..."
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" /> Confirm Appointment ({formatFee(doctor.consultationFee)})
                    </>
                  )}
                </Button>
              </div>
            ) : null}
          </section>
        </div>

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
                  {availabilityQuery.isPending ? "Checking…" : `${availableSlots.length} available`}
                </dd>
              </div>
            </div>
          </dl>

          <Button
            className="w-full"
            onClick={() => {
              const el = document.getElementById("slots-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Choose a slot
          </Button>
        </aside>
      </div>
    </PageShell>
  );
}
