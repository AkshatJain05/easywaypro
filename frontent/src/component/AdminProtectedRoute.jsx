import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "./Loading";

export default function ProtectedRoute() {
  const { user, initialized } = useSelector((state) => state.auth);
  //  console.log("Auth State:", { user, initialized });

  if (!initialized) return <Loading />;

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
