import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, QrCode, ShieldCheck, CheckCircle2, AlertCircle, X, Sparkles, Smartphone, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { paymentService } from "@/services/payment.service";

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  doctorName: string;
  consultationFee: number;
  penaltyAmount?: number;
  onSuccess: (paymentId: string) => void;
}

export function RazorpayCheckoutModal({
  isOpen,
  onClose,
  appointmentId,
  doctorName,
  consultationFee,
  penaltyAmount = 0,
  onSuccess,
}: RazorpayCheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const baseFee = consultationFee || 500;
  const gstTax = Math.round(baseFee * 0.18);
  const dues = penaltyAmount || 0;
  const totalPayable = baseFee + gstTax + dues;

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create order
      const order = await paymentService.createOrder(appointmentId);

      // 2. Simulate payment verification
      const mockPaymentId = `pay_sim_${Date.now()}`;
      const mockSignature = `test_sig_${order.orderId}`;

      const res = await paymentService.verifyPayment({
        appointmentId,
        razorpayOrderId: order.orderId,
        razorpayPaymentId: mockPaymentId,
        razorpaySignature: mockSignature,
      });

      if (res.success) {
        toast.success("Payment verified! Receipt generated.", {
          description: `Transaction ID: ${mockPaymentId}`,
        });
        onSuccess(mockPaymentId);
        onClose();
      } else {
        toast.error(res.message || "Payment verification failed.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="surface-panel w-full max-w-md p-6 rounded-2xl shadow-2xl border border-border space-y-5 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Razorpay Secure Checkout</h3>
              <p className="text-xs text-muted-foreground">100% Encrypted Payment Gateway</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose} className="size-8 p-0 rounded-full">
            <X className="size-4" />
          </Button>
        </div>

        {/* Amount Breakdown */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Consultation Fee ({doctorName})</span>
            <span className="font-semibold text-foreground">₹{baseFee.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Medical Service Tax / GST (18%)</span>
            <span className="font-semibold text-foreground">₹{gstTax.toFixed(2)}</span>
          </div>
          {dues > 0 ? (
            <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold border-t border-amber-500/30 pt-1.5">
              <span>⚠️ Previous Missed Dues (50% Penalty)</span>
              <span>+ ₹{dues.toFixed(2)}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between text-sm font-black text-emerald-600 dark:text-emerald-400 border-t border-emerald-500/30 pt-2">
            <span>Total Payable Amount</span>
            <span className="text-lg">₹{totalPayable.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method Options */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground">Select Payment Method</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedMethod("UPI")}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                selectedMethod === "UPI"
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "border-border/80 hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <QrCode className="size-5" />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod("CARD")}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                selectedMethod === "CARD"
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "border-border/80 hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <CreditCard className="size-5" />
              <span>Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod("NETBANKING")}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 text-xs font-semibold transition-all ${
                selectedMethod === "NETBANKING"
                  ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "border-border/80 hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <Landmark className="size-5" />
              <span>Netbanking</span>
            </button>
          </div>
        </div>

        {/* Method Detail Preview */}
        <div className="p-3 rounded-xl bg-muted/50 border border-border/60 text-xs text-muted-foreground flex items-center gap-2">
          <Smartphone className="size-4 text-emerald-500 shrink-0" />
          <span>
            {selectedMethod === "UPI"
              ? "Instant UPI payment via Google Pay, PhonePe, Paytm, or BHIM QR Code."
              : selectedMethod === "CARD"
              ? "Supports all Visa, Mastercard, RuPay, and American Express cards."
              : "Netbanking available for HDFC, SBI, ICICI, Axis, and all major Indian banks."}
          </span>
        </div>

        {/* Sandbox Badge */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground bg-accent/40 p-2 rounded-lg">
          <span className="flex items-center gap-1">
            <Sparkles className="size-3 text-amber-500" /> Free Developer Test Sandbox Active
          </span>
          <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-500 bg-emerald-500/10">
            Zero Cost
          </Badge>
        </div>

        {/* Pay Button */}
        <Button
          onClick={handleSimulatePayment}
          disabled={isProcessing}
          className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl gap-2 text-sm shadow-lg shadow-emerald-950/40"
        >
          <CheckCircle2 className="size-5" />
          {isProcessing ? "Verifying Signature..." : `Pay ₹${totalPayable.toFixed(2)} & Confirm Booking`}
        </Button>
      </div>
    </div>
  );
}
