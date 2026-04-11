import { TextField } from "@mui/material";

type Props = {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string; // added
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
}: Props) => {
  return (
    <TextField
      fullWidth
      size="small"
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
