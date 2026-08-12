import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAppSelector } from "../hooks/useAppSelector";

const MainLayout = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Authenticated users are restricted to their respective workspace dashboard layouts and cannot access public layout
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
  }

  return (
    <div className="min-h-screen bg-[#F5F7FC] flex flex-col justify-between">
      <div>
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;