import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type Props = {
  label: string;
  name: string;
  size?: "small" | "medium";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
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
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <TextField
      fullWidth
      size={size}
      label={label}
      name={name}
      value={value}
      type={isPassword ? (showPassword ? "text" : "password") : type}
      onChange={onChange}
      margin="normal"
      error={!!error}
      helperText={error}
      sx={{
        "& .MuiOutlinedInput-root": { borderRadius: "5px" },
        margin: 0,
      }}
      InputProps={
        isPassword
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : undefined
      }
    />
  );
};

export default InputField;
