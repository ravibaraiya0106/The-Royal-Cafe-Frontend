import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
  minDate?: string;
  maxDate?: string;
};

const DatePickerField = ({
  label,
  name,
  value,
  onChange,
  error,
  minDate,
  maxDate,
}: Props) => {
  return (
    <DatePicker
      label={label}
      value={value ? dayjs(value, "YYYY-MM-DD") : null} //  IMPORTANT
      onChange={(newValue: Dayjs | null) => {
        const formatted = newValue ? newValue.format("YYYY-MM-DD") : "";
        onChange(name, formatted); //  send string
      }}
      minDate={minDate ? dayjs(minDate) : undefined}
      maxDate={maxDate ? dayjs(maxDate) : undefined}
      slotProps={{
        textField: {
          fullWidth: true,
          size: "small",
          error: !!error,
          helperText: error,
          sx: {
            margin: 0,

            "& .MuiOutlinedInput-root": {
              borderRadius: "5px",

              "& fieldset": {
                borderColor: "#d1d5db",
              },

              "&:hover fieldset": {
                borderColor: "#6b0f0f",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#6b0f0f",
              },
            },

            "& .MuiInputLabel-root.Mui-focused": {
              color: "#6b0f0f",
            },
          },
        },
      }}
    />
  );
};

export default DatePickerField;
