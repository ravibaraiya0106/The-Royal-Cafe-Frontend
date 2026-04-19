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
    const message = await logoutService();

    toastSuccess(message || "Logged out successfully");
  } catch (error) {
    console.error("Logout API failed", error);
  } finally {
    logout(); // clear local storage
    window.dispatchEvent(new Event("authChanged"));
  }
};

export const PROFILE_MENU_ITEMS: DropdownItem[] = [
  { label: "Profile", to: "/profile" },
  { label: "Order History", to: "/order-history" },
  {
    label: "Logout",
    onClick: async () => {
      await userLogout();
    },
  },
];
