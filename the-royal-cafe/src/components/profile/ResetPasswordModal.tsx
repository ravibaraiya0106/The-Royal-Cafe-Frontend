import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { toastSuccess, toastError } from "@/utils/toast";

import logo from "@/assets/images/logo.png";
import InputField from "@/components/common/form/InputField";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/common/form/Button";
import { resetPasswordService } from "@/services/authService";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ResetPasswordModal = ({ open, onClose }: Props) => {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setForm({ old_password: "", new_password: "", confirm_password: "" });
    setErrors({});
  }, [open]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.old_password.trim()) newErrors.old_password = "Old password is required";
    if (!form.new_password.trim()) newErrors.new_password = "New password is required";
    if (!form.confirm_password.trim()) {
      newErrors.confirm_password = "Confirm password is required";
    } else if (form.new_password !== form.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);

      const message = await resetPasswordService({
        old_password: form.old_password,
        new_password: form.new_password,
      });

      toastSuccess(message || "Password updated successfully");
      onClose();
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Failed to update password");
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
            <img src={logo} className="h-16 mx-auto" />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Reset your password
            </Typography>
          </div>

          <InputField
            label="Old Password"
            name="old_password"
            type="password"
            value={form.old_password}
            onChange={handleChange}
            error={errors.old_password}
          />

          <Box sx={{ mt: 2 }}>
            <InputField
              label="New Password"
              name="new_password"
              type="password"
              value={form.new_password}
              onChange={handleChange}
              error={errors.new_password}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <InputField
              label="Confirm Password"
              name="confirm_password"
              type="password"
              value={form.confirm_password}
              onChange={handleChange}
              error={errors.confirm_password}
            />
          </Box>

          {/* BUTTONS */}
          <div className="mt-4 flex gap-3">
            <PrimaryButton
              label="Update Password"
              loading={loading}
              onClick={handleSubmit}
            />
            <SecondaryButton label="Close" onClick={onClose} />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
