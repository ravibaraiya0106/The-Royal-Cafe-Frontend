import { TextField, MenuItem, Paper } from "@mui/material";
import { useState, useEffect } from "react";

type Option = {
  label: string;
  value: string | number;
};

type FilterField = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: Option[]; // only for select
};

type Props = {
  filters: FilterField[];
  onChange: (values: Record<string, unknown>) => void;
};

const Filter = ({ filters, onChange }: Props) => {
  const [values, setValues] = useState<Record<string, unknown>>({});

  // update parent when filters change
  useEffect(() => {
    onChange(values);
  }, [values]);

  const handleChange = (key: string, value: unknown) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setValues({});
  };

  return (
    <Paper
      elevation={0}
      className="p-4 mb-4 border rounded-xl flex flex-wrap gap-4 items-end"
    >
      {filters.map((filter) => (
        <div key={filter.key} className="min-w-[200px] flex-1">
          {filter.type === "text" && (
            <TextField
              fullWidth
              size="small"
              label={filter.label}
              value={values[filter.key] || ""}
              onChange={(e) => handleChange(filter.key, e.target.value)}
            />
          )}

          {filter.type === "select" && (
            <TextField
              select
              fullWidth
              size="small"
              label={filter.label}
              value={values[filter.key] ?? ""}
              onChange={(e) => handleChange(filter.key, e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {filter.options?.map((opt) => (
                <MenuItem key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>
      ))}

      {/* RESET BUTTON */}
      <button
        onClick={handleReset}
        className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
      >
        Reset
      </button>
    </Paper>
  );
};

export default Filter;
