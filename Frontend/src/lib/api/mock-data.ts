import type {
  AppointmentDto,
  AvailabilitySlotDto,
  DoctorDto,
  SpecializationDto,
  UserDto,
} from "./types";

/**
 * Mock JSON data. Shapes match the Spring Boot DTOs exactly, so swapping the
 * mock service for real Axios calls requires no UI changes.
 * Contains no ratings, testimonials or medical claims.
 */

export const mockSpecializations: SpecializationDto[] = [
  { id: "sp-1", name: "General Medicine" },
  { id: "sp-2", name: "Cardiology" },
  { id: "sp-3", name: "Dermatology" },
  { id: "sp-4", name: "Pediatrics" },
  { id: "sp-5", name: "Orthopaedics" },
  { id: "sp-6", name: "ENT" },
  { id: "sp-7", name: "Neurology" },
  { id: "sp-8", name: "Gynecology" },
  { id: "sp-9", name: "Ophthalmology" },
  { id: "sp-10", name: "Psychiatry" },
  { id: "sp-11", name: "Dental" },
];

export const mockCities = ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Pune"];

export const mockDoctors: DoctorDto[] = [
  {
    id: "d1000001-0000-4000-8000-000000000001",
    fullName: "Dr. Rajesh Sharma",
    specialization: "General Medicine",
    qualifications: "MBBS, MD (General Medicine)",
    yearsOfExperience: 14,
    consultationFee: 500,
    clinicName: "Apollo Health Clinic",
    city: "Delhi",
    languages: ["English", "Hindi"],
    about: "Experienced Senior Physician specializing in preventative medicine, diabetes care, and lifestyle health management.",
    registrationNumber: "REG-DEL-101",
  },
  {
    id: "d1000001-0000-4000-8000-000000000002",
    fullName: "Dr. Ananya Roy",
    specialization: "Cardiology",
    qualifications: "MBBS, DM (Cardiology)",
    yearsOfExperience: 18,
    consultationFee: 800,
    clinicName: "HeartCare Specialist Center",
    city: "Mumbai",
    languages: ["English", "Hindi", "Bengali"],
    about: "Interventional Cardiologist focused on coronary artery disease, heart failure prevention, and echocardiography.",
    registrationNumber: "REG-MUM-202",
  },
  {
    id: "d1000001-0000-4000-8000-000000000003",
    fullName: "Dr. Vikram Patel",
    specialization: "Dermatology",
    qualifications: "MBBS, MD (Dermatology)",
    yearsOfExperience: 10,
    consultationFee: 750,
    clinicName: "Skin & Laser Center",
    city: "Bengaluru",
    languages: ["English", "Hindi", "Kannada"],
    about: "Consults on skin, hair and nail concerns, acne treatments and scheduled review appointments.",
    registrationNumber: "REG-BLR-303",
  },
  {
    id: "d1000001-0000-4000-8000-000000000004",
    fullName: "Dr. Priya Nair",
    specialization: "Orthopedics",
    qualifications: "MBBS, MS (Orthopedics)",
    yearsOfExperience: 13,
    consultationFee: 900,
    clinicName: "Joint & Spine Clinic",
    city: "Chennai",
    languages: ["English", "Tamil", "Hindi"],
    about: "Consults on joint mobility, fracture follow-ups and spine care planning.",
    registrationNumber: "REG-CHE-404",
  },
  {
    id: "d1000001-0000-4000-8000-000000000005",
    fullName: "Dr. Amit Verma",
    specialization: "Pediatrics",
    qualifications: "MBBS, MD (Pediatrics)",
    yearsOfExperience: 12,
    consultationFee: 650,
    clinicName: "Child Health Center",
    city: "Hyderabad",
    languages: ["English", "Hindi", "Telugu"],
    about: "Consults on child growth reviews, immunisation schedules and routine paediatric visits.",
    registrationNumber: "REG-HYD-505",
  },
  {
    id: "d1000001-0000-4000-8000-000000000006",
    fullName: "Dr. Sunita Kulkarni",
    specialization: "ENT",
    qualifications: "MBBS, MS (ENT)",
    yearsOfExperience: 15,
    consultationFee: 700,
    clinicName: "ENT Care Clinic",
    city: "Pune",
    languages: ["English", "Marathi", "Hindi"],
    about: "Consults on sinus issues, hearing reviews, and throat care appointments.",
    registrationNumber: "REG-PUN-606",
  },
];

function isoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const TIME_BLOCKS: Array<[string, string]> = [
  ["09:00", "09:30"],
  ["10:00", "10:30"],
  ["11:00", "11:30"],
  ["14:00", "14:30"],
  ["15:30", "16:00"],
  ["17:00", "17:30"],
  ["19:00", "19:30"],
  ["20:00", "20:30"],
  ["21:00", "21:30"],
];

export const mockSlots: AvailabilitySlotDto[] = mockDoctors.flatMap((doctor, doctorIndex) =>
  [0, 1, 2, 3, 4, 5].flatMap((dayOffset) =>
    TIME_BLOCKS.map(([startTime, endTime], blockIndex) => ({
      id: `slot-${doctor.id}-${dayOffset}-${blockIndex}`,
      doctorId: doctor.id,
      date: isoDate(dayOffset),
      startTime,
      endTime,
      booked: (doctorIndex + dayOffset + blockIndex) % 7 === 0,
    })),
  ),
);

