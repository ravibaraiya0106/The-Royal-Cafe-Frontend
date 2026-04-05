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
  image?: string | null; // existing image (URL/path)
  is_active?: boolean;
  is_special?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
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
    existingImage: "" as string | null, // NEW
    is_active: true,
    is_special: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ================= SET INITIAL DATA ================= */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: initialData.category?._id || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        image: null,
        existingImage: initialData.image || null, // store existing image
        is_active: initialData.is_active ?? true,
        is_special: initialData.is_special ?? false,
      });
    } else {
      setForm({
        name: "",
        category: "",
        description: "",
        price: "",
        image: null,
        existingImage: null,
        is_active: true,
        is_special: false,
      });
    }

    setErrors({});
  }, [initialData, open]);

  /* ================= HANDLERS ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image must be less than 2MB",
        }));
        return;
      }

      setForm({
        ...form,
        image: file,
        existingImage: null, // remove old preview when new selected
      });

      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Item name is required";
    }

    if (!form.category) {
      newErrors.category = "Category is required";
    }

    if (!form.price) {
      newErrors.price = "Price is required";
    } else if (Number(form.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (form.description && form.description.length < 5) {
      newErrors.description = "Minimum 5 characters required";
    }

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
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("is_active", String(form.is_active));
      formData.append("is_special", String(form.is_special));

      // Only send image if new one selected
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
            error={errors.name}
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
            error={errors.category}
          />

          {/* Price */}
          <InputField
            label="Price"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            error={errors.price}
          />

          {/* Description */}
          <TextAreaField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            error={errors.description}
          />

          {/* Upload + Preview Row */}
          <div className="flex items-start gap-6 mt-4">
            {/* LEFT SIDE → Images */}
            <div className="flex gap-4">
              {/* Existing Image (ONLY if no new image selected) */}
              {form.existingImage && !form.image && (
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-500 mb-1">Current</p>
                  <img
                    src={`${import.meta.env.VITE_FILE_URL}${form.existingImage}`}
                    alt="existing"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                </div>
              )}

              {/* New Image Preview */}
              {form.image && (
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-500 mb-1">New</p>
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            {/* RIGHT SIDE → Upload */}
            <div className="flex-1">
              <FileUpload file={form.image} onChange={handleFile} />

              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>
          </div>

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
