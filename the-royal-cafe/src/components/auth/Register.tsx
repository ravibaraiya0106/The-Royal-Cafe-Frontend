import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import logo from "../../assets/images/logo.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    console.log("Register clicked");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= LEFT SIDE ================= */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
          alt="Cafe"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6b0f0f]/70 to-black/40"></div>

        {/* Content */}
        <div className="relative z-10 text-white text-center px-10">
          <img src={logo} alt="Royal Cafe" className="h-16 mx-auto mb-4" />

          <h1 className="text-5xl font-bold mb-4">The Royal Cafe ☕</h1>

          <p className="text-lg opacity-90 max-w-md mx-auto">
            Experience premium coffee & delicious meals. Join us and enjoy
            exclusive offers!
          </p>

          {/* Glass Card */}
          <div className="mt-10 bg-white/10 backdrop-blur-lg px-6 py-4 rounded-2xl border border-white/20 inline-block">
            <p className="text-sm opacity-80">🔥 Today’s Special</p>
            <p className="font-semibold text-lg">Cappuccino + Croissant</p>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "24px",
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
              boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mb: 3,
                textAlign: "center",
              }}
            >
              Create Account
            </Typography>

            {/* Form */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  required
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleRegister}
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
              Create Account
            </Button>

            {/* Footer */}
            <Typography
              variant="body2"
              sx={{ mt: 2, textAlign: "center", color: "#6b7280" }}
            >
              Already have an account?{" "}
              <span className="text-brand font-semibold cursor-pointer hover:underline">
                Login
              </span>
            </Typography>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Register;
