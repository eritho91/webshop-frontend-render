import { Navigate, Outlet } from "react-router-dom";
import {
  isAuthenticated,
  getCurrentUser,
} from "../service/authService";

function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function ProtectedAdminRoute() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = currentUser.roles.includes("ROLE_ADMIN");

  if (!isAdmin) {
    return <Navigate to="/welcome" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;