import { useQuery, useQueries } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SearchX, SlidersHorizontal, Zap, Sparkles, Search, MapPin, Stethoscope, Filter, Star, Clock, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";
import { DoctorCardSkeletonGrid } from "@/components/common/Loading";
import { EmptyState, ErrorState } from "@/components/common/ErrorState";
import { PaginationControls } from "@/components/common/PaginationControls";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isUpcomingSlot } from "@/components/common/format";
import type { ApiError } from "@/lib/api/types";
import { mockSpecializations } from "@/lib/api/mock-data";
import { doctorService } from "@/services/doctor.service";
import { DoctorSearchTrie } from "@/lib/dsa/DoctorSearchTrie";
import { InvertedIndexEngine } from "@/lib/dsa/InvertedIndexSearch";

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
      { title: "Find a doctor — Durrmi Specialist Directory" },
      {
        name: "description",
        content:
          "Search doctors by specialization, city, consultation fee, or rating and book clinic appointment slots.",
      },
      { property: "og:title", content: "Find a doctor — Durrmi Specialist Directory" },
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
        hasAvailableSlots: search.availability === "AVAILABLE" ? true : undefined,
        page,
        size: PAGE_SIZE,
      }),
  });

  const result = doctorsQuery.data;
  const error = doctorsQuery.error as ApiError | null;

  // --- DSA Step 1: Initialize Trie & Inverted Index Engine ---
  const trieEngine = useMemo(() => {
    const trie = new DoctorSearchTrie();
    if (result?.content) {
      trie.buildTrieFromDoctors(result.content);
    }
    return trie;
  }, [result?.content]);

  // --- DSA Step 2: Instant O(K) Trie Prefix Execution ---
  const trieResult = useMemo(() => {
    return trieEngine.searchPrefix(queryInput);
  }, [trieEngine, queryInput]);

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
    if (slots.some((s) => !s.booked && isUpcomingSlot(s.date, s.startTime))) {
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
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans pb-16">
      {/* HEADER BANNER */}
      <section className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] border-b border-amber-200/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-900 shadow-xs">
            <Sparkles className="size-3.5 text-amber-600" /> Durrmi Verified Therapist Network
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Find The Right Therapist For Your Wellness Journey
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Filter by therapy focus area, city, session fee, and available slots to book confidential therapy sessions.
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)]">
          {/* SIDEBAR FILTERS PANEL */}
          <aside className="rounded-3xl border border-amber-200/80 bg-white p-6 shadow-xs h-fit space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-amber-700" />
                <h2 className="text-sm font-extrabold text-slate-900">Therapist Filters</h2>
              </div>
              {(search.query || search.specialization || search.city || search.maxFee || search.availability) ? (
                <button type="button" onClick={clearFilters} className="text-[11px] font-bold text-amber-700 hover:underline">
                  Reset All
                </button>
              ) : null}
            </div>

            {/* QUERY INPUT WITH TRIE AUTOCOMPLETE */}
            <form
              className="space-y-2 relative"
              onSubmit={(event) => {
                event.preventDefault();
                updateSearch({ query: queryInput.trim() || undefined });
              }}
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="doctor-query" className="text-xs font-bold text-slate-700">
                  Therapist Name or Focus Area
                </Label>
                {queryInput.trim().length > 0 ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Zap className="size-3 text-amber-600 fill-amber-600" /> Trie: {trieResult.searchTimeMs} ms
                  </span>
                ) : null}
              </div>

              <div className="flex gap-2">
                <Input
                  id="doctor-query"
                  value={queryInput}
                  onChange={(event) => setQueryInput(event.target.value)}
                  placeholder="e.g. Rajesh, Delhi, Cardiology"
                  className="h-10 text-xs font-medium rounded-xl border-slate-200"
                />
                <Button type="submit" size="sm" className="h-10 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold">
                  Go
                </Button>
              </div>

              {/* Live Trie Autocomplete Dropdown */}
              {queryInput.trim().length > 0 && trieResult.matchedCount > 0 ? (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-amber-200 rounded-2xl shadow-xl p-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-2 pb-1 border-b">
                    <span className="flex items-center gap-1">
                      <Sparkles className="size-3 text-amber-600" /> Trie Suggestions ({trieResult.matchedCount})
                    </span>
                    <span className="text-[10px] text-teal-700 font-bold">O(K) Speed</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1 pt-1">
                    {(result?.content ?? [])
                      .filter((d) => trieResult.matchingDoctorIds.includes(d.id))
                      .slice(0, 4)
                      .map((doctor) => (
                        <button
                          key={doctor.id}
                          type="button"
                          className="w-full text-left px-2 py-1.5 rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-between text-xs group"
                          onClick={() => {
                            setQueryInput(doctor.fullName);
                            updateSearch({ query: doctor.fullName });
                          }}
                        >
                          <span className="font-bold text-slate-900 group-hover:text-amber-700">
                            {doctor.fullName}
                          </span>
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                            {doctor.specialization}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              ) : null}
            </form>

            {/* SPECIALIZATION SELECT */}
            <div className="space-y-1.5">
              <Label htmlFor="filter-specialization" className="text-xs font-bold text-slate-700">Specialization</Label>
              <Select
                value={search.specialization ?? ANY}
                onValueChange={(value) =>
                  updateSearch({ specialization: value === ANY ? undefined : value })
                }
              >
                <SelectTrigger id="filter-specialization" className="h-10 rounded-xl text-xs font-semibold border-slate-200">
                  <SelectValue placeholder="Any specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>Any specialization</SelectItem>
                  {specializations.map((item) => (
                    <SelectItem key={item.id} value={item.name} className="text-xs">
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CITY SELECT */}
            <div className="space-y-1.5">
              <Label htmlFor="filter-city" className="text-xs font-bold text-slate-700">Location City</Label>
              <Select
                value={search.city ?? ANY}
                onValueChange={(value) => updateSearch({ city: value === ANY ? undefined : value })}
              >
                <SelectTrigger id="filter-city" className="h-10 rounded-xl text-xs font-semibold border-slate-200">
                  <SelectValue placeholder="Any location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>Any location</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city} className="text-xs">
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* AVAILABILITY SELECT */}
            <div className="space-y-1.5">
              <Label htmlFor="filter-availability" className="text-xs font-bold text-slate-700">Slot Availability</Label>
              <Select
                value={search.availability ?? ANY}
                onValueChange={(value) =>
                  updateSearch({ availability: value === ANY ? undefined : value })
                }
              >
                <SelectTrigger id="filter-availability" className="h-10 rounded-xl text-xs font-semibold border-slate-200">
                  <SelectValue placeholder="Any availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ANY}>Any availability</SelectItem>
                  <SelectItem value="AVAILABLE" className="text-xs font-bold text-emerald-700">
                    🟢 Open Slots Available Only
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* FEE SLIDER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Max Fee</span>
                <span className="text-amber-700 font-extrabold bg-amber-100 px-2 py-0.5 rounded-md">₹{feeDraft}</span>
              </div>
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
              />
            </div>

            <Button variant="outline" className="w-full rounded-xl border-slate-300 font-bold text-slate-700 hover:bg-slate-100" onClick={clearFilters}>
              Clear Filters
            </Button>
          </aside>

          {/* THERAPIST RESULTS GRID */}
          <section aria-label="Therapist results" className="space-y-6">
            {doctorsQuery.isPending ? <DoctorCardSkeletonGrid /> : null}

            {error ? <ErrorState error={error} onRetry={() => doctorsQuery.refetch()} /> : null}

            {result && displayDoctors.length === 0 ? (
              <EmptyState
                icon={<SearchX className="size-8 text-amber-600" aria-hidden="true" />}
                title="No therapists match these filters"
                description="Try widening the session fee range, setting location to Any, or clearing filters."
                action={
                  <Button variant="outline" className="rounded-xl border-amber-300 text-amber-900 font-bold" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                }
              />
            ) : null}

            {result && displayDoctors.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
      </div>
    </div>
  );
}
