import { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";

import InputField from "@/components/common/form/InputField";
import SelectField from "@/components/common/form/SelectField";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/common/form/Button";

import { FiX } from "react-icons/fi";
import IconButton from "@mui/material/IconButton";

type DeliveryPerson = {
  name: string;
  phone: string;
  email: string;
  vehicle_type: string;
  vehicle_number: string;
  current_location: {
    lat: number;
    lng: number;
  };
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: DeliveryPerson | null;
};

const AddEditItemModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    vehicle_type: "",
    vehicle_number: "",
    current_location: {
      lat: 0,
      lng: 0,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ================= SET INITIAL DATA ================= */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        vehicle_type: initialData.vehicle_type || "",
        vehicle_number: initialData.vehicle_number || "",
        current_location: initialData.current_location || {
          lat: 0,
          lng: 0,
        },
      });
    } else {
      setForm({
        name: "",
        phone: "",
        email: "",
        vehicle_type: "",
        vehicle_number: "",
        current_location: {
          lat: 0,
          lng: 0,
        },
      });
    }

    setErrors({});
  }, [initialData, open]);

  /* ================= HANDLERS ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Item name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("vehicle_type", form.vehicle_type);
      formData.append("vehicle_number", form.vehicle_number);
      formData.append(
        "current_location[lat]",
        String(form.current_location.lat),
      );
      formData.append(
        "current_location[lng]",
        String(form.current_location.lng),
      );

      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl px-4">
        <Paper
          elevation={0}
          sx={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: "5px",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* ================= HEADER ================= */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {initialData ? "Edit Item" : "Add New Item"}
            </Typography>

            <IconButton onClick={onClose} size="small">
              <FiX size={20} />
            </IconButton>
          </div>

          {/* ================= BODY ================= */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            <InputField
              label="Item Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />

            <InputField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <InputField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <SelectField
              label="Vehicle Type"
              name="vehicle_type"
              value={form.vehicle_type}
              onChange={handleChange}
              options={[
                { label: "Select Vehicle Type", value: "" },
                { label: "Bike", value: "bike" },
                { label: "Cycle", value: "cycle" },
                { label: "Scooter", value: "scooter" },
              ]}
              error={errors.vehicle_type}
            />
            <InputField
              label="Vehicle Number"
              name="vehicle_number"
              value={form.vehicle_number}
              onChange={handleChange}
              error={errors.vehicle_number}
            />
            <InputField
              label="Latitude"
              name="lat"
              value={form.current_location.lat}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  current_location: {
                    ...prev.current_location,
                    lat: Number(e.target.value),
                  },
                }))
              }
            />

            <InputField
              label="Longitude"
              name="lng"
              value={form.current_location.lng}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  current_location: {
                    ...prev.current_location,
                    lng: Number(e.target.value),
                  },
                }))
              }
            />
          </div>

          {/* ================= FOOTER ================= */}
          <div className="flex gap-3 p-4 border-t">
            <SecondaryButton label="Cancel" onClick={onClose} />

            <PrimaryButton
              loading={loading}
              label={initialData ? "Update" : "Create"}
              onClick={handleSubmit}
            />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default AddEditItemModal;
