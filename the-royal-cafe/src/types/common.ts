import type { ReactNode } from "react";

export type NavItemType = {
  label: string;
  to: string;
};
export type DropdownItem = {
  label: string;
  to?: string;
  onClick?: () => void;
};

export type UserInfo = {
  initials: ReactNode;
  name: string;
  email: string;
  avatar: string;
};
