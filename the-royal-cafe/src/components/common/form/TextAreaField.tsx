import { TextField } from "@mui/material";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; // added
  row?: number; // added
};

const TextAreaField = ({ label, name, value, onChange, error, row }: Props) => {
  return (
    <TextField
      fullWidth
      size="small"
      multiline
      rows={row || 3}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      margin="normal"
      error={!!error}
      helperText={error}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "5px" } }}
    />
  );
};

export default TextAreaField;
