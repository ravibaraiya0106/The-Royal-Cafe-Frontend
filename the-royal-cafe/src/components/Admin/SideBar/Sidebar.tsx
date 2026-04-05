import { FiChevronsLeft, FiChevronsRight, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import SidebarItem from "./SidebarItem";
import { SIDEBAR_ITEMS } from "../../../constants/Sidebar";
import logo from "../../../assets/images/logo.png";
import logo1 from "../../../assets/images/logo1.png";

import { logout } from "../../../utils/storage"; // import
import { toastSuccess } from "../../../utils/toast"; // import

const Sidebar = ({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) => {
  const navigate = useNavigate();

  // LOGOUT FUNCTION
  const handleLogout = () => {
    logout(); // clear localStorage
    toastSuccess("Logged out successfully");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-40 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center border-b px-4 justify-between">
        <div className="flex items-center justify-center overflow-hidden">
          <img
            src={collapsed ? logo1 : logo}
            alt="Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Toggle */}
        <button
          type="button"
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center absolute -right-3 top-12 w-7 h-7 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition"
        >
          {collapsed ? (
            <FiChevronsRight size={14} className="text-brand" />
          ) : (
            <FiChevronsLeft size={14} className="text-brand" />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className={`p-4 space-y-2 ${collapsed ? "pt-3" : ""}`}>
        {SIDEBAR_ITEMS.map((item, index) => (
          <SidebarItem
            key={index}
            label={item.label}
            to={item.to}
            Icon={item.icon}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 w-full px-4">
        <button
          type="button"
          onClick={handleLogout} // attach here
          className={`flex items-center w-full py-2 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-500 transition ${
            collapsed ? "justify-center px-2" : "gap-3 px-4"
          }`}
        >
          <FiLogOut />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
