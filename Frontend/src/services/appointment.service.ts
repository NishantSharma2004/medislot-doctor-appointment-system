import { apiClient } from "@/lib/api/client";
import { mockAppointments, mockDoctors } from "@/lib/api/mock-data";
import type {
  AppointmentDto,
  AppointmentStatus,
  CreateAppointmentRequest,
  PageResponse,
} from "@/lib/api/types";
import { USE_MOCK_API, createMockRateLimiter, delay, mockError } from "./config";
import { _mockSlots } from "./doctor.service";

/**
 * Appointment service interface.
 *
 * Backend endpoints:
 *   POST   /api/v1/appointments
 *   GET    /api/v1/appointments/my
 *   PATCH  /api/v1/appointments/{appointmentId}/status
 *   PATCH  /api/v1/appointments/{appointmentId}/reschedule
 *   DELETE /api/v1/appointments/{appointmentId}
 */
export interface AppointmentService {
  book(payload: CreateAppointmentRequest): Promise<AppointmentDto>;
  myAppointments(params?: { page?: number; size?: number; status?: AppointmentStatus }): Promise<
    PageResponse<AppointmentDto>
  >;
  updateStatus(appointmentId: string, status: AppointmentStatus): Promise<AppointmentDto>;
  savePrescription(appointmentId: string, payload: import("@/lib/api/types").SavePrescriptionRequest): Promise<AppointmentDto>;
  reschedule(appointmentId: string, slotId: string): Promise<AppointmentDto>;
  cancel(appointmentId: string): Promise<void>;
}

const store: AppointmentDto[] = [...mockAppointments];
const bookingLimiter = createMockRateLimiter(6, 20_000);

function paginate(items: AppointmentDto[], page: number, size: number): PageResponse<AppointmentDto> {
  return {
    content: items.slice(page * size, page * size + size),
    page,
    size,
    totalElements: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
  };
}

const mockAppointmentService: AppointmentService = {
  async book({ doctorId, slotId, reason, medicalDocumentUrl, medicalDocumentName }) {
    const limited = bookingLimiter();
    if (limited) return mockError(limited);

    const slot = _mockSlots().find((s) => s.id === slotId);
    const doctor = mockDoctors.find((d) => d.id === doctorId);
    if (!slot || !doctor)
      return mockError({ status: 404, code: "NOT_FOUND", message: "That slot is no longer listed." });

    // Double-booking prevention (the backend enforces this with a DB constraint).
    if (slot.booked || store.some((a) => a.slotId === slotId && a.status !== "CANCELLED")) {
      return mockError({
        status: 409,
        code: "CONFLICT",
        message: "That time slot has just been booked. Please choose another one.",
      });
    }

    slot.booked = true;
    const appointment: AppointmentDto = {
      id: `apt-${Date.now()}`,
      doctorId,
      doctorName: doctor.fullName,
      specialization: doctor.specialization,
      patientId: "usr-patient-1",
      patientName: "Riya Sharma",
      slotId,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: "PENDING",
      reason,
      medicalDocumentUrl,
      medicalDocumentName,
      consultationFee: doctor.consultationFee,
    };
    store.unshift(appointment);
    return delay(appointment);
  },

  async myAppointments({ page = 0, size = 5, status } = {}) {
    const items = store
      .filter((a) => (status ? a.status === status : true))
      .sort((a, b) => `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`));
    return delay(paginate(items, page, size));
  },

  async updateStatus(appointmentId, status) {
    const appointment = store.find((a) => a.id === appointmentId);
    if (!appointment)
      return mockError({ status: 404, code: "NOT_FOUND", message: "Appointment not found." });
    appointment.status = status;
    return delay(appointment);
  },

  async savePrescription(appointmentId, payload) {
    const appointment = store.find((a) => a.id === appointmentId);
    if (!appointment)
      return mockError({ status: 404, code: "NOT_FOUND", message: "Appointment not found." });
    appointment.diagnosis = payload.diagnosis;
    appointment.prescriptionJson = payload.prescriptionJson;
    appointment.labTests = payload.labTests;
    appointment.followUpDate = payload.followUpDate;
    appointment.notes = payload.notes;
    appointment.status = "COMPLETED";
    return delay(appointment);
  },

  async reschedule(appointmentId, slotId) {
    const appointment = store.find((a) => a.id === appointmentId);
    const slot = _mockSlots().find((s) => s.id === slotId);
    if (!appointment || !slot)
      return mockError({ status: 404, code: "NOT_FOUND", message: "Appointment or slot not found." });
    if (slot.booked)
      return mockError({
        status: 409,
        code: "CONFLICT",
        message: "That time slot is already taken. Please choose another one.",
      });

    const previous = _mockSlots().find((s) => s.id === appointment.slotId);
    if (previous) previous.booked = false;
    slot.booked = true;
    appointment.slotId = slot.id;
    appointment.date = slot.date;
    appointment.startTime = slot.startTime;
    appointment.endTime = slot.endTime;
    appointment.status = "PENDING";
    return delay(appointment);
  },

  async cancel(appointmentId) {
    const appointment = store.find((a) => a.id === appointmentId);
    if (!appointment)
      return mockError({ status: 404, code: "NOT_FOUND", message: "Appointment not found." });
    appointment.status = "CANCELLED";
    const slot = _mockSlots().find((s) => s.id === appointment.slotId);
    if (slot) slot.booked = false;
    await delay(null);
  },
};

const httpAppointmentService: AppointmentService = {
  async book(payload) {
    const { data } = await apiClient.post<AppointmentDto>("/appointments", payload);
    return data;
  },
  async myAppointments(params) {
    const { data } = await apiClient.get<PageResponse<AppointmentDto>>("/appointments/my", { params });
    return data;
  },
  async updateStatus(appointmentId, status) {
    const { data } = await apiClient.patch<AppointmentDto>(`/appointments/${appointmentId}/status`, {
      status,
    });
    return data;
  },
  async savePrescription(appointmentId, payload) {
    const { data } = await apiClient.post<AppointmentDto>(`/appointments/${appointmentId}/prescription`, payload);
    return data;
  },
  async reschedule(appointmentId, slotId) {
    const { data } = await apiClient.patch<AppointmentDto>(
      `/appointments/${appointmentId}/reschedule`,
      { slotId },
    );
    return data;
  },
  async cancel(appointmentId) {
    await apiClient.delete(`/appointments/${appointmentId}`);
  },
};

export const appointmentService: AppointmentService = USE_MOCK_API
  ? mockAppointmentService
  : httpAppointmentService;
