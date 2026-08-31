import type {
  AppointmentDto,
  AvailabilitySlotDto,
  DoctorDto,
  SpecializationDto,
  UserDto,
} from "./types";

/**
 * Mock JSON data for Durrmi Therapy & Mental Health Consultation Platform.
 * Shapes match Spring Boot DTOs.
 */

export const mockSpecializations: SpecializationDto[] = [
  { id: "sp-1", name: "Anxiety & Stress Therapy" },
  { id: "sp-2", name: "Depression & Mood Care" },
  { id: "sp-3", name: "Couples & Relationship Counselling" },
  { id: "sp-4", name: "Trauma & Emotional Healing" },
  { id: "sp-5", name: "Cognitive Behavioral Therapy (CBT)" },
  { id: "sp-6", name: "Burnout & Career Stress" },
  { id: "sp-7", name: "Child & Teen Psychology" },
  { id: "sp-8", name: "Mindfulness & Personal Growth" },
];

export const mockCities = ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Pune"];

export const mockDoctors: DoctorDto[] = [
  {
    id: "d1000001-0000-4000-8000-000000000001",
    fullName: "Dr. Rajesh Sharma",
    specialization: "Anxiety & Stress Therapy",
    qualifications: "M.Phil in Clinical Psychology, RCI Licensed",
    yearsOfExperience: 14,
    consultationFee: 600,
    clinicName: "Durrmi Mind Care Center",
    city: "Delhi",
    languages: ["English", "Hindi"],
    about: "Senior Clinical Psychologist specializing in Cognitive Behavioral Therapy (CBT), panic management, and chronic stress recovery.",
    registrationNumber: "RCI-DEL-101",
  },
  {
    id: "d1000001-0000-4000-8000-000000000002",
    fullName: "Dr. Ananya Roy",
    specialization: "Depression & Mood Care",
    qualifications: "Ph.D. Counseling Psychology",
    yearsOfExperience: 18,
    consultationFee: 850,
    clinicName: "Harmony Mental Health Institute",
    city: "Mumbai",
    languages: ["English", "Hindi", "Bengali"],
    about: "Specializes in mood disorders, emotional regulation, trauma-informed therapy, and self-compassion practices.",
    registrationNumber: "RCI-MUM-202",
  },
  {
    id: "d1000001-0000-4000-8000-000000000003",
    fullName: "Dr. Vikram Patel",
    specialization: "Couples & Relationship Counselling",
    qualifications: "M.A. Applied Psychology, Gottman Certified",
    yearsOfExperience: 10,
    consultationFee: 750,
    clinicName: "Durrmi Relationship Clinic",
    city: "Bengaluru",
    languages: ["English", "Hindi", "Kannada"],
    about: "Helping couples rebuild communication, resolve deep conflicts, navigate life transitions, and restore emotional intimacy.",
    registrationNumber: "RCI-BLR-303",
  },
  {
    id: "d1000001-0000-4000-8000-000000000004",
    fullName: "Dr. Meera Iyer",
    specialization: "Burnout & Career Stress",
    qualifications: "M.Sc Counseling Psychology",
    yearsOfExperience: 8,
    consultationFee: 700,
    clinicName: "Mindful Living Center",
    city: "Bengaluru",
    languages: ["English", "Tamil", "Hindi"],
    about: "Dedicated to workplace burnout, imposter syndrome, career transition anxiety, and building sustainable life balance.",
    registrationNumber: "RCI-BLR-404",
  },
];

export const mockAvailabilitySlots: AvailabilitySlotDto[] = [
  {
    id: "slot-1",
    doctorId: "d1000001-0000-4000-8000-000000000001",
    doctorName: "Dr. Rajesh Sharma",
    specialization: "Anxiety & Stress Therapy",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "10:45",
    isBooked: false,
    consultationFee: 600,
  },
  {
    id: "slot-2",
    doctorId: "d1000001-0000-4000-8000-000000000001",
    doctorName: "Dr. Rajesh Sharma",
    specialization: "Anxiety & Stress Therapy",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "11:30",
    endTime: "12:15",
    isBooked: false,
    consultationFee: 600,
  },
  {
    id: "slot-3",
    doctorId: "d1000001-0000-4000-8000-000000000002",
    doctorName: "Dr. Ananya Roy",
    specialization: "Depression & Mood Care",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "14:00",
    endTime: "14:45",
    isBooked: false,
    consultationFee: 850,
  },
];

export const mockAppointments: AppointmentDto[] = [
  {
    id: "app-1",
    patientName: "Riya Sharma",
    patientEmail: "patient@durrmi.test",
    doctorId: "d1000001-0000-4000-8000-000000000001",
    doctorName: "Dr. Rajesh Sharma",
    specialization: "Anxiety & Stress Therapy",
    date: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "10:45",
    status: "CONFIRMED",
    queueTokenNumber: "TOKEN-#1",
    consultationFee: 600,
    paymentStatus: "COMPLETED",
    notes: "Client experiencing work-related stress and panic symptoms.",
    createdAt: new Date().toISOString(),
  },
];

export const mockCurrentUser: UserDto = {
  id: "u-patient-101",
  email: "patient@durrmi.test",
  fullName: "Riya Sharma",
  role: "PATIENT",
  phone: "+919844123440",
};

export const mockPatient = mockCurrentUser;
export const mockDoctorUser: UserDto = {
  id: "d1000001-0000-4000-8000-000000000001",
  email: "doctor@durrmi.test",
  fullName: "Dr. Rajesh Sharma",
  role: "DOCTOR",
};
export const mockAdminUser: UserDto = {
  id: "admin-1",
  email: "admin@durrmi.test",
  fullName: "Durrmi Administrator",
  role: "ADMIN",
};
export const mockPatients = [mockCurrentUser];
export const mockSlots = mockAvailabilitySlots;
