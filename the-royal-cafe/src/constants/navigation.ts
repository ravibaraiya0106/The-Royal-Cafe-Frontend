// the-royal-cafe/src/constants/navigation.ts

import type { NavItemType } from "@/types/common";

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  ITEMS: "/item",
  BLOG: "/blog",
  CONTACT: "/contact",
  FOOD_ITEM: "/fooditem",
};

export const NAV_ITEMS: NavItemType[] = [
  { label: "Home", to: ROUTES.HOME },
  { label: "About", to: ROUTES.ABOUT },
  { label: "Items", to: ROUTES.ITEMS },
  { label: "Blog", to: ROUTES.BLOG },
  { label: "Contact", to: ROUTES.CONTACT },
];

export const QUICK_LINKS: NavItemType[] = [
  { label: "Home", to: ROUTES.HOME },
  { label: "About", to: ROUTES.ABOUT },
  { label: "Items", to: ROUTES.FOOD_ITEM },
  { label: "Blog", to: ROUTES.BLOG },
  { label: "Contact", to: ROUTES.CONTACT },
];
