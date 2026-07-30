import { useState } from "react";
import { Outlet } from "react-router-dom";
import { RecruiterSidebar } from "./RecruiterSidebar";
import { RecruiterHeader } from "./RecruiterHeader";

export const RecruiterLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FC]">
      {/* Fixed Sidebar */}
      <RecruiterSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <RecruiterHeader onOpenMobileMenu={() => setIsMobileOpen(true)} />

        {/* Dynamic Nested Route Content */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
