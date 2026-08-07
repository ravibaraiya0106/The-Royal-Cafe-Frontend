import { Paper, Typography } from "@mui/material";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/common/form/Button";
import Loader from "@/components/common/Loader";
import logo from "@/assets/images/logo.png";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmLoadingLabel?: string;
};

const ConfirmDialog = ({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  onClose,
  onConfirm,
  loading = false,
  cancelLabel = "Cancel",
  confirmLabel = "Delete",
  confirmLoadingLabel = "Deleting...",
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md px-4">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "5px",
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <div className="flex justify-center mb-3">
            <img src={logo} alt="Brand logo" className="h-12 object-contain" />
          </div>

          {/* 🔴 Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: "#6b0f0f", // brand
            }}
          >
            {title}
          </Typography>

          {/* Message */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {message}
          </Typography>

          {/* Loader (optional center loader) */}
          {loading && <Loader />}

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <SecondaryButton label={cancelLabel} onClick={onClose} fullWidth />

            <PrimaryButton
              label={loading ? confirmLoadingLabel : confirmLabel}
              onClick={onConfirm}
              loading={loading}
              fullWidth
            />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default ConfirmDialog;
