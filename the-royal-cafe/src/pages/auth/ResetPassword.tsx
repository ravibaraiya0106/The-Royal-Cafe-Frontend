import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Paper, Typography, Box } from "@mui/material";

import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import logo from "@/assets/images/logo.png";
import InputField from "@/components/common/form/InputField";
import { PrimaryButton } from "@/components/common/form/Button";
import { confirmResetPasswordService } from "@/services/authService";
import { toastSuccess, toastError } from "@/utils/toast";
import { ROUTES } from "@/constants/Navigation";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setApiError("");
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!token) {
      setApiError("Invalid or missing reset token. Please request a new link.");
      return false;
    }

    if (!form.newPassword.trim()) {
      nextErrors.newPassword = "New password is required";
    } else if (form.newPassword.length < 6) {
      nextErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your password";
    } else if (form.newPassword !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setApiError("");

      const msg = await confirmResetPasswordService(token, form.newPassword);
      toastSuccess(msg || "Password reset successful!");
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password";
      setApiError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#fdf8f6] to-[#f3e7e3]">
        <div className="w-full max-w-md">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* BRAND */}
            <div className="text-center mb-6">
              <img src={logo} alt="The Royal Cafe" className="h-16 mx-auto mb-2" />
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#7F1D1D" }}>
                Reset Password
              </Typography>
              <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
                Enter your new password below to secure your account.
              </Typography>
            </div>

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

            {isSuccess ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827" }}>
                  Password Reset Complete!
                </Typography>
                <p className="text-sm text-gray-600">
                  Your password has been successfully updated. You can now log in using your new credentials.
                </p>
                <div className="pt-2">
                  <PrimaryButton
                    label="Go to Home"
                    onClick={() => navigate(ROUTES.HOME)}
                    fullWidth
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <InputField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                />

                <Box sx={{ mt: 2 }}>
                  <InputField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                  />
                </Box>

                <div className="mt-6">
                  <PrimaryButton
                    label="Update Password"
                    onClick={handleSubmit}
                    loading={loading}
                    fullWidth
                  />
                </div>
              </div>
            )}
          </Paper>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ResetPassword;
