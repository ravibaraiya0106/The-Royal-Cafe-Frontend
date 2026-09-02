import Sidebar from "../components/Admin/SideBar/Sidebar";
import { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { getSocket } from "@/config/socket";
import { toastSuccess, toastError } from "@/utils/toast";
import {
  playNewOrderChime,
  playOrderCancelledChime,
  speakVoiceAlert,
} from "@/utils/notificationSound";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastAdminNotifiedRef = useRef<string>("");

  // 🔔 ADMIN REAL-TIME SOCKET LISTENER FOR NEW ORDERS & CANCELLATIONS
  useEffect(() => {
    let socket: ReturnType<typeof getSocket> | null = null;
    try {
      socket = getSocket();

      const handleNewOrder = (data: { orderNumber?: string; finalAmount?: number }) => {
        const orderKey = `new:${data?.orderNumber || JSON.stringify(data)}`;
        if (lastAdminNotifiedRef.current === orderKey) return;
        lastAdminNotifiedRef.current = orderKey;
        setTimeout(() => {
          if (lastAdminNotifiedRef.current === orderKey) {
            lastAdminNotifiedRef.current = "";
          }
        }, 5000);

        playNewOrderChime();
        const orderText = data?.orderNumber ? `#${data.orderNumber}` : "New Order";
        toastSuccess(`🛒 New Order Coming: ${orderText}!`);
        speakVoiceAlert(`New order coming! Order ${orderText.replace("#", "")}`);

        window.dispatchEvent(new CustomEvent("adminOrderUpdated", { detail: data }));
      };

      const handleOrderCancelled = (data: { orderNumber?: string; reason?: string; cancelledBy?: string }) => {
        const orderKey = `cancel:${data?.orderNumber || JSON.stringify(data)}`;
        if (lastAdminNotifiedRef.current === orderKey) return;
        lastAdminNotifiedRef.current = orderKey;
        setTimeout(() => {
          if (lastAdminNotifiedRef.current === orderKey) {
            lastAdminNotifiedRef.current = "";
          }
        }, 5000);

        playOrderCancelledChime();
        const orderText = data?.orderNumber ? `#${data.orderNumber}` : "Order";
        toastError(`⚠️ Order Cancelled: ${orderText}!`);
        speakVoiceAlert(`Order ${orderText.replace("#", "")} was cancelled`);

        window.dispatchEvent(new CustomEvent("adminOrderUpdated", { detail: data }));
      };

      socket.on("admin:new_order", handleNewOrder);
      socket.on("admin:order_cancelled", handleOrderCancelled);

      return () => {
        socket?.off("admin:new_order", handleNewOrder);
        socket?.off("admin:order_cancelled", handleOrderCancelled);
      };
    } catch (err) {
      console.log("Admin socket setup error:", err);
    }
  }, []);

  return (
    <div className="flex">
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white border border-gray-200 shadow-sm text-gray-700"
        aria-label="Open menu"
      >
        <FiMenu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <main
        className={`w-full min-h-screen transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        } ml-0`}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
