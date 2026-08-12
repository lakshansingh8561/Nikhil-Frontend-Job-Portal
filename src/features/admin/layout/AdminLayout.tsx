import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export const AdminLayout: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsDesktopCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FC]">
      {/* Collapsible Sidebar */}
      <Sidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        isDesktopCollapsed={isDesktopCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      {/* Main Content Area — offset to clear the fixed sidebar */}
      <div
        className={`flex flex-1 flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 ${
          isDesktopCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <Header onToggleSidebar={handleToggleSidebar} />

        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
