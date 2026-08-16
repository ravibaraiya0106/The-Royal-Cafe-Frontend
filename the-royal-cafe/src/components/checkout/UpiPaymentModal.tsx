import { useState, useEffect } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { FiCopy, FiCheck, FiSmartphone, FiShield } from "react-icons/fi";

import logo from "@/assets/images/logo.png";
import InputField from "@/components/common/form/InputField";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/common/form/Button";
import { toastSuccess, toastError } from "@/utils/toast";

type Props = {
  open: boolean;
  onClose: () => void;
  amount: number;
  upiId?: string;
  onSubmitUtr: (utr: string) => Promise<void>;
  loading?: boolean;
};

const DEFAULT_UPI_ID = import.meta.env.VITE_UPI_ID || "theroyalcafe@upi";
const CAFE_NAME = "The Royal Cafe";

const UpiPaymentModal = ({
  open,
  onClose,
  amount,
  upiId = DEFAULT_UPI_ID,
  onSubmitUtr,
  loading = false,
}: Props) => {
  const [utr, setUtr] = useState("");
  const [copied, setCopied] = useState(false);
  const [utrError, setUtrError] = useState("");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    CAFE_NAME,
  )}&am=${amount}&cu=INR`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiDeepLink,
  )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toastSuccess("UPI ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAppLaunch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) {
      e.preventDefault();
      toastError(
        "Mobile App Link: On Desktop/PC, please scan the QR code using Google Pay or PhonePe on your mobile phone.",
      );
    }
  };

  const handleSubmit = async () => {
    const cleanUtr = utr.trim();
    if (!cleanUtr) {
      setUtrError("12-digit UTR / Transaction ID is required");
      return;
    }

    if (!/^\d{12}$/.test(cleanUtr)) {
      setUtrError("UTR / Transaction ID must be exactly 12 digits");
      return;
    }

    setUtrError("");
    try {
      await onSubmitUtr(cleanUtr);
    } catch (err: unknown) {
      toastError(
        err instanceof Error ? err.message : "Failed to verify UPI payment",
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl my-6 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Paper elevation={0} sx={{ p: 4, borderRadius: "5px" }}>
          {/* HEADER BRAND */}
          <div className="text-center mb-5 border-b border-gray-100 pb-3">
            <img src={logo} className="h-14 mx-auto" alt="Logo" />
            <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold", color: "#6A1B1A" }}>
              Pay via UPI & QR Code
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Scan the QR code or copy UPI ID to complete your payment
            </Typography>
          </div>

          {/* HORIZONTAL 2-COLUMN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* LEFT COLUMN: QR CODE & AMOUNT & UPI ID */}
            <div className="space-y-4">
              {/* AMOUNT BANNER */}
              <div className="bg-brand/5 border border-brand/20 rounded-[5px] p-3 text-center">
                <span className="text-xs text-gray-600 block">Total Amount Payable</span>
                <span className="text-2xl font-bold text-brand block mt-0.5">
                  {formattedAmount}
                </span>
              </div>

              {/* QR CODE CONTAINER */}
              <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-[5px] p-3">
                <img
                  src={qrCodeUrl}
                  alt="Scan to Pay via UPI"
                  className="w-44 h-44 rounded-[5px] border border-white bg-white p-1.5 shadow-xs"
                />
                <p className="text-[11px] text-gray-500 mt-2 font-medium flex items-center gap-1 text-center">
                  <FiShield className="text-emerald-600 inline shrink-0" />
                  <span>Scan with GPay, PhonePe, Paytm, BHIM or any UPI app</span>
                </p>
              </div>

              {/* UPI ID ROW */}
              <div className="bg-gray-50 border border-gray-200 rounded-[5px] p-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-500 font-semibold block uppercase">
                    Official UPI ID
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-900 truncate block">
                    {upiId}
                  </span>
                </div>
                <button
                  onClick={handleCopyUpi}
                  type="button"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand/10 hover:bg-brand/20 text-brand text-xs font-bold rounded-[5px] transition shrink-0"
                >
                  {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
                  <span>{copied ? "Copied" : "Copy ID"}</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: APP LAUNCHERS & UTR FORM & BUTTONS */}
            <div className="space-y-5 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-semibold text-gray-700 block mb-2">
                  Or Pay Directly via Mobile App:
                </span>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <a
                    href={upiDeepLink}
                    onClick={handleAppLaunch}
                    className="flex items-center justify-center gap-1.5 p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-[5px] transition border border-gray-200 text-center"
                  >
                    <FiSmartphone size={13} className="text-brand" />
                    <span>Open UPI App</span>
                  </a>
                  <a
                    href={upiDeepLink}
                    onClick={handleAppLaunch}
                    className="flex items-center justify-center gap-1.5 p-2 bg-brand text-white hover:bg-brand/90 text-xs font-semibold rounded-[5px] transition text-center shadow-xs"
                  >
                    <FiCheck size={13} />
                    <span>Direct Pay</span>
                  </a>
                </div>

                <Box sx={{ mt: 3 }}>
                  <InputField
                    label="12-Digit UTR / Transaction Ref No."
                    name="utr"
                    value={utr}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setUtr(val);
                      if (utrError) setUtrError("");
                    }}
                    error={utrError}
                  />
                  <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                    After paying in your UPI app, check your payment receipt or bank SMS for the 12-digit UTR number and paste it above to confirm your order.
                  </p>
                </Box>
              </div>

              {/* BUTTONS */}
              <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
                <PrimaryButton
                  label="Confirm Payment"
                  onClick={handleSubmit}
                  loading={loading}
                />
                <SecondaryButton label="Close" onClick={onClose} />
              </div>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default UpiPaymentModal;
