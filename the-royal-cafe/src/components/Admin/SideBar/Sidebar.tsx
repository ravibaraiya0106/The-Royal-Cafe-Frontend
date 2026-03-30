import { FiLogOut } from "react-icons/fi";
import SidebarItem from "./SidebarItem";
import { SIDEBAR_ITEMS } from "../../../constants/Sidebar";
import logo from "../../../assets/images/logo.png";

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b">
        <img src={logo} alt="Logo" className="h-16" />
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {SIDEBAR_ITEMS.map((item, index) => (
          <SidebarItem
            key={index}
            label={item.label}
            to={item.to}
            Icon={item.icon}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 w-full px-4">
        <button className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-gray-700 hover:bg-brand-50 hover:text-brand-500 transition">
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
