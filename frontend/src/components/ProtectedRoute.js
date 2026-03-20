import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// GUEST: redirected to /login
// MEMBER: allowed unless role="admin" is required
// ADMIN: always allowed
function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // Not logged in — redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Inactive account — redirect to login
  if (user.status === "inactive") {
    return <Navigate to="/login" />;
  }

  // Admin-only route — non-admin redirected to home
  if (role === "admin" && user.role !== "admin") {
    return <Navigate to="/home" />;
  }

  return children;
}

export default ProtectedRoute;