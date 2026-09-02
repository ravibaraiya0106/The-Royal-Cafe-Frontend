import { useState, useEffect } from "react";
import { Paper, Typography, IconButton } from "@mui/material";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import TextAreaField from "@/components/common/form/TextAreaField";
import { DangerButton, SecondaryButton } from "@/components/common/form/Button";

interface CancelOrderModalProps {
  open: boolean;
  orderNumber?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
}

const CancelOrderModal = ({
  open,
  orderNumber,
  loading = false,
  onClose,
  onConfirm,
}: CancelOrderModalProps) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setError("Please provide a reason for cancelling this order");
      return;
    }
    if (trimmed.length < 5) {
      setError("Cancellation reason must be at least 5 characters long");
      return;
    }

    setError("");
    await onConfirm(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md px-4">
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "5px",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#6b0f0f",
              }}
            >
              <FiAlertTriangle className="text-red-600 shrink-0" />
              <span>Cancel Order</span>
            </Typography>

            <IconButton onClick={onClose} size="small" disabled={loading}>
              <FiX size={20} />
            </IconButton>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {orderNumber && (
              <p className="text-xs text-gray-600">
                Are you sure you want to cancel order{" "}
                <span className="font-bold text-gray-900 font-mono">#{orderNumber}</span>?
              </p>
            )}

            <div>
              <TextAreaField
                label="Reason for Cancellation *"
                name="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                placeholder="e.g. Changed my mind, Ordered incorrect items, Delivery time too long..."
                error={error}
                row={4}
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Please enter a brief note explaining why this order is being cancelled.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-4 border-t">
            <SecondaryButton
              label="Cancel"
              onClick={onClose}
              disabled={loading}
            />
            <DangerButton
              label={loading ? "Cancelling..." : "Confirm Cancellation"}
              onClick={handleSubmit}
              loading={loading}
            />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default CancelOrderModal;
