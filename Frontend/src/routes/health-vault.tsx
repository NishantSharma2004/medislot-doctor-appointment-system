import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  UploadCloud,
  FileUp,
  Link,
  Trash2,
  CheckCircle2,
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
  const [uploadSource, setUploadSource] = useState<"FILE" | "LINK">("FILE");
  const [newFileName, setNewFileName] = useState("");
  const [newCategory, setNewCategory] = useState<VaultFile["category"]>("LAB_REPORT");
  const [newFileUrl, setNewFileUrl] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preview Modal State
  const [previewFile, setPreviewFile] = useState<VaultFile | null>(null);

  // Delete Confirmation State
  const [deleteConfirmFile, setDeleteConfirmFile] = useState<VaultFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const resetUploadForm = () => {
    setNewFileName("");
    setNewFileUrl("");
    setNewNotes("");
    setSelectedFile(null);
    setFileDataUrl("");
    setUploadSource("FILE");
    setIsDragOver(false);
  };

  const processSelectedFile = (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      toast.error("File size exceeds 15MB limit. Please select a smaller document.");
      return;
    }
    setSelectedFile(file);

    // Auto-populate document title if not filled yet
    if (!newFileName.trim()) {
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setNewFileName(cleanTitle);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFileDataUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) {
      toast.error("Please enter a document title");
      return;
    }
    if (uploadSource === "FILE" && !fileDataUrl) {
      toast.error("Please select a file to upload from your device");
      return;
    }
    setIsUploading(true);
    try {
      const finalUrl =
        uploadSource === "FILE"
          ? fileDataUrl
          : newFileUrl.trim() || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

      await healthVaultService.uploadToVault({
        fileName: newFileName.trim(),
        category: newCategory,
        fileUrl: finalUrl,
        fileType: selectedFile?.type || "application/pdf",
        fileSizeBytes: selectedFile?.size || 524288,
        notes: newNotes.trim(),
      });
      toast.success("Medical document saved to your Vault!");
      setIsUploadModalOpen(false);
      resetUploadForm();
      loadVaultFiles();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async () => {
    if (!deleteConfirmFile) return;
    setIsDeleting(true);
    try {
      await healthVaultService.deleteVaultFile(deleteConfirmFile.id);
      toast.success(`"${deleteConfirmFile.fileName}" removed from Health Vault`);
      setDeleteConfirmFile(null);
      loadVaultFiles();
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Failed to delete document");
    } finally {
      setIsDeleting(false);
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
            onClick={() => {
              resetUploadForm();
              setIsUploadModalOpen(true);
            }}
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
          <Button onClick={() => { resetUploadForm(); setIsUploadModalOpen(true); }} className="gap-2 font-semibold bg-emerald-600 text-white">
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
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider rounded-lg px-2 py-0.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                      {file.category.replace("_", " ")}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteConfirmFile(file)}
                      title="Delete document"
                      className="size-7 p-0 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/15 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
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

                  <a href={file.fileUrl} target="_blank" rel="noreferrer" download={file.fileName} className="w-full">
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
              {/* Source Switcher Tabs */}
              <div className="flex rounded-xl bg-muted/60 p-1 gap-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setUploadSource("FILE")}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    uploadSource === "FILE"
                      ? "bg-background text-foreground shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <UploadCloud className="size-4 text-emerald-500" /> Upload File from Device
                </button>
                <button
                  type="button"
                  onClick={() => setUploadSource("LINK")}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    uploadSource === "LINK"
                      ? "bg-background text-foreground shadow-sm font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Link className="size-4 text-teal-500" /> Cloud Link / URL
                </button>
              </div>

              {/* Upload Dropzone / File Picker */}
              {uploadSource === "FILE" ? (
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Select Document or Image *</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shrink-0">
                          {selectedFile.type.startsWith("image/") ? (
                            <ImageIcon className="size-6" />
                          ) : (
                            <FileText className="size-6" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs line-clamp-1 text-foreground">{selectedFile.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5">
                              ✓ Ready to upload
                            </Badge>
                            <span className="text-[11px] text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-lg px-2.5 shrink-0"
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center space-y-3 ${
                        isDragOver
                          ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
                          : "border-border/80 hover:border-emerald-500/60 bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <div className="size-14 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                        <UploadCloud className="size-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm text-foreground">
                          Click to browse <span className="text-muted-foreground font-normal">or drag and drop file</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, PNG, JPG, JPEG, WEBP, or DOCX (Max 15MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor="doc-url" className="text-xs font-bold">Document Link / Cloud URL *</Label>
                  <Input
                    id="doc-url"
                    placeholder="https://drive.google.com/... or cloud PDF URL"
                    value={newFileUrl}
                    onChange={(e) => setNewFileUrl(e.target.value)}
                    className="rounded-xl"
                  />
                  <p className="text-[11px] text-muted-foreground">Paste a direct link to your document hosted on Google Drive or Cloud Storage.</p>
                </div>
              )}

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
                <a href={previewFile.fileUrl} target="_blank" rel="noreferrer" download={previewFile.fileName}>
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
              {previewFile.fileUrl.startsWith("data:application/pdf") || previewFile.fileUrl.endsWith(".pdf") || previewFile.fileType === "application/pdf" ? (
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmFile ? (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="surface-panel w-full max-w-md p-6 rounded-2xl shadow-2xl border border-border space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="p-3 rounded-2xl bg-rose-500/10">
                <Trash2 className="size-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Delete Document?</h3>
                <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-foreground/90 bg-muted/50 p-3 rounded-xl border border-border/50">
              Are you sure you want to permanently delete <strong className="text-foreground">"{deleteConfirmFile.fileName}"</strong> from your Health Vault?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeleteConfirmFile(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={handleDeleteFile}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl gap-2"
              >
                <Trash2 className="size-4" /> {isDeleting ? "Deleting..." : "Delete Document"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
