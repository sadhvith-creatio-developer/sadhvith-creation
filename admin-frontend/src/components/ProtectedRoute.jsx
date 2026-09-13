import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingState from "./LoadingState";

// Guards every admin route. Unauthenticated admins, or admins whose JWT
// has expired, are redirected to /login. The backend independently
// re-verifies the JWT (and that the role is "admin") on every protected
// API call, so this is a UX convenience, not the real security boundary.
export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <LoadingState count={3} />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
