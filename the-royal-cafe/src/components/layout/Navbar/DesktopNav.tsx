import { NavLink } from "react-router-dom";
import type { NavItemType } from "@/types/common";

const DesktopNav = ({
  navItems,
  onNavigate,
}: {
  navItems: NavItemType[];
  onNavigate: () => void;
}) => {
  return (
    <div className="hidden md:flex md:order-1">
      <ul className="flex items-center space-x-6 font-medium">
        {navItems.map((item, idx) => (
          <li key={`${item.label}-${idx}`}>
            <NavLink
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-300
                 ${
                   isActive
                     ? "bg-brand text-white shadow-sm"
                     : "text-gray-700 hover:bg-gray-100 hover:text-brand"
                 }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DesktopNav;
