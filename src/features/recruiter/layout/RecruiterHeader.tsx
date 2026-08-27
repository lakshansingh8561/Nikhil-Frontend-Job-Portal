import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiZap,
  FiPlus,
} from "react-icons/fi";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { logout } from "../../auth/authSlice";
import NotificationDropdown from "../../../components/common/NotificationDropdown";
import { DetectLocationButton } from "../../../components/common/DetectLocationButton";

import Avatar from "../../../features/network/components/common/Avatar";
import { useGetMyNetworkProfileQuery } from "../../../features/network/api/networkApi";

interface RecruiterHeaderProps {
  onToggleSidebar?: () => void;
}

export const RecruiterHeader = ({ onToggleSidebar }: RecruiterHeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);
  const { data: networkProfile } = useGetMyNetworkProfileQuery(undefined, { skip: !user });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const avatarUrl = networkProfile?.profilePicture || (user as any)?.profilePicture;
  const displayName = networkProfile?.fullName || user?.email?.split("@")[0] || "Recruiter";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-white/90 backdrop-blur-md px-6 border-b border-slate-200/80">
      {/* Search Bar & Mobile Toggle */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 lg:hidden transition cursor-pointer"
          title="Toggle Sidebar"
        >
          <FiMenu className="text-lg" />
        </button>

        <div className="relative flex items-center w-full">
          <FiSearch className="absolute left-3 text-slate-400 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Search candidates, jobs, applications..."
            className="saas-input h-9 text-xs pl-9 pr-10 bg-slate-50/60 focus:bg-white"
          />
          <kbd className="absolute right-3 hidden sm:inline-flex items-center rounded-md bg-slate-200/60 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions: Post Job, Location, Notifications, Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          to="/recruiter/post-job"
          className="saas-btn-primary h-8.5 text-xs px-3.5"
        >
          <FiPlus /> Post a Job
        </Link>

        <DetectLocationButton variant="badge" />

        <NotificationDropdown />

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl bg-slate-50 p-1 pl-1.5 pr-2.5 border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
          >
            <Avatar
              src={avatarUrl}
              name={displayName}
              email={user?.email}
              size="sm"
              className="!h-7 !w-7"
            />
            <span className="hidden sm:inline text-xs font-bold text-slate-900 max-w-[100px] truncate">
              {displayName}
            </span>
            <FiChevronDown className="text-xs text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.email?.split("@")[0]}</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">{user?.email}</p>
              </div>

              <Link
                to="/recruiter/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <FiUser /> Profile
              </Link>

              <Link
                to="/recruiter/membership"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <FiZap className="text-amber-500" /> Membership
              </Link>

              <Link
                to="/recruiter/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <FiSettings /> Settings
              </Link>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <FiLogOut /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default RecruiterHeader;
