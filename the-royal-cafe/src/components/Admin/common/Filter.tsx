import { Paper } from "@mui/material";
import { useState, useRef } from "react";

import InputField from "@/components/common/form/InputField";
import SelectField from "@/components/common/form/SelectField";
import DatePickerField from "@/components/common/form/DateField";
import { PrimaryButton } from "@/components/common/form/Button";

type Option = {
  label: string;
  value: string;
};

type FilterField = {
  key: string;
  label: string;
  type: "text" | "select" | "date";
  options?: Option[];
};

type Props = {
  filters: FilterField[];
  onChange: (values: Record<string, unknown>) => void;
};

const Filter = ({ filters, onChange }: Props) => {
  const [values, setValues] = useState<Record<string, unknown>>({});

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (key: string, value: unknown) => {
    const updatedValues = {
      ...values,
      [key]: value,
    };

    setValues(updatedValues);

    // Apply debounce only for "name"
    if (
      key === "name" ||
      key === "username" ||
      key === "email" ||
      key === "phone_no" ||
      key === "first_name" ||
      key === "last_name" ||
      key === "code" ||
      key === "phone" ||
      key === "vehicle_number" ||
      key === "title"
    ) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onChange(updatedValues);
      }, 500);
    } else {
      // Immediate for dropdowns
      onChange(updatedValues);
    }
  };

  /* ===== RESET ===== */
  const handleReset = () => {
    setValues({});
    onChange({});
  };

  return (
    <Paper
      elevation={0}
      className="p-4 mb-4 bg-white rounded-[5px] shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end"
    >
      {filters.map((filter) => (
        <div key={filter.key} className="min-w-[200px] flex-1">
          {/* TEXT */}
          {filter.type === "text" && (
            <InputField
              label={filter.label}
              name={filter.key}
              value={(values[filter.key] as string) || ""}
              onChange={(e) => handleChange(filter.key, e.target.value)}
            />
          )}

          {/* SELECT */}
          {filter.type === "select" && (
            <SelectField
              label={filter.label}
              name={filter.key}
              value={(values[filter.key] as string) || ""}
              onChange={(e) => handleChange(filter.key, e.target.value)}
              options={[{ label: "All", value: "" }, ...(filter.options || [])]}
            />
          )}

          {/* DATE PICKER  */}
          {filter.type === "date" && (
            <DatePickerField
              label={filter.label}
              name={filter.key}
              value={(values[filter.key] as string) || ""}
              onChange={handleChange}
            />
          )}
        </div>
      ))}

      {/* RESET */}
      <div className="flex justify-end pb-1">
        <PrimaryButton onClick={handleReset} label="Reset" />
      </div>
    </Paper>
  );
};

export default Filter;
