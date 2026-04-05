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
};

const SelectField = ({ label, name, value, options, onChange }: Props) => {
  return (
    <TextField
      select
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      margin="normal"
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
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
