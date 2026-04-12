import type { ReactNode } from "react";
import clsx from "clsx";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "special";

type Props = {
  label?: string;
  icon?: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  primary: "bg-brand/10 text-brand border border-brand/20",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  special:
    "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-sm",
};

const Badge = ({ label, icon, variant = "default", className }: Props) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold",
        variantStyles[variant],
        className,
      )}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {label}
    </span>
  );
};

export default Badge;
