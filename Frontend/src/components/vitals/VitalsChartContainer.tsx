import { useState } from "react";
import { Activity, Heart, Scale, Plus, Trash2, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import type { HealthVitalDto } from "@/lib/api/types";
import { vitalsService } from "@/services/vitals.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VitalsChartContainerProps {
  vitals: HealthVitalDto[];
  onRefresh: () => void;
  onOpenLogModal: () => void;
  readOnly?: boolean;
}

export function VitalsChartContainer({ vitals, onRefresh, onOpenLogModal, readOnly = false }: VitalsChartContainerProps) {
  const latestVital = vitals[0];

  // Helper for status badges
  const getGlucoseBadge = (val?: number) => {
    if (!val) return null;
    if (val <= 100) return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Normal ({val} mg/dL)</Badge>;
    if (val <= 125) return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">Pre-Diabetes ({val} mg/dL)</Badge>;
    return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/30">High ({val} mg/dL)</Badge>;
  };

  const getBpBadge = (sys?: number, dia?: number) => {
    if (!sys || !dia) return null;
    if (sys <= 120 && dia <= 80) return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Normal ({sys}/{dia})</Badge>;
    if (sys <= 130 && dia <= 85) return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">Elevated ({sys}/{dia})</Badge>;
    return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/30">High ({sys}/{dia})</Badge>;
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this health log?")) {
      await vitalsService.deleteVital(id);
      onRefresh();
    }
  };

  // Sort chronological for charts (oldest to newest)
  const sortedVitals = [...vitals].sort((a, b) => new Date(a.logDate).getTime() - new Date(b.logDate).getTime());

  return (
    <div className="space-y-6">
      {/* Top Banner Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-xs">
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <Activity className="size-5 text-primary" /> Health Vitals & Metabolic Trends
          </h2>
          <p className="text-xs text-muted-foreground">
            Track daily blood sugar, blood pressure, weight, and pulse trends over time.
          </p>
        </div>
        {!readOnly && (
          <Button onClick={onOpenLogModal} className="gap-2 text-xs font-semibold shadow-xs">
            <Plus className="size-4" /> Log New Vitals
          </Button>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Fasting Sugar */}
        <div className="surface-panel p-4 space-y-2 border-l-4 border-l-primary">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Fasting Glucose</span>
            <span className="text-primary font-bold">🩸 Sugar</span>
          </div>
          <div className="text-xl font-extrabold">{latestVital?.fastingGlucose ? `${latestVital.fastingGlucose} mg/dL` : "--"}</div>
          <div>{getGlucoseBadge(latestVital?.fastingGlucose)}</div>
        </div>

        {/* Blood Pressure */}
        <div className="surface-panel p-4 space-y-2 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Blood Pressure</span>
            <Heart className="size-4 text-rose-500 fill-rose-500/20" />
          </div>
          <div className="text-xl font-extrabold">
            {latestVital?.systolicBp && latestVital?.diastolicBp ? `${latestVital.systolicBp}/${latestVital.diastolicBp}` : "--"}
          </div>
          <div>{getBpBadge(latestVital?.systolicBp, latestVital?.diastolicBp)}</div>
        </div>

        {/* Body Weight & BMI */}
        <div className="surface-panel p-4 space-y-2 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Weight & BMI</span>
            <Scale className="size-4 text-emerald-500" />
          </div>
          <div className="text-xl font-extrabold">{latestVital?.weightKg ? `${latestVital.weightKg} kg` : "--"}</div>
          {latestVital?.bmi && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px]">
              BMI: {latestVital.bmi}
            </Badge>
          )}
        </div>

        {/* Heart Rate */}
        <div className="surface-panel p-4 space-y-2 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Heart Rate</span>
            <Activity className="size-4 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold">{latestVital?.heartRateBpm ? `${latestVital.heartRateBpm} bpm` : "--"}</div>
          <span className="text-[11px] text-muted-foreground">Resting Pulse</span>
        </div>
      </div>

      {/* SVG Trend Graphs */}
      {sortedVitals.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blood Glucose SVG Chart */}
          <div className="surface-panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <TrendingUp className="size-4 text-primary" /> Blood Glucose (Sugar) Trend
              </h3>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-primary inline-block" /> Fasting</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500 inline-block" /> Post-Meal (PP)</span>
              </div>
            </div>

            {/* Simple Visual Line SVG */}
            <div className="h-40 w-full bg-accent/20 rounded-lg p-3 flex flex-col justify-between border border-border/40 relative">
              <div className="absolute inset-x-3 top-1/2 border-b border-dashed border-muted-foreground/30 flex justify-between text-[9px] text-muted-foreground px-1">
                <span>Normal Max (100 mg/dL)</span>
              </div>
              <div className="flex items-end justify-between h-full pt-4 px-2">
                {sortedVitals.map((item, idx) => {
                  const fastHeight = Math.min(Math.max(((item.fastingGlucose || 90) - 60) * 1.5, 20), 110);
                  const ppHeight = Math.min(Math.max(((item.postPrandialGlucose || 120) - 60) * 1.2, 30), 120);

                  return (
                    <div key={item.id} className="flex flex-col items-center gap-1 flex-1">
                      <div className="flex items-end gap-1.5 h-28">
                        {item.fastingGlucose && (
                          <div
                            style={{ height: `${fastHeight}px` }}
                            className="w-3.5 bg-primary/80 rounded-t-md transition-all hover:bg-primary relative group"
                            title={`Fasting: ${item.fastingGlucose} mg/dL`}
                          />
                        )}
                        {item.postPrandialGlucose && (
                          <div
                            style={{ height: `${ppHeight}px` }}
                            className="w-3.5 bg-amber-500/80 rounded-t-md transition-all hover:bg-amber-500 relative group"
                            title={`Post Meal: ${item.postPrandialGlucose} mg/dL`}
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">{item.logDate.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Blood Pressure SVG Chart */}
          <div className="surface-panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold flex items-center gap-1.5 text-foreground">
                <Heart className="size-4 text-rose-500 fill-rose-500/20" /> Blood Pressure Trend
              </h3>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-rose-500 inline-block" /> Systolic</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-blue-500 inline-block" /> Diastolic</span>
              </div>
            </div>

            {/* Simple Visual Bar SVG */}
            <div className="h-40 w-full bg-accent/20 rounded-lg p-3 flex flex-col justify-between border border-border/40 relative">
              <div className="absolute inset-x-3 top-1/2 border-b border-dashed border-muted-foreground/30 flex justify-between text-[9px] text-muted-foreground px-1">
                <span>Systolic Normal (120 mmHg)</span>
              </div>
              <div className="flex items-end justify-between h-full pt-4 px-2">
                {sortedVitals.map((item) => {
                  const sysHeight = Math.min(Math.max(((item.systolicBp || 120) - 80) * 2, 20), 110);
                  const diaHeight = Math.min(Math.max(((item.diastolicBp || 80) - 40) * 1.5, 15), 90);

                  return (
                    <div key={item.id} className="flex flex-col items-center gap-1 flex-1">
                      <div className="flex items-end gap-1.5 h-28">
                        {item.systolicBp && (
                          <div
                            style={{ height: `${sysHeight}px` }}
                            className="w-3.5 bg-rose-500/80 rounded-t-md transition-all hover:bg-rose-500"
                            title={`Systolic: ${item.systolicBp} mmHg`}
                          />
                        )}
                        {item.diastolicBp && (
                          <div
                            style={{ height: `${diaHeight}px` }}
                            className="w-3.5 bg-blue-500/80 rounded-t-md transition-all hover:bg-blue-500"
                            title={`Diastolic: ${item.diastolicBp} mmHg`}
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">{item.logDate.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Vitals Table */}
      <div className="surface-panel p-5 space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Calendar className="size-4 text-primary" /> Vitals History & Clinical Logs
        </h3>

        {vitals.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
            <Activity className="size-8 text-muted-foreground/40 mx-auto mb-2" />
            No vitals logged yet. Click <strong>Log New Vitals</strong> above to add your first entry!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="p-3">Log Date</th>
                  <th className="p-3">Fasting Glucose</th>
                  <th className="p-3">Post-Meal Glucose</th>
                  <th className="p-3">Blood Pressure</th>
                  <th className="p-3">Weight (BMI)</th>
                  <th className="p-3">Pulse</th>
                  <th className="p-3">Notes</th>
                  {!readOnly && <th className="p-3 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {vitals.map((v) => (
                  <tr key={v.id} className="hover:bg-accent/40 transition-colors">
                    <td className="p-3 font-semibold text-foreground whitespace-nowrap">{v.logDate}</td>
                    <td className="p-3">{v.fastingGlucose ? `${v.fastingGlucose} mg/dL` : "--"}</td>
                    <td className="p-3">{v.postPrandialGlucose ? `${v.postPrandialGlucose} mg/dL` : "--"}</td>
                    <td className="p-3 font-medium">{v.systolicBp && v.diastolicBp ? `${v.systolicBp}/${v.diastolicBp} mmHg` : "--"}</td>
                    <td className="p-3">{v.weightKg ? `${v.weightKg} kg ${v.bmi ? `(BMI ${v.bmi})` : ""}` : "--"}</td>
                    <td className="p-3">{v.heartRateBpm ? `${v.heartRateBpm} bpm` : "--"}</td>
                    <td className="p-3 text-muted-foreground max-w-xs truncate">{v.notes || "--"}</td>
                    {!readOnly && (
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(v.id)}
                          className="text-rose-500 hover:text-rose-600 p-1 rounded-md transition-colors"
                          title="Delete log"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
