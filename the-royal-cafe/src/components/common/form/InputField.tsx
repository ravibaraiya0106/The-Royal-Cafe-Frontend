import { TextField } from "@mui/material";

type Props = {
  label: string;
  name: string;
  size?: "small" | "medium";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  InputProps?: unknown;
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  size = "small",
}: Props) => {
  return (
    <TextField
      fullWidth
      size={size}
      label={label}
      name={name}
      value={value}
      type={type}
      onChange={onChange}
      margin="normal"
      error={!!error}
      helperText={error}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "5px" }, margin: 0 }}
    />
  );
};

export default InputField;
