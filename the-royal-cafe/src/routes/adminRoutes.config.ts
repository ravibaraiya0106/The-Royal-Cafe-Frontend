import React from "react";
import Dashboard from "@/pages/Admin/Dashboard";
import Items from "@/pages/Admin/Items";
import Categories from "@/pages/Admin/Categories";
import Orders from "@/pages/Admin/Orders";
import Customers from "@/pages/Admin/Customers";
import Blogs from "@/pages/Admin/Blogs";
import Contact from "@/pages/Admin/Contact";
import Coupons from "@/pages/Admin/Coupons";
import DeliveryPerson from "@/pages/Admin/DeliveryPerson";
import Reviews from "@/pages/Admin/Reviews";
import Login from "@/components/auth/Login";

import { ROUTES } from "@/constants/Sidebar";

export const ADMIN_ROUTE_CONFIG = [
  { path: ROUTES.ADMIN_LOGIN, element: React.createElement(Login) },
  { path: ROUTES.ADMIN_DASHBOARD, element: React.createElement(Dashboard) },
  { path: ROUTES.ADMIN_ITEMS, element: React.createElement(Items) },
  { path: ROUTES.ADMIN_CATEGORIES, element: React.createElement(Categories) },
  { path: ROUTES.ADMIN_ORDERS, element: React.createElement(Orders) },
  { path: ROUTES.ADMIN_CUSTOMERS, element: React.createElement(Customers) },
  { path: ROUTES.ADMIN_DELIVERY, element: React.createElement(DeliveryPerson) },
  { path: ROUTES.ADMIN_BLOGS, element: React.createElement(Blogs) },
  { path: ROUTES.ADMIN_CONTACT, element: React.createElement(Contact) },
  { path: ROUTES.ADMIN_COUPONS, element: React.createElement(Coupons) },
  { path: ROUTES.ADMIN_REVIEWS, element: React.createElement(Reviews) },
];
