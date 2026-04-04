import { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/images/logo.png";
import { loginService } from "../../services/authService";
import { setAuth } from "../../utils/storage";
import { toastSuccess, toastError } from "../../utils/toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      if (!form.username || !form.password) {
        setError("Please fill all fields");
        return;
      }

      const { token, user } = await loginService(form);

      // ✅ Role check
      if (user.role !== "admin") {
        setError("Access denied. Admin only.");
        toastError("Access denied. Admin only.");
        return;
      }

      // ✅ Store here (NOT in service)
      setAuth(token, user);
      toastSuccess(
        "Welcome back, " + user.first_name + " " + user.last_name + "!",
      );
      // ✅ Correct path
      navigate("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
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
            borderRadius: "20px",
            border: "1px solid #e5e7eb",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Branding */}
          <div className="text-center mb-4">
            <img src={logo} alt="The Royal Cafe" className="h-16 mx-auto" />

            <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
              Welcome back! Please login to continue
            </Typography>
          </div>

          {/* Error */}
          {error && (
            <Typography
              variant="body2"
              sx={{ color: "red", textAlign: "center", mb: 1 }}
            >
              {error}
            </Typography>
          )}

          {/* Username */}
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Forgot Password */}
          <div className="flex justify-end mt-1">
            <span className="text-sm text-brand cursor-pointer hover:underline w-full text-center">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.3,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "16px",
              background: "linear-gradient(135deg, #6b0f0f, #8b1a1a)",
              boxShadow: "0 4px 14px rgba(107,15,15,0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #500b0b, #6b0f0f)",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </Paper>
      </div>
    </div>
  );
};

export default Login;
