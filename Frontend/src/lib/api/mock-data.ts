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
];

export const mockCities = ["Bengaluru", "Chennai", "Hyderabad", "Pune"];

export const mockDoctors: DoctorDto[] = [
  {
    id: "doc-1",
    fullName: "Dr. Ananya Rao",
    specialization: "General Medicine",
    qualifications: "MBBS, MD (General Medicine)",
    yearsOfExperience: 11,
    consultationFee: 600,
    clinicName: "Northline Clinic",
    city: "Bengaluru",
    languages: ["English", "Hindi", "Kannada"],
    about:
      "Consults on routine health concerns, preventive check-ups and follow-up care for long-term conditions.",
    registrationNumber: "KMC-114523",
  },
  {
    id: "doc-2",
    fullName: "Dr. Vikram Shetty",
    specialization: "Cardiology",
    qualifications: "MBBS, DM (Cardiology)",
    yearsOfExperience: 16,
    consultationFee: 1200,
    clinicName: "Northline Clinic",
    city: "Bengaluru",
    languages: ["English", "Tulu"],
    about:
      "Consults on cardiac follow-up appointments, report reviews and post-procedure care planning.",
    registrationNumber: "KMC-098211",
  },
  {
    id: "doc-3",
    fullName: "Dr. Meera Krishnan",
    specialization: "Dermatology",
    qualifications: "MBBS, MD (Dermatology)",
    yearsOfExperience: 8,
    consultationFee: 750,
    clinicName: "Riverside Care Centre",
    city: "Chennai",
    languages: ["English", "Tamil"],
    about: "Consults on skin, hair and nail concerns, including scheduled review appointments.",
    registrationNumber: "TNMC-556190",
  },
  {
    id: "doc-4",
    fullName: "Dr. Imran Qureshi",
    specialization: "Pediatrics",
    qualifications: "MBBS, DCH",
    yearsOfExperience: 13,
    consultationFee: 700,
    clinicName: "Riverside Care Centre",
    city: "Hyderabad",
    languages: ["English", "Hindi", "Telugu"],
    about: "Consults on child growth reviews, immunisation schedules and routine paediatric visits.",
    registrationNumber: "TSMC-330871",
  },
  {
    id: "doc-5",
    fullName: "Dr. Sneha Kulkarni",
    specialization: "Orthopaedics",
    qualifications: "MBBS, MS (Orthopaedics)",
    yearsOfExperience: 10,
    consultationFee: 900,
    clinicName: "Hillview Polyclinic",
    city: "Pune",
    languages: ["English", "Marathi", "Hindi"],
    about: "Consults on joint and mobility concerns, post-operative reviews and physiotherapy referrals.",
    registrationNumber: "MMC-771204",
  },
  {
    id: "doc-6",
    fullName: "Dr. Rahul Nair",
    specialization: "ENT",
    qualifications: "MBBS, MS (ENT)",
    yearsOfExperience: 7,
    consultationFee: 650,
    clinicName: "Hillview Polyclinic",
    city: "Pune",
    languages: ["English", "Malayalam"],
    about: "Consults on ear, nose and throat concerns and scheduled review appointments.",
    registrationNumber: "MMC-812345",
  },
  {
    id: "doc-7",
    fullName: "Dr. Priya Menon",
    specialization: "General Medicine",
    qualifications: "MBBS, DNB (Family Medicine)",
    yearsOfExperience: 9,
    consultationFee: 550,
    clinicName: "Riverside Care Centre",
    city: "Chennai",
    languages: ["English", "Tamil", "Malayalam"],
    about: "Consults on general health reviews, health record updates and referral coordination.",
    registrationNumber: "TNMC-441097",
  },
  {
    id: "doc-8",
    fullName: "Dr. Arjun Desai",
    specialization: "Cardiology",
    qualifications: "MBBS, MD, DM (Cardiology)",
    yearsOfExperience: 14,
    consultationFee: 1100,
    clinicName: "Hillview Polyclinic",
    city: "Hyderabad",
    languages: ["English", "Gujarati", "Hindi"],
    about: "Consults on scheduled cardiac reviews and follow-up appointments.",
    registrationNumber: "TSMC-190228",
  },
];

function isoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const TIME_BLOCKS: Array<[string, string]> = [
  ["09:00", "09:30"],
  ["09:30", "10:00"],
  ["10:00", "10:30"],
  ["11:00", "11:30"],
  ["15:00", "15:30"],
  ["16:00", "16:30"],
  ["17:30", "18:00"],
];

export const mockSlots: AvailabilitySlotDto[] = mockDoctors.flatMap((doctor, doctorIndex) =>
  [1, 2, 3].flatMap((dayOffset) =>
    TIME_BLOCKS.map(([startTime, endTime], blockIndex) => ({
      id: `slot-${doctor.id}-${dayOffset}-${blockIndex}`,
      doctorId: doctor.id,
      date: isoDate(dayOffset),
      startTime,
      endTime,
      booked: (doctorIndex + dayOffset + blockIndex) % 5 === 0,
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
