import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUser,
  FiFileText,
  FiSearch,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiX,
  FiBriefcase,
  FiMenu,
} from "react-icons/fi";
import Logo from "../../../assets/logo.svg";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { logout } from "../../auth/authSlice";
import { useGetProfileQuery } from "../api/jobSeekerApi";
import { useGetUnreadCountQuery } from "../../chat/api/chatApi";
import { UnreadBadge } from "../../chat/components/UnreadBadge";

interface JobSeekerSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isDesktopCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

const navItems = [
  { name: "Dashboard", path: "/job-seeker/dashboard", icon: FiGrid },
  { name: "My Profile", path: "/job-seeker/profile", icon: FiUser },
  { name: "My Applications", path: "/job-seeker/applications", icon: FiFileText },
  { name: "Messages", path: "/job-seeker/messages", icon: FiMessageSquare, hasBadge: true },
  { name: "Find Jobs", path: "/job-seeker/jobs", icon: FiSearch },
  { name: "Settings", path: "/job-seeker/settings", icon: FiSettings },
];

export const JobSeekerSidebar = ({
  isMobileOpen = false,
  onCloseMobile,
  isDesktopCollapsed = false,
  onToggleSidebar,
}: JobSeekerSidebarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: profile } = useGetProfileQuery();
  const { data: unreadData } = useGetUnreadCountQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    if (onCloseMobile) onCloseMobile();
    navigate("/login");
  };

  const displayName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || user?.email?.split("@")[0] || "Job Seeker"
    : user?.email?.split("@")[0] || "Job Seeker";

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between bg-white border-r border-[#EAEFF7] transition-all duration-300 w-72 ${
          isDesktopCollapsed ? "lg:w-20 p-3" : "lg:w-72 p-6"
        } p-6 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          {/* Header Logo + Sidebar Toggle Button */}
          <div className={`flex items-center ${isDesktopCollapsed ? "lg:justify-center flex-col gap-2.5" : "justify-between"} pb-5 border-b border-[#F0F4FC]`}>
            <Link to="/" className="flex items-center shrink-0">
              <img
                src={Logo}
                alt="JobBox Candidate"
                className={`h-8 w-auto transition-all ${isDesktopCollapsed ? "lg:w-8 lg:h-8 lg:object-cover lg:object-left" : ""}`}
              />
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

              {onCloseMobile && (
                <button
                  onClick={onCloseMobile}
                  className="lg:hidden p-1.5 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <FiX className="text-xl" />
                </button>
              )}
            </div>
          </div>

          {/* Profile Summary Badge */}
          <div
            className={`mt-5 flex items-center ${
              isDesktopCollapsed ? "lg:justify-center lg:p-2" : "gap-3 p-3"
            } rounded-2xl bg-[#F8FAFC] border border-[#EAEFF7] shadow-2xs`}
            title={displayName}
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3C65F5] font-bold text-white text-xs shadow-xs">
              {displayName.charAt(0).toUpperCase()}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className={`min-w-0 flex-1 ${isDesktopCollapsed ? "lg:hidden" : ""}`}>
              <h4 className="text-xs font-bold text-[#05264E] truncate">
                {displayName}
              </h4>
              <p
                className="text-[11px] font-medium text-[#66789C] truncate"
                title={user?.email || "candidate@jobbox.com"}
              >
                {user?.email || "candidate@jobbox.com"}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onCloseMobile}
                  title={isDesktopCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `flex items-center ${
                      isDesktopCollapsed
                        ? "lg:justify-center lg:w-11 lg:h-11 lg:mx-auto lg:p-0"
                        : "justify-between px-3.5 py-2.5"
                    } gap-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-[#3C65F5] text-white shadow-md"
                        : "text-[#66789C] hover:bg-[#F8FAFC] hover:text-[#05264E]"
                    }`
                  }
                >
                  <div className="flex items-center gap-3 min-w-0 justify-center">
                    <Icon className="text-lg shrink-0" />
                    <span className={`truncate ${isDesktopCollapsed ? "lg:hidden" : ""}`}>
                      {item.name}
                    </span>
                  </div>
                  {item.hasBadge && unreadData && unreadData.unreadCount > 0 && (
                    <div className={isDesktopCollapsed ? "lg:hidden" : ""}>
                      <UnreadBadge count={unreadData.unreadCount} />
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-4 border-t border-[#F0F4FC] shrink-0">
          <Link
            to="/job-seeker/jobs"
            onClick={onCloseMobile}
            title={isDesktopCollapsed ? "Browse Jobs" : undefined}
            className={`flex items-center justify-center gap-2 rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] ${
              isDesktopCollapsed ? "lg:w-11 lg:h-11 lg:p-0 lg:mx-auto" : "py-2.5"
            } text-xs font-bold text-[#05264E] hover:bg-[#E8F0FE] hover:text-[#3C65F5] transition`}
          >
            <FiBriefcase className="text-lg shrink-0" />
            <span className={isDesktopCollapsed ? "lg:hidden" : ""}>Browse Jobs</span>
          </Link>

          <button
            onClick={handleLogout}
            title={isDesktopCollapsed ? "Sign Out" : undefined}
            className={`flex w-full items-center ${
              isDesktopCollapsed
                ? "lg:justify-center lg:w-11 lg:h-11 lg:p-0 lg:mx-auto"
                : "gap-3 px-3.5 py-2.5"
            } rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer`}
          >
            <FiLogOut className="text-lg shrink-0" />
            <span className={isDesktopCollapsed ? "lg:hidden" : ""}>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default JobSeekerSidebar;