export const mockPatient: UserDto = {
  id: "usr-patient-1",
  fullName: "Riya Sharma",
  email: "patient@medislot.test",
  phone: "9876543210",
  role: "PATIENT",
};

export const mockDoctorUser: UserDto = {
  id: "doc-1",
  fullName: "Dr. Ananya Rao",
  email: "doctor@medislot.test",
  phone: "9876500011",
  role: "DOCTOR",
};

export const mockAdminUser: UserDto = {
  id: "usr-admin-1",
  fullName: "Clinic Administrator",
  email: "admin@medislot.test",
  phone: "9876500022",
  role: "ADMIN",
};

export const mockAppointments: AppointmentDto[] = [
  {
    id: "apt-1",
    doctorId: "doc-1",
    doctorName: "Dr. Ananya Rao",
    specialization: "General Medicine",
    patientId: "usr-patient-1",
    patientName: "Riya Sharma",
    slotId: "slot-doc-1-1-1",
    date: isoDate(1),
    startTime: "09:30",
    endTime: "10:00",
    status: "CONFIRMED",
    reason: "Routine health review",
    consultationFee: 600,
  },
  {
    id: "apt-2",
    doctorId: "doc-3",
    doctorName: "Dr. Meera Krishnan",
    specialization: "Dermatology",
    patientId: "usr-patient-1",
    patientName: "Riya Sharma",
    slotId: "slot-doc-3-2-2",
    date: isoDate(2),
    startTime: "10:00",
    endTime: "10:30",
    status: "PENDING",
    reason: "Follow-up review",
    consultationFee: 750,
  },
  {
    id: "apt-3",
    doctorId: "doc-1",
    doctorName: "Dr. Ananya Rao",
    specialization: "General Medicine",
    patientId: "usr-patient-2",
    patientName: "Kabir Anand",
    slotId: "slot-doc-1-2-3",
    date: isoDate(2),
    startTime: "11:00",
    endTime: "11:30",
    status: "PENDING",
    reason: "Report review",
    consultationFee: 600,
  },
  {
    id: "apt-4",
    doctorId: "doc-1",
    doctorName: "Dr. Ananya Rao",
    specialization: "General Medicine",
    patientId: "usr-patient-3",
    patientName: "Neha Gupta",
    slotId: "slot-doc-1-3-0",
    date: isoDate(-4),
    startTime: "09:00",
    endTime: "09:30",
    status: "COMPLETED",
    reason: "Consultation",
    consultationFee: 600,
  },
  {
    id: "apt-5",
    doctorId: "doc-5",
    doctorName: "Dr. Sneha Kulkarni",
    specialization: "Orthopaedics",
    patientId: "usr-patient-1",
    patientName: "Riya Sharma",
    slotId: "slot-doc-5-1-4",
    date: isoDate(-9),
    startTime: "15:00",
    endTime: "15:30",
    status: "CANCELLED",
    reason: "Mobility review",
    consultationFee: 900,
  },
];

export const mockPatients: UserDto[] = [
  mockPatient,
  { id: "usr-patient-2", fullName: "Kabir Anand", email: "kabir@example.test", phone: "9812345678", role: "PATIENT" },
  { id: "usr-patient-3", fullName: "Neha Gupta", email: "neha@example.test", phone: "9823456789", role: "PATIENT" },
  { id: "usr-patient-4", fullName: "Sameer Iqbal", email: "sameer@example.test", phone: "9834567890", role: "PATIENT" },
];

/** Verified clinic documents used by the backend RAG pipeline (titles only here). */
export const mockKnowledgeBase = [
  {
    title: "Clinic Appointment Policy",
    section: "Rescheduling and cancellation",
    keywords: ["cancel", "reschedule", "policy", "refund", "late", "no-show"],
    answer:
      "Appointments can be rescheduled or cancelled up to 4 hours before the scheduled start time from the My Appointments page. Cancellations inside 4 hours are marked as late cancellations and the clinic may apply its standard late-cancellation charge.",
    evidenceStrength: "STRONG" as const,
  },
  {
    title: "Patient Handbook",
    section: "Booking an appointment",
    keywords: ["book", "booking", "slot", "appointment", "how", "confirm"],
    answer:
      "To book, open Find a doctor, filter by specialization, city or consultation fee, open a doctor profile and choose an available slot. Your booking is only confirmed after the confirmation screen shows a booking reference.",
    evidenceStrength: "STRONG" as const,
  },
  {
    title: "Specialization Directory",
    section: "Choosing a department",
    keywords: ["specialization", "department", "which doctor", "cardiology", "skin", "child", "bone", "ent"],
    answer:
      "The clinic lists General Medicine, Cardiology, Dermatology, Pediatrics, Orthopaedics and ENT. If you are unsure which department fits your visit, General Medicine can review your case and refer you internally.",
    evidenceStrength: "MODERATE" as const,
  },
  {
    title: "Clinic Operations Guide",
    section: "Visiting hours and documents",
    keywords: ["timing", "hours", "open", "documents", "id", "reports", "arrive"],
    answer:
      "Consultation hours are 09:00 to 18:00, Monday to Saturday. Please arrive 10 minutes early and carry a photo ID plus any previous prescriptions or reports relevant to the visit.",
    evidenceStrength: "STRONG" as const,
  },
];
