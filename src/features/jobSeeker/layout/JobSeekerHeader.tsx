import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiUser,
  FiFileText,
  FiLogOut,
  FiChevronDown,
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
  const { user } = useAppSelector((state) => state.auth);
  const { data: profile } = useGetProfileQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
    navigate("/login");
  };

  const displayName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || user?.email?.split("@")[0] || "Candidate"
    : user?.email?.split("@")[0] || "Candidate";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#EAEFF7] bg-white px-4 sm:px-8 shadow-2xs">
      {/* Left: Sidebar Toggle & Page Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] text-[#05264E] lg:hidden hover:bg-[#E8F0FE] hover:text-[#3C65F5] transition cursor-pointer"
          title="Toggle Sidebar Menu"
        >
          <FiMenu className="text-xl" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#05264E]">
            Candidate Control Center
          </h2>
          <p className="text-[11px] font-medium text-[#66789C] hidden sm:block">
            Track job applications, manage profile qualifications, and review recruiter feedback
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Swiggy-Style Detected Location Badge */}
        <DetectLocationButton variant="badge" />

        {/* Notifications */}
        <NotificationDropdown />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 rounded-full bg-[#F8FAFC] p-1.5 pr-3 border border-[#EAEFF7] text-xs font-bold text-[#05264E] hover:bg-blue-50 transition cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3C65F5] font-bold text-white text-xs shadow-xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline max-w-[120px] truncate">
              {displayName}
            </span>
            <FiChevronDown className="text-xs text-gray-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#EAEFF7] bg-white py-2 shadow-xl z-50">
              <Link
                to="/job-seeker/profile"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-[#3C65F5]"
              >
                <FiUser /> My Profile
              </Link>
              <Link
                to="/job-seeker/applications"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-[#3C65F5]"
              >
                <FiFileText /> My Applications
              </Link>
              <div className="my-1 border-t border-gray-100" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
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
