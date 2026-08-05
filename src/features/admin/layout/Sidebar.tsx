import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiBriefcase,
  FiFileText,
  FiSettings,
  FiX,
  FiGlobe,
  FiMenu,
} from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isDesktopCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

const navItems = [
  { label: "Overview", path: "/admin/dashboard", icon: FiGrid },
  { label: "Users", path: "/admin/users", icon: FiUsers },
  { label: "Recruiters", path: "/admin/recruiters", icon: FiUserCheck },
  { label: "Jobs", path: "/admin/jobs", icon: FiBriefcase },
  { label: "Applications", path: "/admin/applications", icon: FiFileText },
  { label: "Settings", path: "/admin/settings", icon: FiSettings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isDesktopCollapsed = false,
  onToggleSidebar,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-[#EAEFF7] bg-white transition-all duration-300 ease-in-out lg:static lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          isDesktopCollapsed ? "lg:w-20" : "lg:w-64"
        } w-64 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Top Logo Section */}
        <div className={`flex h-20 items-center ${isDesktopCollapsed ? "lg:justify-center flex-col gap-2" : "justify-between px-5"} border-b border-[#EAEFF7] shrink-0`}>
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3C65F5] font-extrabold text-white text-xl shadow-md shrink-0">
              J
            </div>
            <div className={`flex flex-col ${isDesktopCollapsed ? "lg:hidden" : ""}`}>
              <span className="text-lg font-extrabold text-[#05264E] leading-tight">
                JobBox
              </span>
              <span className="text-[10px] font-bold text-[#3C65F5] tracking-wider uppercase">
                Admin Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-1.5 rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] text-[#05264E] hover:bg-[#E8F0FE] hover:text-[#3C65F5] transition cursor-pointer"
                title="Toggle Sidebar"
              >
                <FiMenu className="text-base" />
              </button>
            )}

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 lg:hidden cursor-pointer p-1"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        {/* Navigation Menu Links */}
        <div className={`flex-1 overflow-y-auto no-scrollbar ${isDesktopCollapsed ? "lg:px-2" : "px-4"} py-6 space-y-1.5`}>
          <p className={`px-3 text-[11px] font-bold uppercase tracking-wider text-[#66789C] mb-2 ${isDesktopCollapsed ? "lg:hidden" : ""}`}>
            Main Management
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={isDesktopCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center ${
                    isDesktopCollapsed
                      ? "lg:justify-center lg:w-11 lg:h-11 lg:mx-auto lg:p-0"
                      : "gap-3 px-4 py-3"
                  } rounded-2xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#3C65F5] text-white shadow-md shadow-blue-500/20"
                      : "text-[#66789C] hover:bg-[#F8FAFC] hover:text-[#05264E]"
                  }`
                }
              >
                <Icon className="text-base shrink-0" />
                <span className={isDesktopCollapsed ? "lg:hidden" : ""}>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Back to Main Portal Link */}
        <div className="p-4 border-t border-[#EAEFF7] shrink-0">
          <Link
            to="/jobs"
            title={isDesktopCollapsed ? "Public Site" : undefined}
            className={`flex items-center justify-center gap-2 rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] ${
              isDesktopCollapsed ? "lg:w-11 lg:h-11 lg:p-0 lg:mx-auto" : "py-3"
            } text-xs font-bold text-[#05264E] transition hover:bg-[#E8F0FE] hover:text-[#3C65F5]`}
          >
            <FiGlobe className="text-base shrink-0" />
            <span className={isDesktopCollapsed ? "lg:hidden" : ""}>Public Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
