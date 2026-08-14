import { useState } from "react";
import { toast } from "sonner";
import {
  FileSearch,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Languages,
  ShieldCheck,
  Stethoscope,
  Upload,
  FolderLock,
  Utensils,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { assistantService } from "@/services/assistant.service";
import type { ReportAnalysisData, LabParameter } from "@/lib/api/types";

interface LabReportAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFileName?: string;
  initialReportText?: string;
}

export function LabReportAnalyzerModal({
  isOpen,
  onClose,
  initialFileName,
  initialReportText,
}: LabReportAnalyzerModalProps) {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState(initialFileName || "Blood_Test_CBC_Glucose.pdf");
  const [reportText, setReportText] = useState(initialReportText || "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ReportAnalysisData & { recommendedDoctor?: any } | null>(null);
  const [langTab, setLangTab] = useState<"HI" | "EN">("HI");

  if (!isOpen) return null;

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const data = await (assistantService as any).analyzeLabReport({
        fileName,
        reportText,
      });
      setAnalysisResult(data);
      toast.success("Blood Report successfully analyzed by Medical AI!");
    } catch {
      toast.error("Failed to analyze blood report.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
  };

  const getStatusBadge = (status: LabParameter["status"]) => {
    switch (status) {
      case "HIGH":
        return <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 font-bold">🔴 HIGH</Badge>;
      case "LOW":
        return <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1 font-bold">🔵 LOW</Badge>;
      default:
        return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">🟢 NORMAL</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-border bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                AI Lab Report OCR Reader & Summary
                <Badge variant="outline" className="border-purple-500/40 text-purple-300 text-[10px] uppercase font-bold">
                  Groq & Gemini AI
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">
                Automated blood test parameter extraction with Hindi & English clinical guidance.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {!analysisResult && !isAnalyzing ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <p className="text-xs text-purple-200 font-medium">
                  Select a blood test report (CBC, Glucose/HbA1c, Lipid Profile, Thyroid, Kidney function). Our AI engine will extract test parameters and generate high/low alerts.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Selected Lab Report File</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg bg-background border border-border focus:border-purple-500 outline-none"
                    placeholder="e.g. Complete_Blood_Count_CBC.pdf"
                  />
                  <label className="px-3 py-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold hover:bg-purple-500/30 cursor-pointer flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Upload File
                    <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Optional Lab Text / Notes</label>
                <textarea
                  rows={3}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Paste blood test text values or notes (e.g. HbA1c 7.8%, Fasting Glucose 142 mg/dL, Total Cholesterol 248 mg/dL)..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border focus:border-purple-500 outline-none resize-none"
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2.5 shadow-lg"
                onClick={handleRunAnalysis}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Report with Medical AI Engine
              </Button>
            </div>
          ) : isAnalyzing ? (
            <div className="text-center py-16 space-y-4">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
                <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">Medical AI Engine Analyzing Report...</h3>
                <p className="text-xs text-muted-foreground">Extracting HbA1c, Cholesterol, Glucose & CBC parameters with reference ranges...</p>
              </div>
            </div>
          ) : analysisResult ? (
            <div className="space-y-5">
              {/* Output Toolbar */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                    {analysisResult.fileName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-background border border-border rounded-lg p-0.5">
                    <button
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                        langTab === "HI" ? "bg-purple-600 text-white" : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setLangTab("HI")}
                    >
                      🇮🇳 हिंदी सारांश
                    </button>
                    <button
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                        langTab === "EN" ? "bg-purple-600 text-white" : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setLangTab("EN")}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setAnalysisResult(null)}>
                    <RefreshCw className="w-3 h-3 mr-1" /> Re-analyze
                  </Button>
                </div>
              </div>

              {/* Dual Language Clinical Summary Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 to-slate-900 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Clinical Assessment & Findings
                  </span>
                  <Badge variant="outline" className="border-purple-500/40 text-purple-300 text-[10px]">
                    {langTab === "HI" ? "हिंदी में व्याख्या" : "English Clinical Summary"}
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed text-slate-200">
                  {langTab === "HI" ? analysisResult.summaryHindi : analysisResult.summaryEnglish}
                </p>
              </div>

              {/* Extracted Parameters Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Extracted Blood Parameters & Reference Ranges
                </h4>
                <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border font-bold text-muted-foreground">
                      <tr>
                        <th className="p-3">Test Parameter</th>
                        <th className="p-3">Measured Value</th>
                        <th className="p-3">Standard Clinical Range</th>
                        <th className="p-3 text-right">AI Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {analysisResult.parameters.map((param, idx) => (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-semibold text-foreground">{param.name}</td>
                          <td className="p-3 font-bold text-foreground">{param.value}</td>
                          <td className="p-3 text-muted-foreground">{param.normalRange}</td>
                          <td className="p-3 text-right">{getStatusBadge(param.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actionable Dietary Advice */}
              {analysisResult.dietAdvice && analysisResult.dietAdvice.length > 0 ? (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-4 h-4" /> Recommended Dietary & Lifestyle Plan
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-200/90 list-disc list-inside">
                    {analysisResult.dietAdvice.map((advice, i) => (
                      <li key={i}>{advice}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* 1-Click Specialist Doctor Recommendation Card */}
              {analysisResult.recommendedDoctor ? (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        RECOMMENDED SPECIALIST MATCH
                      </span>
                      <h4 className="text-sm font-bold text-foreground">
                        {analysisResult.recommendedDoctor.doctorName} ({analysisResult.recommendedDoctor.specialization})
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {analysisResult.recommendedDoctor.reason} • Fee ₹{analysisResult.recommendedDoctor.consultationFee}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0"
                    onClick={() => {
                      onClose();
                      navigate({ to: "/doctors" });
                    }}
                  >
                    Book Consultation Slot <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Clinical Decision Support (Non-Diagnostic)</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
