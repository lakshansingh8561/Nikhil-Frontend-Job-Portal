import { useState } from "react";
import { Outlet } from "react-router-dom";
import JobSeekerSidebar from "./JobSeekerSidebar";
import JobSeekerHeader from "./JobSeekerHeader";

export const JobSeekerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FC]">
      {/* Sidebar */}
      <JobSeekerSidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden lg:pl-72">
        <JobSeekerHeader
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default JobSeekerLayout;
