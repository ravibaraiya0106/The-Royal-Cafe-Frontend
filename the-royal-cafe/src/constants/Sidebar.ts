import {
  FiHome,
  FiGrid,
  FiShoppingCart,
  FiUsers,
  FiFileText,
  FiTag,
  FiMessageSquare,
  FiTruck,
  FiLayers,
} from "react-icons/fi";

/* ================= ROUTES ================= */

export const ROUTES = {
  // Admin Routes
  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_ITEMS: "/admin/items",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_CUSTOMERS: "/admin/customers",
  ADMIN_BLOGS: "/admin/blogs",
  ADMIN_CONTACT: "/admin/contact",
  ADMIN_COUPONS: "/admin/coupons",
  ADMIN_DELIVERY: "/admin/delivery-persons",
  ADMIN_REVIEWS: "/admin/reviews",
};

/* ================= SIDEBAR ================= */

export const SIDEBAR_ITEMS = [
  // Dashboard
  {
    label: "Dashboard",
    to: ROUTES.ADMIN_DASHBOARD,
    icon: FiHome,
  },

  // Product Management
  {
    label: "Items",
    to: ROUTES.ADMIN_ITEMS,
    icon: FiGrid,
  },
  {
    label: "Categories",
    to: ROUTES.ADMIN_CATEGORIES,
    icon: FiLayers,
  },

  // Orders & Customers
  {
    label: "Orders",
    to: ROUTES.ADMIN_ORDERS,
    icon: FiShoppingCart,
  },
  {
    label: "Customers",
    to: ROUTES.ADMIN_CUSTOMERS,
    icon: FiUsers,
  },
  {
    label: "Delivery",
    to: ROUTES.ADMIN_DELIVERY,
    icon: FiTruck,
  },

  // Content
  {
    label: "Blogs",
    to: ROUTES.ADMIN_BLOGS,
    icon: FiFileText,
  },
  {
    label: "Reviews",
    to: ROUTES.ADMIN_REVIEWS,
    icon: FiMessageSquare,
  },

  // Marketing / Support
  {
    label: "Coupons",
    to: ROUTES.ADMIN_COUPONS,
    icon: FiTag,
  },
  {
    label: "Contact",
    to: ROUTES.ADMIN_CONTACT,
    icon: FiMessageSquare,
  },
];
