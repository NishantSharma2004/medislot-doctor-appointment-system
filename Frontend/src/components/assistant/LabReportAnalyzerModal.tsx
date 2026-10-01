import { useState } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  ShieldCheck,
  Upload,
  RefreshCw,
  HeartHandshake,
  Brain,
  Pill,
  Activity,
  FileText,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { assistantService } from "@/services/assistant.service";
import type { ReportAnalysisData, LabParameter } from "@/lib/api/types";
import { DurrmiLogoIcon } from "@/components/common/DurrmiLogo";

interface LabReportAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFileName?: string;
  initialReportText?: string;
}

const PRESETS = [
  {
    id: "assessment",
    icon: "🧠",
    title: "PHQ-9 & GAD-7 Assessment",
    fileName: "PHQ9_GAD7_Psychological_Screening.pdf",
    text: "Clinical Assessment Results:\n• PHQ-9 Depression Score: 13 / 27 (Moderate low mood, persistent fatigue)\n• GAD-7 Anxiety Score: 12 / 21 (Moderate anxiety, racing thoughts, restlessness)\n• Subjective sleep disruption: Frequent awakenings, early morning insomnia.",
  },
  {
    id: "prescription",
    icon: "💊",
    title: "Psychiatric Prescription",
    fileName: "Psychiatry_Consultation_Rx.pdf",
    text: "Prescription & Doctor Clinical Note:\n• Tab Escitalopram 10mg once daily after breakfast\n• Tab Clonazepam 0.25mg SOS for severe panic\n• Recommendation: Initiate weekly 1-on-1 Cognitive Behavioral Therapy (CBT) for long-term emotional regulation.",
  },
  {
    id: "biomarkers",
    icon: "🩸",
    title: "Neuro-Biomarkers (D3, B12, Thyroid)",
    fileName: "Comprehensive_Neuro_Metabolic_Panel.pdf",
    text: "Lab Biomarker Findings:\n• Serum Vitamin D3: 14.8 ng/mL (Suboptimal < 30)\n• Vitamin B12: 172 pg/mL (Deficient < 211)\n• Thyroid TSH: 5.45 uIU/mL (Elevated)\n• Morning Cortisol: 23.8 ug/dL (Elevated Stress Marker)",
  },
  {
    id: "burnout",
    icon: "💼",
    title: "Workplace Burnout Inventory",
    fileName: "Executive_Burnout_Stress_Inventory.pdf",
    text: "Workplace Psychological Stress Index:\n• Emotional Exhaustion Score: 78% (Severe Overload)\n• Depersonalization & Cynicism: Elevated\n• Cognitive Fatigue & Task Paralysis: High\n• Primary Driver: Unrealistic deadlines and imposter syndrome.",
  },
];

