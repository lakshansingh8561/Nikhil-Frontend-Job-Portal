import React from "react";
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
  FiChevronRight,
  FiGlobe,
  FiUsers,
  FiEdit3,
} from "react-icons/fi";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { logout } from "../../auth/authSlice";
import { useGetUnreadCountQuery } from "../../chat/api/chatApi";
import { UnreadBadge } from "../../chat/components/UnreadBadge";
import { useGetNetworkStatsQuery } from "../../network/api/networkApi";
import { useGetCurrentRecruiterPlanQuery } from "../../membership/api/membershipApi";
import logo from "../../../assets/logo.svg";

interface RecruiterSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isDesktopCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

const navItems = [
  { name: "Dashboard", path: "/recruiter/dashboard", icon: FiGrid },
  { name: "Network Feed", path: "/recruiter/network", icon: FiGlobe },
  {
    name: "My Network",
    path: "/recruiter/network/connections",
    icon: FiUsers,
    hasInviteBadge: true,
  },
  { name: "Company Profile", path: "/recruiter/company", icon: FiLayers },
  { name: "Post a Job", path: "/recruiter/post-job", icon: FiPlusSquare },
  { name: "My Jobs", path: "/recruiter/my-jobs", icon: FiBriefcase },
  { name: "Applications", path: "/recruiter/applications", icon: FiFileText },
  { name: "My Blogs", path: "/recruiter/blogs", icon: FiEdit3 },
  { name: "Messages", path: "/recruiter/messages", icon: FiMessageSquare, hasBadge: true },
  { name: "Recruiter Profile", path: "/recruiter/profile", icon: FiUser },
  { name: "Settings", path: "/recruiter/settings", icon: FiSettings },
];

export const RecruiterSidebar: React.FC<RecruiterSidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
  isDesktopCollapsed = false,
  onToggleSidebar,
}) => {
  const { data: unreadData } = useGetUnreadCountQuery();
  const { data: networkStats } = useGetNetworkStatsQuery();
  const { data: recSub } = useGetCurrentRecruiterPlanQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const activeJobsCount = recSub?.activeJobsCount || 0;
  const maxActiveJobs = recSub?.maxActiveJobs || 3;
  const planName = recSub?.subscription?.planName || recSub?.plan?.name || "Free Tier";

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
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between bg-white text-slate-900 border-r border-slate-200/80 transition-all duration-200 w-64 ${isDesktopCollapsed ? "lg:w-20 p-3" : "lg:w-64 p-4"
          } p-4 ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-5">
          {/* Sidebar Top Header */}
          <div
            className={`flex items-center ${isDesktopCollapsed ? "lg:justify-center flex-col gap-3" : "justify-between"
              } pb-3.5 border-b border-slate-100`}
          >
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="JobBox" className="h-7 w-auto" />
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

              {onCloseMobile && (
                <button
                  onClick={onCloseMobile}
                  className="lg:hidden p-1.5 text-slate-400 hover:text-slate-900 cursor-pointer"
                >
                  <FiX className="text-lg" />
                </button>
              )}
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onCloseMobile}
                  title={isDesktopCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `relative flex items-center ${isDesktopCollapsed
                      ? "lg:justify-center lg:w-10 lg:h-10 lg:mx-auto lg:p-0"
                      : "justify-between px-3 py-2.5"
                    } gap-3 rounded-xl text-xs font-semibold transition-all duration-150 group ${isActive
                      ? "bg-indigo-50 text-indigo-600 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon className={`text-base shrink-0 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-700"}`} />
                        <span className={`${isDesktopCollapsed ? "lg:hidden" : ""}`}>{item.name}</span>
                      </div>

                      {item.hasBadge && (
                        <div className={`${isDesktopCollapsed ? "lg:hidden" : ""}`}>
                          <UnreadBadge count={unreadData?.unreadCount || 0} />
                        </div>
                      )}

                      {item.hasInviteBadge && (
                        <div className={`${isDesktopCollapsed ? "lg:hidden" : ""}`}>
                          <UnreadBadge count={networkStats?.pendingInvitesCount || 0} />
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer: Membership Upgrade Widget & Logout */}
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          {!isDesktopCollapsed && (
            <div className="rounded-xl bg-slate-900 p-3.5 text-white border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <FiZap className="text-amber-400" /> {planName}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                  {activeJobsCount}/{maxActiveJobs} Jobs
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-tight mb-2.5">
                Upgrade to post unlimited jobs and candidate search.
              </p>
              <Link
                to="/recruiter/membership"
                onClick={onCloseMobile}
                className="w-full flex items-center justify-center gap-1 rounded-lg bg-indigo-600 py-1.5 text-[11px] font-bold text-white hover:bg-indigo-700 transition cursor-pointer shadow-xs"
              >
                <span>Upgrade Plan</span>
                <FiChevronRight className="text-xs" />
              </Link>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isDesktopCollapsed ? "lg:justify-center lg:p-2" : "px-3 py-2"
              } gap-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer`}
            title="Sign Out"
          >
            <FiLogOut className="text-base shrink-0" />
            <span className={`${isDesktopCollapsed ? "lg:hidden" : ""}`}>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
