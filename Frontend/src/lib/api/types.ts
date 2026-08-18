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
  | "IN_CONSULTATION"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED"
  | "MISSED"
  | "SKIPPED";

export interface UserDto {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  profileImageUrl?: string;
  noShowCount?: number;
  totalMissedVisits?: number;
  isCashBookingSuspended?: boolean;
  totalAccumulatedDues?: number;
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
  tokenNumber?: number;
  paymentMode?: string;
  paymentStatus?: string;
  razorpayOrderId?: string;
  penaltyAmount?: number;
  doctorActionStatus?: string;
  rejectionReason?: string;
  patientNoShowCount?: number;
  patientTotalMissedVisits?: number;
  isCashBookingSuspended?: boolean;
  patientTotalAccumulatedDues?: number;
}

export interface OpdQueueResponse {
  doctorId: string;
  doctorName: string;
  date: string;
  currentlyServingToken?: number;
  currentlyServingPatientName?: string;
  totalTokensToday: number;
  remainingPatients: number;
  queue: AppointmentDto[];
}

export interface CreateAppointmentRequest {
  doctorId: string;
  slotId: string;
  reason?: string;
  medicalDocumentUrl?: string;
  medicalDocumentName?: string;
  paymentMode?: string;
}

export interface PrescriptionMedicine {
  id?: string;
  name?: string;
  medicineName?: string;
  dosage?: string;
  frequency?: string;
  timing?: string;
  duration?: string;
  durationDays?: string;
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
  hasAvailableSlots?: boolean;
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

export type NotificationType =
  | "APPOINTMENT_CONFIRMED"
  | "APPOINTMENT_CANCELLED"
  | "PRESCRIPTION_GENERATED"
  | "APPOINTMENT_REMINDER"
  | "SYSTEM";

export interface NotificationDto {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  targetUrl?: string;
}

export interface HealthVitalDto {
  id: string;
  patientId: string;
  logDate: string; // yyyy-MM-dd
  fastingGlucose?: number; // mg/dL
  postPrandialGlucose?: number; // mg/dL
  systolicBp?: number; // mmHg
  diastolicBp?: number; // mmHg
  weightKg?: number; // kg
  heightCm?: number; // cm
  bmi?: number; // auto-calculated
  heartRateBpm?: number; // bpm
  notes?: string;
  createdAt: string;
}

export interface DoctorReviewDto {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  rating: number; // 1 - 5
  comment: string;
  verifiedPatient: boolean;
  createdAt: string;
}

export type DosageTiming = "MORNING" | "AFTERNOON" | "NIGHT";

export interface PillLogDto {
  id: string;
  userId?: string;
  medicineName: string;
  dosage: string;
  timing: DosageTiming;
  taken: boolean;
  takenAt?: string;
  date: string; // YYYY-MM-DD
  doctorName?: string;
  prescriptionId?: string;
  notes?: string;
}

export interface PrescriptionDto {
  id: string;
  rxNumber: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  doctorRegistrationNumber?: string;
  doctorSpecialization?: string;
  clinicName?: string;
  patientId: string;
  patientName: string;
  diagnosis?: string;
  symptoms?: string;
  medicines: PrescriptionMedicine[];
  labTestsRecommended?: string;
  clinicalAdvice?: string;
  followUpDate?: string;
  createdAt: string;
}
