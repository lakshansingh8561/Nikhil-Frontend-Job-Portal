import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";

export const PublicOnlyRoute = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated && user) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === "RECRUITER") {
      return <Navigate to="/recruiter/dashboard" replace />;
    }
    if (user.role === "JOB_SEEKER") {
      return <Navigate to="/job-seeker/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
