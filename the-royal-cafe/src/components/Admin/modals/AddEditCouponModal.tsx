import { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";

import InputField from "@/components/common/form/InputField";
import SelectField from "@/components/common/form/SelectField";
import TextAreaField from "@/components/common/form/TextAreaField";
import DatePickerField from "@/components/common/form/DateField";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/common/form/Button";

import { FiX } from "react-icons/fi";
import IconButton from "@mui/material/IconButton";

type CouponData = {
  code: string;
  description: string;
  discount_type: "percentage" | "flat";
  discount_value: number;
  min_order_amount: number;
  max_discount: number;
  expiry_date: string;
  usage_limit: number;
  used_count: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: CouponData | null;
};

const AddEditCouponModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discount_type: "percentage" as "percentage" | "flat",
    discount_value: "" as string | number,
    min_order_amount: "" as string | number,
    max_discount: "" as string | number,
    expiry_date: "",
    usage_limit: "" as string | number,
    used_count: "" as string | number,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ================= SET INITIAL DATA ================= */
  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code || "",
        description: initialData.description || "",
        discount_type: initialData.discount_type || "percentage",
        discount_value: initialData.discount_value || 0,
        min_order_amount: initialData.min_order_amount || 0,
        max_discount: initialData.max_discount || 0,
        expiry_date: initialData.expiry_date || "",
        usage_limit: initialData.usage_limit || 0,
        used_count: initialData.used_count || 0,
      });
    } else {
      setForm({
        code: "",
        description: "",
        discount_type: "percentage",
        discount_value: "",
        min_order_amount: "",
        max_discount: "",
        expiry_date: "",
        usage_limit: "",
        used_count: "",
      });
    }

    setErrors({});
  }, [initialData, open]);

  /* ================= HANDLERS ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleDateChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.code.trim()) newErrors.code = "Coupon code is required";
    if (!form.discount_value) newErrors.discount_value = "Discount value is required";
    else if (Number(form.discount_value) <= 0)
      newErrors.discount_value = "Value must be greater than 0";

    if (!form.expiry_date) newErrors.expiry_date = "Expiry date is required";

    if (form.description && form.description.length < 5)
      newErrors.description = "Minimum 5 characters required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("code", form.code);
      formData.append("description", form.description);
      formData.append("discount_type", form.discount_type);
      formData.append("discount_value", String(form.discount_value));
      formData.append("min_order_amount", String(form.min_order_amount));
      formData.append("max_discount", String(form.max_discount));
      formData.append("expiry_date", form.expiry_date);
      formData.append("usage_limit", String(form.usage_limit));

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
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: "5px",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* ================= HEADER ================= */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {initialData ? "Edit Coupon" : "Add New Coupon"}
            </Typography>

            <IconButton onClick={onClose} size="small">
              <FiX size={20} />
            </IconButton>
          </div>

          {/* ================= BODY ================= */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Coupon Code"
                name="code"
                value={form.code}
                onChange={handleChange}
                error={errors.code}
              />

              <SelectField
                label="Discount Type"
                name="discount_type"
                value={form.discount_type}
                onChange={handleSelectChange}
                options={[
                  { label: "Percentage", value: "percentage" },
                  { label: "Flat", value: "flat" },
                ]}
                error={errors.discount_type}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Discount Value"
                name="discount_value"
                type="number"
                value={form.discount_value}
                onChange={handleChange}
                error={errors.discount_value}
              />

              <InputField
                label="Max Discount"
                name="max_discount"
                type="number"
                value={form.max_discount}
                onChange={handleChange}
                error={errors.max_discount}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Min Order Amount"
                name="min_order_amount"
                type="number"
                value={form.min_order_amount}
                onChange={handleChange}
                error={errors.min_order_amount}
              />

              <InputField
                label="Usage Limit"
                name="usage_limit"
                type="number"
                value={form.usage_limit}
                onChange={handleChange}
                error={errors.usage_limit}
              />
            </div>

            <DatePickerField
              label="Expiry Date"
              name="expiry_date"
              value={form.expiry_date}
              onChange={handleDateChange}
              error={errors.expiry_date}
            />

            <TextAreaField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              error={errors.description}
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

export default AddEditCouponModal;
