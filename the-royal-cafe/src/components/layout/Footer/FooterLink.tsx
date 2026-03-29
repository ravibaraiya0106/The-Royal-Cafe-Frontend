import { Link } from "react-router-dom";
import type { NavItemType } from "@/types/common";

const FooterLink = ({ to, label }: NavItemType) => (
  <Link
    to={to}
    className="text-gray-600 hover:text-brand hover:font-semibold transition-all duration-200"
  >
    {label}
  </Link>
);

export default FooterLink;
