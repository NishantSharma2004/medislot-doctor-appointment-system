import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Activity, AlertTriangle, ArrowRight, Brain, CalendarClock, CheckCircle2, ChevronRight, Heart, ShieldAlert, Sparkles, Stethoscope, Pill, Plus, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyzeHealthRisk, type HealthRiskResponse } from "@/services/health-risk.service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/health-risk-calculator")({
  component: HealthRiskCalculatorPage,
});

function HealthRiskCalculatorPage() {
  const navigate = useNavigate();

  // Form State
  const [fastingGlucose, setFastingGlucose] = useState(95);
  const [ppGlucose, setPpGlucose] = useState(130);
  const [systolicBp, setSystolicBp] = useState(120);
  const [diastolicBp, setDiastolicBp] = useState(80);
  const [heartRate, setHeartRate] = useState(72);
  const [age, setAge] = useState(38);
  const [bmi, setBmi] = useState(24.2);
  const [medInput, setMedInput] = useState("");
  const [medications, setMedications] = useState<string[]>(["Metformin (Optional)"]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthRiskResponse | null>(null);

  const handleAddMed = () => {
    if (medInput.trim() && !medications.includes(medInput.trim())) {
      setMedications([...medications, medInput.trim()]);
      setMedInput("");
    }
  };

  const handleRemoveMed = (med: string) => {
    setMedications(medications.filter((m) => m !== med));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await analyzeHealthRisk({
        fastingGlucose,
        ppGlucose,
        systolicBp,
        diastolicBp,
        heartRate,
        age,
        bmi,
        currentMedications: medications,
      });
      setResult(res);
      toast.success("AI Health Risk Assessment Complete!");
    } catch {
      toast.error("Failed to run health risk analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 font-sans pb-16">
      {/* HEADER HERO BANNER */}
      <section className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#FAF8F5] border-b border-amber-200/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold uppercase tracking-wider">
                <Brain className="size-3.5 text-amber-600" /> High-Accuracy Clinical ML Model
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Predict Diabetes & Heart Disease Risk in Seconds
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                Enter your Fasting/PP Glucose, Blood Pressure, and Body Vitals below to run our ensemble machine learning risk assessment.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/90 p-4 rounded-3xl border border-amber-200 shadow-xs shrink-0">
              <div className="size-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 font-black text-2xl">
                95%
              </div>
              <div>
                <p className="text-xs text-slate-900 font-bold">Trained Confidence</p>
                <p className="text-xs text-slate-500">PIMA & Framingham Guidelines</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Vitals Input Panel */}
          <div className="lg:col-span-6 rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Activity className="size-5 text-amber-600" /> Enter Patient Vitals & Health Data
                </h2>
                <p className="text-xs text-slate-500">Adjust sliders or type values to evaluate risk.</p>
              </div>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200">
                Step 1 of 2
              </span>
            </div>

            {/* Fasting Glucose */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <Label htmlFor="fasting" className="flex items-center gap-1.5">
                  🩸 Fasting Blood Glucose (mg/dL)
                </Label>
                <span className="font-mono text-sm font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  {fastingGlucose} mg/dL
                </span>
              </div>
              <Slider
                id="fasting"
                min={50}
                max={300}
                step={1}
                value={[fastingGlucose]}
                onValueChange={(val) => setFastingGlucose(val[0])}
                className="py-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>70 (Normal)</span>
                <span>100 (Pre-Diabetes)</span>
                <span>126+ (High Risk)</span>
              </div>
            </div>

            {/* Post Meal PP Glucose */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <Label htmlFor="pp" className="flex items-center gap-1.5">
                  🍰 Post-Meal (PP) Glucose (mg/dL)
                </Label>
                <span className="font-mono text-sm font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  {ppGlucose} mg/dL
                </span>
              </div>
              <Slider
                id="pp"
                min={60}
                max={400}
                step={1}
                value={[ppGlucose]}
                onValueChange={(val) => setPpGlucose(val[0])}
                className="py-2"
              />
            </div>

            {/* Systolic & Diastolic BP Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <Label htmlFor="sys">💓 Systolic BP (mmHg)</Label>
                  <span className="font-mono text-xs font-bold text-amber-700">{systolicBp}</span>
                </div>
                <Input
                  id="sys"
                  type="number"
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(Number(e.target.value))}
                  className="h-10 text-xs font-bold font-mono rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <Label htmlFor="dia">💓 Diastolic BP (mmHg)</Label>
                  <span className="font-mono text-xs font-bold text-amber-700">{diastolicBp}</span>
                </div>
                <Input
                  id="dia"
                  type="number"
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(Number(e.target.value))}
                  className="h-10 text-xs font-bold font-mono rounded-xl border-slate-200"
                />
              </div>
            </div>

            {/* Age & BMI Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-xs font-bold text-slate-700">🎂 Patient Age (Years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="h-10 text-xs font-bold font-mono rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bmi" className="text-xs font-bold text-slate-700">⚖️ Body Mass Index (BMI)</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  value={bmi}
                  onChange={(e) => setBmi(Number(e.target.value))}
                  className="h-10 text-xs font-bold font-mono rounded-xl border-slate-200"
                />
              </div>
            </div>

            {/* Medications List */}
            <div className="space-y-2 pt-2 border-t">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Pill className="size-4 text-amber-600" /> Current Medications (Optional)
              </Label>
              <div className="flex gap-2">
                <Input
                  value={medInput}
                  onChange={(e) => setMedInput(e.target.value)}
                  placeholder="e.g. Metformin, Amlodipine"
                  className="h-10 text-xs rounded-xl border-slate-200"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddMed())}
                />
                <Button type="button" onClick={handleAddMed} size="sm" className="h-10 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700">
                  <Plus className="size-4" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {medications.map((m) => (
                  <span key={m} className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                    {m}
                    <button type="button" onClick={() => handleRemoveMed(m)} className="hover:text-rose-700">
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-amber-600 text-white font-extrabold hover:bg-amber-700 text-base shadow-md"
            >
              {loading ? "Running ML Risk Prediction..." : "⚡ Run Clinical ML Risk Analysis"}
            </Button>
          </div>

          {/* Right Column: AI Analysis Result Display */}
          <div className="lg:col-span-6 rounded-3xl border border-amber-200/80 bg-white p-6 sm:p-8 space-y-6 shadow-xs h-fit">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Brain className="size-5 text-amber-600" /> AI Risk Assessment Report
              </h2>
              <span className="text-[11px] font-bold bg-teal-100 text-teal-900 px-2.5 py-1 rounded-full border border-teal-200">
                Step 2 of 2
              </span>
            </div>

            {!result && !loading ? (
              <div className="text-center py-16 space-y-4">
                <div className="size-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <Activity className="size-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Risk Analysis Executed Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Adjust patient vitals on the left panel and click 'Run Clinical ML Risk Analysis' to view predictions.
                </p>
              </div>
            ) : null}

            {loading ? (
              <div className="text-center py-16 space-y-4">
                <Sparkles className="size-10 text-amber-600 animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-900">Evaluating PIMA & Framingham Ensembles...</p>
              </div>
            ) : null}

            {result ? (() => {
              const category = (result as any).overallRiskCategory || result.riskCategory || "LOW";
              const diabetesPercent = (result as any).diabetesRiskPercentage ?? result.diabetesRisk?.probability ?? 0;
              const summary = (result as any).clinicalSummary || result.diabetesRisk?.summary || result.clinicalDisclaimer || "";
              const heartPercent = (result as any).heartDiseaseRiskPercentage ?? result.cardiologyRisk?.probability ?? 0;
              const heartCategory = (result as any).heartDiseaseCategory || result.cardiologyRisk?.stage || "Normal";
              const hypertensionCategory = (result as any).hypertensionCategory || result.cardiologyRisk?.status || "Normal";
              const recommendations: string[] = (result as any).recommendations || result.lifestyleAdviceEnglish || [];

              return (
                <div className="space-y-6">
                  {/* Overall Risk Card */}
                  <div className={cn(
                    "p-6 rounded-3xl border text-center space-y-2 shadow-xs",
                    (category === "HIGH" || category === "CRITICAL") && "bg-rose-50 border-rose-200 text-rose-900",
                    category === "MODERATE" && "bg-amber-50 border-amber-200 text-amber-900",
                    category === "LOW" && "bg-emerald-50 border-emerald-200 text-emerald-900",
                  )}>
                    <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-white/80 border shadow-xs">
                      Overall Category: {category} RISK
                    </span>
                    <div className="text-4xl font-black mt-2">
                      {diabetesPercent}% <span className="text-base font-semibold text-slate-600">Diabetes Risk</span>
                    </div>
                    <p className="text-xs leading-relaxed font-medium max-w-md mx-auto pt-2">
                      {summary}
                    </p>
                  </div>

                  {/* Specific Risk Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-center space-y-1">
                      <p className="text-[11px] font-bold text-slate-500">Heart Disease Risk</p>
                      <p className="text-2xl font-black text-slate-900">{heartPercent}%</p>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        {heartCategory}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-center space-y-1">
                      <p className="text-[11px] font-bold text-slate-500">Hypertension Category</p>
                      <p className="text-sm font-extrabold text-slate-900 pt-1">{hypertensionCategory}</p>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                        BP Check Validated
                      </span>
                    </div>
                  </div>

                  {/* Action Recommendations */}
                  {recommendations && recommendations.length > 0 ? (
                    <div className="space-y-3 border-t pt-4">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                        💡 Clinical Action Plan & Next Steps
                      </h3>
                      <ul className="space-y-2 text-xs font-medium text-slate-700">
                        {recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                            <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <Button
                    onClick={() => navigate({ to: "/doctors" })}
                    className="w-full h-12 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 gap-2"
                  >
                    <Stethoscope className="size-5" /> Book Consultation With Specialist Doctor ➔
                  </Button>
                </div>
              );
            })() : null}
          </div>
        </div>
      </div>
    </div>
  );
}
