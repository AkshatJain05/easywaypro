import { Navigate, Outlet, useLocation } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // if logged in → redirect to previous page or home
  if (token) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;