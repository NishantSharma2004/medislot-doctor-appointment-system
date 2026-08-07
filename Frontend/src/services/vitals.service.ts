import type { HealthVitalDto } from "@/lib/api/types";

const STORAGE_KEY = "medislot_vitals_v1";

const INITIAL_VITALS: HealthVitalDto[] = [
  {
    id: "vital-1",
    patientId: "patient-1",
    logDate: "2026-08-07",
    fastingGlucose: 105,
    postPrandialGlucose: 138,
    systolicBp: 122,
    diastolicBp: 80,
    weightKg: 68,
    heightCm: 172,
    bmi: 23.0,
    heartRateBpm: 72,
    notes: "Fasting sample taken 8:00 AM. Feeling good.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "vital-2",
    patientId: "patient-1",
    logDate: "2026-08-05",
    fastingGlucose: 112,
    postPrandialGlucose: 145,
    systolicBp: 128,
    diastolicBp: 84,
    weightKg: 68.5,
    heightCm: 172,
    bmi: 23.2,
    heartRateBpm: 76,
    notes: "Slight headache in evening after work.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "vital-3",
    patientId: "patient-1",
    logDate: "2026-08-03",
    fastingGlucose: 118,
    postPrandialGlucose: 152,
    systolicBp: 130,
    diastolicBp: 86,
    weightKg: 69,
    heightCm: 172,
    bmi: 23.3,
    heartRateBpm: 78,
    notes: "Before starting low sugar diet plan.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
  {
    id: "vital-4",
    patientId: "patient-1",
    logDate: "2026-07-30",
    fastingGlucose: 125,
    postPrandialGlucose: 160,
    systolicBp: 134,
    diastolicBp: 88,
    weightKg: 69.8,
    heightCm: 172,
    bmi: 23.6,
    heartRateBpm: 80,
    notes: "Routine checkup log.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 180).toISOString(),
  },
];

function loadFromStorage(): HealthVitalDto[] {
  if (typeof window === "undefined") return INITIAL_VITALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_VITALS));
      return INITIAL_VITALS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_VITALS;
  }
}

function saveToStorage(vitals: HealthVitalDto[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vitals));
  } catch {
    // Ignore storage errors
  }
}

export const vitalsService = {
  async getPatientVitals(patientId?: string): Promise<HealthVitalDto[]> {
    const all = loadFromStorage();
    if (!patientId) return all;
    return all.filter((v) => !v.patientId || v.patientId === patientId);
  },

  async logVital(data: {
    patientId: string;
    logDate: string;
    fastingGlucose?: number;
    postPrandialGlucose?: number;
    systolicBp?: number;
    diastolicBp?: number;
    weightKg?: number;
    heightCm?: number;
    heartRateBpm?: number;
    notes?: string;
  }): Promise<HealthVitalDto> {
    const all = loadFromStorage();

    let bmi: number | undefined = undefined;
    if (data.weightKg && data.heightCm && data.heightCm > 0) {
      const heightM = data.heightCm / 100;
      bmi = parseFloat((data.weightKg / (heightM * heightM)).toFixed(1));
    }

    const newVital: HealthVitalDto = {
      id: `vital-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      patientId: data.patientId,
      logDate: data.logDate,
      fastingGlucose: data.fastingGlucose,
      postPrandialGlucose: data.postPrandialGlucose,
      systolicBp: data.systolicBp,
      diastolicBp: data.diastolicBp,
      weightKg: data.weightKg,
      heightCm: data.heightCm,
      bmi,
      heartRateBpm: data.heartRateBpm,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    const updated = [newVital, ...all];
    saveToStorage(updated);
    return newVital;
  },

  async deleteVital(id: string): Promise<void> {
    const all = loadFromStorage();
    const updated = all.filter((v) => v.id !== id);
    saveToStorage(updated);
  },
};
