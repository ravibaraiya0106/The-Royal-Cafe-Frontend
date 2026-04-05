import { TextField } from "@mui/material";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TextAreaField = ({ label, name, value, onChange }: Props) => {
  return (
    <TextField
      fullWidth
      multiline
      rows={3}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      margin="normal"
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
    />
  );
};

export default TextAreaField;