export function LabReportAnalyzerModal({
  isOpen,
  onClose,
  initialFileName,
  initialReportText,
}: LabReportAnalyzerModalProps) {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState(
    initialFileName || "PHQ9_GAD7_Psychological_Screening.pdf"
  );
  const [reportText, setReportText] = useState(
    initialReportText ||
      "Clinical Assessment Results:\n• PHQ-9 Depression Score: 13 / 27 (Moderate low mood)\n• GAD-7 Anxiety Score: 12 / 21 (Moderate anxiety, restlessness)\n• Subjective sleep quality: Fragmented, difficulty falling asleep."
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<
    (ReportAnalysisData & { recommendedDoctor?: any }) | null
  >(null);
  const [langTab, setLangTab] = useState<"HI" | "EN">("HI");

  if (!isOpen) return null;

  const handleApplyPreset = (preset: (typeof PRESETS)[0]) => {
    setFileName(preset.fileName);
    setReportText(preset.text);
    setAnalysisResult(null);
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const data = await assistantService.analyzeLabReport({
        fileName,
        reportText,
      });
      setAnalysisResult(data);
      toast.success("Document analyzed by Durrmi Mental Health AI!");
    } catch {
      toast.error("Failed to analyze report.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    if (file.type.includes("text") || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setReportText(text);
      };
      reader.readAsText(file);
    }
  };

  const getStatusBadge = (status: LabParameter["status"]) => {
    switch (status) {
      case "HIGH":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1 font-semibold text-[10px]">
            <AlertTriangle className="w-3 h-3 text-amber-500" /> ELEVATED
          </Badge>
        );
      case "LOW":
        return (
          <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 flex items-center gap-1 font-semibold text-[10px]">
            🔵 SUBOPTIMAL
          </Badge>
        );
      default:
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold text-[10px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> OPTIMAL
          </Badge>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-card border border-emerald-200 dark:border-emerald-800/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-100 dark:border-emerald-900/50 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-xs flex-shrink-0">
              <DurrmiLogoIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                  Durrmi AI Clinical & Wellness Report Analyzer
                </h2>
                <Badge className="bg-white/20 hover:bg-white/20 text-emerald-50 border-white/30 text-[10px] uppercase font-semibold">
                  Mental Health AI
                </Badge>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Analyze psychological assessments, therapy prescriptions, or neuro-biomarkers (Vit D3, B12, Thyroid, Cortisol) affecting emotional wellbeing.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-white/80 hover:text-white hover:bg-white/15 flex-shrink-0"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs sm:text-sm">
          {!analysisResult && !isAnalyzing ? (
            <div className="space-y-4">
              {/* Presets Bar */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Try Sample Reports / Assessments:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 text-left transition-all group cursor-pointer"
                    >
                      <span className="text-base block mb-1">{p.icon}</span>
                      <span className="text-xs font-semibold text-emerald-950 dark:text-emerald-200 block truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                        {p.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* File Name & Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Document / Assessment File
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. PHQ9_Screening_Report.pdf or Prescription.pdf"
                  />
                  <label className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Upload File
                    <input
                      type="file"
                      accept="application/pdf,image/*,.txt,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Document Text / Findings Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Extracted Scores, Prescription Details, or Lab Notes
                </label>
                <textarea
                  rows={4}
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Paste assessment scores (e.g. PHQ-9: 14, GAD-7: 12), psychiatric medication names, or lab values (e.g. Vitamin D3: 15 ng/mL, Thyroid TSH: 5.4 uIU/mL)..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-emerald-500 outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <Button
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2.5 rounded-xl shadow-md shadow-emerald-700/20 cursor-pointer"
                onClick={handleRunAnalysis}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze with Durrmi Mental Health AI & Match Specialist
              </Button>
            </div>
          ) : isAnalyzing ? (
            <div className="text-center py-16 space-y-4">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
                <DurrmiLogoIcon className="w-6 h-6 text-emerald-600 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">
                  Durrmi AI Analyzing Emotional Wellness & Clinical Biomarkers...
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Cross-referencing psychological scores, neuro-nutrients, and evidence-based clinical protocols...
                </p>
              </div>
            </div>
          ) : analysisResult ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Output Toolbar */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-foreground truncate max-w-[200px] sm:max-w-[320px]">
                    {analysisResult.fileName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white dark:bg-card border border-border rounded-xl p-0.5 shadow-2xs">
                    <button
                      type="button"
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                        langTab === "HI"
                          ? "bg-emerald-600 text-white"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setLangTab("HI")}
                    >
                      🇮🇳 हिंदी सारांश
                    </button>
                    <button
                      type="button"
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                        langTab === "EN"
                          ? "bg-emerald-600 text-white"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setLangTab("EN")}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs rounded-xl border-border/80 cursor-pointer"
                    onClick={() => setAnalysisResult(null)}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" /> Re-analyze
                  </Button>
                </div>
              </div>

              {/* Dual Language Findings Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-background dark:from-emerald-950/40 dark:via-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Clinical Assessment & Findings
                  </span>
                  <Badge variant="outline" className="border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-[10px]">
                    {langTab === "HI" ? "मानसिक स्वास्थ्य विश्लेषण" : "Mind-Body Health Insights"}
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed text-foreground">
                  {langTab === "HI" ? analysisResult.summaryHindi : analysisResult.summaryEnglish}
                </p>
              </div>

              {/* Extracted Parameters Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Extracted Parameters & Assessment Scales
                </h4>
                <div className="border border-border rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/50 border-b border-border font-semibold text-muted-foreground">
                      <tr>
                        <th className="p-3">Scale / Biomarker</th>
                        <th className="p-3">Observed Value</th>
                        <th className="p-3">Clinical Reference</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {analysisResult.parameters.map((param, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition-colors">
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

              {/* Evidence-Based Coping & Lifestyle Guidance */}
              {analysisResult.dietAdvice && analysisResult.dietAdvice.length > 0 && (
                <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/50 space-y-2">
                  <h4 className="text-xs font-semibold text-teal-900 dark:text-teal-200 uppercase tracking-wider flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-teal-600" /> Recommended Coping & Wellness Protocol
                  </h4>
                  <ul className="space-y-1.5 text-xs text-foreground list-disc list-inside">
                    {analysisResult.dietAdvice.map((advice, i) => (
                      <li key={i}>{advice}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Matched Specialist Therapist Recommendation Card */}
              {analysisResult.recommendedDoctor && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center backdrop-blur-xs shrink-0">
                      <DurrmiLogoIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-emerald-100 uppercase tracking-wider">
                        MATCHED DURRMI THERAPIST
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {analysisResult.recommendedDoctor.doctorName}
                      </h4>
                      <p className="text-xs text-emerald-100/90">
                        {analysisResult.recommendedDoctor.specialization} • Fee: ₹{analysisResult.recommendedDoctor.consultationFee}
                      </p>
                      <p className="text-[11px] text-emerald-50/80 mt-0.5">
                        {analysisResult.recommendedDoctor.reason}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="bg-white hover:bg-emerald-50 text-emerald-800 font-semibold px-4 py-2 rounded-xl shrink-0 shadow-sm cursor-pointer transition-all active:scale-95"
                    onClick={() => {
                      onClose();
                      navigate({ to: "/doctors" });
                    }}
                  >
                    <span>Book Session Now</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Confidential AI Clinical Decision Support (Non-Diagnostic)</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl cursor-pointer">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
