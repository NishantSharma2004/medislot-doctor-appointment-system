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

/**
 * Doctor / availability service interface.
 *
 * Backend endpoints:
 *   GET   /api/v1/doctors
 *   GET   /api/v1/doctors/{doctorId}
 *   GET   /api/v1/doctors/{doctorId}/availability
 *   POST  /api/v1/doctors/availability
 */
export interface DoctorService {
  searchDoctors(params: DoctorSearchParams): Promise<PageResponse<DoctorDto>>;
  getDoctor(doctorId: string): Promise<DoctorDto>;
  getAvailability(doctorId: string): Promise<AvailabilitySlotDto[]>;
  createAvailability(payload: CreateAvailabilityRequest): Promise<AvailabilitySlotDto[]>;
  getSpecializations(): Promise<SpecializationDto[]>;
  getCities(): Promise<string[]>;
}

const mockSlotStore: AvailabilitySlotDto[] = [...mockSlots];

/** Exposed so the appointment mock service can mark slots as booked. */
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
    const doctorId = "doc-1"; // the backend derives this from the JWT subject
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

const httpDoctorService: DoctorService = {
  async searchDoctors(params) {
    const { data } = await apiClient.get<PageResponse<DoctorDto>>("/doctors", { params });
    return data;
  },
  async getDoctor(doctorId) {
    const { data } = await apiClient.get<DoctorDto>(`/doctors/${doctorId}`);
    return data;
  },
  async getAvailability(doctorId) {
    const { data } = await apiClient.get<AvailabilitySlotDto[]>(`/doctors/${doctorId}/availability`);
    return data;
  },
  async createAvailability(payload) {
    const { data } = await apiClient.post<AvailabilitySlotDto[]>("/doctors/availability", payload);
    return data;
  },
  async getSpecializations() {
    const { data } = await apiClient.get<SpecializationDto[]>("/specializations");
    return data;
  },
  async getCities() {
    const { data } = await apiClient.get<string[]>("/doctors/cities");
    return data;
  },
};

export const doctorService: DoctorService = USE_MOCK_API ? mockDoctorService : httpDoctorService;
