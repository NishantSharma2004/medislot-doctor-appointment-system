import { apiClient } from "@/lib/api/client";
import { mockCities, mockDoctors, mockSlots, mockSpecializations } from "@/lib/api/mock-data";
import type {
  AvailabilitySlotDto,
  CreateAvailabilityRequest,
  DoctorDto,
  DoctorSearchParams,
  PageResponse,
  SpecializationDto,
} from "@/lib/api/types";
import { USE_MOCK_API, delay, mockError } from "./config";

export interface DoctorService {
  searchDoctors(params: DoctorSearchParams): Promise<PageResponse<DoctorDto>>;
  getDoctor(doctorId: string): Promise<DoctorDto>;
  getAvailability(doctorId: string): Promise<AvailabilitySlotDto[]>;
  createAvailability(payload: CreateAvailabilityRequest): Promise<AvailabilitySlotDto[]>;
  getSpecializations(): Promise<SpecializationDto[]>;
  getCities(): Promise<string[]>;
}

const mockSlotStore: AvailabilitySlotDto[] = [...mockSlots];

export function _mockSlots() {
  return mockSlotStore;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function matchesSpecialization(docSpec: string, requestedSpec: string): boolean {
  if (!requestedSpec || requestedSpec === "ANY") return true;
  const req = requestedSpec.toLowerCase().trim();
  const doc = docSpec.toLowerCase().trim();
  
  if (doc === req || doc.includes(req) || req.includes(doc)) return true;
  
  if ((req.includes("stress") || req.includes("burnout")) && (doc.includes("stress") || doc.includes("burnout") || doc.includes("cbt"))) return true;
  if ((req.includes("anxiety") || req.includes("panic")) && (doc.includes("anxiety") || doc.includes("panic"))) return true;
  if ((req.includes("relation") || req.includes("couple")) && (doc.includes("relation") || doc.includes("couple"))) return true;
  if ((req.includes("depress") || req.includes("mood") || req.includes("sad")) && (doc.includes("depress") || doc.includes("mood"))) return true;
  if ((req.includes("sleep") || req.includes("insomnia")) && (doc.includes("sleep") || doc.includes("mindful") || doc.includes("circadian"))) return true;
  if ((req.includes("career") || req.includes("work")) && (doc.includes("career") || doc.includes("burnout") || doc.includes("stress"))) return true;
  if ((req.includes("adhd") || req.includes("attention")) && (doc.includes("adhd") || doc.includes("attention") || doc.includes("child"))) return true;
  if ((req.includes("lone") || req.includes("isolat")) && (doc.includes("lone") || doc.includes("counsel") || doc.includes("emotion"))) return true;
  
  return false;
}

export function generateFallbackSlots(doctorId: string): AvailabilitySlotDto[] {
  const slots: AvailabilitySlotDto[] = [];
  const times = [
    { start: "10:00", end: "10:45" },
    { start: "11:30", end: "12:15" },
    { start: "14:00", end: "14:45" },
    { start: "16:00", end: "16:45" },
    { start: "18:00", end: "18:45" },
  ];

  for (let dayOffset = 0; dayOffset <= 6; dayOffset++) {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    const dateStr = d.toISOString().split("T")[0];

    times.forEach((t, idx) => {
      slots.push({
        id: `dyn-slot-${doctorId}-${dateStr}-${idx}`,
        doctorId,
        date: dateStr,
        startTime: t.start,
        endTime: t.end,
        booked: false,
        consultationFee: 700,
      });
    });
  }

  return slots;
}

const mockDoctorService: DoctorService = {
  async searchDoctors({ query, specialization, city, maxFee, page = 0, size = 6 }) {
    const q = query?.trim().toLowerCase();
    const filtered = mockDoctors.filter((doctor) => {
      if (q && !`${doctor.fullName} ${doctor.specialization} ${doctor.clinicName}`.toLowerCase().includes(q))
        return false;
      if (specialization && !matchesSpecialization(doctor.specialization, specialization)) return false;
      if (city && doctor.city !== city) return false;
      if (maxFee !== undefined && doctor.consultationFee > maxFee) return false;
      return true;
    });

    return delay({
      content: filtered.slice(page * size, page * size + size),
      page,
      size,
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / size)),
    });
  },

  async getDoctor(doctorId) {
    const doctor = mockDoctors.find((d) => d.id === doctorId);
    if (!doctor)
      return mockError({ status: 404, code: "NOT_FOUND", message: "Doctor profile not found." });
    return delay(doctor);
  },

  async getAvailability(doctorId) {
    const slots = mockSlotStore.filter((slot) => slot.doctorId === doctorId);
    if (slots.length > 0) {
      return delay(slots.sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)));
    }
    return delay(generateFallbackSlots(doctorId));
  },

  async createAvailability(payload) {
    const doctorId = "d1000001-0000-4000-8000-000000000001";
    const created: AvailabilitySlotDto[] = [];
    let cursor = payload.startTime;
    while (cursor < payload.endTime) {
      const end = addMinutes(cursor, payload.slotMinutes);
      if (end > payload.endTime) break;
      const clash = mockSlotStore.some(
        (s) => s.doctorId === doctorId && s.date === payload.date && s.startTime === cursor,
      );
      if (clash) {
        return mockError({
          status: 409,
          code: "CONFLICT",
          message: `A slot already exists on ${payload.date} at ${cursor}.`,
        });
      }
      created.push({
        id: `slot-${doctorId}-${payload.date}-${cursor}`,
        doctorId,
        date: payload.date,
        startTime: cursor,
        endTime: end,
        booked: false,
      });
      cursor = end;
    }
    if (created.length === 0) {
      return mockError({
        status: 400,
        code: "VALIDATION",
        message: "The selected window is too short for the chosen slot length.",
      });
    }
    mockSlotStore.push(...created);
    return delay(created);
  },

  async getSpecializations() {
    return delay(mockSpecializations, 200);
  },

  async getCities() {
    return delay(mockCities, 200);
  },
};

