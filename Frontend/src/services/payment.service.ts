import { apiClient } from "@/lib/api/client";
import { USE_MOCK_API, delay } from "./config";

export interface CreateOrderResponse {
  orderId: string;
  appointmentId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  appointmentId: string;
  paymentStatus: string;
}

export const paymentService = {
  async createOrder(appointmentId: string): Promise<CreateOrderResponse> {
    if (USE_MOCK_API) {
      return delay({
        orderId: `order_mock_${Date.now()}`,
        appointmentId,
        amount: 590,
        currency: "INR",
        keyId: "rzp_test_medislot_demo",
      });
    }
    const { data } = await apiClient.post<CreateOrderResponse>("/payments/create-order", { appointmentId });
    return data;
  },

  async verifyPayment(payload: {
    appointmentId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<VerifyPaymentResponse> {
    if (USE_MOCK_API) {
      return delay({
        success: true,
        message: "Payment verified successfully",
        appointmentId: payload.appointmentId,
        paymentStatus: "PAID",
      });
    }
    const { data } = await apiClient.post<VerifyPaymentResponse>("/payments/verify", payload);
    return data;
  },

  async doctorRespond(appointmentId: string, accept: boolean, reason?: string): Promise<VerifyPaymentResponse> {
    if (USE_MOCK_API) {
      return delay({
        success: true,
        message: accept ? "Appointment accepted" : "Appointment rejected",
        appointmentId,
        paymentStatus: "CONFIRMED",
      });
    }
    const { data } = await apiClient.post<VerifyPaymentResponse>(`/payments/doctor-respond/${appointmentId}`, { accept, reason });
    return data;
  },
};
