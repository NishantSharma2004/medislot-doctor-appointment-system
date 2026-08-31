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

const mockDoctorService: DoctorService = {
  async searchDoctors({ query, specialization, city, maxFee, page = 0, size = 6 }) {
    const q = query?.trim().toLowerCase();
    const filtered = mockDoctors.filter((doctor) => {
      if (q && !`${doctor.fullName} ${doctor.specialization} ${doctor.clinicName}`.toLowerCase().includes(q))
        return false;
      if (specialization && doctor.specialization !== specialization) return false;
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
    return delay(
      mockSlotStore
        .filter((slot) => slot.doctorId === doctorId)
        .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)),
    );
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

const httpDoctorService: DoctorService = {
  async searchDoctors(params) {
    try {
      const { data } = await apiClient.get<PageResponse<DoctorDto>>("/doctors", { params });
      return {
        ...data,
        content: (data.content || []).map(transformDoctorToTherapist),
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
      return transformDoctorToTherapist(fallback);
    }
  },
  async getAvailability(doctorId) {
    try {
      const { data } = await apiClient.get<AvailabilitySlotDto[]>(`/doctors/${doctorId}/availability`);
      return data;
    } catch {
      return mockSlotStore.filter((s) => s.doctorId === doctorId);
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
