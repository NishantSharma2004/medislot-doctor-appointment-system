import { useQuery, useQueries } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { DoctorCardSkeletonGrid } from "@/components/common/Loading";
import { EmptyState, ErrorState } from "@/components/common/ErrorState";
import { PaginationControls } from "@/components/common/PaginationControls";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { PageShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ApiError } from "@/lib/api/types";
import { mockSpecializations } from "@/lib/api/mock-data";
import { doctorService } from "@/services/doctor.service";

const PAGE_SIZE = 6;
const ANY = "ANY";
const MAX_FEE = 1500;
const DEFAULT_CITIES = ["Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Chennai"];

interface DoctorSearch {
  query?: string;
  specialization?: string;
  city?: string;
  maxFee?: number;
  availability?: string;
  page?: number;
}

export const Route = createFileRoute("/doctors/")({
  validateSearch: (search: Record<string, unknown>): DoctorSearch => ({
    query: typeof search.query === "string" && search.query ? search.query : undefined,
    specialization:
      typeof search.specialization === "string" && search.specialization
        ? search.specialization
        : undefined,
    city: typeof search.city === "string" && search.city ? search.city : undefined,
    maxFee: typeof search.maxFee === "number" ? search.maxFee : undefined,
    availability: typeof search.availability === "string" && search.availability ? search.availability : undefined,
    page: typeof search.page === "number" ? search.page : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Find a doctor — MediSlot" },
      {
        name: "description",
        content:
          "Search clinic doctors by specialization, city and consultation fee, then open their published availability.",
      },
      { property: "og:title", content: "Find a doctor — MediSlot" },
      { property: "og:description", content: "Search clinic doctors and open their availability." },
    ],
  }),
  component: DoctorSearchPage,
});

function DoctorSearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [queryInput, setQueryInput] = useState(search.query ?? "");
  const [feeDraft, setFeeDraft] = useState(search.maxFee ?? MAX_FEE);

  const page = search.page ?? 0;

  const { data: fetchedSpecializations = [] } = useQuery({
    queryKey: ["specializations"],
    queryFn: () => doctorService.getSpecializations(),
  });
  const { data: fetchedCities = [] } = useQuery({
    queryKey: ["cities"],
    queryFn: () => doctorService.getCities(),
  });

  const specializations =
    fetchedSpecializations.length > 0 ? fetchedSpecializations : mockSpecializations;
  const cities = fetchedCities.length > 0 ? fetchedCities : DEFAULT_CITIES;

  const doctorsQuery = useQuery({
    queryKey: ["doctors", search],
    queryFn: () =>
      doctorService.searchDoctors({
        query: search.query,
        specialization: search.specialization,
        city: search.city,
        maxFee: search.maxFee,
        page,
        size: PAGE_SIZE,
      }),
  });

  const result = doctorsQuery.data;
  const error = doctorsQuery.error as ApiError | null;

  const doctorIds = (result?.content ?? []).map((d) => d.id);
  const slotsQueries = useQueries({
    queries: doctorIds.map((id) => ({
      queryKey: ["availability", id],
      queryFn: () => doctorService.getAvailability(id),
      staleTime: 60000,
    })),
  });

  const availableDoctorIdSet = new Set<string>();
  doctorIds.forEach((id, index) => {
    const slots = slotsQueries[index]?.data ?? [];
    if (slots.some((s) => !s.booked)) {
      availableDoctorIdSet.add(id);
    }
  });

  const displayDoctors = (result?.content ?? []).filter((doctor) => {
    if (search.availability === "AVAILABLE") {
      return availableDoctorIdSet.has(doctor.id);
    }
    return true;
  });

  function updateSearch(next: Partial<DoctorSearch>, resetPage = true) {
    navigate({
      search: (prev: DoctorSearch) => ({ ...prev, ...next, page: resetPage ? 0 : next.page ?? prev.page }),
      replace: true,
    });
  }

  function clearFilters() {
    setQueryInput("");
    setFeeDraft(MAX_FEE);
    navigate({ search: {}, replace: true });
  }

  return (
    <PageShell
      title="Find a doctor"
      description="Filter by specialization, city and consultation fee to see published availability."
    >
      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="surface-panel h-fit space-y-5 p-5" aria-label="Filters">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
            <h2 className="text-sm font-semibold">Filters</h2>
          </div>

          <form
            className="space-y-1.5"
            onSubmit={(event) => {
              event.preventDefault();
              updateSearch({ query: queryInput.trim() || undefined });
            }}
          >
            <Label htmlFor="doctor-query">Search by name or clinic</Label>
            <div className="flex gap-2">
              <Input
                id="doctor-query"
                value={queryInput}
                onChange={(event) => setQueryInput(event.target.value)}
                placeholder="e.g. Ananya"
              />
              <Button type="submit" variant="secondary">
                Go
              </Button>
            </div>
          </form>

          <div className="space-y-1.5">
            <Label htmlFor="filter-specialization">Specialization</Label>
            <Select
              value={search.specialization ?? ANY}
              onValueChange={(value) =>
                updateSearch({ specialization: value === ANY ? undefined : value })
              }
            >
              <SelectTrigger id="filter-specialization">
                <SelectValue placeholder="Any specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any specialization</SelectItem>
                {specializations.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-city">Location</Label>
            <Select
              value={search.city ?? ANY}
              onValueChange={(value) => updateSearch({ city: value === ANY ? undefined : value })}
            >
              <SelectTrigger id="filter-city">
                <SelectValue placeholder="Any location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any location</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-availability">Slot Availability</Label>
            <Select
              value={search.availability ?? ANY}
              onValueChange={(value) =>
                updateSearch({ availability: value === ANY ? undefined : value })
              }
            >
              <SelectTrigger id="filter-availability">
                <SelectValue placeholder="Any availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>Any availability</SelectItem>
                <SelectItem value="AVAILABLE">🟢 Open Slots Available Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-fee">Maximum consultation fee: ₹{feeDraft}</Label>
            <Slider
              id="filter-fee"
              min={300}
              max={MAX_FEE}
              step={50}
              value={[feeDraft]}
              onValueChange={([value]) => setFeeDraft(value)}
              onValueCommit={([value]) =>
                updateSearch({ maxFee: value >= MAX_FEE ? undefined : value })
              }
              aria-label="Maximum consultation fee"
            />
          </div>

          <Button variant="outline" className="w-full" onClick={clearFilters}>
            Clear filters
          </Button>
        </aside>

        <section aria-label="Doctor results" className="space-y-5">
          {doctorsQuery.isPending ? <DoctorCardSkeletonGrid /> : null}

          {error ? <ErrorState error={error} onRetry={() => doctorsQuery.refetch()} /> : null}

          {result && displayDoctors.length === 0 ? (
            <EmptyState
              icon={<SearchX className="size-6" aria-hidden="true" />}
              title="No doctors match these filters"
              description="Try widening the consultation fee range, setting availability to Any, or clearing filters."
              action={
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : null}

          {result && displayDoctors.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {displayDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
              <PaginationControls
                page={result.page}
                totalPages={result.totalPages}
                totalElements={displayDoctors.length}
                label="doctors"
                onPageChange={(next) => updateSearch({ page: next }, false)}
              />
            </>
          ) : null}
        </section>
      </div>
    </PageShell>
  );
}
