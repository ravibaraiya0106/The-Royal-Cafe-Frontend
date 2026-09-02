import { postRequest } from "./apiService";
import { ENDPOINTS } from "@/api/endpoints";

export type CreateOrderResponse = {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  amount_paid: number;
  notes?: Record<string, unknown>;
  created_at: number;
  key_id: string;
};

export type VerifyPaymentResponse = {
  verified: boolean;
  razorpay_order_id: string;
  razorpay_payment_id: string;
};

/* ================= CREATE ORDER ================= */
export const createOrder = async (
  amount: number,
  notes: Record<string, unknown> = {},
) => {
  const res = await postRequest(ENDPOINTS.PAYMENT.CREATE_ORDER, {
    amount,
    currency: "INR",
    notes,
  });
  const { success, message, responseData } = res.data;
  if (!success) throw new Error(message || "Failed to create order");
  return responseData as CreateOrderResponse;
};

/* ================= VERIFY PAYMENT ================= */
export const verifyPayment = async (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const res = await postRequest(ENDPOINTS.PAYMENT.VERIFY, payload);
  const { success, message, responseData } = res.data;
  if (!success) throw new Error(message || "Payment verification failed");
  return responseData as VerifyPaymentResponse;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      close: () => void;
    };
  }
}

/* ================= LOAD CHECKOUT SCRIPT ================= */
export const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not defined"));
      return;
    }
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Razorpay Checkout script"));
    document.body.appendChild(script);
  });
};
