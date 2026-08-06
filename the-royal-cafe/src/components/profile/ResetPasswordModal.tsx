import { useState } from "react";
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

const ResetPasswordModal = ({ open, onClose }: Props) => {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 👉 CALL YOUR RESET PASSWORD API HERE

      toastSuccess("Password updated successfully");
      onClose();
    } catch {
      toastError("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

        <InputField
          label="Old Password"
          name="old_password"
          type="password"
          value={form.old_password}
          onChange={handleChange}
        />

        <InputField
          label="New Password"
          name="new_password"
          type="password"
          value={form.new_password}
          onChange={handleChange}
        />

        <div className="flex gap-3 mt-4">
          <PrimaryButton
            label="Update Password"
            loading={loading}
            onClick={handleSubmit}
          />
          <SecondaryButton label="Cancel" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
