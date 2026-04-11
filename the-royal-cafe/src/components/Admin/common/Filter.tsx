import { Paper } from "@mui/material";
import { useState, useRef } from "react";

import InputField from "@/components/common/form/InputField";
import SelectField from "@/components/common/form/SelectField";
import { PrimaryButton } from "@/components/common/form/Button";

type Option = {
  label: string;
  value: string;
};

type FilterField = {
  key: string;
  label: string;
  type: "text" | "select";
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
      key === "last_name"
    ) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onChange(updatedValues);
      }, 1000); // 5 seconds
    } else {
      // Immediate for dropdowns
      onChange(updatedValues);
    }
  };
  /* ================= RESET ================= */
  const handleReset = () => {
    setValues({});
    onChange({}); // important (reload full data)
  };

  return (
    <Paper
      elevation={0}
      className="p-4 mb-4 bg-white rounded-[5px] shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end"
    >
      {filters.map((filter) => (
        <div key={filter.key} className="min-w-[200px] flex-1">
          {/* TEXT INPUT */}
          {filter.type === "text" && (
            <InputField
              label={filter.label}
              name={filter.key}
              value={(values[filter.key] as string) || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(filter.key, e.target.value)
              }
            />
          )}

          {/* SELECT INPUT */}
          {filter.type === "select" && (
            <SelectField
              label={filter.label}
              name={filter.key}
              value={(values[filter.key] as string) || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(filter.key, e.target.value)
              }
              options={[{ label: "All", value: "" }, ...(filter.options || [])]}
            />
          )}
        </div>
      ))}

      {/* RIGHT SIDE BUTTON */}
      <div className="flex justify-end pb-1">
        <PrimaryButton onClick={handleReset} label="Reset" />
      </div>
    </Paper>
  );
};

export default Filter;
