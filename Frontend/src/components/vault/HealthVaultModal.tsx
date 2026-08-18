import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FolderLock,
  Upload,
  FileText,
  CheckCircle2,
  Share2,
  X,
  Plus,
  ShieldCheck,
  Smartphone,
  HardDrive,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { healthVaultService, type VaultFile } from "@/services/health-vault.service";
import { LabReportAnalyzerModal } from "@/components/assistant/LabReportAnalyzerModal";

interface HealthVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId?: string;
  doctorName?: string;
  onRecordShared?: () => void;
}

export function HealthVaultModal({
  isOpen,
  onClose,
  appointmentId,
  doctorName,
  onRecordShared,
}: HealthVaultModalProps) {
  const [activeTab, setActiveTab] = useState<"VAULT" | "UPLOAD">("VAULT");
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // AI Lab Report Analyzer Modal State
  const [analyzerModalOpen, setAnalyzerModalOpen] = useState(false);
  const [analyzerFileTarget, setAnalyzerFileTarget] = useState<string>("");

  // Upload Form State
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("LAB_REPORT");
  const [uploadNotes, setUploadNotes] = useState("");
  const [uploadFileUrl, setUploadFileUrl] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");

  const loadVault = async () => {
    setIsLoading(true);
    try {
      const files = await healthVaultService.getVaultFiles();
      setVaultFiles(files);
    } catch {
      toast.error("Failed to load vault files");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadVault();
      setSelectedFileIds([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleSelect = (id: string) => {
    if (selectedFileIds.includes(id)) {
      setSelectedFileIds(selectedFileIds.filter((fId) => fId !== id));
    } else {
      setSelectedFileIds([...selectedFileIds, id]);
    }
  };

  const handleShareFromVault = async () => {
    if (!appointmentId) {
      toast.info("Opened in Locker Management mode.");
      return;
    }
    if (selectedFileIds.length === 0) {
      toast.error("Please select at least one record from your Vault to share.");
      return;
    }
    setIsSharing(true);
    try {
      for (const fileId of selectedFileIds) {
        await healthVaultService.shareFileWithAppointment({
          appointmentId,
          vaultFileId: fileId,
        });
      }
      toast.success(`Successfully shared ${selectedFileIds.length} record(s) with Dr. ${doctorName || "your doctor"}!`);
      if (onRecordShared) onRecordShared();
      onClose();
    } catch {
      toast.error("Failed to share vault records");
    } finally {
      setIsSharing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    setUploadName(file.name.replace(/\.[^/.]+$/, ""));

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadFileUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAndShare = async () => {
    if (!uploadName.trim()) {
      toast.error("Please enter a name for this record.");
      return;
    }
    const finalUrl = uploadFileUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

    setIsSharing(true);
    try {
      const newFile = await healthVaultService.uploadToVault({
        fileName: uploadName,
        category: uploadCategory,
        fileUrl: finalUrl,
        notes: uploadNotes,
      });

      if (appointmentId) {
        await healthVaultService.shareFileWithAppointment({
          appointmentId,
          vaultFileId: newFile.id,
        });
        toast.success(`Uploaded to Vault & shared with Dr. ${doctorName || "your doctor"}!`);
      } else {
        toast.success("Medical record saved to your Health Vault!");
      }

      await loadVault();
      setActiveTab("VAULT");
      if (onRecordShared) onRecordShared();
      if (appointmentId) onClose();
    } catch {
      toast.error("Failed to upload record");
    } finally {
      setIsSharing(false);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "LAB_REPORT":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">🧪 Lab Report</Badge>;
      case "X_RAY":
        return <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">🩻 X-Ray / Scan</Badge>;
      case "DISCHARGE_SUMMARY":
        return <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/30">📋 Discharge Summary</Badge>;
      default:
        return <Badge variant="outline">📄 Medical Document</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-border bg-gradient-to-r from-teal-950/50 via-slate-900 to-emerald-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                Digital Health Locker (Vault)
                <Badge variant="outline" className="border-teal-500/40 text-teal-400 text-[10px] uppercase font-bold">
                  HIPAA Secure
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">
                {appointmentId
                  ? `Select specific records to share with Dr. ${doctorName || "your doctor"} for this visit.`
                  : "Manage your private medical documents locker."}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-border bg-muted/30 px-5 pt-3 gap-2">
          <button
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "VAULT"
                ? "border-teal-500 text-teal-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("VAULT")}
          >
            <FolderLock className="w-3.5 h-3.5" />
            Option 1: Pick from My Vault ({vaultFiles.length})
          </button>
          <button
            className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === "UPLOAD"
                ? "border-teal-500 text-teal-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("UPLOAD")}
          >
            <Upload className="w-3.5 h-3.5" />
            Option 2: Upload New from Device / Drive
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === "VAULT" ? (
            <div>
              {/* Header Action bar inside Vault tab */}
              <div className="flex items-center justify-between pb-3 border-b mb-3">
                <span className="text-xs text-muted-foreground font-medium">
                  {vaultFiles.length} file(s) saved in your Locker
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs font-bold gap-1.5 border-teal-500/50 text-teal-400 hover:bg-teal-500/10 rounded-lg"
                  onClick={() => setActiveTab("UPLOAD")}
                >
                  <Upload className="w-3.5 h-3.5" /> 📤 Upload New Document
                </Button>
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-xs text-muted-foreground">Loading your Health Vault...</div>
              ) : vaultFiles.length === 0 ? (
                <div className="text-center py-10 border border-dashed rounded-xl space-y-3">
                  <FolderLock className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-sm font-semibold text-foreground">Your Vault is empty</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Upload your lab reports or X-rays using Option 2 to save them to your private Locker.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setActiveTab("UPLOAD")}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Upload First Record
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {vaultFiles.map((file) => {
                    const isChecked = selectedFileIds.includes(file.id);
                    return (
                      <div
                        key={file.id}
                        onClick={() => handleToggleSelect(file.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isChecked
                            ? "bg-teal-500/10 border-teal-500/50 shadow-sm"
                            : "bg-card hover:bg-muted/40 border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                              isChecked ? "bg-teal-500 border-teal-500 text-white" : "border-muted-foreground/40"
                            }`}
                          >
                            {isChecked ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-foreground">{file.fileName}</span>
                              {getCategoryBadge(file.category)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {file.notes || "Stored in Health Locker"} • Uploaded {new Date(file.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAnalyzerFileTarget(file.fileName);
                              setAnalyzerModalOpen(true);
                            }}
                            className="text-xs text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-2 py-1 rounded-md border border-purple-500/30 font-bold flex items-center gap-1 transition-colors"
                          >
                            <Sparkles className="w-3 h-3 text-purple-400" /> AI Analyze
                          </button>

                          <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <FileText className="w-3.5 h-3.5" /> View
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/30 flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-teal-400 shrink-0" />
                <p className="text-xs text-teal-200">
                  Select a document from your Phone, Computer, or Google Drive. It will be saved permanently in your private Health Vault and attached to this visit.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">1. Choose File from Device</label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-500/20 file:text-teal-300 hover:file:bg-teal-500/30 cursor-pointer"
                />
                {uploadFileName ? (
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" /> Selected: {uploadFileName}
                  </p>
                ) : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Record Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Blood Test CBC Report"
                    value={uploadName}
                    onChange={(e) => setUploadName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:border-teal-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Category Tag</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:border-teal-500 outline-none"
                  >
                    <option value="LAB_REPORT">🧪 Lab Report (Blood/Urine)</option>
                    <option value="X_RAY">🩻 X-Ray / Scan / MRI</option>
                    <option value="DISCHARGE_SUMMARY">📋 Discharge Summary</option>
                    <option value="PRESCRIPTION">💊 Past Prescription</option>
                    <option value="OTHER">📄 General Medical Record</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Optional Clinical Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Fasting report done at Dr. Lal PathLabs"
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:border-teal-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>End-to-End Encrypted Consent</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            {activeTab === "VAULT" ? (
              <Button
                size="sm"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold"
                onClick={handleShareFromVault}
                disabled={isSharing || (appointmentId ? selectedFileIds.length === 0 : false)}
              >
                <Share2 className="w-3.5 h-3.5 mr-1" />
                {appointmentId ? `Share Selected (${selectedFileIds.length})` : "Done"}
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold"
                onClick={handleUploadAndShare}
                disabled={isSharing || !uploadName.trim()}
              >
                <Upload className="w-3.5 h-3.5 mr-1" />
                Upload & Share Record
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* AI Lab Report OCR Analyzer Modal */}
      <LabReportAnalyzerModal
        isOpen={analyzerModalOpen}
        onClose={() => setAnalyzerModalOpen(false)}
        initialFileName={analyzerFileTarget}
      />
    </div>
  );
}
