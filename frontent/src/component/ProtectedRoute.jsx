import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "./Loading";

export default function ProtectedRoute() {
  const { user, initialized } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!initialized) return <Loading />;

  //  Save current page before redirect
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}