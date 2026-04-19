import type { DropdownItem } from "@/types/common";
import { logoutService } from "@/services/authService";
import { toastSuccess } from "@/utils/toast";
import { logout } from "@/utils/storage";

export const user = {
  name: "Joseph McFall",
  email: "name@flowbite.com",
  avatar: "https://i.pravatar.cc/40",
};

export const userLogout = async () => {
  try {
    await logoutService();
  } catch (error) {
    console.error("Logout API failed", error);
  } finally {
    logout();
    // window.dispatchEvent(new Event("authChanged"));
  }
};

export const PROFILE_MENU_ITEMS: DropdownItem[] = [
  { label: "Profile", to: "/profile" },
  { label: "Order History", to: "/order-history" },
  {
    label: "Logout",
    onClick: async () => {
      await userLogout();

      toastSuccess("Logged out successfully");

      window.location.href = "/"; // or use navigate("/")
    },
  },
];
