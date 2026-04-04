import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/storage";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = getToken();
  const user = getUser();

  if (!token) return <Navigate to="/login" />;

  if (user?.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminProtectedRoute;
