import { Printer, Download, FileCheck, X, ShieldCheck, CheckCircle, Calendar, User, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AppointmentDto } from "@/lib/api/types";

interface MedicalInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentDto | null;
}

export function MedicalInvoiceModal({ isOpen, onClose, appointment }: MedicalInvoiceModalProps) {
  if (!isOpen || !appointment) return null;

  const baseFee = appointment.consultationFee || 500;
  const gstTax = Math.round(baseFee * 0.18);
  const dues = appointment.penaltyAmount || 0;
  const grandTotal = baseFee + gstTax + dues;

  const invoiceNo = `INV-${appointment.id.substring(0, 8).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="surface-panel w-full max-w-2xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-border space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-black text-xl">
              🏥
            </div>
            <div>
              <h3 className="font-black text-xl text-foreground">Durrmi Medical GST Invoice</h3>
              <p className="text-xs text-muted-foreground">Official Healthcare Consultation & Dues Receipt</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handlePrint} className="gap-1.5 text-xs rounded-xl">
              <Printer className="size-3.5" /> Print Invoice
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose} className="size-8 p-0 rounded-full">
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Invoice Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/40 border border-border/50 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Invoice Number</span>
            <span className="font-bold font-mono text-foreground">{invoiceNo}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Consultation Date</span>
            <span className="font-bold text-foreground">{appointment.date}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Payment Mode</span>
            <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 mt-0.5">
              {appointment.paymentMode === "ONLINE_RAZORPAY" ? "ONLINE RAZORPAY / UPI" : "CASH AT CLINIC"}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Payment Status</span>
            <Badge className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 mt-0.5">
              {appointment.paymentStatus || "PAID"}
            </Badge>
          </div>
        </div>

        {/* Patient & Doctor Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-border/60 space-y-1.5">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <User className="size-3.5" /> Patient Details
            </span>
            <h4 className="font-bold text-sm text-foreground">{appointment.patientName || "Patient Record"}</h4>
            <p className="text-xs text-muted-foreground">{appointment.patientEmail || "Registered Patient Account"}</p>
            {appointment.patientPhone ? <p className="text-xs text-muted-foreground">Phone: {appointment.patientPhone}</p> : null}
          </div>

          <div className="p-4 rounded-xl border border-border/60 space-y-1.5">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <Stethoscope className="size-3.5" /> Healthcare Practitioner
            </span>
            <h4 className="font-bold text-sm text-foreground">Dr. {appointment.doctorName}</h4>
            <p className="text-xs text-muted-foreground">Specialization: {appointment.specialization}</p>
            <p className="text-xs text-muted-foreground">Durrmi Verified Clinic</p>
          </div>
        </div>

        {/* Footnote */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/50">
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-emerald-500" /> Authorized Medical Receipt for Health Insurance Claims
          </span>
          <span>Thank you for choosing Durrmi Clinic</span>
        </div>
      </div>
    </div>
  );
}
