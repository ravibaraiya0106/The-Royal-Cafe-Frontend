import { useState } from "react";
import { Paper, Typography, Box } from "@mui/material";

import logo from "@/assets/images/logo.png";
import { toastSuccess, toastError } from "@/utils/toast";
import { registerService } from "@/services/authService";

import InputField from "@/components/common/form/InputField";
import SelectField from "@/components/common/form/SelectField";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/common/form/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
};

const RegisterModal = ({ open, onClose, onSwitchToLogin }: Props) => {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_no: "",
    password: "",
    gender: "male",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!form.username.trim()) return "Username is required";
    if (!form.first_name.trim()) return "First name is required";
    if (!form.last_name.trim()) return "Last name is required";
    if (!form.email.includes("@")) return "Invalid email";
    if (form.phone_no.length < 10) return "Invalid phone number";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";

    return null;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    const error = validate();
    if (error) return toastError(error);

    try {
      setLoading(true);

      const { message, user } = (await registerService(form)) as {
        message: string;
        user: {
          role: string;
          first_name: string;
          last_name: string;
        };
      };

      /* ================= ROLE CHECK ================= */
      if (user.role !== "user") {
        toastError("Invalid role assigned");
        return;
      }

      /* ================= SUCCESS TOAST (API MESSAGE) ================= */
      toastSuccess(message || "Registration successful! Please login");

      /* ================= SWITCH MODAL (NO DELAY NEEDED) ================= */
      onClose();
      onSwitchToLogin?.();
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Registration failed");
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
        <Paper sx={{ p: 3, borderRadius: "5px" }}>
          {/* HEADER */}
          <div className="text-center mb-4">
            <img src={logo} className="h-16 mx-auto" />
            <Typography variant="body2">Create your account</Typography>
          </div>

          {/* FORM */}
          <div className="space-y-3">
            <InputField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
            />

            <InputField
              label="First Name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
            />

            <InputField
              label="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
            />

            <InputField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <InputField
              label="Phone"
              name="phone_no"
              value={form.phone_no}
              onChange={handleChange}
            />

            <InputField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
            />

            <Box>
              <SelectField
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
              />
            </Box>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex gap-3">
            <PrimaryButton
              label="Register"
              onClick={handleSubmit}
              loading={loading}
            />
            <SecondaryButton label="Close" onClick={onClose} />
          </div>

          {/* LOGIN LINK */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
            </span>
            <span
              className="text-sm text-brand cursor-pointer hover:underline"
              onClick={() => onSwitchToLogin?.()}
            >
              Login
            </span>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default RegisterModal;
