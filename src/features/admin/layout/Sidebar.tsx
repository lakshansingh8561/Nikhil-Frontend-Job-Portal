import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiBriefcase,
  FiFileText,
  FiSettings,
  FiZap,
  FiX,
  FiGlobe,
  FiMenu,
} from "react-icons/fi";
import logo from "../../../assets/logo.svg";

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
  { label: "Membership Plans", path: "/admin/memberships", icon: FiZap },
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
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between bg-white text-slate-900 border-r border-slate-200/80 transition-all duration-200 w-64 ${
          isDesktopCollapsed ? "lg:w-20 p-3" : "lg:w-64 p-4"
        } p-4 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-5">
          {/* Top Logo Section */}
          <div
            className={`flex items-center ${
              isDesktopCollapsed ? "lg:justify-center flex-col gap-3" : "justify-between"
            } pb-3.5 border-b border-slate-100`}
          >
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <img src={logo} alt="JobBox" className="h-7 w-auto" />
              {!isDesktopCollapsed && (
                <span className="saas-badge saas-badge-rose text-[9px]">Admin</span>
              )}
            </Link>

            <div className="flex items-center gap-1">
              {onToggleSidebar && (
                <button
                  onClick={onToggleSidebar}
                  className="hidden lg:flex p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  title="Toggle Sidebar"
                >
                  <FiMenu className="text-sm" />
                </button>
              )}

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-900 lg:hidden cursor-pointer p-1"
              >
                <FiX className="text-lg" />
              </button>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <div className="space-y-1">
            <p
              className={`px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 ${
                isDesktopCollapsed ? "lg:hidden" : ""
              }`}
            >
              System Management
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
                        ? "lg:justify-center lg:w-10 lg:h-10 lg:mx-auto lg:p-0"
                        : "px-3 py-2.5"
                    } gap-3 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`text-base shrink-0 ${
                          isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-700"
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
        <div className="pt-3 border-t border-slate-100">
          <Link
            to="/"
            className={`flex items-center ${
              isDesktopCollapsed ? "lg:justify-center lg:p-2" : "px-3 py-2"
            } gap-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer`}
          >
            <FiGlobe className="text-base text-indigo-600 shrink-0" />
            <span className={`${isDesktopCollapsed ? "lg:hidden" : ""}`}>Public Portal</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
