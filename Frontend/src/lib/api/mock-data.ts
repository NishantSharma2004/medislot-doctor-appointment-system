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
  { id: "sp-1", name: "Anxiety & Panic Therapy" },
  { id: "sp-2", name: "Depression & Mood Care" },
  { id: "sp-3", name: "Couples & Relationship Therapy" },
  { id: "sp-4", name: "Trauma & Emotional Healing" },
  { id: "sp-5", name: "Cognitive Behavioral Therapy (CBT)" },
  { id: "sp-6", name: "Burnout & Work Stress" },
  { id: "sp-7", name: "Child & Adolescent Therapy" },
  { id: "sp-8", name: "Mindfulness & Personal Growth" },
];

export const mockCities = ["Delhi", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Pune"];

export const mockDoctors: DoctorDto[] = [
  {
    id: "d1000001-0000-4000-8000-000000000001",
    fullName: "Dr. Ananya Roy",
    specialization: "Depression & Mood Care",
    qualifications: "Ph.D. Counseling Psychology",
    yearsOfExperience: 18,
    consultationFee: 800,
    clinicName: "Durrmi Mind & Wellbeing Hub",
    city: "Mumbai",
    languages: ["English", "Hindi", "Bengali"],
    about: "Specializes in mood regulation, emotional exhaustion recovery, trauma-informed therapy, and self-compassion practices.",
    registrationNumber: "RCI-MUM-202",
  },
  {
    id: "d1000001-0000-4000-8000-000000000002",
    fullName: "Dr. Rajesh Sharma",
    specialization: "Anxiety & Panic Therapy",
    qualifications: "M.Phil in Clinical Psychology, RCI Licensed",
    yearsOfExperience: 15,
    consultationFee: 500,
    clinicName: "Durrmi Mind Care Center",
    city: "Delhi",
    languages: ["English", "Hindi"],
    about: "Senior Clinical Psychologist specializing in Cognitive Behavioral Therapy (CBT), panic management, and chronic stress recovery.",
    registrationNumber: "RCI-DEL-101",
  },
  {
    id: "d1000001-0000-4000-8000-000000000003",
    fullName: "Dr. Amit Verma",
    specialization: "Child & Adolescent Therapy",
    qualifications: "M.Sc Child & Adolescent Psychology",
    yearsOfExperience: 15,
    consultationFee: 450,
    clinicName: "Durrmi Youth Psychology Center",
    city: "Hyderabad",
    languages: ["English", "Hindi", "Telugu"],
    about: "Specialized therapist focusing on teen anxiety, developmental transitions, behavioral guidance, and school stress.",
    registrationNumber: "RCI-HYD-303",
  },
  {
    id: "d1000001-0000-4000-8000-000000000004",
    fullName: "Dr. Priya Nair",
    specialization: "Trauma & Emotional Healing",
    qualifications: "M.A. Trauma & EMDR Therapy Specialist",
    yearsOfExperience: 12,
    consultationFee: 700,
    clinicName: "Durrmi Healing & Wellness Center",
    city: "Pune",
    languages: ["English", "Hindi", "Malayalam"],
    about: "Expert in EMDR, somatic experiencing, grief counseling, and trauma recovery for individuals and families.",
    registrationNumber: "RCI-PUN-404",
  },
  {
    id: "d1000001-0000-4000-8000-000000000005",
    fullName: "Dr. Sunita Kapoor",
    specialization: "Mindfulness & Personal Growth",
    qualifications: "M.A. Applied Psychology & Counseling",
    yearsOfExperience: 11,
    consultationFee: 550,
    clinicName: "Durrmi Mindfulness Studio",
    city: "Pune",
    languages: ["English", "Hindi", "Marathi"],
    about: "Focusing on self-esteem building, mindfulness-based cognitive therapy, life transition counseling, and stress relief.",
    registrationNumber: "RCI-PUN-505",
  },
  {
    id: "d1000001-0000-4000-8000-000000000006",
    fullName: "Dr. Vikram Patel",
    specialization: "Couples & Relationship Therapy",
    qualifications: "M.A. Applied Psychology, Gottman Certified",
    yearsOfExperience: 10,
    consultationFee: 750,
    clinicName: "Durrmi Couples Relationship Studio",
    city: "Bengaluru",
    languages: ["English", "Hindi", "Kannada"],
    about: "Helping couples rebuild communication, resolve deep conflicts, navigate life transitions, and restore emotional intimacy.",
    registrationNumber: "RCI-BLR-606",
  },
];

export const mockAvailabilitySlots: AvailabilitySlotDto[] = [
  {
    id: "slot-1",
    doctorId: "d1000001-0000-4000-8000-000000000002",
    doctorName: "Dr. Rajesh Sharma",
    specialization: "Anxiety & Panic Therapy",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "10:45",
    booked: false,
    consultationFee: 500,
  },
  {
    id: "slot-2",
    doctorId: "d1000001-0000-4000-8000-000000000002",
    doctorName: "Dr. Rajesh Sharma",
    specialization: "Anxiety & Panic Therapy",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "11:30",
    endTime: "12:15",
    booked: false,
    consultationFee: 500,
  },
  {
    id: "slot-3",
    doctorId: "d1000001-0000-4000-8000-000000000001",
    doctorName: "Dr. Ananya Roy",
    specialization: "Depression & Mood Care",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "14:00",
    endTime: "14:45",
    booked: false,
    consultationFee: 800,
  },
];

export const mockAppointments: AppointmentDto[] = [
  {
    id: "app-1",
    patientName: "Riya Sharma",
    patientEmail: "patient@durrmi.test",
    doctorId: "d1000001-0000-4000-8000-000000000002",
    doctorName: "Dr. Rajesh Sharma",
    specialization: "Anxiety & Panic Therapy",
    date: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "10:45",
    status: "CONFIRMED",
    queueTokenNumber: "TOKEN-#1",
    consultationFee: 500,
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
  id: "d1000001-0000-4000-8000-000000000002",
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
