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
  FiZap,
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
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between bg-white text-[#05264E] border-r border-[#EAEFF7] transition-all duration-300 w-64 ${
          isDesktopCollapsed ? "lg:w-20 p-3" : "lg:w-64 p-5"
        } p-5 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-6">
          {/* Top Logo Section */}
          <div
            className={`flex items-center ${
              isDesktopCollapsed ? "lg:justify-center flex-col gap-3" : "justify-between"
            } pb-4 border-b border-[#F0F4FC]`}
          >
            <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3C65F5] shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <FiZap className="text-white text-lg fill-white" />
              </div>
              <div className={`${isDesktopCollapsed ? "lg:hidden" : "flex flex-col"}`}>
                <span className="text-xl font-black tracking-tight text-[#05264E] flex items-center gap-1">
                  Job<span className="text-[#3C65F5]">Box</span>
                </span>
                <span className="text-[10px] font-extrabold tracking-widest text-[#66789C] uppercase">
                  Super Admin
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              {onToggleSidebar && (
                <button
                  onClick={onToggleSidebar}
                  className="p-2 rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] text-[#05264E] hover:bg-[#E8F0FE] transition cursor-pointer"
                  title="Toggle Sidebar"
                >
                  <FiMenu className="text-base" />
                </button>
              )}

              <button
                onClick={onClose}
                className="text-[#66789C] hover:text-[#05264E] lg:hidden cursor-pointer p-1"
              >
                <FiX className="text-xl" />
              </button>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <div className="space-y-2">
            <p
              className={`px-3 text-[10px] font-black uppercase tracking-widest text-[#66789C] mb-3 ${
                isDesktopCollapsed ? "lg:hidden" : ""
              }`}
            >
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
                    `relative flex items-center ${
                      isDesktopCollapsed
                        ? "lg:justify-center lg:w-12 lg:h-12 lg:mx-auto lg:p-0"
                        : "px-4 py-3.5"
                    } gap-3.5 rounded-2xl text-xs font-bold transition-all duration-200 group ${
                      isActive
                        ? "bg-[#3C65F5] text-white shadow-md shadow-blue-500/20"
                        : "text-[#66789C] hover:text-[#05264E] hover:bg-[#F8FAFC]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`text-lg transition-transform group-hover:scale-110 ${
                          isActive ? "text-white" : "text-[#66789C] group-hover:text-[#3C65F5]"
                        }`}
                      />
                      <span className={`${isDesktopCollapsed ? "lg:hidden" : ""}`}>
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Footer Link to Public Platform */}
        <div className="pt-4 border-t border-[#F0F4FC]">
          <Link
            to="/"
            className={`flex items-center ${
              isDesktopCollapsed ? "lg:justify-center lg:p-2.5" : "px-3.5 py-2.5"
            } gap-3 rounded-xl text-xs font-bold text-[#66789C] hover:text-[#05264E] hover:bg-[#F8FAFC] transition cursor-pointer`}
          >
            <FiGlobe className="text-base text-[#3C65F5]" />
            <span className={`${isDesktopCollapsed ? "lg:hidden" : ""}`}>Live Portal</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
