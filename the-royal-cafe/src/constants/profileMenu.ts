import type { DropdownItem } from "@/types/common";

export const user = {
  name: "Joseph McFall",
  email: "name@flowbite.com",
  avatar: "https://i.pravatar.cc/40",
};
export const PROFILE_MENU_ITEMS: DropdownItem[] = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Settings", to: "/settings" },
  { label: "Earnings", to: "/earnings" },
  {
    label: "Sign out",
    onClick: () => {
      console.log("Logout clicked");
    },
  },
];
