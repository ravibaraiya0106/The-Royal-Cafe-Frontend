import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getToken, getUser } from "@/utils/storage";
import { ROUTES } from "@/constants/navigation";

const UserProtectedRoute = ({
  children,
}: {
  children: ReactNode;
}) => {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default UserProtectedRoute;

