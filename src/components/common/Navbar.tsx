import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiChevronDown, FiUser, FiFileText, FiLogOut, FiMessageSquare } from "react-icons/fi";
import Logo from "../../assets/logo.svg";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../features/auth/authSlice";
import { useGetUnreadCountQuery } from "../../features/chat/api/chatApi";
import { UnreadBadge } from "../../features/chat/components/UnreadBadge";

import NotificationDropdown from "./NotificationDropdown";
import { DetectLocationButton } from "./DetectLocationButton";

const links = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Find a Job",
    path: "/jobs",
  },
  {
    name: "Recruiters",
    path: "/recruiters",
  },
  {
    name: "Candidates",
    path: "/candidates",
  },
];

const Navbar = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
    navigate("/login");
  };

  const isRecruiter = user?.role === "RECRUITER";
  const isAdmin = user?.role === "ADMIN";
  const profilePath = isAdmin
    ? "/admin/dashboard"
    : isRecruiter
    ? "/recruiter/dashboard"
    : "/job-seeker/dashboard";

  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    skip: !user || user.role === "ADMIN",
  });

  const chatPath = isRecruiter ? "/recruiter/messages" : "/job-seeker/messages";

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 w-full"
      style={{
        backgroundColor: "rgba(245, 248, 255, 0.95)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid #EAEFF7",
      }}
    >
      <div className="mx-auto w-full max-w-[1200px] px-[20px]">
        <div className="flex h-[85px] items-center justify-between">
          {/* Logo & Location Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="flex items-center shrink-0">
              <img src={Logo} alt="JobBox" className="h-9 w-auto" />
            </Link>

            <DetectLocationButton variant="badge" />
          </div>

          {/* Nav Links - Centered */}
          <nav className="hidden items-center justify-center gap-9 lg:flex flex-1">
            {links.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-[15px] font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-[#3B5BDB]"
                      : "text-[#05264E] hover:text-[#3B5BDB]"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4 shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <NotificationDropdown />

                {!isAdmin && (
                  <Link
                    to={chatPath}
                    title="Real-Time Messages"
                    className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#EBF2FF] text-[#05264E] hover:bg-blue-100 hover:text-[#3B5BDB] transition"
                  >
                    <FiMessageSquare className="text-lg" />
                    {unreadData && unreadData.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1">
                        <UnreadBadge count={unreadData.unreadCount} />
                      </span>
                    )}
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 rounded-full bg-[#EBF2FF] p-1.5 pr-3 text-sm font-semibold text-[#05264E] hover:bg-blue-100 transition cursor-pointer"
                  >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B5BDB] text-white font-bold text-xs">
                    {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">
                    {user.email}
                  </span>
                  <FiChevronDown className="text-xs text-gray-500" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#EAEFF7] bg-white py-2 shadow-xl z-50">
                    <Link
                      to={profilePath}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#3B5BDB]"
                    >
                      <FiUser /> {isAdmin ? "Admin Dashboard" : isRecruiter ? "Dashboard" : "My Profile"}
                    </Link>
                    {!isAdmin && (
                      <Link
                        to={chatPath}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#3B5BDB]"
                      >
                        <div className="flex items-center gap-2.5">
                          <FiMessageSquare /> Messages
                        </div>
                        {unreadData && unreadData.unreadCount > 0 && (
                          <UnreadBadge count={unreadData.unreadCount} />
                        )}
                      </Link>
                    )}
                    {!isRecruiter && !isAdmin && (
                      <Link
                        to="/job-seeker/applications"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#3B5BDB]"
                      >
                        <FiFileText /> My Applications
                      </Link>
                    )}
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <FiLogOut /> Sign Out
                    </button>
                  </div>
                )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  to="/register"
                  className="text-[15px] font-medium text-[#05264E] hover:text-[#3B5BDB] underline underline-offset-4 whitespace-nowrap transition-colors"
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  className="flex h-[50px] items-center justify-center rounded-[12px] bg-[#3B5BDB] px-7 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-[#2B47C5] whitespace-nowrap"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;