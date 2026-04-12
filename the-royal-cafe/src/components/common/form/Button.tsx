import { Button, CircularProgress, IconButton } from "@mui/material";
import type { ReactNode } from "react";

/* ================= PRIMARY BUTTON ================= */

type BaseProps = {
  label?: string;
  loading?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  icon?: ReactNode;
};

/* 🔴 PRIMARY (Brand) */
export const PrimaryButton = ({
  label,
  loading = false,
  onClick,
  fullWidth = true,
  icon,
}: BaseProps) => {
  return (
    <Button
      fullWidth={fullWidth}
      variant="contained"
      onClick={onClick}
      disabled={loading}
      startIcon={!loading && icon}
      sx={{
        borderRadius: "5px",
        textTransform: "none",
        fontWeight: 600,
        background: "linear-gradient(135deg, #6b0f0f, #8b1a1a)",
        boxShadow: "0 4px 14px rgba(107,15,15,0.4)",
        "&:hover": {
          background: "linear-gradient(135deg, #500b0b, #6b0f0f)",
        },
      }}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : label}
    </Button>
  );
};

/* ================= SECONDARY BUTTON ================= */

export const SecondaryButton = ({
  label,
  onClick,
  fullWidth = true,
}: BaseProps) => {
  return (
    <Button
      fullWidth={fullWidth}
      variant="outlined"
      onClick={onClick}
      sx={{
        borderRadius: "5px",
        textTransform: "none",
        fontWeight: 500,
        borderColor: "brand",
        color: "brand",
        "&:hover": {
          borderColor: "brand",
          backgroundColor: "#f9fafb",
        },
      }}
    >
      {label}
    </Button>
  );
};

/* ================= DANGER BUTTON ================= */

export const DangerButton = ({
  label,
  onClick,
  fullWidth = true,
}: BaseProps) => {
  return (
    <Button
      fullWidth={fullWidth}
      variant="contained"
      onClick={onClick}
      sx={{
        borderRadius: "5px",
        textTransform: "none",
        fontWeight: 600,
        background: "#ef4444",
        "&:hover": {
          background: "#dc2626",
        },
      }}
    >
      {label}
    </Button>
  );
};

/* ================= ICON BUTTON ================= */

type IconProps = {
  icon: ReactNode;
  onClick?: () => void;
  color?: string;
};

export const IconBtn = ({ icon, onClick, color = "#6b0f0f" }: IconProps) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        color,
        backgroundColor: "rgba(107,15,15,0.08)",
        "&:hover": {
          backgroundColor: "rgba(107,15,15,0.15)",
        },
      }}
    >
      {icon}
    </IconButton>
  );
};

/* ================= SMALL BUTTON ================= */

export const SmallButton = ({ label, onClick }: BaseProps) => {
  return (
    <Button
      size="small"
      onClick={onClick}
      sx={{
        borderRadius: "5px",
        textTransform: "none",
        fontSize: "12px",
        px: 2,
        py: 0.5,
        background: "#f3f4f6",
        color: "#374151",
        "&:hover": {
          background: "#e5e7eb",
        },
      }}
    >
      {label}
    </Button>
  );
};
/* ================= ROUND BUTTON ================= */
type RoundButtonProps = {
  icon: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  size?: number;
  disabled?: boolean;
};

export const RoundButton = ({
  icon,
  onClick,
  variant = "primary",
  size = 36,
  disabled = false,
}: RoundButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      type="button"
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",

        ...(variant === "primary"
          ? {
              background: "linear-gradient(135deg, #6b0f0f, #8b1a1a)",
              color: "#fff",
              boxShadow: "0 4px 14px rgba(107,15,15,0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #500b0b, #6b0f0f)",
                transform: "scale(1.05)", // 🔥 nice effect
              },
            }
          : {
              backgroundColor: "#f9fafb",
              color: "#374151",
              border: "1px solid #e5e7eb",
              "&:hover": {
                backgroundColor: "#f3f4f6",
                transform: "scale(1.05)",
              },
            }),

        ...(disabled && {
          opacity: 0.5,
          cursor: "not-allowed",
        }),
      }}
    >
      {icon}
    </IconButton>
  );
};
