import { Route } from "react-router-dom";
import Login from "@/components/auth/Login";
import AdminProtectedRoute from "./AdminProtectedRoute";

import { ROUTES } from "@/constants/Sidebar";
import { ADMIN_ROUTE_CONFIG } from "./adminRoutes.config";

export const AdminRoutes = (
  <>
    {/* Public */}
    <Route path={ROUTES.ADMIN_LOGIN} element={<Login />} />

    {/* Protected (Mapped) */}
    {ADMIN_ROUTE_CONFIG.map((route, index) => (
      <Route
        key={index}
        path={route.path}
        element={<AdminProtectedRoute>{route.element}</AdminProtectedRoute>}
      />
    ))}
  </>
);
