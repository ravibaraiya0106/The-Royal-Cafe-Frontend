import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getToken, getUser } from "@/utils/storage";
import { ROUTES } from "@/constants/navigation";

const DeliveryProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to={ROUTES.DELIVERY_LOGIN} replace />;
  }

  // Check if role is delivery_person or admin
  if (user.role !== "delivery_person" && user.role !== "admin") {
    return <Navigate to={ROUTES.DELIVERY_LOGIN} replace />;
  }

  return <>{children}</>;
};

export default DeliveryProtectedRoute;
