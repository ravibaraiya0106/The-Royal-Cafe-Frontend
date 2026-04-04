import { Route } from "react-router-dom";

import { ROUTES as ADMIN_ROUTES } from "@/constants/Sidebar";

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
import AdminProtectedRoute from "./AdminProtectedRoute";

export const AdminRoutes = (
  <>
    {/* Admin area routes (mounted inside AppRoutes' <Routes />) */}
    <Route path={ADMIN_ROUTES.ADMIN_LOGIN} element={<Login />} />

    <Route
      path={ADMIN_ROUTES.ADMIN_DASHBOARD}
      element={
        <AdminProtectedRoute>
          <Dashboard />
        </AdminProtectedRoute>
      }
    />
    <Route path={ADMIN_ROUTES.ADMIN_ITEMS} element={<Items />} />
    <Route path={ADMIN_ROUTES.ADMIN_CATEGORIES} element={<Categories />} />
    <Route path={ADMIN_ROUTES.ADMIN_ORDERS} element={<Orders />} />
    <Route path={ADMIN_ROUTES.ADMIN_CUSTOMERS} element={<Customers />} />
    <Route path={ADMIN_ROUTES.ADMIN_DELIVERY} element={<DeliveryPerson />} />
    <Route path={ADMIN_ROUTES.ADMIN_BLOGS} element={<Blogs />} />
    <Route path={ADMIN_ROUTES.ADMIN_CONTACT} element={<Contact />} />
    <Route path={ADMIN_ROUTES.ADMIN_COUPONS} element={<Coupons />} />
    <Route path={ADMIN_ROUTES.ADMIN_REVIEWS} element={<Reviews />} />
  </>
);
