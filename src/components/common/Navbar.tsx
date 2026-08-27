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
  FiBriefcase,
} from "react-icons/fi";
import Logo from "../../assets/logo.svg";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../features/auth/authSlice";
import { useGetUnreadCountQuery } from "../../features/chat/api/chatApi";
import { useGetMyNetworkProfileQuery } from "../../features/network/api/networkApi";
import Avatar from "../../features/network/components/common/Avatar";
import { UnreadBadge } from "../../features/chat/components/UnreadBadge";
import NotificationDropdown from "./NotificationDropdown";

const links = [
  { name: "Home", path: "/" },
  { name: "Find Jobs", path: "/jobs" },
  { name: "Recruiters", path: "/recruiters" },
  { name: "Candidates", path: "/candidates" },
];

const Navbar = () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { user } = useAppSelector((state) => state.auth);
  const { data: networkProfile } = useGetMyNetworkProfileQuery(undefined, { skip: !user });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const avatarUrl = networkProfile?.profilePicture || (user as any)?.profilePicture;
  const displayName = networkProfile?.fullName || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

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
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
          <div className="flex h-16 sm:h-18 items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center gap-2">
                <img src={Logo} alt="JobBox" className="h-8 w-auto" />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center justify-center gap-1 lg:flex flex-1 max-w-md mx-auto">
              {links.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${isActive
                      ? "bg-slate-100 text-indigo-600 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Right Action Bar */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {user ? (
                <div className="flex items-center gap-2.5">
                  <NotificationDropdown />

                  {!isAdmin && (
                    <Link
                      to={chatPath}
                      title="Messages"
                      className="relative flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-indigo-600 transition"
                    >
                      <FiMessageSquare className="text-base" />
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
                      className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 pl-1.5 pr-3 text-xs font-bold text-slate-800 hover:bg-slate-200/80 transition cursor-pointer"
                    >
                      <Avatar
                        src={avatarUrl}
                        name={displayName}
                        email={user.email}
                        size="sm"
                        className="!h-7 !w-7"
                      />
                      <span className="max-w-[120px] truncate">
                        {displayName}
                      </span>
                      <FiChevronDown className="text-xs text-slate-400" />
                    </button>

                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                          <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider mt-0.5">{user.role}</p>
                        </div>

                        <Link
                          to={profilePath}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                        >
                          <FiUser /> {isAdmin ? "Admin Dashboard" : isRecruiter ? "Recruiter Suite" : "Candidate Dashboard"}
                        </Link>

                        {!isAdmin && (
                          <Link
                            to={chatPath}
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
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
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                          >
                            <FiFileText /> My Applications
                          </Link>
                        )}

                        {isRecruiter && (
                          <Link
                            to="/recruiter/post-job"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                          >
                            <FiBriefcase /> Post a Job
                          </Link>
                        )}

                        <div className="my-1 border-t border-slate-100" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <FiLogOut /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/login"
                    className="saas-btn-secondary h-9 text-xs px-4"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="saas-btn-primary h-9 text-xs px-4"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              {user && (
                <>
                  <NotificationDropdown />
                  {!isAdmin && (
                    <Link
                      to={chatPath}
                      className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
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
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FiX className="text-lg" /> : <FiMenu className="text-lg" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-white shadow-xl transform transition-transform duration-200 ease-in-out lg:hidden flex flex-col ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <img src={Logo} alt="JobBox" className="h-7 w-auto" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition cursor-pointer"
          >
            <FiX className="text-base" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                  ? "bg-indigo-50 text-indigo-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <div className="my-3 border-t border-slate-100" />

          {user ? (
            <>
              <div className="flex items-center gap-3 px-3.5 py-3 bg-slate-50 rounded-xl mb-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-black text-xs">
                  {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.email?.split("@")[0]}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
              </div>

              <Link
                to={profilePath}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <FiUser /> {isAdmin ? "Admin Dashboard" : isRecruiter ? "Recruiter Suite" : "Dashboard"}
              </Link>

              <div className="my-2 border-t border-slate-100" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              >
                <FiLogOut /> Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="saas-btn-secondary w-full text-xs"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="saas-btn-primary w-full text-xs"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </nav>

        <div className="px-5 py-4 border-t border-slate-100">
          <p className="text-center text-[11px] font-medium text-slate-400">© 2026 JobBox Portal.</p>
        </div>
      </div>
    </>
  );
};

export default Navbar;