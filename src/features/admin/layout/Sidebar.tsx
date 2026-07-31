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
} from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    label: "Overview",
    path: "/admin/dashboard",
    icon: FiGrid,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: FiUsers,
  },
  {
    label: "Recruiters",
    path: "/admin/recruiters",
    icon: FiUserCheck,
  },
  {
    label: "Jobs",
    path: "/admin/jobs",
    icon: FiBriefcase,
  },
  {
    label: "Applications",
    path: "/admin/applications",
    icon: FiFileText,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: FiSettings,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-[#EAEFF7] bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Logo Section */}
        <div className="flex h-20 items-center justify-between border-b border-[#EAEFF7] px-6">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3C65F5] font-extrabold text-white text-xl shadow-md">
              J
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-[#05264E] leading-tight">
                JobBox
              </span>
              <span className="text-[10px] font-bold text-[#3C65F5] tracking-wider uppercase">
                Admin Portal
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 lg:hidden cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#66789C] mb-2">
            Main Management
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-[#3C65F5] text-white shadow-md shadow-blue-500/20"
                      : "text-[#66789C] hover:bg-[#F8FAFC] hover:text-[#05264E]"
                  }`
                }
              >
                <Icon className="text-base shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Back to Main Portal Link */}
        <div className="p-4 border-t border-[#EAEFF7]">
          <Link
            to="/jobs"
            className="flex items-center justify-center gap-2 rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 text-xs font-bold text-[#05264E] transition hover:bg-[#E8F0FE] hover:text-[#3C65F5]"
          >
            <FiGlobe />
            <span>Public Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
