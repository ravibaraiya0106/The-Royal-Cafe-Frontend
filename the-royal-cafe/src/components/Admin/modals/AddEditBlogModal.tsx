import { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";

import InputField from "@/components/common/form/InputField";
import TextAreaField from "@/components/common/form/TextAreaField";
import FileUpload from "@/components/common/form/FileUpload";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/common/form/Button";

import { FiX } from "react-icons/fi";
import IconButton from "@mui/material/IconButton";

type BlogData = {
  title?: string;
  content?: string;
  image?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: BlogData | null;
};

const AddEditBlogModal = ({ open, onClose, onSubmit, initialData }: Props) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: null as File | null,
    existingImage: "" as string | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ================= SET INITIAL DATA ================= */
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        content: initialData.content || "",
        image: null,
        existingImage: initialData.image || null,
      });
    } else {
      setForm({
        title: "",
        content: "",
        image: null,
        existingImage: null,
      });
    }

    setErrors({});
  }, [initialData, open]);

  /* ================= HANDLERS ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
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

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.content.trim()) newErrors.content = "Content is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("content", form.content);

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
              {initialData ? "Edit Blog" : "Add New Blog"}
            </Typography>

            <IconButton onClick={onClose} size="small">
              <FiX size={20} />
            </IconButton>
          </div>

          {/* ================= BODY ================= */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            <InputField
              label="Blog Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={errors.title}
            />

            <TextAreaField
              label="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              error={errors.content}
              row={12}
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

export default AddEditBlogModal;
