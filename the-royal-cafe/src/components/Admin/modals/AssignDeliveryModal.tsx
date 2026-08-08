import { Paper, Typography, IconButton } from "@mui/material";
import { FiX, FiTruck } from "react-icons/fi";
import { PrimaryButton, SecondaryButton } from "@/components/common/form/Button";

export type DeliveryStaffOption = {
  _id: string;
  name: string;
  phone: string;
  vehicle_type: string;
  is_available: boolean;
};

type AssignDeliveryModalProps = {
  open: boolean;
  onClose: () => void;
  orderNumber: string;
  orderAmount: number;
  paymentMethod: string;
  deliveryStaff: DeliveryStaffOption[];
  selectedStaffId: string;
  onSelectStaff: (id: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

const AssignDeliveryModal = ({
  open,
  onClose,
  orderNumber,
  orderAmount,
  paymentMethod,
  deliveryStaff,
  selectedStaffId,
  onSelectStaff,
  onSubmit,
  loading,
}: AssignDeliveryModalProps) => {
  if (!open) return null;

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

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
              sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}
            >
              <FiTruck className="text-brand" />
              <span>Assign Delivery Staff</span>
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
                <strong className="text-gray-900">Total Amount:</strong>{" "}
                {formatMoney(orderAmount)} ({paymentMethod})
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Select Delivery Person
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => onSelectStaff(e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:border-brand"
              >
                <option value="">-- Select Available Delivery Person --</option>
                {deliveryStaff.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name} ({staff.phone}) - {staff.vehicle_type}{" "}
                    {staff.is_available ? "🟢 Online" : "🔴 Offline"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div className="flex gap-3 p-4 border-t">
            <SecondaryButton label="Cancel" onClick={onClose} />
            <PrimaryButton
              loading={loading}
              disabled={!selectedStaffId}
              label="Confirm Assignment"
              onClick={onSubmit}
            />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default AssignDeliveryModal;
