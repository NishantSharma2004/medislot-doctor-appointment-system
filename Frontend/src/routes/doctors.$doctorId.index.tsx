import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Banknote, BadgeCheck, CalendarClock, Languages, MapPin, CheckCircle2, FileText, Lock, LogIn, UserPlus, AlertTriangle, Sun, SunMedium, Moon, CreditCard, Wallet, QrCode } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { formatFee, formatTimeRange, isUpcomingSlot } from "@/components/common/format";
import { ErrorState } from "@/components/common/ErrorState";
import { FullPageLoader, InlineLoader } from "@/components/common/Loading";
import { PageShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import type { ApiError, AvailabilitySlotDto, AppointmentDto } from "@/lib/api/types";
import { appointmentService } from "@/services/appointment.service";
import { doctorService } from "@/services/doctor.service";
import { notificationService } from "@/services/notification.service";
import { reviewService } from "@/services/review.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { healthVaultService, type VaultFile } from "@/services/health-vault.service";

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
  const bookingFormRef = useRef<HTMLDivElement>(null);

  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlotDto | null>(null);
  const [reason, setReason] = useState("");
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [docSourceMode, setDocSourceMode] = useState<"DEVICE" | "VAULT">("DEVICE");
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [selectedVaultFileId, setSelectedVaultFileId] = useState<string>("");

  const loadVaultFiles = async () => {
    try {
      const files = await healthVaultService.getVaultFiles();
      setVaultFiles(files);
    } catch {
      setVaultFiles([]);
    }
  };
  const [paymentMode, setPaymentMode] = useState<"ONLINE_RAZORPAY" | "PAY_AT_CLINIC">("ONLINE_RAZORPAY");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [createdAppointment, setCreatedAppointment] = useState<AppointmentDto | null>(null);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const doctorQuery = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: () => doctorService.getDoctor(doctorId),
  });

  const availabilityQuery = useQuery({
    queryKey: ["doctor-availability", doctorId],
    queryFn: () => doctorService.getAvailability(doctorId),
  });

  const reviewQuery = useQuery({
    queryKey: ["reviews", doctorId],
    queryFn: () => reviewService.getDoctorReviews(doctorId),
    staleTime: 60000,
  });

  const myAppointmentsQuery = useQuery({
    queryKey: ["my-appointments"],
    queryFn: () => appointmentService.getMyAppointmens({ page: 0, size: 50 }),
    enabled: isAuthenticated && user?.role === "PATIENT",
  });

  const activeApptWithThisDoctor = myAppointmentsQuery.data?.content?.find(
    (a) =>
      (a.doctorId === doctorId || a.doctorName === doctorQuery.data?.fullName) &&
      (a.status === "PENDING" || a.status === "CONFIRMED" || a.status === "IN_CONSULTATION")
  );

  if (doctorQuery.isPending) return <FullPageLoader label="Loading doctor profile" />;
  if (doctorQuery.error)
    return (
      <PageShell title="Doctor profile">
        <div className="surface-panel p-8 text-center space-y-4 max-w-lg mx-auto">
          <div className="size-12 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <CalendarClock className="size-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Doctor Profile Not Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This doctor profile may be inactive or updated. Please browse our active clinic specialists below.
            </p>
          </div>
          <Button onClick={() => navigate({ to: "/doctors" })} className="gap-2 font-semibold">
            🔍 Browse Active Specialists
          </Button>
        </div>
      </PageShell>
    );

  const doctor = doctorQuery.data!;
  const availableSlots = (availabilityQuery.data ?? []).filter((slot) => !slot.booked && isUpcomingSlot(slot.date, slot.startTime));

  const handleBooking = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    if (!selectedSlot) return;

    if (paymentMode === "PAY_AT_CLINIC" && user?.isCashBookingSuspended) {
      toast.error("Your Cash Booking privileges are suspended due to 3 consecutive missed visits. Please select Online Payment.");
      return;
    }

    setIsBooking(true);
    setBookingError(null);
    try {
      const created = await appointmentService.book({
        doctorId: doctor.id,
        slotId: selectedSlot.id,
        reason: reason.trim() || undefined,
        medicalDocumentUrl: documentUrl || undefined,
        medicalDocumentName: documentName || undefined,
        paymentMode,
      });

      setCreatedAppointment(created);

      await notificationService.addNotification({
        userId: user?.id,
        title: "Appointment Booked! 📅",
        message: `Your appointment request with ${doctor.fullName} for ${selectedSlot.date} (${selectedSlot.startTime}) is pending approval.`,
        type: "SYSTEM",
        targetUrl: "/appointments",
      });

      if (paymentMode === "ONLINE_RAZORPAY") {
        setIsRazorpayModalOpen(true);
      } else {
        toast.success(`Appointment booked with Dr. ${doctor.fullName}`);
        setIsInvoiceModalOpen(true);
        setSelectedSlot(null);
        setReason("");
        setDocumentUrl(null);
        setDocumentName(null);
        availabilityQuery.refetch();
      }
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
            {activeApptWithThisDoctor ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Active Appointment In Progress</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  You already have an active ({activeApptWithThisDoctor.status}) appointment with Dr. {doctor.fullName} for {activeApptWithThisDoctor.date} ({activeApptWithThisDoctor.startTime}). Please wait for your doctor to complete it or cancel it before booking another slot.
                </p>
                <Button size="sm" variant="outline" className="text-xs font-semibold gap-1.5 border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20" onClick={() => navigate({ to: "/appointments" })}>
                  <CalendarClock className="size-3.5" /> View My Appointments
                </Button>
              </div>
            ) : null}

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
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8 px-4 border border-dashed border-amber-500/40 bg-amber-500/5 rounded-xl space-y-3">
                <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300 font-semibold text-sm">
                  <CalendarClock className="size-4 text-amber-500" />
                  <span>No open consultation slots available currently for {doctor.fullName}</span>
                </div>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  This doctor has no open appointment slots right now. You can browse our other available specialists or check back later!
                </p>
                <Button size="sm" variant="outline" onClick={() => navigate({ to: "/doctors" })} className="text-xs font-semibold gap-1.5 mt-2">
                  🔍 Browse Other Available Specialists
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {(() => {
                  const upcomingSlots = (availabilityQuery.data ?? []).filter((slot) => isUpcomingSlot(slot.date, slot.startTime));
                  const morningSlots = upcomingSlots.filter((slot) => {
                    const hour = parseInt(slot.startTime.split(":")[0], 10);
                    return hour < 12;
                  });
                  const afternoonSlots = upcomingSlots.filter((slot) => {
                    const hour = parseInt(slot.startTime.split(":")[0], 10);
                    return hour >= 12 && hour < 16;
                  });
                  const eveningSlots = upcomingSlots.filter((slot) => {
                    const hour = parseInt(slot.startTime.split(":")[0], 10);
                    return hour >= 16;
                  });

                  const renderCategoryGroup = (title: string, icon: React.ReactNode, slots: AvailabilitySlotDto[]) => {
                    if (slots.length === 0) return null;

                    return (
                      <div key={title} className="space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/40 pb-1.5">
                          {icon}
                          <span>{title}</span>
                          <Badge variant="secondary" className="text-[10px] rounded-full px-2 py-0">
                            {slots.length}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {slots.map((slot) => {
                            const isSelected = selectedSlot?.id === slot.id;
                            return (
                              <button
                                key={slot.id}
                                type="button"
                                onClick={() => {
                                  setSelectedSlot(slot);
                                  setTimeout(() => {
                                    bookingFormRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
                                  }, 100);
                                }}
                                className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between space-y-1.5 ${
                                  isSelected
                                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/40 shadow-sm"
                                    : "border-border/80 hover:border-emerald-500/50 hover:bg-emerald-500/5 bg-card text-foreground"
                                }`}
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-muted-foreground">{slot.date}</span>
                                  <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-600 bg-emerald-500/10 px-1.5">
                                    Available
                                  </Badge>
                                </div>
                                <span className="text-sm font-bold text-foreground">
                                  {formatTimeRange(slot.startTime, slot.endTime)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  };

                  return (
                    <>
                      {renderCategoryGroup("Morning Sessions 🌅", <Sun className="size-4 text-amber-500" />, morningSlots)}
                      {renderCategoryGroup("Afternoon Sessions ☀️", <SunMedium className="size-4 text-orange-500" />, afternoonSlots)}
                      {renderCategoryGroup("Evening Sessions 🌙", <Moon className="size-4 text-teal-400" />, eveningSlots)}
                    </>
                  );
                })()}
              </div>
            )}

            {selectedSlot ? (
              <div ref={bookingFormRef} className="mt-4 border-t pt-4 space-y-4 bg-primary/5 p-4 rounded-lg scroll-mt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">
                    Selected Slot: {selectedSlot.date} ({formatTimeRange(selectedSlot.startTime, selectedSlot.endTime)})
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSlot(null)}>
                    Change
                  </Button>
                </div>

                {/* Dues & Suspension Warnings */}
                {user?.isCashBookingSuspended ? (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-start gap-2">
                    <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Cash Privileges Suspended:</strong> You missed 3 consecutive cash visits. You must book via Online Payment.
                    </span>
                  </div>
                ) : null}

                {user?.totalAccumulatedDues && user.totalAccumulatedDues > 0 ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="size-4 text-amber-500" />
                        Previous Missed Visit Dues (50% Penalty)
                      </span>
                      <span>+ ₹{user.totalAccumulatedDues}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      This penalty from previous missed visits will be added to your booking total.
                    </p>
                  </div>
                ) : null}

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Payment Method Choice *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMode("ONLINE_RAZORPAY")}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                        paymentMode === "ONLINE_RAZORPAY"
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm"
                          : "border-border/80 hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="size-4 text-emerald-500" />
                        <span>Pay Online (Razorpay / UPI)</span>
                      </div>
                      <Badge className="bg-emerald-600 text-white text-[9px] px-1.5">Fast & Secure</Badge>
                    </button>

                    <button
                      type="button"
                      disabled={user?.isCashBookingSuspended}
                      onClick={() => setPaymentMode("PAY_AT_CLINIC")}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                        user?.isCashBookingSuspended
                          ? "opacity-50 cursor-not-allowed border-border/50 text-muted-foreground"
                          : paymentMode === "PAY_AT_CLINIC"
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm"
                          : "border-border/80 hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Banknote className="size-4 text-teal-500" />
                        <span>Pay Cash at Clinic</span>
                      </div>
                      {user?.isCashBookingSuspended ? (
                        <Badge variant="destructive" className="text-[9px] px-1.5">Suspended</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] px-1.5">On Visit</Badge>
                      )}
                    </button>
                  </div>
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

                {/* Medical Document Attachment Section (Device Upload vs Health Vault Picker) */}
                <div className="space-y-2 pt-1 border-t">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <FileText className="size-3.5 text-emerald-500" /> Upload Lab Report / Medical Records (Optional)
                  </label>

                  {/* Dual Mode Choice Selector */}
                  <div className="flex gap-2 p-1 bg-muted/60 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setDocSourceMode("DEVICE")}
                      className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        docSourceMode === "DEVICE"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>📁 Option 1: Upload from Device</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDocSourceMode("VAULT");
                        if (isAuthenticated) {
                          loadVaultFiles();
                        }
                      }}
                      className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        docSourceMode === "VAULT"
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>📂 Option 2: Pick from Health Vault</span>
                    </button>
                  </div>

                  {docSourceMode === "DEVICE" ? (
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 15 * 1024 * 1024) {
                            toast.error("File size must be smaller than 15MB");
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
                      className="text-xs file:text-xs file:font-semibold file:bg-primary/10 file:text-primary file:border-0 file:rounded-md file:mr-2 cursor-pointer bg-card"
                    />
                  ) : (
                    <div className="space-y-2">
                      {vaultFiles.length === 0 ? (
                        <div className="p-3 border border-dashed rounded-xl text-center space-y-1.5 bg-muted/20">
                          <p className="text-xs text-muted-foreground font-medium">No saved documents in your Health Vault locker.</p>
                          <button
                            type="button"
                            onClick={() => setDocSourceMode("DEVICE")}
                            className="text-xs font-bold text-teal-400 hover:underline"
                          >
                            Upload from device instead
                          </button>
                        </div>
                      ) : (
                        <Select
                          value={selectedVaultFileId}
                          onValueChange={(val) => {
                            setSelectedVaultFileId(val);
                            const vf = vaultFiles.find((f) => f.id === val);
                            if (vf) {
                              setDocumentName(vf.fileName);
                              setDocumentUrl(vf.fileUrl);
                              toast.success(`Attached "${vf.fileName}" from Health Vault!`);
                            }
                          }}
                        >
                          <SelectTrigger className="h-9 text-xs font-semibold rounded-lg bg-card">
                            <SelectValue placeholder="Choose a document from your Health Vault locker..." />
                          </SelectTrigger>
                          <SelectContent>
                            {vaultFiles.map((vf) => (
                              <SelectItem key={vf.id} value={vf.id} className="text-xs">
                                📄 {vf.fileName} ({vf.category})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  )}

                  {documentName ? (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-400 font-bold">
                      <span className="truncate flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-emerald-500" /> Attached: {documentName}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setDocumentName(null);
                          setDocumentUrl(null);
                          setSelectedVaultFileId("");
                        }}
                        className="text-rose-400 hover:underline text-[11px] ml-2 shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}
                </div>

                <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold" disabled={isBooking} onClick={handleBooking}>
                  {isBooking ? (
                    "Booking appointment..."
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" /> Proceed to {paymentMode === "ONLINE_RAZORPAY" ? "Online Payment" : "Cash Booking"} ({formatFee((doctor.consultationFee || 500) + (user?.totalAccumulatedDues || 0))})
                    </>
                  )}
                </Button>
              </div>
            ) : null}
          </section>

          {/* Doctor Reviews */}
          <DoctorReviewList
            doctorId={doctorId}
            reviews={reviewQuery.data?.reviews ?? []}
            averageRating={reviewQuery.data?.averageRating ?? 0}
            totalReviews={reviewQuery.data?.totalReviews ?? 0}
            onReviewAdded={() => reviewQuery.refetch()}
          />
        </div>

        <aside className="surface-panel h-fit space-y-4 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Consultation details
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Banknote className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt className="font-semibold">Consultation fee</dt>
                <dd className="text-muted-foreground">{formatFee(doctor.consultationFee)} per visit</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt className="font-semibold">Clinic & Location</dt>
                <dd className="text-muted-foreground">
                  {doctor.clinicName}, {doctor.city}
                </dd>
              </div>
            </div>
          </dl>
        </aside>
      </div>

      {/* Auth Modal */}
      {showAuthModal ? (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-panel w-full max-w-md p-6 rounded-2xl shadow-2xl border border-border space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Lock className="size-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Authentication Required</h3>
                <p className="text-xs text-muted-foreground">Please sign in to book your consultation.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button variant="outline" onClick={() => navigate({ to: "/login", search: { redirect: `/doctors/${doctorId}` } })} className="gap-2 rounded-xl">
                <LogIn className="size-4" /> Sign In
              </Button>
              <Button onClick={() => navigate({ to: "/register", search: { redirect: `/doctors/${doctorId}` } })} className="gap-2 rounded-xl bg-emerald-600 text-white font-bold">
                <UserPlus className="size-4" /> Create Account
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Razorpay Checkout Modal */}
      {createdAppointment ? (
        <RazorpayCheckoutModal
          isOpen={isRazorpayModalOpen}
          onClose={() => {
            setIsRazorpayModalOpen(false);
            setIsInvoiceModalOpen(true);
          }}
          appointmentId={createdAppointment.id}
          doctorName={doctor.fullName}
          consultationFee={doctor.consultationFee}
          penaltyAmount={user?.totalAccumulatedDues || 0}
          onSuccess={() => {
            setIsRazorpayModalOpen(false);
            setIsInvoiceModalOpen(true);
            availabilityQuery.refetch();
          }}
        />
      ) : null}

      {/* Invoice Modal */}
      {createdAppointment ? (
        <MedicalInvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedSlot(null);
            setReason("");
            setDocumentUrl(null);
            setDocumentName(null);
            availabilityQuery.refetch();
            navigate({ to: "/appointments" });
          }}
          appointment={createdAppointment}
        />
      ) : null}
    </PageShell>
  );
}
