import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  IconButton,
  InputAdornment,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import logo from "@/assets/images/logo.png";
import { loginService } from "@/services/authService";
import { setAuth } from "@/utils/storage";
import { toastSuccess, toastError } from "@/utils/toast";

import InputField from "@/components/common/form/InputField";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/common/form/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
};

const LoginModal = ({ open, onClose, onSwitchToRegister }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const { token, user } = (await loginService(form)) as {
        token: string;
        user: {
          role: string;
          first_name: string;
          last_name: string;
          [key: string]: unknown;
        };
      };

      /* ================= ROLE CHECK ================= */
      if (user.role !== "user") {
        toastError("Access denied. Admins must login from admin panel.");
        return;
      }

      /* ================= SET AUTH ================= */
      setAuth(token, user);

      toastSuccess(
        "Welcome back, " + user.first_name + " " + user.last_name + "!",
      );

      /* CLOSE MODAL */
      onClose();

      /* UPDATE NAVBAR */
      window.dispatchEvent(new Event("authChanged"));
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Paper elevation={0} sx={{ p: 4, borderRadius: "5px" }}>
          {/* BRAND */}
          <div className="text-center mb-4">
            <img src={logo} className="h-16 mx-auto" />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Welcome back! Please login to continue
            </Typography>
          </div>

          <InputField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
          />

          <Box sx={{ mt: 2 }}>
            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <div className="flex justify-end mt-2">
            <span className="text-sm text-brand cursor-pointer hover:underline w-full text-center">
              Forgot password?
            </span>
          </div>

          {/* BUTTONS */}
          <div className="mt-4 flex gap-3">
            <PrimaryButton
              label="Login"
              onClick={handleLogin}
              loading={loading}
            />
            <SecondaryButton label="Close" onClick={onClose} />
          </div>

          {/* REGISTER LINK */}
          <div className="mt-3 text-center">
            <span className="text-sm text-gray-600">
              Don’t have an account?{" "}
            </span>
            <span
              className="text-sm text-brand cursor-pointer hover:underline"
              onClick={() => {
                onSwitchToRegister?.(); // only this
              }}
            >
              Register
            </span>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default LoginModal;
