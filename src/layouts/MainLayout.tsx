import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { useAppSelector } from "../hooks/useAppSelector";

const MainLayout = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Recruiter is restricted to recruiter dashboard workspace and cannot access public seeker layout
  if (isAuthenticated && user?.role === "RECRUITER") {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FC]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;