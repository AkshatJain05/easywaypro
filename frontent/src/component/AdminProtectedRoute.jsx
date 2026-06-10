import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "./Loading";

export default function ProtectedRoute() {
  const { user, initialized } = useSelector((state) => state.auth);

  // Keep execution suspended until user context initialization handshakes complete
  if (!initialized) return <Loading />;

  // Define structured group authorization layers
  const authorizedRoles = ["admin", "teacher"];

  // Guard Clause: Validate presence and evaluate permission context keys
  if (!user || !authorizedRoles.includes(user?.role?.toLowerCase())) {
    return <Navigate to="/admin/login" replace />;
  }

  // Authorize rendering pipeline for mounted child paths
  return <Outlet />;
}