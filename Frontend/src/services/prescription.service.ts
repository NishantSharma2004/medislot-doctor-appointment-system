import { apiClient } from "@/lib/api/client";
import type { PrescriptionDto } from "@/lib/api/types";
import { USE_MOCK_API } from "./config";

const mockPrescriptionStore = new Map<string, PrescriptionDto>();

export const prescriptionService = {
  async createPrescription(payload: {
    appointmentId: string;
    diagnosis: string;
    symptoms?: string;
    medicines?: Array<{
      medicineName: string;
      dosage?: string;
      frequency?: string;
      timing?: string;
      durationDays?: string;
    }>;
    labTestsRecommended?: string;
    clinicalAdvice?: string;
    followUpDate?: string;
  }): Promise<PrescriptionDto> {
    if (USE_MOCK_API) {
      const rxNumber = `RX-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
      const rx: PrescriptionDto = {
        id: `rx-mock-${Date.now()}`,
        rxNumber,
        appointmentId: payload.appointmentId,
        doctorId: "d1000001-0000-4000-8000-000000000001",
        doctorName: "Dr. Rajesh Sharma",
        doctorRegistrationNumber: "REG-DEL-101",
        doctorSpecialization: "General Physician",
        clinicName: "Apollo Health Clinic",
        patientId: "patient-1",
        patientName: "Patient",
        diagnosis: payload.diagnosis,
        symptoms: payload.symptoms,
        medicines: (payload.medicines || []).map((m) => ({
          medicineName: m.medicineName,
          dosage: m.dosage,
          frequency: m.frequency,
          timing: m.timing,
          durationDays: m.durationDays,
        })),
        labTestsRecommended: payload.labTestsRecommended,
        clinicalAdvice: payload.clinicalAdvice,
        followUpDate: payload.followUpDate,
        createdAt: new Date().toISOString(),
      };
      mockPrescriptionStore.set(payload.appointmentId, rx);
      return rx;
    }

    const { data } = await apiClient.post<PrescriptionDto>("/prescriptions", payload);
    return data;
  },

  async getPrescriptionByAppointment(appointmentId: string): Promise<PrescriptionDto> {
    if (USE_MOCK_API) {
      const existing = mockPrescriptionStore.get(appointmentId);
      if (existing) return existing;

      // Safe fallback mock prescription if created in session
      return {
        id: `rx-fallback-${appointmentId}`,
        rxNumber: `RX-20260814-1001`,
        appointmentId,
        doctorId: "d1000001-0000-4000-8000-000000000001",
        doctorName: "Dr. Rajesh Sharma",
        doctorRegistrationNumber: "REG-DEL-101",
        doctorSpecialization: "General Physician & Primary Care",
        clinicName: "Apollo Health Clinic",
        patientId: "patient-1",
        patientName: "Patient",
        diagnosis: "Type 2 Diabetes & Mild Essential Hypertension",
        symptoms: "Fasting blood sugar 145 mg/dL, mild headache, tiredness.",
        medicines: [
          { medicineName: "Metformin 500mg", dosage: "500mg", frequency: "1-0-1", timing: "After Food", durationDays: "30 Days" },
          { medicineName: "Telmisartan 40mg", dosage: "40mg", frequency: "1-0-0", timing: "Morning Before Breakfast", durationDays: "30 Days" },
          { medicineName: "Multivitamin Extra", dosage: "1 Tab", frequency: "0-0-1", timing: "After Dinner", durationDays: "15 Days" },
        ],
        labTestsRecommended: "HbA1c, Serum Creatinine, Fasting Lipid Profile after 30 days.",
        clinicalAdvice: "Avoid sugar, refined carbs and sodium (>2g/day). Perform 30 mins brisk walking daily.",
        followUpDate: "2026-09-15",
        createdAt: new Date().toISOString(),
      };
    }

    const { data } = await apiClient.get<PrescriptionDto>(`/prescriptions/appointment/${appointmentId}`);
    return data;
  },
};
