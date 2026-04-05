import { TextField } from "@mui/material";

type Props = {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const InputField = ({ label, name, value, onChange, type = "text" }: Props) => {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      type={type}
      onChange={onChange}
      margin="normal"
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
    />
  );
};

export default InputField;
