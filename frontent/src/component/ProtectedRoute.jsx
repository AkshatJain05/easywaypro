import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "./Loading";

export default function ProtectedRoute() {
  const { user, initialized } = useSelector((state) => state.auth);
    //  console.log("Auth State:", { user, initialized });
  // While auth state is being fetched
  if (!initialized) return <Loading/>

  // Redirect to login if not authenticated
  if (!user) return <Navigate to="/login" replace />;

  // Render the protected content
  return <Outlet />;
}
