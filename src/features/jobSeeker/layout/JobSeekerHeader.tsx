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

  // Close dropdown when clicking outside
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
    <header className="sticky top-0 z-30 flex h-[76px] w-full items-center justify-between bg-white/90 backdrop-blur-xl px-4 sm:px-8 border-b border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      {/* Left: Sidebar Toggle & Page Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 lg:hidden hover:bg-slate-100 transition cursor-pointer"
          title="Toggle Sidebar Menu"
        >
          <FiMenu className="text-xl" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Candidate Control Center
          </h2>
          <p className="text-[11px] font-semibold text-slate-400 hidden sm:block">
            Track job applications, manage profile qualifications, and review recruiter feedback
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Swiggy-Style Detected Location Badge */}
        <DetectLocationButton variant="badge" />

        {/* Notifications Dropdown */}
        <NotificationDropdown />

        {/* User Profile Menu */}
        <div className="relative ml-1" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 rounded-2xl bg-white p-1.5 pr-3 border border-slate-200/90 hover:border-indigo-500/80 transition cursor-pointer shadow-xs"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-extrabold text-white text-xs shadow-sm overflow-hidden">
              {profile?.profilePicture ? (
                <img src={profile.profilePicture} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span>{displayName.charAt(0).toUpperCase()}</span>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-extrabold text-slate-900 max-w-[110px] truncate leading-tight">
                {displayName}
              </span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Candidate
              </span>
            </div>
            <FiChevronDown className={`text-xs text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180 text-indigo-600" : ""}`} />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/90 bg-white py-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">{displayName}</p>
                <p className="text-[11px] text-slate-500 font-medium truncate">{user?.email}</p>
              </div>

              <Link
                to="/job-seeker/profile"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                <FiUser className="text-base text-slate-400" /> My Profile
              </Link>

              <Link
                to="/job-seeker/applications"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                <FiFileText className="text-base text-slate-400" /> My Applications
              </Link>

              <Link
                to="/job-seeker/membership"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                <FiZap className="text-base text-yellow-500" /> Membership Plans
              </Link>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <FiLogOut className="text-base text-red-500" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default JobSeekerHeader;
