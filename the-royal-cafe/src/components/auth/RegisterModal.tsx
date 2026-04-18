import { useState } from "react";
import { Paper, Typography, Box } from "@mui/material";

import logo from "@/assets/images/logo.png";
import { toastSuccess } from "@/utils/toast";

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

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    toastSuccess("Registered successfully (API pending)");
    onClose();
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
        <Paper sx={{ p: 2, borderRadius: "5px" }}>
          <div className="text-center mb-4">
            <img src={logo} className="h-16 mx-auto" />
            <Typography variant="body2">Create your account</Typography>
          </div>

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

          <Box mt={2}>
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

          <div className="mt-4 flex gap-3">
            <PrimaryButton label="Register" onClick={handleSubmit} />
            <SecondaryButton label="Close" onClick={onClose} />
          </div>

          <div className="mt-3 text-center">
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
