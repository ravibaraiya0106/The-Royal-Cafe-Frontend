import { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";

import InputField from "@/components/common/form/InputField";
import SelectField from "@/components/common/form/SelectField";
import TextAreaField from "@/components/common/form/TextAreaField";
import FileUpload from "@/components/common/form/FileUpload";
import SwitchField from "@/components/common/form/SwitchField";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/common/form/Button";

type ItemData = {
  name?: string;
  category?: { _id: string };
  description?: string;
  price?: string | number;
  image?: string | null;
  is_active?: boolean;
  is_special?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: unknown) => void;
  categories: { _id: string; name: string }[];
  initialData?: ItemData | null;
};

const AddEditItemModal = ({
  open,
  onClose,
  onSubmit,
  categories,
  initialData,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    image: null as File | null,
    is_active: true,
    is_special: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: initialData.category?._id || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        image: null,
        is_active: initialData.is_active ?? true,
        is_special: initialData.is_special ?? false,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.price) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("is_active", String(form.is_active));
      formData.append("is_special", String(form.is_special));

      if (form.image) {
        formData.append("image", form.image);
      }

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
            p: 4,
            borderRadius: "20px",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Title */}
          <div className="text-center mb-4">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {initialData ? "Edit Item" : "Add New Item"}
            </Typography>
          </div>

          {/* Name */}
          <InputField
            label="Item Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          {/* Category */}
          <SelectField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            options={categories.map((c) => ({
              label: c.name,
              value: c._id,
            }))}
          />

          {/* Price */}
          <InputField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
          />

          {/* Description */}
          <TextAreaField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          {/* Upload */}
          <FileUpload file={form.image} onChange={handleFile} />

          {/* Switches */}
          <div className="flex justify-between mt-3">
            <SwitchField
              label="Active"
              name="is_active"
              checked={form.is_active}
              onChange={handleSwitch}
            />

            <SwitchField
              label="Special"
              name="is_special"
              checked={form.is_special}
              onChange={handleSwitch}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-5">
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
