import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import ResetPasswordModal from "./ResetPasswordModal";

import {
  PrimaryButton,
  SecondaryButton,
  DangerButton,
} from "@/components/common/form/Button";

type Props = {
  onLogout: () => void;
  user: unknown;
};

const ProfileActions = ({ onLogout }: Props) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openReset, setOpenReset] = useState(false);

  return (
    <section className="py-16">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Manage Your Account
        </h2>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {/* EDIT PROFILE */}
          <PrimaryButton
            label="Edit Profile"
            onClick={() => setOpenEdit(true)}
            fullWidth={false}
          />

          {/* RESET PASSWORD */}
          <SecondaryButton
            label="Reset Password"
            onClick={() => setOpenReset(true)}
            fullWidth={false}
          />

          {/* LOGOUT */}
          <DangerButton label="Logout" onClick={onLogout} fullWidth={false} />
        </div>
      </div>

      {/* MODALS */}
      <EditProfileModal open={openEdit} onClose={() => setOpenEdit(false)} />

      <ResetPasswordModal
        open={openReset}
        onClose={() => setOpenReset(false)}
      />
    </section>
  );
};

export default ProfileActions;
