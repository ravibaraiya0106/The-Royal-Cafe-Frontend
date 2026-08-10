import { useState, useCallback, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiPackage,
  FiClock,
  FiUser,
  FiLogOut,
  FiPower,
  FiMenu,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { getUser, clearAuth } from "@/utils/storage";
import { ROUTES } from "@/constants/Navigation";
import { toggleAvailabilityService } from "@/services/deliveryService";
import { toastSuccess, toastError } from "@/utils/toast";
import logo from "@/assets/images/logo.png";
import logo1 from "@/assets/images/logo1.png";

interface DeliveryLayoutProps {
  children: ReactNode;
}

const DeliveryLayout = ({ children }: DeliveryLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [toggling, setToggling] = useState(false);

  const handleToggle = useCallback(async () => {
    try {
      setToggling(true);
      const res = await toggleAvailabilityService(!isAvailable);
      setIsAvailable(res.data.is_available);
      toastSuccess(res.message);
    } catch (err: unknown) {
      toastError(
        err instanceof Error ? err.message : "Failed to toggle status",
      );
    } finally {
      setToggling(false);
    }
  }, [isAvailable]);

  const handleLogout = () => {
    clearAuth();
    window.dispatchEvent(new Event("authChanged"));
    navigate(ROUTES.DELIVERY_LOGIN);
  };

  const navItems = [
    { label: "Dashboard", icon: FiGrid, path: ROUTES.DELIVERY_DASHBOARD },
    { label: "Active Deliveries", icon: FiPackage, path: ROUTES.DELIVERY_ORDERS },
    { label: "Delivery History", icon: FiClock, path: ROUTES.DELIVERY_HISTORY },
    { label: "My Profile", icon: FiUser, path: ROUTES.DELIVERY_PROFILE },
  ];

  return (
    <div className="min-h-screen bg-white flex font-sans text-gray-800">
      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Fixed Admin-Style Left Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-40 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center border-b px-4 justify-between">
          <Link to={ROUTES.DELIVERY_DASHBOARD} className="flex items-center justify-center overflow-hidden">
            <img
              src={collapsed ? logo1 : logo}
              alt="Logo"
              className="h-14 object-contain"
            />
          </Link>

          {/* Sidebar Collapse Toggle Button */}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="hidden lg:flex items-center justify-center absolute -right-3 top-12 w-7 h-7 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            {collapsed ? (
              <FiChevronsRight size={14} className="text-brand" />
            ) : (
              <FiChevronsLeft size={14} className="text-brand" />
            )}
          </button>
        </div>

        {/* Sidebar Agent Brief */}
        {!collapsed && (
          <div className="p-3 m-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand text-white font-bold flex items-center justify-center text-xs shadow-sm">
              {(user?.username || "D")[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : user?.username}
              </p>
              <p className="text-[10px] text-brand font-medium">Delivery Agent</p>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className={`p-3 space-y-1.5 ${collapsed ? "pt-3" : ""}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-xl transition-all ${
                  active
                    ? "bg-brand text-white shadow-sm font-semibold"
                    : "text-gray-700 hover:bg-gray-100 hover:text-brand"
                } ${collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-4 py-2.5"}`}
              >
                <Icon className="text-lg shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button at Bottom */}
        <div className="absolute bottom-4 w-full px-3">
          <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center w-full py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition ${
              collapsed ? "justify-center px-2" : "gap-3 px-4"
            }`}
          >
            <FiLogOut className="text-lg" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div
        className={`w-full min-h-screen transition-all duration-300 flex flex-col ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        } ml-0`}
      >
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-30 px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-white border border-gray-200 shadow-sm text-gray-700"
              aria-label="Open delivery menu"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand bg-brand/10 px-3 py-1 rounded-full border border-brand/20">
              Delivery Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Availability Toggle */}
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isAvailable
                  ? "bg-green-50 border-green-200 text-green-700 shadow-sm"
                  : "bg-red-50 border-red-200 text-red-700 shadow-sm"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              />
              <span>{isAvailable ? "Online (Available)" : "Offline"}</span>
              <FiPower className="w-3.5 h-3.5" />
            </button>

            {/* Profile Brief */}
            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
              <div className="w-8 h-8 rounded-full bg-brand text-white font-bold text-xs flex items-center justify-center shadow-sm">
                {(user?.username || "D")[0].toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : user?.username}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DeliveryLayout;
