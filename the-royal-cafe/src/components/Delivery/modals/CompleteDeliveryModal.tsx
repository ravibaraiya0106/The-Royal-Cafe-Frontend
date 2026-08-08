import { Paper, Typography, IconButton } from "@mui/material";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { PrimaryButton, SecondaryButton } from "@/components/common/form/Button";
import InputField from "@/components/common/form/InputField";
import TextAreaField from "@/components/common/form/TextAreaField";

type CompleteDeliveryModalProps = {
  open: boolean;
  onClose: () => void;
  orderNumber: string;
  paymentMethod: string;
  finalAmount: number;
  cashCollected: number;
  onChangeCashCollected: (val: number) => void;
  deliveryNotes: string;
  onChangeDeliveryNotes: (notes: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

const CompleteDeliveryModal = ({
  open,
  onClose,
  orderNumber,
  paymentMethod,
  finalAmount,
  cashCollected,
  onChangeCashCollected,
  deliveryNotes,
  onChangeDeliveryNotes,
  onSubmit,
  loading,
}: CompleteDeliveryModalProps) => {
  if (!open) return null;

  const formatMoney = (val?: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-lg px-4">
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "5px",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* ================= HEADER ================= */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, display: "flex", items: "center", gap: 1 }}
            >
              <FiCheckCircle className="text-green-600" />
              <span>Confirm Order Delivery</span>
            </Typography>

            <IconButton onClick={onClose} size="small">
              <FiX size={20} />
            </IconButton>
          </div>

          {/* ================= BODY ================= */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200 text-xs space-y-1">
              <p className="text-gray-700">
                <strong className="text-gray-900">Order Number:</strong> #{orderNumber}
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Payment Mode:</strong> {paymentMethod}
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">Final Order Amount:</strong>{" "}
                {formatMoney(finalAmount)}
              </p>
            </div>

            {paymentMethod === "COD" && (
              <div>
                <InputField
                  label="Cash Amount Collected (₹)"
                  name="cashCollected"
                  type="number"
                  value={cashCollected}
                  onChange={(e) => onChangeCashCollected(Number(e.target.value))}
                />
              </div>
            )}

            <div>
              <TextAreaField
                label="Delivery Notes / Remarks (Optional)"
                name="deliveryNotes"
                value={deliveryNotes}
                onChange={(e) => onChangeDeliveryNotes(e.target.value)}
              />
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div className="flex gap-3 p-4 border-t">
            <SecondaryButton label="Cancel" onClick={onClose} />
            <PrimaryButton
              loading={loading}
              label="Confirm Delivered"
              onClick={onSubmit}
            />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default CompleteDeliveryModal;
