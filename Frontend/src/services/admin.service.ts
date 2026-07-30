import { apiClient } from "@/lib/api/client";
import { mockAppointments, mockDoctors, mockPatients } from "@/lib/api/mock-data";
import type { AppointmentDto, DoctorDto, PageResponse, UserDto } from "@/lib/api/types";
import { USE_MOCK_API, delay } from "./config";

/**
 * Admin service — read/monitor views over doctors, patients and appointments.
 * Every call is authorized server-side by the ADMIN role.
 */
export interface AdminService {
  listDoctors(page?: number, size?: number): Promise<PageResponse<DoctorDto>>;
  listPatients(page?: number, size?: number): Promise<PageResponse<UserDto>>;
  listAppointments(page?: number, size?: number): Promise<PageResponse<AppointmentDto>>;
}

function paginate<T>(items: T[], page: number, size: number): PageResponse<T> {
  return {
    content: items.slice(page * size, page * size + size),
    page,
    size,
    totalElements: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
  };
}

const mockAdminService: AdminService = {
  async listDoctors(page = 0, size = 5) {
    return delay(paginate(mockDoctors, page, size));
  },
  async listPatients(page = 0, size = 5) {
    return delay(paginate(mockPatients, page, size));
  },
  async listAppointments(page = 0, size = 5) {
    return delay(paginate(mockAppointments, page, size));
  },
};

const httpAdminService: AdminService = {
  async listDoctors(page = 0, size = 5) {
    const { data } = await apiClient.get<PageResponse<DoctorDto>>("/admin/doctors", {
      params: { page, size },
    });
    return data;
  },
  async listPatients(page = 0, size = 5) {
    const { data } = await apiClient.get<PageResponse<UserDto>>("/admin/patients", {
      params: { page, size },
    });
    return data;
  },
  async listAppointments(page = 0, size = 5) {
    const { data } = await apiClient.get<PageResponse<AppointmentDto>>("/admin/appointments", {
      params: { page, size },
    });
    return data;
  },
};

export const adminService: AdminService = USE_MOCK_API ? mockAdminService : httpAdminService;
