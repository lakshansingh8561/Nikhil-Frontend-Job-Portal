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
} from "react-icons/fi";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { logout } from "../../auth/authSlice";
import NotificationDropdown from "../../../components/common/NotificationDropdown";
import { DetectLocationButton } from "../../../components/common/DetectLocationButton";

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
    <header className="sticky top-0 z-30 flex h-[76px] w-full items-center justify-between bg-white/90 backdrop-blur-xl px-6 border-b border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      {/* Search Input & Mobile Sidebar Trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 lg:hidden transition cursor-pointer"
          title="Toggle Sidebar Menu"
        >
          <FiMenu className="text-xl" />
        </button>

        <div className="relative flex items-center w-full">
          <FiSearch className="absolute left-3.5 text-slate-400 text-base pointer-events-none" />
          <input
            type="text"
            placeholder="Search candidates, jobs, applications..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-10 pr-12 text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs"
          />
          <kbd className="absolute right-3 hidden sm:inline-flex items-center rounded-lg bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-300/60">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Notifications & Avatar Menu */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Detected Location Badge */}
        <DetectLocationButton variant="badge" />

        {/* Notifications Dropdown */}
        <NotificationDropdown />

        {/* User Profile Menu */}
        <div className="relative ml-1" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-2xl bg-white p-1.5 pr-3 border border-slate-200/90 hover:border-indigo-500/80 transition cursor-pointer shadow-xs"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-extrabold text-white text-xs shadow-sm">
              {user?.email ? user.email.charAt(0).toUpperCase() : "R"}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-extrabold text-slate-900 max-w-[110px] truncate leading-tight">
                {user?.email?.split("@")[0] || "Recruiter"}
              </span>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Recruiter
              </span>
            </div>
            <FiChevronDown className={`text-xs text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180 text-indigo-600" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/90 bg-white py-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2.5 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">{user?.email?.split("@")[0] || "Recruiter"}</p>
                <p className="text-[11px] text-slate-500 font-medium truncate">{user?.email}</p>
              </div>

              <Link
                to="/recruiter/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                <FiUser className="text-base text-slate-400" /> My Profile
              </Link>

              <Link
                to="/recruiter/membership"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                <FiZap className="text-base text-yellow-500" /> Membership Plans
              </Link>

              <Link
                to="/recruiter/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                <FiSettings className="text-base text-slate-400" /> Settings
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

export default RecruiterHeader;
