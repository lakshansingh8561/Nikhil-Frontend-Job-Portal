import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiUser,
  FiFileText,
  FiLogOut,
  FiChevronDown,
  FiZap,
} from "react-icons/fi";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { logout } from "../../auth/authSlice";
import { useGetProfileQuery } from "../api/jobSeekerApi";

import NotificationDropdown from "../../../components/common/NotificationDropdown";
import { DetectLocationButton } from "../../../components/common/DetectLocationButton";

interface JobSeekerHeaderProps {
  onToggleSidebar: () => void;
}

export const JobSeekerHeader = ({ onToggleSidebar }: JobSeekerHeaderProps) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);
  const { data: profile } = useGetProfileQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
    navigate("/login");
  };

  const displayName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || user?.email?.split("@")[0] || "Candidate"
    : user?.email?.split("@")[0] || "Candidate";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-white/90 backdrop-blur-md px-4 sm:px-6 border-b border-slate-200/80">
      {/* Left Context Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 lg:hidden hover:bg-slate-100 transition cursor-pointer"
          title="Toggle Menu"
        >
          <FiMenu className="text-base" />
        </button>

        <div>
          <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Candidate Workspace
          </h2>
          <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
            Track applications, profile status, and direct recruiter messages
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <DetectLocationButton variant="badge" />

        <NotificationDropdown />

        {/* User Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 rounded-xl bg-slate-50 p-1 pl-1.5 pr-2.5 border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
          >
            <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 font-black text-white text-xs overflow-hidden">
              {profile?.profilePicture ? (
                <img src={profile.profilePicture} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span>{displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-slate-900 max-w-[100px] truncate">
              {displayName}
            </span>
            <FiChevronDown className="text-xs text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-[10px] text-slate-500 font-medium truncate">{user?.email}</p>
              </div>

              <Link
                to="/job-seeker/profile"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <FiUser /> Profile
              </Link>

              <Link
                to="/job-seeker/applications"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <FiFileText /> My Applications
              </Link>

              <Link
                to="/job-seeker/membership"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
              >
                <FiZap className="text-amber-500" /> Membership
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

export default JobSeekerHeader;
