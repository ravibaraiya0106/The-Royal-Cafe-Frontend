import { IconButton, Paper, Typography } from "@mui/material";
import { FiX } from "react-icons/fi";
import { PrimaryButton } from "@/components/common/form/Button";

type Field = {
  label: string;
  value?: string | number | boolean | null;
  render?: () => React.ReactNode;
};

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  fields: Field[];
  image?: string | null;
};

const ShowDetailsModal = ({
  open,
  title = "Details",
  onClose,
  fields,
  image,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-5xl px-4">
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: "5px",
            border: "1px solid #e5e7eb",
            overflow: "hidden", //  important
          }}
        >
          {/* ================= HEADER (Sticky) ================= */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>

            <IconButton onClick={onClose} size="small">
              <FiX size={20} />
            </IconButton>
          </div>

          {/* ================= BODY ================= */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div
              className={`grid gap-10 ${
                image ? "grid-cols-1 md:grid-cols-[2fr_1fr]" : "grid-cols-1"
              }`}
            >
              {/* LEFT → DETAILS */}
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={index}>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      {field.label}
                    </p>

                    <div className="text-sm text-gray-800 font-medium mt-1 leading-relaxed break-words">
                      {field.render ? field.render() : formatValue(field.value)}
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT → IMAGE */}
              {image && (
                <div className="justify-center">
                  <img
                    src={image}
                    alt="preview"
                    className="w-62 h-62 object-cover rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ================= FOOTER (Sticky) ================= */}
          <div className="px-6 py-4 border-t bg-white sticky bottom-0">
            <div className="flex justify-end">
              <PrimaryButton label="Cancel" onClick={onClose} />
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
};

/* ================= HELPER ================= */
const formatValue = (value: unknown): React.ReactNode => {
  if (value === null || value === undefined || value === "") return "-";

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

export default ShowDetailsModal;
