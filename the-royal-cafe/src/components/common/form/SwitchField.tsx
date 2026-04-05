import { Switch, FormControlLabel } from "@mui/material";

type Props = {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean; // optional
};

const SwitchField = ({ label, name, checked, onChange }: Props) => {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onChange} name={name} />}
      label={label}
    />
  );
};

export default SwitchField;
