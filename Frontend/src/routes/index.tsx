import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, CalendarSearch, ClipboardList, MessageSquareText, ShieldCheck, Stethoscope, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { mockSpecializations } from "@/lib/api/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediSlot — Book Clinic Appointments Online" },
      {
        name: "description",
        content:
          "Search doctors by specialization, city and consultation fee, then book, reschedule or cancel clinic appointments in a few clicks.",
      },
      { property: "og:title", content: "MediSlot — Book Clinic Appointments Online" },
      {
        property: "og:description",
        content: "Search doctors by specialization, city and consultation fee, then book, reschedule or cancel clinic appointments in a few clicks.",
      },
    ],
  }),
  component: LandingPage,
});

const STEPS = [
  {
    icon: CalendarSearch,
    title: "Find a doctor",
    body: "Filter by specialization, city and consultation fee to shortlist the right department.",
  },
  {
    icon: CalendarCheck,
    title: "Pick a slot",
    body: "See the doctor's published availability and choose a time that works for you.",
  },
  {
    icon: ClipboardList,
    title: "Manage your visit",
    body: "Track status, reschedule or cancel from a single My Appointments page.",
  },
];

function LandingPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <section className="hero-gradient">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
              Appointment scheduling for the clinic network
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Clinic appointments, organised end to end
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              MediSlot connects patients, doctors and clinic administrators in one scheduling
              workspace — search availability, confirm bookings and keep every appointment status in
              sync.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/doctors">Find a doctor</Link>
              </Button>
              {isAuthenticated ? (
                <Button asChild size="lg" variant="outline" className="gap-2">
                  <Link to="/dashboard">
                    <LayoutDashboard className="size-4" /> Go to Dashboard ({user?.fullName || "Account"})
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" variant="outline">
                  <Link to="/register">Create a patient account</Link>
                </Button>
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              MediSlot handles scheduling only. It does not provide medical advice.
            </p>
          </div>

          <div className="surface-panel p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Departments available
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {mockSpecializations.map((specialization) => (
                <li key={specialization.id}>
                  <Link
                    to="/doctors"
                    search={{ specialization: specialization.name }}
                    className="flex items-center gap-3 rounded-lg border border-border px-3 py-3 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    <Stethoscope className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    <span className="truncate">{specialization.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold tracking-tight">How booking works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <article key={step.title} className="surface-panel p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <step.icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="surface-panel grid gap-6 p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Not sure where to start?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The clinic assistant answers navigation and policy questions using the clinic's own
              verified documents, and shows the source behind each answer. It never diagnoses
              conditions or recommends medicines.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-primary-soft p-5">
            <MessageSquareText className="size-6 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium text-accent-foreground">
              Open the assistant from the button in the bottom-right corner of any page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
