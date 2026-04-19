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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // clear error on typing
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // USERNAME
    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      newErrors.username = "Minimum 3 characters required";
    }

    // FIRST NAME
    if (!form.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    // LAST NAME
    if (!form.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    // EMAIL
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    // PHONE
    if (!form.phone_no.trim()) {
      newErrors.phone_no = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone_no)) {
      newErrors.phone_no = "Phone must be 10 digits";
    }

    // PASSWORD
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    } else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.password)) {
      newErrors.password = "Must include at least 1 uppercase & 1 number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validate()) return;

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

      if (user.role !== "user") {
        toastError("Invalid role assigned");
        return;
      }

      toastSuccess(message || "Registration successful! Please login");

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
              error={errors.username}
            />

            <InputField
              label="First Name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              error={errors.first_name}
            />

            <InputField
              label="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              error={errors.last_name}
            />

            <InputField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />

            <InputField
              label="Phone"
              name="phone_no"
              value={form.phone_no}
              onChange={handleChange}
              error={errors.phone_no}
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
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
