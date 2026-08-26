import { useState } from "react";
import { Outlet } from "react-router-dom";
import JobSeekerSidebar from "./JobSeekerSidebar";
import JobSeekerHeader from "./JobSeekerHeader";

export const JobSeekerLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsDesktopCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FC]">
      {/* Sidebar */}
      <JobSeekerSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        isDesktopCollapsed={isDesktopCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Main Content Area */}
      <div
        className={`flex flex-1 flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 ${isDesktopCollapsed ? "lg:pl-20" : "lg:pl-64"
          }`}
      >
        <JobSeekerHeader onToggleSidebar={handleToggleSidebar} />

        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default JobSeekerLayout;
