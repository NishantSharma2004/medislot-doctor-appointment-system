import type { DosageTiming, PillLogDto } from "@/lib/api/types";

const STORAGE_KEY = "medislot_pill_tracker_v1";

function getTodayString(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

const INITIAL_PILLS: PillLogDto[] = [
  {
    id: "pill-1",
    medicineName: "Metformin ER 500mg",
    dosage: "1 Tablet after breakfast",
    timing: "MORNING",
    taken: true,
    takenAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    date: getTodayString(),
    doctorName: "Dr. Rajesh Sharma",
    notes: "For blood sugar regulation",
  },
  {
    id: "pill-2",
    medicineName: "Telmisartan 40mg",
    dosage: "1 Tablet morning with water",
    timing: "MORNING",
    taken: true,
    takenAt: new Date(Date.now() - 1000 * 60 * 60 * 4.5).toISOString(),
    date: getTodayString(),
    doctorName: "Dr. Vikram Shetty",
    notes: "For blood pressure control",
  },
  {
    id: "pill-3",
    medicineName: "Multivitamin & Zinc",
    dosage: "1 Capsule post lunch",
    timing: "AFTERNOON",
    taken: false,
    date: getTodayString(),
    notes: "Immunity support",
  },
  {
    id: "pill-4",
    medicineName: "Atorvastatin 10mg",
    dosage: "1 Tablet before bedtime",
    timing: "NIGHT",
    taken: false,
    date: getTodayString(),
    doctorName: "Dr. Vikram Shetty",
    notes: "Cholesterol care",
  },
  {
    id: "pill-5",
    medicineName: "Vitamin D3 60K",
    dosage: "1 Sachet with milk",
    timing: "NIGHT",
    taken: false,
    date: getTodayString(),
    notes: "Weekly bone health booster",
  },
];

function loadPills(): PillLogDto[] {
  if (typeof window === "undefined") return INITIAL_PILLS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PILLS));
      return INITIAL_PILLS;
    }
    const parsed: PillLogDto[] = JSON.parse(raw);
    const today = getTodayString();
    
    // Auto populate today's initial pills if date changed
    const hasTodayPills = parsed.some((p) => p.date === today);
    if (!hasTodayPills) {
      const todayPills = INITIAL_PILLS.map((p, idx) => ({
        ...p,
        id: `pill-${Date.now()}-${idx}`,
        date: today,
        taken: false,
        takenAt: undefined,
      }));
      const updated = [...todayPills, ...parsed];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    }

    return parsed;
  } catch {
    return INITIAL_PILLS;
  }
}

function savePills(pills: PillLogDto[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pills));
  } catch {
    // Ignore storage quota errors
  }
}

export const pillService = {
  async getPillsForDate(userId?: string, dateStr?: string): Promise<PillLogDto[]> {
    const targetDate = dateStr || getTodayString();
    const all = loadPills();
    return all.filter((p) => p.date === targetDate && (!userId || !p.userId || p.userId === userId));
  },

  async togglePillTaken(pillId: string): Promise<PillLogDto> {
    const all = loadPills();
    let updatedPill: PillLogDto | undefined;

    const updated = all.map((p) => {
      if (p.id === pillId) {
        const nextTaken = !p.taken;
        updatedPill = {
          ...p,
          taken: nextTaken,
          takenAt: nextTaken ? new Date().toISOString() : undefined,
        };
        return updatedPill;
      }
      return p;
    });

    savePills(updated);
    if (!updatedPill) throw new Error("Pill log not found");
    return updatedPill;
  },

  async addPill(payload: Omit<PillLogDto, "id" | "taken">): Promise<PillLogDto> {
    const all = loadPills();
    const newPill: PillLogDto = {
      ...payload,
      id: `pill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      taken: false,
      date: payload.date || getTodayString(),
    };

    const updated = [newPill, ...all];
    savePills(updated);
    return newPill;
  },

  async deletePill(pillId: string): Promise<void> {
    const all = loadPills();
    const updated = all.filter((p) => p.id !== pillId);
    savePills(updated);
  },

  async getAdherenceStats(userId?: string, dateStr?: string): Promise<{
    totalPills: number;
    takenPills: number;
    adherencePercentage: number;
  }> {
    const pills = await this.getPillsForDate(userId, dateStr);
    const totalPills = pills.length;
    const takenPills = pills.filter((p) => p.taken).length;
    const adherencePercentage = totalPills === 0 ? 100 : Math.round((takenPills / totalPills) * 100);

    return { totalPills, takenPills, adherencePercentage };
  },
};
