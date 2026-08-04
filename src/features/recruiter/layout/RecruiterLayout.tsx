import { useState } from "react";
import { Outlet } from "react-router-dom";
import { RecruiterSidebar } from "./RecruiterSidebar";
import { RecruiterHeader } from "./RecruiterHeader";

export const RecruiterLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FC]">
      {/* Fixed Sidebar */}
      <RecruiterSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden lg:pl-72">
        {/* Sticky Top Header */}
        <RecruiterHeader onOpenMobileMenu={() => setIsMobileOpen(true)} />

        {/* Dynamic Nested Route Content */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
