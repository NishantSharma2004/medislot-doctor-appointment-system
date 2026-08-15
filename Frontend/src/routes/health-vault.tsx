import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Upload,
  Search,
  FolderLock,
  Plus,
  Eye,
  Download,
  Calendar,
  Sparkles,
  ShieldCheck,
  Tag,
  Share2,
  X,
  FileCheck2,
  Image as ImageIcon,
  Activity,
} from "lucide-react";
import { BackButton } from "@/components/common/BackButton";
import { ErrorState } from "@/components/common/ErrorState";
import { FullPageLoader, InlineLoader } from "@/components/common/Loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { healthVaultService, type VaultFile } from "@/services/health-vault.service";
import type { ApiError } from "@/lib/api/types";

export const Route = createFileRoute("/health-vault")({
  head: () => ({
    meta: [
      { title: "Health Records Vault — MediSlot" },
      { name: "description", content: "Store, organize, and securely share your medical reports and EHR records." },
    ],
  }),
  component: HealthVaultPage,
});

const CATEGORIES = [
  { key: "ALL", label: "All Files" },
  { key: "LAB_REPORT", label: "Lab Reports 🧪" },
  { key: "PRESCRIPTION", label: "Prescriptions 📄" },
  { key: "X_RAY", label: "Imaging & Scans 🩻" },
  { key: "DISCHARGE_SUMMARY", label: "Discharge Summaries 🏥" },
  { key: "OTHER", label: "Other Records 📁" },
];

function HealthVaultPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [files, setFiles] = useState<VaultFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newCategory, setNewCategory] = useState<VaultFile["category"]>("LAB_REPORT");
  const [newFileUrl, setNewFileUrl] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Preview Modal State
  const [previewFile, setPreviewFile] = useState<VaultFile | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate({ to: "/login", search: { redirect: "/health-vault" } });
      } else if (user?.role !== "PATIENT") {
        navigate({ to: "/dashboard" });
      }
    }
  }, [authLoading, isAuthenticated, user?.role, navigate]);

  const loadVaultFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await healthVaultService.getVaultFiles();
      setFiles(list || []);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "PATIENT") {
      loadVaultFiles();
    }
  }, [isAuthenticated, user?.role]);

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) {
      toast.error("Please enter a file name");
      return;
    }
    setIsUploading(true);
    try {
      const finalUrl = newFileUrl.trim() || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
      await healthVaultService.uploadToVault({
        fileName: newFileName.trim(),
        category: newCategory,
        fileUrl: finalUrl,
        notes: newNotes.trim(),
      });
      toast.success("Medical document saved to your Vault!");
      setIsUploadModalOpen(false);
      setNewFileName("");
      setNewFileUrl("");
      setNewNotes("");
      loadVaultFiles();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return <FullPageLoader label="Opening Health Vault" />;
  }

  const filteredFiles = files.filter((f) => {
    const matchesSearch =
      f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.notes && f.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "ALL" || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: VaultFile["category"]) => {
    switch (category) {
      case "LAB_REPORT":
        return <Activity className="size-5 text-emerald-500" />;
      case "PRESCRIPTION":
        return <FileText className="size-5 text-blue-500" />;
      case "X_RAY":
        return <ImageIcon className="size-5 text-purple-500" />;
      case "DISCHARGE_SUMMARY":
        return <FileCheck2 className="size-5 text-amber-500" />;
      default:
        return <Tag className="size-5 text-slate-400" />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <BackButton />

      {/* Hero Vault Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 backdrop-blur-md px-3 py-1 text-xs">
                <FolderLock className="size-3.5 mr-1" /> EHR Confidential Records
              </Badge>
              <Badge variant="outline" className="text-teal-200 border-teal-500/30 text-xs">
                <ShieldCheck className="size-3 mr-1" /> HIPAA Privacy Standard
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Digital Health Records Locker 📂
            </h1>
            <p className="text-emerald-100/80 text-sm max-w-xl">
              Store all your lab reports, prescriptions, X-rays, and discharge summaries in one encrypted vault. Share explicitly with doctors during consultations.
            </p>
          </div>

          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-2 shadow-lg shadow-emerald-950/60 text-sm py-6 px-6 rounded-xl"
          >
            <Plus className="size-5" /> Upload Document to Vault
          </Button>
        </div>
      </div>

      {/* Search & Category Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-3 size-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by title or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-card"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.key}
                size="sm"
                variant={selectedCategory === cat.key ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.key)}
                className={`rounded-xl text-xs ${
                  selectedCategory === cat.key
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Vault Files Grid Display */}
      {isLoading ? (
        <InlineLoader label="Accessing encrypted vault files" />
      ) : error ? (
        <ErrorState error={error} onRetry={loadVaultFiles} />
      ) : filteredFiles.length === 0 ? (
        <div className="surface-panel p-12 text-center space-y-4 rounded-2xl border border-dashed border-border/80">
          <div className="size-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <FolderLock className="size-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold">No Documents Found</h3>
            <p className="text-xs text-muted-foreground">
              {searchQuery || selectedCategory !== "ALL"
                ? "No vault files match your search criteria. Try adjusting filters."
                : "Your Health Vault is currently empty. Upload your lab reports, prescriptions, or X-rays to get started!"}
            </p>
          </div>
          <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2 font-semibold bg-emerald-600 text-white">
            <Plus className="size-4" /> Add First Document
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="surface-panel p-5 rounded-2xl space-y-4 border border-border/60 hover:border-emerald-500/40 transition-all duration-300 shadow-sm flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-xl bg-accent text-accent-foreground group-hover:scale-105 transition-transform">
                    {getCategoryIcon(file.category)}
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider rounded-lg px-2 py-0.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                    {file.category.replace("_", " ")}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-bold text-base line-clamp-1 text-foreground" title={file.fileName}>
                    {file.fileName}
                  </h4>
                  {file.notes ? (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{file.notes}</p>
                  ) : null}
                </div>
              </div>

              <div className="pt-3 border-t border-border/50 space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {new Date(file.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>{file.fileSizeBytes ? `${(file.fileSizeBytes / 1024 / 1024).toFixed(1)} MB` : "Document"}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewFile(file)}
                    className="text-xs font-semibold gap-1.5 rounded-xl border-border/80"
                  >
                    <Eye className="size-3.5 text-teal-500" /> Preview
                  </Button>

                  <a href={file.fileUrl} target="_blank" rel="noreferrer" className="w-full">
                    <Button size="sm" variant="secondary" className="w-full text-xs font-semibold gap-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20">
                      <Download className="size-3.5" /> Download
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen ? (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-panel w-full max-w-lg p-6 rounded-2xl shadow-2xl border border-border space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <FolderLock className="size-5 text-emerald-500" />
                <h3 className="font-bold text-lg">Add Document to Vault</h3>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setIsUploadModalOpen(false)} className="size-8 p-0 rounded-full">
                <X className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleUploadFile} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="doc-title" className="text-xs font-bold">Document Title *</Label>
                <Input
                  id="doc-title"
                  placeholder="e.g. Complete Blood Count Report August 2026"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-cat" className="text-xs font-bold">Document Category</Label>
                <select
                  id="doc-cat"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as VaultFile["category"])}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="LAB_REPORT">Lab Report 🧪</option>
                  <option value="PRESCRIPTION">Prescription 📄</option>
                  <option value="X_RAY">Imaging & X-Ray 🩻</option>
                  <option value="DISCHARGE_SUMMARY">Discharge Summary 🏥</option>
                  <option value="OTHER">Other Medical Record 📁</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-url" className="text-xs font-bold">Document Link / Cloud URL (Optional)</Label>
                <Input
                  id="doc-url"
                  placeholder="https://drive.google.com/... or cloud PDF URL"
                  value={newFileUrl}
                  onChange={(e) => setNewFileUrl(e.target.value)}
                  className="rounded-xl"
                />
                <p className="text-[11px] text-muted-foreground">If left empty, a secure demo report placeholder will be generated.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="doc-notes" className="text-xs font-bold">Notes / Observations (Optional)</Label>
                <Textarea
                  id="doc-notes"
                  placeholder="e.g. Fasting glucose level 105 mg/dL, advised follow up in 2 weeks"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  className="rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl gap-2">
                  <Upload className="size-4" /> {isUploading ? "Uploading..." : "Save to Vault"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Document Preview Modal */}
      {previewFile ? (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="surface-panel w-full max-w-4xl max-h-[90vh] p-6 rounded-2xl shadow-2xl border border-border flex flex-col space-y-4 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  {getCategoryIcon(previewFile.category)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground line-clamp-1">{previewFile.fileName}</h3>
                  <p className="text-xs text-muted-foreground">Added on {new Date(previewFile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a href={previewFile.fileUrl} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="outline" className="gap-1 text-xs">
                    <Download className="size-3.5" /> Download
                  </Button>
                </a>
                <Button size="sm" variant="ghost" onClick={() => setPreviewFile(null)} className="size-8 p-0 rounded-full">
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-black/20 rounded-xl p-2 min-h-[400px] flex items-center justify-center">
              {previewFile.fileUrl.endsWith(".pdf") || previewFile.fileType === "application/pdf" ? (
                <iframe src={previewFile.fileUrl} className="w-full h-full min-h-[500px] rounded-lg border-0" title={previewFile.fileName} />
              ) : (
                <img src={previewFile.fileUrl} alt={previewFile.fileName} className="max-w-full max-h-[550px] object-contain rounded-lg shadow-md" />
              )}
            </div>

            {previewFile.notes ? (
              <div className="p-3 bg-muted/60 rounded-xl text-xs text-muted-foreground border border-border/50">
                <strong className="text-foreground">Clinical Notes: </strong>
                {previewFile.notes}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