const SPEC_MAP: Record<string, string> = {
  "Cardiology": "Anxiety & Panic Therapy",
  "Dermatology": "Depression & Mood Care",
  "ENT": "Mindfulness & Personal Growth",
  "General Medicine": "Cognitive Behavioral Therapy (CBT)",
  "General Physician": "Cognitive Behavioral Therapy (CBT)",
  "Gynecology": "Couples & Relationship Therapy",
  "Neurology": "Burnout & Work Stress",
  "Ophthalmology": "Child & Adolescent Therapy",
  "Orthopaedics": "Trauma & Emotional Healing",
  "Orthopedics": "Trauma & Emotional Healing",
  "Pediatrics": "Child & Adolescent Therapy",
  "Psychiatry": "Depression & Mood Care",
};

const QUAL_MAP: Record<string, string> = {
  "MBBS, DM (Cardiology)": "Ph.D. Counseling Psychology",
  "MBBS, MD (General Medicine)": "M.Phil Clinical Psychology (RCI Reg)",
  "MBBS, DCH (Pediatrics)": "M.Sc Child & Adolescent Psychology",
  "MBBS, MS (Orthopedics)": "M.A. Trauma & EMDR Therapy Specialist",
  "MBBS, MS (ENT)": "M.A. Applied Psychology & Counseling",
  "MBBS, MD (Dermatology)": "Ph.D. Clinical Psychology",
  "MBBS, MS (Gynecology)": "M.A. Relationship & Couples Therapy",
  "MBBS, MD (Psychiatry)": "M.Phil Clinical Psychology",
};

const CLINIC_MAP: Record<string, string> = {
  "HeartCare Specialist Center": "Durrmi Mind & Wellbeing Hub",
  "MediSlot Care Clinic": "Durrmi Mind Care Center",
  "Little Angels Children Clinic": "Durrmi Youth Psychology Center",
  "OrthoJoint Bone Care": "Durrmi Healing & Wellness Center",
  "ENT & Hearing Care Center": "Durrmi Mindfulness Studio",
  "Apollo Health Clinic": "Durrmi Mind Care Center",
  "Skin & Laser Center": "Durrmi Mood & Wellbeing Center",
};

export function transformDoctorToTherapist(doc: DoctorDto): DoctorDto {
  const spec = SPEC_MAP[doc.specialization] || doc.specialization || "Anxiety & Panic Therapy";
  const qual = QUAL_MAP[doc.qualifications] || (doc.qualifications.includes("MBBS") ? "M.Phil Clinical Psychology, RCI Licensed" : doc.qualifications);
  const clinic = CLINIC_MAP[doc.clinicName] || (doc.clinicName.includes("MediSlot") ? doc.clinicName.replace("MediSlot", "Durrmi") : doc.clinicName);
  
  return {
    ...doc,
    specialization: spec,
    qualifications: qual,
    clinicName: clinic,
  };
}

