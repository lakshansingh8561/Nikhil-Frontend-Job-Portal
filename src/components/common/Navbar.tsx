import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FiChevronDown,
  FiUser,
  FiFileText,
  FiLogOut,
  FiMessageSquare,
  FiMenu,
  FiX,
} from "react-icons/fi";
import Logo from "../../assets/logo.svg";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../features/auth/authSlice";
import { useGetUnreadCountQuery } from "../../features/chat/api/chatApi";
import { UnreadBadge } from "../../features/chat/components/UnreadBadge";
import NotificationDropdown from "./NotificationDropdown";

const links = [
  { name: "Home", path: "/" },
  { name: "Find a Job", path: "/jobs" },
  { name: "Recruiters", path: "/recruiters" },
  { name: "Candidates", path: "/candidates" },
];

const Navbar = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

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

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
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
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 w-full"
        style={{
          backgroundColor: "rgba(245, 248, 255, 0.97)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #EAEFF7",
        }}
      >
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-5">
          <div className="flex h-[72px] sm:h-[85px] items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center shrink-0">
                <img src={Logo} alt="JobBox" className="h-8 sm:h-9 w-auto" />
              </Link>
            </div>

            {/* Nav Links - Desktop Centered */}
            <nav className="hidden items-center justify-center gap-8 lg:flex flex-1">
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

            {/* Right Action Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-4 shrink-0">
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

                  <div className="relative" ref={dropdownRef}>
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

            {/* Mobile Right: Notification + Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              {user && (
                <>
                  <NotificationDropdown />
                  {!isAdmin && (
                    <Link
                      to={chatPath}
                      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#EBF2FF] text-[#05264E] hover:bg-blue-100 transition"
                    >
                      <FiMessageSquare className="text-base" />
                      {unreadData && unreadData.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1">
                          <UnreadBadge count={unreadData.unreadCount} />
                        </span>
                      )}
                    </Link>
                  )}
                </>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EAEFF7] bg-white text-[#05264E] hover:bg-blue-50 transition cursor-pointer"
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 bottom-0 z-50 w-[300px] max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAEFF7]">
          <img src={Logo} alt="JobBox" className="h-8 w-auto" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAEFF7] text-[#05264E] hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Drawer Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[#EBF2FF] text-[#3B5BDB]"
                    : "text-[#05264E] hover:bg-[#F5F8FF] hover:text-[#3B5BDB]"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Divider */}
          <div className="my-3 border-t border-[#EAEFF7]" />

          {user ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] rounded-xl mb-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3B5BDB] text-white font-bold text-sm">
                  {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#05264E] truncate">{user.email?.split("@")[0]}</p>
                  <p className="text-[11px] text-[#66789C] truncate">{user.email}</p>
                </div>
              </div>

              <Link
                to={profilePath}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#05264E] hover:bg-[#F5F8FF] hover:text-[#3B5BDB] transition"
              >
                <FiUser className="shrink-0" />
                {isAdmin ? "Admin Dashboard" : isRecruiter ? "Dashboard" : "My Profile"}
              </Link>

              {!isRecruiter && !isAdmin && (
                <Link
                  to="/job-seeker/applications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#05264E] hover:bg-[#F5F8FF] hover:text-[#3B5BDB] transition"
                >
                  <FiFileText className="shrink-0" />
                  My Applications
                </Link>
              )}

              <div className="my-2 border-t border-[#EAEFF7]" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <FiLogOut className="shrink-0" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-3 px-2 pt-2">
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center py-3 rounded-xl border border-[#3B5BDB] text-[#3B5BDB] text-sm font-semibold hover:bg-[#EBF2FF] transition"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center py-3 rounded-xl bg-[#3B5BDB] text-white text-sm font-semibold hover:bg-[#2B47C5] transition shadow-md shadow-blue-500/20"
              >
                Sign in
              </Link>
            </div>
          )}
        </nav>

        {/* Drawer Footer */}
        <div className="px-5 py-4 border-t border-[#EAEFF7]">
          <p className="text-center text-[11px] text-[#66789C]">© 2026 JobBox. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default Navbar;