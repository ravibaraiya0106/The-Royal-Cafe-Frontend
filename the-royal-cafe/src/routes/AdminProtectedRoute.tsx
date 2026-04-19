import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/storage";
import { ROUTES } from "../constants/Sidebar";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getToken();
  const user = getUser();

  if (!token) return <Navigate to={ROUTES.ADMIN_LOGIN} />;

  if (user?.role !== "admin") {
    return <Navigate to={ROUTES.ADMIN_LOGIN} />;
  }

  return children;
};

export default AdminProtectedRoute;
