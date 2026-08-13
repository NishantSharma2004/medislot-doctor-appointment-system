import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Activity, AlertTriangle, ArrowRight, Brain, CalendarClock, CheckCircle2, ChevronRight, Heart, ShieldAlert, Sparkles, Stethoscope, Pill } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/layout/AppShell";
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
    <PageShell
      title="🤖 AI/ML Health Risk Predictor"
      description="Clinically grounded AI predictive model trained on PIMA Diabetes & Framingham Heart Study benchmarks."
    >
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        {/* Hero Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 shadow-2xl border border-emerald-800/40">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                <Brain className="size-3.5" /> High-Accuracy Clinical ML Model
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Predict Diabetes & Heart Disease Risk in Seconds
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed font-medium">
                Enter your Fasting/PP Glucose, Blood Pressure, and Body Vitals below to run our ensemble machine learning risk assessment.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
              <div className="size-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-black text-xl shadow-inner">
                95%
              </div>
              <div>
                <p className="text-xs text-emerald-200 font-semibold">Trained Confidence</p>
                <p className="text-xs text-muted-foreground text-emerald-100/70">PIMA & Framingham Guidelines</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Vitals Input Panel */}
          <div className="lg:col-span-6 surface-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-border/80 shadow-xl bg-card">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Activity className="size-5 text-emerald-500" /> Enter Patient Vitals & Health Data
                </h2>
                <p className="text-xs text-muted-foreground">Adjust sliders or type values to evaluate risk.</p>
              </div>
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                Step 1 of 2
              </Badge>
            </div>

            {/* Fasting Glucose */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <Label htmlFor="fasting" className="flex items-center gap-1.5 text-foreground">
                  🩸 Fasting Blood Glucose (mg/dL)
                </Label>
                <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
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
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>70 (Normal)</span>
                <span>100 (Pre-Diabetes)</span>
                <span>126+ (High Risk)</span>
              </div>
            </div>

            {/* Post Meal PP Glucose */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <Label htmlFor="pp" className="flex items-center gap-1.5 text-foreground">
                  🍰 Post-Meal (PP) Glucose (mg/dL)
                </Label>
                <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
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
                <div className="flex justify-between items-center text-xs font-semibold">
                  <Label htmlFor="sys" className="text-foreground">💓 Systolic BP (mmHg)</Label>
                  <span className="font-mono text-xs font-bold text-primary">{systolicBp}</span>
                </div>
                <Input
                  id="sys"
                  type="number"
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(Number(e.target.value))}
                  className="h-10 text-xs font-bold font-mono"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <Label htmlFor="dia" className="text-foreground">💓 Diastolic BP (mmHg)</Label>
                  <span className="font-mono text-xs font-bold text-primary">{diastolicBp}</span>
                </div>
                <Input
                  id="dia"
                  type="number"
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(Number(e.target.value))}
                  className="h-10 text-xs font-bold font-mono"
                />
              </div>
            </div>

            {/* Age & BMI Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-xs font-semibold text-foreground">🎂 Patient Age (Years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="h-10 text-xs font-bold font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bmi" className="text-xs font-semibold text-foreground">⚖️ Body Mass Index (BMI)</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  value={bmi}
                  onChange={(e) => setBmi(Number(e.target.value))}
                  className="h-10 text-xs font-bold font-mono"
                />
              </div>
            </div>

            {/* Current Medications */}
            <div className="space-y-2 pt-2 border-t">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Pill className="size-3.5 text-primary" /> Active Medications (Side-Effect & Interaction Check)
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Type drug name (e.g. Steroids, Decongestants)..."
                  value={medInput}
                  onChange={(e) => setMedInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddMed())}
                  className="h-9 text-xs"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddMed} className="h-9 text-xs font-semibold">
                  Add
                </Button>
              </div>

              {medications.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {medications.map((m) => (
                    <Badge key={m} variant="secondary" className="text-[11px] gap-1 px-2 py-0.5">
                      {m}
                      <button type="button" onClick={() => handleRemoveMed(m)} className="hover:text-destructive text-muted-foreground ml-1">✕</button>
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full h-12 text-sm font-bold gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg cursor-pointer transition-all"
            >
              {loading ? (
                <span>Analyzing ML Parameters...</span>
              ) : (
                <>
                  <Sparkles className="size-4" /> Run ML Health Risk Analysis <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>

          {/* Right Column: Interactive ML Prediction Results */}
          <div className="lg:col-span-6 space-y-6">
            {result ? (
              <div className="surface-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-emerald-500/30 shadow-2xl bg-card animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Result Header & Gauge Score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-foreground">Health Risk Analysis Report</h3>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-emerald-500/30">
                        ✓ {result.modelConfidence}% Confidence
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">ML Ensemble Risk Classification Result</p>
                  </div>

                  {/* Visual Speedometer Risk Score */}
                  <div className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl border shadow-inner self-start sm:self-auto",
                    result.riskColor === "GREEN" && "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
                    result.riskColor === "AMBER" && "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400",
                    result.riskColor === "RED" && "bg-destructive/10 border-destructive/40 text-destructive",
                    result.riskColor === "PURPLE" && "bg-purple-500/10 border-purple-500/40 text-purple-600 dark:text-purple-400",
                  )}>
                    <div className="text-center px-2">
                      <span className="text-3xl font-black font-mono leading-none">{result.overallRiskScore}</span>
                      <span className="text-[10px] block font-bold text-muted-foreground">/100 RISK</span>
                    </div>
                    <div className="border-l pl-3">
                      <Badge className={cn(
                        "text-xs font-black uppercase tracking-wider px-2 py-0.5",
                        result.riskColor === "GREEN" && "bg-emerald-600 text-white",
                        result.riskColor === "AMBER" && "bg-amber-600 text-white",
                        result.riskColor === "RED" && "bg-destructive text-white",
                        result.riskColor === "PURPLE" && "bg-purple-600 text-white",
                      )}>
                        {result.riskCategory} RISK
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Diabetes & Cardiology Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Diabetes Card */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        🩸 Diabetes ML Risk
                      </span>
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-bold",
                        result.diabetesRisk.status === "NORMAL" && "text-emerald-600 border-emerald-500/30",
                        result.diabetesRisk.status === "ELEVATED" && "text-amber-600 border-amber-500/30",
                        result.diabetesRisk.status === "HIGH" && "text-destructive border-destructive/30",
                      )}>
                        {result.diabetesRisk.probability}% Risk
                      </Badge>
                    </div>
                    <p className="text-sm font-black text-foreground">{result.diabetesRisk.level}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{result.diabetesRisk.summary}</p>
                  </div>

                  {/* Cardiology Card */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        💓 Cardiology ML Risk
                      </span>
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-bold",
                        result.cardiologyRisk.status === "NORMAL" && "text-emerald-600 border-emerald-500/30",
                        result.cardiologyRisk.status === "ELEVATED" && "text-amber-600 border-amber-500/30",
                        (result.cardiologyRisk.status === "HIGH" || result.cardiologyRisk.status === "CRISIS") && "text-destructive border-destructive/30",
                      )}>
                        {result.cardiologyRisk.probability}% Risk
                      </Badge>
                    </div>
                    <p className="text-sm font-black text-foreground">{result.cardiologyRisk.stage}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{result.cardiologyRisk.summary}</p>
                  </div>
                </div>

                {/* Medication Safety Alerts */}
                {result.medicationWarnings.length > 0 ? (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <AlertTriangle className="size-4 text-amber-600" /> Drug-Condition Interaction Alerts:
                    </div>
                    <ul className="text-xs space-y-1 pl-4 list-disc text-muted-foreground">
                      {result.medicationWarnings.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* Lifestyle Advice Tabs (English & Hindi) */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">💡 Personalized Clinical Lifestyle Plan</h4>
                  <Tabs defaultValue="english" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-9">
                      <TabsTrigger value="english" className="text-xs font-semibold">English Guidelines</TabsTrigger>
                      <TabsTrigger value="hindi" className="text-xs font-semibold">हिंदी मार्गदर्शन</TabsTrigger>
                    </TabsList>
                    <TabsContent value="english" className="p-3 bg-muted/30 rounded-xl space-y-1.5 text-xs text-muted-foreground">
                      {result.lifestyleAdviceEnglish.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </TabsContent>
                    <TabsContent value="hindi" className="p-3 bg-muted/30 rounded-xl space-y-1.5 text-xs text-muted-foreground font-medium">
                      {result.lifestyleAdviceHindi.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Direct 1-Click Specialist Doctor Booking Card */}
                {result.recommendedDoctor ? (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white space-y-3 shadow-xl border border-emerald-700/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                        <Stethoscope className="size-3.5" /> Recommended Specialist Doctor
                      </span>
                      <Badge variant="outline" className={cn(
                        "text-[10px]",
                        result.recommendedDoctor.reason?.includes("Currently no open slots available")
                          ? "border-amber-400/40 text-amber-300 bg-amber-500/10"
                          : "border-emerald-400/40 text-emerald-200 bg-emerald-500/10"
                      )}>
                        {result.recommendedDoctor.reason?.includes("Currently no open slots available") ? "No Slots Open" : "Slots Available ✓"}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white">{result.recommendedDoctor.doctorName}</h4>
                      <p className="text-xs text-emerald-100/80">{result.recommendedDoctor.specialization} · {result.recommendedDoctor.qualifications}</p>
                      <p className="text-xs text-emerald-300 font-semibold mt-0.5">Consultation Fee: ₹{result.recommendedDoctor.consultationFee}</p>

                      {/* Live Slot Status Warning/Success */}
                      {result.recommendedDoctor.reason?.includes("Currently no open slots available") ? (
                        <div className="mt-2 p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                          <AlertTriangle className="size-4 text-amber-400 shrink-0" />
                          <span>Currently no open consultation slots available for online booking. Please check back later or check other active specialists.</span>
                        </div>
                      ) : (
                        <div className="mt-2 p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-semibold text-emerald-200 flex items-center gap-1.5">
                          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                          <span>Open consultation slots available today! Click below to confirm appointment.</span>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => navigate({ to: "/doctors/$doctorId", params: { doctorId: result.recommendedDoctor!.doctorId } })}
                      className={cn(
                        "w-full h-10 text-xs font-bold gap-2 text-black shadow-md cursor-pointer transition-all",
                        result.recommendedDoctor.reason?.includes("Currently no open slots available")
                          ? "bg-amber-400 hover:bg-amber-300"
                          : "bg-emerald-500 hover:bg-emerald-400"
                      )}
                    >
                      <CalendarClock className="size-4" />
                      {result.recommendedDoctor.reason?.includes("Currently no open slots available")
                        ? `View ${result.recommendedDoctor.doctorName}'s Profile & Slots`
                        : `Book Appointment with ${result.recommendedDoctor.doctorName}`}
                    </Button>
                  </div>
                ) : null}

                <p className="text-[10px] text-muted-foreground text-center italic border-t pt-3">
                  {result.clinicalDisclaimer}
                </p>
              </div>
            ) : (
              <div className="surface-panel p-10 rounded-3xl text-center space-y-4 border border-dashed border-border/80 bg-muted/10">
                <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-inner">
                  <Brain className="size-8 animate-pulse" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-foreground">Ready for AI Risk Prediction</h3>
                  <p className="text-xs text-muted-foreground">
                    Adjust your Fasting/PP Glucose, Blood Pressure, and Vitals on the left panel and click <b>"Run ML Health Risk Analysis"</b>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