const REVERSE_SPEC_MAP: Record<string, string> = {
  "Anxiety": "Cardiology",
  "Anxiety & Panic Therapy": "Cardiology",
  "Anxiety & Stress Therapy": "Cardiology",
  "Anxiety & Panic Specialist": "Cardiology",
  "Depression and low mood": "Dermatology",
  "Depression & Mood Care": "Dermatology",
  "Mindfulness & Personal Growth": "ENT",
  "Sleep": "ENT",
  "Sleep & Insomnia": "ENT",
  "Sleep & Insomnia Specialist": "ENT",
  "Sleep & Circadian Wellness Coach": "ENT",
  "Cognitive Behavioral Therapy (CBT)": "General Medicine",
  "Stress & Burnout": "General Medicine",
  "Stress & Burnout Specialist": "General Medicine",
  "Relationships": "Gynecology",
  "Couples & Relationship Therapy": "Gynecology",
  "Couples & Relationship Therapist": "Gynecology",
  "Burnout & Work Stress": "Neurology",
  "Career": "Neurology",
  "Career & Work Pressure": "Neurology",
  "Career & Mindset Coach": "Neurology",
  "Child & Adolescent Therapy": "Pediatrics",
  "ADHD": "Pediatrics",
  "ADHD & Attention": "Pediatrics",
  "ADHD & Neurodevelopmental Specialist": "Pediatrics",
  "Trauma & Emotional Healing": "Orthopaedics",
  "Loneliness": "General Medicine",
  "Loneliness & Isolation": "General Medicine",
  "Counseling Psychologist": "General Medicine",
};

const httpDoctorService: DoctorService = {
  async searchDoctors(params) {
    try {
      const apiParams: Record<string, any> = { ...params };
      if (params.specialization && REVERSE_SPEC_MAP[params.specialization]) {
        apiParams.specialization = REVERSE_SPEC_MAP[params.specialization];
      }

      const { data } = await apiClient.get<PageResponse<DoctorDto>>("/doctors", { params: apiParams });
      const transformedList = (data.content || []).map(transformDoctorToTherapist);

      // If backend filtered list matches, return it
      if (transformedList.length > 0) {
        return {
          ...data,
          content: transformedList,
        };
      }

      // If backend returned empty list due to SQL mismatch, fetch all doctors & filter client-side
      const { data: allData } = await apiClient.get<PageResponse<DoctorDto>>("/doctors", {
        params: { ...params, specialization: undefined, page: 0, size: 50 },
      });
      const allTransformed = (allData.content || []).map(transformDoctorToTherapist);
      
      const filtered = allTransformed.filter((doc) => {
        if (params.specialization && !matchesSpecialization(doc.specialization, params.specialization)) {
          return false;
        }
        if (params.city && doc.city !== params.city) return false;
        if (params.maxFee !== undefined && doc.consultationFee > params.maxFee) return false;
        if (params.query) {
          const q = params.query.trim().toLowerCase();
          if (!`${doc.fullName} ${doc.specialization} ${doc.clinicName} ${doc.qualifications}`.toLowerCase().includes(q))
            return false;
        }
        return true;
      });

      return {
        content: filtered.slice((params.page || 0) * (params.size || 6), (params.page || 0) * (params.size || 6) + (params.size || 6)),
        page: params.page || 0,
        size: params.size || 6,
        totalElements: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / (params.size || 6))),
      };
    } catch {
      return mockDoctorService.searchDoctors(params);
    }
  },
  async getDoctor(doctorId) {
    try {
      const { data } = await apiClient.get<DoctorDto>(`/doctors/${doctorId}`);
      return transformDoctorToTherapist(data);
    } catch {
      const fallback = mockDoctors.find((d) => d.id === doctorId) || mockDoctors[0];
      return fallback;
    }
  },
  async getAvailability(doctorId) {
    try {
      const { data } = await apiClient.get<AvailabilitySlotDto[]>(`/doctors/${doctorId}/availability`);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return generateFallbackSlots(doctorId);
    } catch {
      return generateFallbackSlots(doctorId);
    }
  },
  async createAvailability(payload) {
    const { data } = await apiClient.post<AvailabilitySlotDto[]>("/doctors/availability", payload);
    return data;
  },
  async getSpecializations() {
    try {
      const { data } = await apiClient.get<SpecializationDto[]>("/specializations");
      if (data && data.length > 0) {
        return mockSpecializations;
      }
      return mockSpecializations;
    } catch {
      return mockSpecializations;
    }
  },
  async getCities() {
    try {
      const { data } = await apiClient.get<string[]>("/doctors/cities");
      return data;
    } catch {
      return ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Chennai"];
    }
  },
};

export const doctorService: DoctorService = USE_MOCK_API ? mockDoctorService : httpDoctorService;
