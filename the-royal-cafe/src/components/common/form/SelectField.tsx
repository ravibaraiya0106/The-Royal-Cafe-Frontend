import { TextField, MenuItem } from "@mui/material";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; // added
};

const SelectField = ({
  label,
  name,
  value,
  options,
  onChange,
  error,
}: Props) => {
  return (
    <TextField
      select
      fullWidth
      size="small"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      margin="normal"
      error={!!error}
      helperText={error}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "5px" }, margin: 0 }}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectField;
