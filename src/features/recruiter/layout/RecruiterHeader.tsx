import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { logout } from "../../auth/authSlice";

import NotificationDropdown from "../../../components/common/NotificationDropdown";

interface RecruiterHeaderProps {
  onToggleSidebar?: () => void;
}

export const RecruiterHeader = ({ onToggleSidebar }: RecruiterHeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
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
    <header className="sticky top-0 z-30 flex h-[85px] w-full items-center justify-between bg-[#F5F7FC]/90 backdrop-blur-md px-6 border-b border-[#EAEFF7]">
      {/* Search Bar + Sidebar Toggle Button */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-600 hover:bg-white rounded-xl border border-[#EAEFF7] lg:hidden transition cursor-pointer"
          title="Toggle Sidebar Menu"
        >
          <FiMenu className="text-xl" />
        </button>

        <div className="relative flex items-center w-full">
          <FiSearch className="absolute left-3.5 text-gray-400 text-base pointer-events-none" />
          <input
            type="text"
            placeholder="Search candidates, jobs, applications..."
            className="w-full rounded-2xl border border-[#EAEFF7] bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#1D4ED8] shadow-xs"
          />
        </div>
      </div>

      {/* Right Icons + Avatar Profile Dropdown */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notifications */}
        <NotificationDropdown />

        {/* User Dropdown */}
        <div className="relative ml-2" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-2xl bg-white p-1.5 pr-3 border border-[#EAEFF7] hover:border-[#1D4ED8] transition cursor-pointer shadow-xs"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1D4ED8] font-bold text-white text-xs">
              {user?.email ? user.email.charAt(0).toUpperCase() : "R"}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-[#05264E] max-w-[100px] truncate">
              {user?.email?.split("@")[0] || "Recruiter"}
            </span>
            <FiChevronDown className="text-xs text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#EAEFF7] bg-white py-2 shadow-xl z-50">
              <Link
                to="/recruiter/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#1D4ED8]"
              >
                <FiUser /> My Profile
              </Link>

              <Link
                to="/recruiter/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#1D4ED8]"
              >
                <FiSettings /> Settings
              </Link>

              <div className="my-1 border-t border-gray-100" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
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
