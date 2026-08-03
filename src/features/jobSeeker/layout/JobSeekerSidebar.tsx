import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUser,
  FiFileText,
  FiSearch,
  FiSettings,
  FiLogOut,
  FiX,
  FiBriefcase,
} from "react-icons/fi";
import Logo from "../../../assets/logo.svg";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { logout } from "../../auth/authSlice";
import { useGetProfileQuery } from "../api/jobSeekerApi";

interface JobSeekerSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const navItems = [
  { name: "Dashboard", path: "/job-seeker/dashboard", icon: FiGrid },
  { name: "My Profile", path: "/job-seeker/profile", icon: FiUser },
  { name: "My Applications", path: "/job-seeker/applications", icon: FiFileText },
  { name: "Find Jobs", path: "/job-seeker/jobs", icon: FiSearch },
  { name: "Settings", path: "/job-seeker/settings", icon: FiSettings },
];

export const JobSeekerSidebar = ({
  isMobileOpen = false,
  onCloseMobile,
}: JobSeekerSidebarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: profile } = useGetProfileQuery();
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
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between bg-white border-r border-[#EAEFF7] p-6 transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          {/* Header Logo + Mobile Close */}
          <div className="flex items-center justify-between pb-6 border-b border-[#F0F4FC]">
            <Link to="/" className="flex items-center shrink-0">
              <img src={Logo} alt="JobBox Candidate" className="h-9 w-auto" />
            </Link>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            )}
          </div>

          {/* Profile Summary Badge */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#F8FAFC] p-3.5 border border-[#EAEFF7] shadow-2xs">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3C65F5] font-bold text-white text-sm shadow-xs">
              {displayName.charAt(0).toUpperCase()}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="min-w-0 flex-1">
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
          <nav className="mt-7 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-[#3C65F5] text-white shadow-md"
                        : "text-[#66789C] hover:bg-[#F8FAFC] hover:text-[#05264E]"
                    }`
                  }
                >
                  <Icon className="text-lg shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-6 border-t border-[#F0F4FC] shrink-0">
          <Link
            to="/job-seeker/jobs"
            onClick={onCloseMobile}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-2.5 text-xs font-bold text-[#05264E] hover:bg-[#E8F0FE] hover:text-[#3C65F5] transition"
          >
            <FiBriefcase />
            <span>Browse Jobs</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <FiLogOut className="text-lg shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default JobSeekerSidebar;
