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
} from "react-icons/fi";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { logout } from "../../auth/authSlice";
import { useGetUnreadCountQuery } from "../../chat/api/chatApi";
import { UnreadBadge } from "../../chat/components/UnreadBadge";
import { useGetCurrentRecruiterPlanQuery } from "../../membership/api/membershipApi";

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

export const RecruiterSidebar: React.FC<RecruiterSidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
  isDesktopCollapsed = false,
  onToggleSidebar,
}) => {
  const { data: unreadData } = useGetUnreadCountQuery();
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
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between bg-white text-[#05264E] border-r border-[#EAEFF7] transition-all duration-300 w-72 ${
          isDesktopCollapsed ? "lg:w-20 p-3" : "lg:w-72 p-5"
        } p-5 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-6">
          {/* Header Logo + Sidebar Toggle */}
          <div
            className={`flex items-center ${
              isDesktopCollapsed ? "lg:justify-center flex-col gap-3" : "justify-between"
            } pb-4 border-b border-[#F0F4FC]`}
          >
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3C65F5] shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <FiZap className="text-white text-lg fill-white" />
              </div>
              <div className={`${isDesktopCollapsed ? "lg:hidden" : "flex flex-col"}`}>
                <span className="text-xl font-black tracking-tight text-[#05264E] flex items-center gap-1">
                  Job<span className="text-[#3C65F5]">Box</span>
                </span>
                <span className="text-[10px] font-extrabold tracking-widest text-[#66789C] uppercase">
                  Recruiter Suite
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

              {onCloseMobile && (
                <button
                  onClick={onCloseMobile}
                  className="lg:hidden p-2 text-[#66789C] hover:text-[#05264E] cursor-pointer"
                >
                  <FiX className="text-xl" />
                </button>
              )}
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-2 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onCloseMobile}
                  title={isDesktopCollapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `relative flex items-center ${
                      isDesktopCollapsed
                        ? "lg:justify-center lg:w-12 lg:h-12 lg:mx-auto lg:p-0"
                        : "justify-between px-4 py-3.5"
                    } gap-3.5 rounded-2xl text-xs font-bold transition-all duration-200 group ${
                      isActive
                        ? "bg-[#3C65F5] text-white shadow-md shadow-blue-500/20"
                        : "text-[#66789C] hover:text-[#05264E] hover:bg-[#F8FAFC]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3.5">
                        <Icon className={`text-lg transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-[#66789C] group-hover:text-[#3C65F5]"}`} />
                        <span className={`${isDesktopCollapsed ? "lg:hidden" : ""}`}>{item.name}</span>
                      </div>

                      {item.hasBadge && (
                        <div className={`${isDesktopCollapsed ? "lg:hidden" : ""}`}>
                          <UnreadBadge count={unreadData?.unreadCount || 0} />
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
        <div className="pt-4 border-t border-[#F0F4FC] space-y-3">
          {!isDesktopCollapsed && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-yellow-300 flex items-center gap-1">
                  <FiZap className="text-yellow-300 fill-yellow-300" /> {planName}
                </span>
                <span className="text-[10px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full border border-white/30">
                  {activeJobsCount}/{maxActiveJobs} Jobs
                </span>
              </div>
              <p className="text-[11px] text-blue-100 font-medium leading-tight mb-3">
                Upgrade plan to unlock unlimited job postings & candidate search!
              </p>
              <Link
                to="/recruiter/membership"
                onClick={onCloseMobile}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white py-2 text-[11px] font-black text-[#05264E] hover:bg-blue-50 transition cursor-pointer shadow-sm"
              >
                <span>Upgrade Plan</span>
                <FiChevronRight className="text-xs" />
              </Link>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              isDesktopCollapsed ? "lg:justify-center lg:p-2.5" : "px-3.5 py-2.5"
            } gap-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer`}
            title="Sign Out"
          >
            <FiLogOut className="text-base" />
            <span className={`${isDesktopCollapsed ? "lg:hidden" : ""}`}>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
