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
  name: string;
  email: string;
  avatar: string;
};
