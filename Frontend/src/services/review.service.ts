import type { DoctorReviewDto } from "@/lib/api/types";

const STORAGE_KEY = "medislot_reviews_v1";

const INITIAL_REVIEWS: DoctorReviewDto[] = [
  // Dr. Rajesh Sharma (doc-7)
  {
    id: "rev-1",
    doctorId: "doc-7",
    patientId: "patient-1",
    patientName: "Riya Sharma",
    appointmentId: "appt-seed-1",
    rating: 5,
    comment: "Dr. Rajesh Sharma analyzed my glucose lab report thoroughly. He explained fasting vs post-meal sugar levels in Hindi very clearly and gave practical diet tips!",
    verifiedPatient: true,
    createdAt: "2026-08-06T10:30:00Z",
  },
  {
    id: "rev-2",
    doctorId: "doc-7",
    patientId: "patient-2",
    patientName: "Amitabh Verma",
    rating: 5,
    comment: "Great experience. Minimum waiting time and very humble doctor. Diagnosed my seasonal fever quickly.",
    verifiedPatient: true,
    createdAt: "2026-08-04T15:20:00Z",
  },
  {
    id: "rev-3",
    doctorId: "doc-7",
    patientId: "patient-3",
    patientName: "Pooja Patel",
    rating: 4,
    comment: "Good consultation. Recommended effective medication.",
    verifiedPatient: true,
    createdAt: "2026-08-01T09:15:00Z",
  },

  // Dr. Ananya Rao (doc-1)
  {
    id: "rev-4",
    doctorId: "doc-1",
    patientId: "patient-4",
    patientName: "Sanjay Gupta",
    rating: 5,
    comment: "Best endocrinologist in Delhi NCR! Balanced my thyroid dosage properly.",
    verifiedPatient: true,
    createdAt: "2026-08-05T11:00:00Z",
  },
  {
    id: "rev-5",
    doctorId: "doc-1",
    patientId: "patient-5",
    patientName: "Neha Mehta",
    rating: 5,
    comment: "Very detailed consultation. Answered all my questions patiently.",
    verifiedPatient: true,
    createdAt: "2026-08-02T14:45:00Z",
  },

  // Dr. Vikram Shetty (doc-2)
  {
    id: "rev-6",
    doctorId: "doc-2",
    patientId: "patient-6",
    patientName: "Rohan Malhotra",
    rating: 5,
    comment: "Outstanding cardiologist. Checked ECG and prescribed clear blood pressure control plan.",
    verifiedPatient: true,
    createdAt: "2026-08-03T16:10:00Z",
  },
];

function loadFromStorage(): DoctorReviewDto[] {
  if (typeof window === "undefined") return INITIAL_REVIEWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REVIEWS;
  }
}

function saveToStorage(reviews: DoctorReviewDto[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // Ignore storage error
  }
}

export const reviewService = {
  async getDoctorReviews(doctorId: string): Promise<{
    reviews: DoctorReviewDto[];
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: Record<number, number>;
  }> {
    const all = loadFromStorage();
    const docReviews = all.filter((r) => r.doctorId === doctorId);

    const totalReviews = docReviews.length;
    if (totalReviews === 0) {
      return {
        reviews: [],
        averageRating: 4.8, // Fallback default for demo doctors
        totalReviews: 12,
        ratingBreakdown: { 5: 10, 4: 2, 3: 0, 2: 0, 1: 0 },
      };
    }

    const sum = docReviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = parseFloat((sum / totalReviews).toFixed(1));

    const ratingBreakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    docReviews.forEach((r) => {
      ratingBreakdown[r.rating] = (ratingBreakdown[r.rating] || 0) + 1;
    });

    return {
      reviews: docReviews,
      averageRating,
      totalReviews,
      ratingBreakdown,
    };
  },

  async addReview(data: Omit<DoctorReviewDto, "id" | "createdAt">): Promise<DoctorReviewDto> {
    const all = loadFromStorage();

    const newReview: DoctorReviewDto = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      doctorId: data.doctorId,
      patientId: data.patientId,
      patientName: data.patientName,
      appointmentId: data.appointmentId,
      rating: data.rating,
      comment: data.comment,
      verifiedPatient: data.verifiedPatient ?? true,
      createdAt: new Date().toISOString(),
    };

    const updated = [newReview, ...all];
    saveToStorage(updated);
    return newReview;
  },

  async hasUserReviewed(appointmentId: string): Promise<boolean> {
    const all = loadFromStorage();
    return all.some((r) => r.appointmentId === appointmentId);
  },
};
