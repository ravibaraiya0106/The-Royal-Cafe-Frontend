// the-royal-cafe/src/constants/navigation.ts

import type { NavItemType } from "@/types/common";

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  ITEMS: "/items",
  BLOGS: "/blogs",
  BLOG_DETAILS: "/blogs/:id",
  CONTACT: "/contact",
  FOOD_ITEM: "/fooditem",
  CART: "/cart",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
};

export const NAV_ITEMS: NavItemType[] = [
  { label: "Home", to: ROUTES.HOME },
  { label: "About", to: ROUTES.ABOUT },
  { label: "Items", to: ROUTES.ITEMS },
  { label: "Blogs", to: ROUTES.BLOGS },
  { label: "Contact", to: ROUTES.CONTACT },
];

export const QUICK_LINKS: NavItemType[] = [
  { label: "Home", to: ROUTES.HOME },
  { label: "About", to: ROUTES.ABOUT },
  { label: "Items", to: ROUTES.ITEMS },
  { label: "Blogs", to: ROUTES.BLOGS },
  { label: "Contact", to: ROUTES.CONTACT },
];
