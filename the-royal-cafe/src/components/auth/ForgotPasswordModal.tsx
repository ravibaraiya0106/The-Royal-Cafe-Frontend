import { useState, useEffect } from "react";
import { Paper, Typography, Box } from "@mui/material";

import logo from "@/assets/images/logo.png";
import { forgotPasswordService } from "@/services/authService";
import { toastSuccess, toastError } from "@/utils/toast";
import InputField from "@/components/common/form/InputField";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/common/form/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
};

const ForgotPasswordModal = ({ open, onClose, onSwitchToLogin }: Props) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
    setApiError("");
  };

  const validate = () => {
    if (!email.trim()) {
      setError("Email address is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setApiError("");
      setSuccessMessage("");

      const msg = await forgotPasswordService(email.trim());
      setSuccessMessage(
        msg || "Password reset link sent! Please check your email inbox."
      );
      toastSuccess("Reset link sent to your email!");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to send reset link";
      setApiError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Paper elevation={0} sx={{ p: 4, borderRadius: "5px" }}>
          {/* BRAND */}
          <div className="text-center mb-4">
            <img src={logo} alt="The Royal Cafe" className="h-16 mx-auto" />
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 1, color: "#7F1D1D" }}>
              Forgot Password?
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
              Enter your registered email address to receive a password reset link.
            </Typography>
          </div>

          {/* SUCCESS BANNER */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-[5px] text-green-700 text-sm font-medium flex items-center gap-2">
              <svg
                className="w-4 h-4 shrink-0 fill-current text-green-600"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {/* API ERROR BANNER */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[5px] text-red-600 text-sm font-medium flex items-center gap-2">
              <svg
                className="w-4 h-4 shrink-0 fill-current text-red-500"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{apiError}</span>
            </div>
          )}

          {!successMessage && (
            <Box sx={{ mt: 1 }}>
              <InputField
                label="Registered Email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                error={error}
              />
            </Box>
          )}

          {/* BUTTONS */}
          <div className="mt-5 flex gap-3">
            {!successMessage ? (
              <PrimaryButton
                label="Send Reset Link"
                onClick={handleSubmit}
                loading={loading}
              />
            ) : (
              <PrimaryButton
                label="Back to Login"
                onClick={() => {
                  onClose();
                  onSwitchToLogin?.();
                }}
              />
            )}
            <SecondaryButton label="Close" onClick={onClose} />
          </div>

          {/* LOGIN LINK */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">Remember password? </span>
            <span
              className="text-sm text-brand font-semibold cursor-pointer hover:underline"
              onClick={() => {
                onClose();
                onSwitchToLogin?.();
              }}
            >
              Log in
            </span>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
