// the-royal-cafe/src/constants/navigation.ts

import type { NavItemType } from "@/types/common";

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  ITEMS: "/items",
  BLOGS: "/blogs",
  BLOG_DETAILS: "/blogs/:id",
  REVIEWS: "/reviews",
  CONTACT: "/contact",
  FOOD_ITEM: "/fooditem",
  CART: "/cart",
  CHECKOUT: "/checkout",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  USER_PROFILE: "/profile",
  ORDER_HISTORY: "/order-history",
  DELIVERY_LOGIN: "/delivery/login",
  DELIVERY_DASHBOARD: "/delivery/dashboard",
  DELIVERY_ORDERS: "/delivery/orders",
  DELIVERY_HISTORY: "/delivery/history",
  DELIVERY_PROFILE: "/delivery/profile",
};

export const NAV_ITEMS: NavItemType[] = [
  { label: "Home", to: ROUTES.HOME },
  { label: "About", to: ROUTES.ABOUT },
  { label: "Items", to: ROUTES.ITEMS },
  { label: "Blogs", to: ROUTES.BLOGS },
  { label: "Reviews", to: ROUTES.REVIEWS },
  { label: "Contact", to: ROUTES.CONTACT },
];

export const QUICK_LINKS: NavItemType[] = [
  { label: "Home", to: ROUTES.HOME },
  { label: "About", to: ROUTES.ABOUT },
  { label: "Items", to: ROUTES.ITEMS },
  { label: "Blogs", to: ROUTES.BLOGS },
  { label: "Reviews", to: ROUTES.REVIEWS },
  { label: "Contact", to: ROUTES.CONTACT },
];
