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

import { getCategoryDropdown } from "@/services/itemsService";

import { FiX } from "react-icons/fi";
import IconButton from "@mui/material/IconButton";

type ItemData = {
  name?: string;
  category?: { _id: string };
  description?: string;
  price?: string | number;
  image?: string | null;
  is_special?: boolean;
};

type CategoryOption = {
  _id: string;
  name: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: ItemData | null;
};

const AddEditItemModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    image: null as File | null,
    existingImage: "" as string | null,
    is_special: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoryDropdown();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  /* ================= SET INITIAL DATA ================= */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        category: initialData.category?._id || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        image: null,
        existingImage: initialData.image || null,
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

      setForm((prev) => ({
        ...prev,
        image: file,
      }));

      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Item name is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.price) newErrors.price = "Price is required";
    else if (Number(form.price) <= 0)
      newErrors.price = "Price must be greater than 0";

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

      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("price", form.price);
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
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
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
          <div className="flex-1 overflow-y-auto px-4 py-3">
            <InputField
              label="Item Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />

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

            <InputField
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              error={errors.price}
            />

            <TextAreaField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              error={errors.description}
            />

            {/* ================= IMAGE SECTION ================= */}
            {!form.image && !form.existingImage ? (
              <div className="mt-4">
                <FileUpload file={form.image} onChange={handleFile} />
              </div>
            ) : (
              <div className="flex items-center gap-6 mt-6">
                {/* LEFT IMAGES */}
                <div className="flex gap-4">
                  {form.existingImage && (
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-gray-500 mb-1">Current</p>
                      <img
                        src={`${import.meta.env.VITE_FILE_URL}${form.existingImage}`}
                        className="w-20 h-20 rounded-lg border object-cover"
                      />
                    </div>
                  )}

                  {form.image && (
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-gray-500 mb-1">New</p>
                      <img
                        src={URL.createObjectURL(form.image)}
                        className="w-20 h-20 rounded-lg border object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* RIGHT UPLOAD */}
                <div className="flex-1">
                  <FileUpload file={form.image} onChange={handleFile} />
                </div>
              </div>
            )}

            {/* Switches */}
            <div className="flex justify-between mt-4">
              <SwitchField
                label="Special"
                name="is_special"
                checked={form.is_special}
                onChange={handleSwitch}
              />
            </div>
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
