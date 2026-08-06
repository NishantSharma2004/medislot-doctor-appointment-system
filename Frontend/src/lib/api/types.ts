/**
 * Shared API types.
 *
 * These mirror the DTOs exposed by the Spring Boot backend.
 * The React app never talks to the database — only to these DTO shapes.
 */

export type Role = "PATIENT" | "DOCTOR" | "ADMIN";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SpecializationDto {
  id: string;
  name: string;
}

export interface DoctorDto {
  id: string;
  fullName: string;
  specialization: string;
  qualifications: string;
  yearsOfExperience: number;
  consultationFee: number;
  clinicName: string;
  city: string;
  languages: string[];
  about: string;
  registrationNumber: string;
}

export interface AvailabilitySlotDto {
  id: string;
  doctorId: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  booked: boolean;
}

export interface CreateAvailabilityRequest {
  date: string;
  startTime: string;
  endTime: string;
  slotMinutes: number;
}

export interface AppointmentDto {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  patientGender?: string;
  patientDateOfBirth?: string;
  patientAge?: number;
  patientCity?: string;
  patientAddress?: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  medicalDocumentUrl?: string;
  medicalDocumentName?: string;
  diagnosis?: string;
  prescriptionJson?: string;
  labTests?: string;
  followUpDate?: string;
  consultationFee: number;
}

export interface CreateAppointmentRequest {
  doctorId: string;
  slotId: string;
  reason?: string;
  medicalDocumentUrl?: string;
  medicalDocumentName?: string;
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface SavePrescriptionRequest {
  diagnosis?: string;
  prescriptionJson?: string;
  labTests?: string;
  followUpDate?: string;
  notes?: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface DoctorSearchParams {
  query?: string;
  specialization?: string;
  city?: string;
  maxFee?: number;
  page?: number;
  size?: number;
}

export type EvidenceStrength = "STRONG" | "MODERATE" | "LIMITED" | "NONE";

export interface AssistantSource {
  title: string;
  section?: string;
  evidenceStrength: EvidenceStrength;
}

export interface DoctorMatchInfo {
  doctorId: string;
  doctorName: string;
  specialization: string;
  qualifications: string;
  consultationFee: number;
  triageLevel: "EMERGENCY" | "URGENT" | "ROUTINE";
  reason: string;
}

export interface LabParameter {
  name: string;
  value: string;
  normalRange: string;
  status: "HIGH" | "LOW" | "NORMAL";
}

export interface ReportAnalysisData {
  fileName?: string;
  summaryHindi: string;
  summaryEnglish: string;
  parameters: LabParameter[];
  dietAdvice: string[];
}

export interface AssistantReply {
  answer: string;
  sources: AssistantSource[];
  sufficientEvidence: boolean;
  disclaimer: string;
  doctorMatch?: DoctorMatchInfo;
  isReportSummary?: boolean;
  reportAnalysis?: ReportAnalysisData;
}

/** Normalized error shape produced by the Axios client for the whole UI. */
export interface ApiError {
  status: number;
  code:
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "CONFLICT"
    | "RATE_LIMITED"
    | "VALIDATION"
    | "NOT_FOUND"
    | "SERVER"
    | "NETWORK";
  message: string;
  /** Seconds to wait, parsed from the Retry-After header on HTTP 429. */
  retryAfterSeconds?: number;
  fieldErrors?: Record<string, string>;
}
