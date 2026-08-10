import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiLayers,
  FiPlusSquare,
  FiBriefcase,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiX,
  FiUser,
  FiMessageSquare,
  FiMenu,
  FiZap,
} from "react-icons/fi";
import Logo from "../../../assets/logo.svg";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { logout } from "../../auth/authSlice";
import { useGetUnreadCountQuery } from "../../chat/api/chatApi";
import { UnreadBadge } from "../../chat/components/UnreadBadge";

interface RecruiterSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isDesktopCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

const navItems = [
  { name: "Dashboard", path: "/recruiter/dashboard", icon: FiGrid },
  { name: "Company Profile", path: "/recruiter/company", icon: FiLayers },
  { name: "Post a Job", path: "/recruiter/post-job", icon: FiPlusSquare },
  { name: "My Jobs", path: "/recruiter/my-jobs", icon: FiBriefcase },
  { name: "Applications", path: "/recruiter/applications", icon: FiFileText },
  { name: "Messages", path: "/recruiter/messages", icon: FiMessageSquare, hasBadge: true },
  { name: "Recruiter Profile", path: "/recruiter/profile", icon: FiUser },
  { name: "Settings", path: "/recruiter/settings", icon: FiSettings },
];

export const RecruiterSidebar = ({
  isMobileOpen = false,
  onCloseMobile,
  isDesktopCollapsed = false,
  onToggleSidebar,
}: RecruiterSidebarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: unreadData } = useGetUnreadCountQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    if (onCloseMobile) onCloseMobile();
    navigate("/login");
  };

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
                alt="JobBox Recruiter"
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

          {/* Recruiter Profile Summary */}
          <div
            className={`mt-5 flex items-center ${
              isDesktopCollapsed ? "lg:justify-center lg:p-2" : "gap-3 p-3"
            } rounded-2xl bg-[#F8FAFC] border border-[#EAEFF7] shadow-2xs`}
            title={user?.email || "Recruiter"}
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1D4ED8] font-bold text-white text-xs shadow-xs">
              {user?.email ? user.email.charAt(0).toUpperCase() : "R"}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className={`min-w-0 flex-1 ${isDesktopCollapsed ? "lg:hidden" : ""}`}>
              <h4 className="text-xs font-bold text-[#05264E] truncate">
                {user?.email?.split("@")[0] || "Recruiter"}
              </h4>
              <p
                className="text-[11px] font-medium text-[#66789C] truncate"
                title={user?.email || "recruiter@jobbox.com"}
              >
                {user?.email || "recruiter@jobbox.com"}
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
                        ? "bg-[#1D4ED8] text-white shadow-md"
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
        <div className="space-y-3 pt-4 border-t border-[#F0F4FC] shrink-0">
          {/* SPECIAL MEMBERSHIP BUTTON AT BOTTOM */}
          <NavLink
            to="/recruiter/membership"
            onClick={onCloseMobile}
            title={isDesktopCollapsed ? "Membership Plans" : undefined}
            className={({ isActive }) =>
              `relative group overflow-hidden flex items-center ${
                isDesktopCollapsed
                  ? "lg:w-12 lg:h-12 lg:p-0 lg:mx-auto lg:justify-center"
                  : "justify-between px-4 py-3"
              } rounded-2xl bg-gradient-to-r from-[#3C65F5] via-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-white/20 ${
                isActive ? "ring-2 ring-yellow-400 ring-offset-2" : ""
              }`
            }
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

            <div className="relative z-10 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-yellow-400/20 backdrop-blur-md text-yellow-300 border border-yellow-300/30 shadow-inner">
                <FiZap className="text-lg fill-yellow-300 text-yellow-300 animate-pulse" />
              </span>
              <div className={`flex flex-col ${isDesktopCollapsed ? "lg:hidden" : ""}`}>
                <span className="text-xs font-black tracking-wide text-white drop-shadow-xs">
                  Membership Plans
                </span>
                <span className="text-[10px] font-bold text-yellow-300/90 tracking-wider uppercase">
                  Upgrade & Perks ⭐
                </span>
              </div>
            </div>

            <span className={`relative z-10 rounded-full bg-yellow-400 px-2 py-0.5 text-[9px] font-black uppercase text-gray-900 shadow-sm ${isDesktopCollapsed ? "lg:hidden" : ""}`}>
              PRO
            </span>
          </NavLink>

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
