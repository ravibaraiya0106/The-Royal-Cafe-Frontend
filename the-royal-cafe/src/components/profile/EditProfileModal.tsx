import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";

import logo from "@/assets/images/logo.png";
import { updateUserProfile } from "@/services/userProfileService";
import { getUser, setAuth } from "@/utils/storage";
import { toastSuccess, toastError } from "@/utils/toast";

import InputField from "@/components/common/form/InputField";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/common/form/Button";

type Props = {
  open: boolean;
  onClose: () => void;
};

const EditProfileModal = ({ open, onClose }: Props) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_no: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  /* ================= LOAD USER (IMPORTANT FIX) ================= */
  useEffect(() => {
    if (open) {
      const user = getUser();
      if (!user || typeof user !== "object") return;

      const u = user as Record<string, unknown>;
      setForm({
        first_name: (u.first_name as string) || "",
        last_name: (u.last_name as string) || "",
        phone_no: (u.phone_no as string) || "",
      });
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  /* ================= CHANGE HANDLER ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // clear field error
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!form.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (form.phone_no && !/^[0-9]{10}$/.test(form.phone_no)) {
      newErrors.phone_no = "Phone must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const user = getUser();
      if (!user || typeof user !== "object" || !("_id" in user)) {
        toastError("Session expired. Please login again.");
        return;
      }
      const userId = (user as { _id: string })._id;

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value),
      );

      const updatedUser = await updateUserProfile(userId, formData);

      /* ✅ BETTER: use API response */
      setAuth(localStorage.getItem("token")!, updatedUser);
      window.dispatchEvent(new Event("authChanged"));

      toastSuccess("Profile updated successfully");
      onClose();
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Update failed");
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
              Update your profile details
            </Typography>
          </div>

          <InputField
            label="First Name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            error={errors.first_name}
          />

          <Box sx={{ mt: 2 }}>
            <InputField
              label="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              error={errors.last_name}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <InputField
              label="Phone"
              name="phone_no"
              value={form.phone_no}
              onChange={handleChange}
              error={errors.phone_no}
            />
          </Box>

          {/* BUTTONS */}
          <div className="mt-4 flex gap-3">
            <PrimaryButton
              label="Update"
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

export default EditProfileModal;
