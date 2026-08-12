import { apiClient } from "@/lib/api/client";
import type { OpdQueueResponse } from "@/lib/api/types";

export const opdQueueService = {
  async getTodayQueue(): Promise<OpdQueueResponse> {
    const { data } = await apiClient.get<OpdQueueResponse>("/doctors/queue/today");
    return data;
  },

  async getPublicDoctorQueue(doctorId: string): Promise<OpdQueueResponse> {
    const { data } = await apiClient.get<OpdQueueResponse>(`/doctors/queue/${doctorId}`);
    return data;
  },

  async callNextPatient(): Promise<OpdQueueResponse> {
    const { data } = await apiClient.post<OpdQueueResponse>("/doctors/queue/next");
    return data;
  },

  async completeCurrentConsultation(): Promise<OpdQueueResponse> {
    const { data } = await apiClient.post<OpdQueueResponse>("/doctors/queue/complete");
    return data;
  },

  async skipCurrentPatient(): Promise<OpdQueueResponse> {
    const { data } = await apiClient.post<OpdQueueResponse>("/doctors/queue/skip");
    return data;
  },
};
