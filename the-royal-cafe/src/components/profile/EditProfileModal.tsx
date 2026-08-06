import { useEffect, useState } from "react";
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

  /* ================= LOAD USER (IMPORTANT FIX) ================= */
  useEffect(() => {
    if (open) {
      const user = getUser();
      setForm({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        phone_no: user?.phone_no || "",
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

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value),
      );

      const updatedUser = await updateUserProfile(user._id, formData);

      /* ✅ BETTER: use API response */
      setAuth(localStorage.getItem("token")!, updatedUser);

      toastSuccess("Profile updated successfully");
      onClose();
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BACKDROP CLICK ================= */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-xl w-full max-w-md animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

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
          label="Phone"
          name="phone_no"
          value={form.phone_no}
          onChange={handleChange}
          error={errors.phone_no}
        />

        <div className="flex gap-3 mt-4">
          <PrimaryButton
            label="Update"
            loading={loading}
            onClick={handleSubmit}
          />

          <SecondaryButton label="Cancel" onClick={onClose} fullWidth={false} />
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
