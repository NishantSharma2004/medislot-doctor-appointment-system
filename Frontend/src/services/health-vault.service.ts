import { apiClient } from "@/lib/api/client";
import { USE_MOCK_API } from "./config";

export interface VaultFile {
  id: string;
  patientId: string;
  fileName: string;
  fileType?: string;
  fileSizeBytes?: number;
  category: "LAB_REPORT" | "X_RAY" | "DISCHARGE_SUMMARY" | "PRESCRIPTION" | "OTHER";
  fileUrl: string;
  notes?: string;
  createdAt: string;
}

const mockVaultFiles: VaultFile[] = [
  {
    id: "vault-1",
    patientId: "patient-1",
    fileName: "Complete_Blood_Count_CBC_2026.pdf",
    fileType: "application/pdf",
    fileSizeBytes: 1048576,
    category: "LAB_REPORT",
    fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    notes: "Fasting CBC & Lipid Profile Report",
    createdAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "vault-2",
    patientId: "patient-1",
    fileName: "Chest_XRay_Digital_Scan.png",
    fileType: "image/png",
    fileSizeBytes: 2097152,
    category: "X_RAY",
    fileUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop",
    notes: "Clear Chest Radiograph",
    createdAt: "2026-07-20T14:30:00Z",
  },
];

const mockAppointmentSharedRecords = new Map<string, string[]>(); // appointmentId -> vaultFileId[]

export const healthVaultService = {
  async getVaultFiles(): Promise<VaultFile[]> {
    if (USE_MOCK_API) {
      return [...mockVaultFiles];
    }
    const { data } = await apiClient.get<VaultFile[]>("/health-vault");
    return data;
  },

  async uploadToVault(payload: {
    fileName: string;
    fileType?: string;
    fileSizeBytes?: number;
    category: string;
    fileUrl: string;
    notes?: string;
  }): Promise<VaultFile> {
    if (USE_MOCK_API) {
      const newFile: VaultFile = {
        id: `vault-${Date.now()}`,
        patientId: "patient-1",
        fileName: payload.fileName,
        fileType: payload.fileType || "application/pdf",
        fileSizeBytes: payload.fileSizeBytes || 524288,
        category: (payload.category as VaultFile["category"]) || "OTHER",
        fileUrl: payload.fileUrl,
        notes: payload.notes,
        createdAt: new Date().toISOString(),
      };
      mockVaultFiles.unshift(newFile);
      return newFile;
    }
    const { data } = await apiClient.post<VaultFile>("/health-vault/upload", payload);
    return data;
  },

  async shareFileWithAppointment(payload: {
    appointmentId: string;
    vaultFileId: string;
  }): Promise<VaultFile> {
    if (USE_MOCK_API) {
      const file = mockVaultFiles.find((f) => f.id === payload.vaultFileId);
      if (!file) throw new Error("Vault file not found");
      const shared = mockAppointmentSharedRecords.get(payload.appointmentId) || [];
      if (!shared.includes(payload.vaultFileId)) {
        shared.push(payload.vaultFileId);
        mockAppointmentSharedRecords.set(payload.appointmentId, shared);
      }
      return file;
    }
    const { data } = await apiClient.post<VaultFile>("/health-vault/share", payload);
    return data;
  },

  async getAppointmentSharedFiles(appointmentId: string): Promise<VaultFile[]> {
    if (USE_MOCK_API) {
      const sharedIds = mockAppointmentSharedRecords.get(appointmentId) || [];
      if (sharedIds.length === 0) {
        // Fallback demo shared record for mock appointments
        return [mockVaultFiles[0]];
      }
      return mockVaultFiles.filter((f) => sharedIds.includes(f.id));
    }
    const { data } = await apiClient.get<VaultFile[]>(`/health-vault/appointment/${appointmentId}`);
    return data;
  },
};
