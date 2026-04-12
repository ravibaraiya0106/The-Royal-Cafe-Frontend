import { FiAward, FiTag } from "react-icons/fi";

type Props = {
  isSpecial?: boolean;
  size?: "sm" | "md";
  showText?: boolean;
};

const SpecialBadge = ({
  isSpecial = false,
  size = "sm",
  showText = true,
}: Props) => {
  const sizeClasses =
    size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold
        ${sizeClasses}
        ${
          isSpecial
            ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
    >
      {isSpecial ? <FiAward size={12} /> : <FiTag size={12} />}
      {showText && (isSpecial ? "Special" : "Regular")}
    </span>
  );
};

export default SpecialBadge;
