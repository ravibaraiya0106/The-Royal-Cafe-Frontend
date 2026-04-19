import { useState } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/images/logo.png";
import { loginService } from "../../services/authService";
import { setAuth } from "../../utils/storage";
import { toastSuccess, toastError } from "../../utils/toast";

import InputField from "@/components/common/form/InputField";
import { PrimaryButton } from "@/components/common/form/Button";
import { ROUTES } from "@/constants/Sidebar";

const Login = () => {
  const [showPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();   

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= LOGIN ================= */
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

      if (user.role !== "admin") {
        toastError("Access denied. Admin only.");
        return;
      }

      setAuth(token, user);

      toastSuccess(
        "Welcome back, " + user.first_name + " " + user.last_name + "!",
      );

      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf8f6] to-[#f3e7e3]">
      <div className="w-full max-w-md px-4">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "5px",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* ================= BRAND ================= */}
          <div className="text-center mb-4">
            <img src={logo} alt="The Royal Cafe" className="h-16 mx-auto" />

            <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
              Welcome back! Please login to continue
            </Typography>
          </div>
          {/* ================= USERNAME ================= */}
          <InputField
            size="medium"
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
          />
          {/* ================= PASSWORD ================= */}
          <Box sx={{ mt: 2 }}>
            <InputField
              size="medium"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />
          </Box>

          {/* ================= FORGOT ================= */}
          <div className="flex justify-end mt-2">
            <span className="text-sm text-brand cursor-pointer hover:underline w-full text-center">
              Forgot password?
            </span>
          </div>

          {/* ================= BUTTON ================= */}
          <div className="mt-4">
            <PrimaryButton
              size="large"
              label="Login"
              onClick={handleLogin}
              loading={loading}
            />
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Login;
