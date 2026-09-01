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

const navLinks = [
  { name: "Home", path: "/", hasDropdown: true },
  { name: "Find a Job", path: "/jobs", hasDropdown: true },
  { name: "Recruiters", path: "/recruiters", hasDropdown: true },
  { name: "Candidates", path: "/candidates", hasDropdown: true },
  { name: "Pages", path: "/pages", hasDropdown: true },
  { name: "Blog", path: "/blog", hasDropdown: true },
  { name: "Contact", path: "/contact", hasDropdown: false },
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
      <header className="sticky top-0 z-50 w-full bg-[#F5F8FF] border-0 m-0 py-[30px] h-[108px] flex items-center transition-all">
        <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-8">
          <div className="flex h-[48px] items-center justify-between gap-4">
            {/* Left: Logo (139px x 36px) */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src={Logo}
                  alt="JobBox"
                  className="w-[139px] h-[36px] object-contain block"
                  width={139}
                  height={36}
                />
              </Link>
            </div>

            {/* Center: Desktop Navigation Items */}
            <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-7.5 font-['Plus_Jakarta_Sans',sans-serif]">
              {navLinks.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `group inline-flex items-center text-[14px] leading-[18px] font-medium font-['Plus_Jakarta_Sans',sans-serif] text-[#05264E] hover:text-[#3C65F5] transition-all duration-300 ease-in-out whitespace-nowrap cursor-pointer ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  <span className="text-[14px] leading-[18px] font-medium font-['Plus_Jakarta_Sans',sans-serif] text-[#05264E] group-hover:text-[#3C65F5] transition-all duration-300">
                    {item.name}
                  </span>
                  {item.hasDropdown && (
                    <FiChevronDown className="ml-1 w-3.5 h-3.5 stroke-[2.2] text-[#05264E] group-hover:text-[#3C65F5] transition-all duration-300" />
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right: Register & Sign In (or Authenticated User Bar) */}
            <div className="hidden lg:flex items-center gap-6 shrink-0 font-['Plus_Jakarta_Sans',sans-serif]">
              {user ? (
                <div className="flex items-center gap-2.5">
                  <NotificationDropdown />

                  {!isAdmin && (
                    <Link
                      to={chatPath}
                      title="Messages"
                      className="relative flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-white text-slate-700 hover:text-[#3C65F5] border border-slate-200/80 transition shadow-xs"
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
                      className="flex items-center gap-2 rounded-xl bg-white p-1 pl-1.5 pr-3 text-[13px] font-medium text-[#05264E] border border-slate-200/80 hover:bg-slate-50 transition cursor-pointer font-['Plus_Jakarta_Sans',sans-serif] shadow-xs"
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
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white py-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-['Plus_Jakarta_Sans',sans-serif]">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-medium text-slate-900 truncate">{user.email}</p>
                          <p className="text-[11px] font-medium text-[#3C65F5] uppercase tracking-wider mt-0.5">{user.role}</p>
                        </div>

                        <Link
                          to={profilePath}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#3C65F5] transition"
                        >
                          <FiUser /> {isAdmin ? "Admin Dashboard" : isRecruiter ? "Recruiter Suite" : "Candidate Dashboard"}
                        </Link>

                        {!isAdmin && (
                          <Link
                            to={chatPath}
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#3C65F5] transition"
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
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#3C65F5] transition"
                          >
                            <FiFileText /> My Applications
                          </Link>
                        )}

                        {isRecruiter && (
                          <Link
                            to="/recruiter/post-job"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#3C65F5] transition"
                          >
                            <FiBriefcase /> Post a Job
                          </Link>
                        )}

                        <div className="my-1 border-t border-slate-100" />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <FiLogOut /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="block-signin flex items-center justify-end w-[215px] h-[48px] font-['Plus_Jakarta_Sans',sans-serif]">
                  <Link
                    to="/register"
                    className="text-[14px] leading-[24px] font-medium text-[#05264E] hover:text-[#3C65F5] underline underline-offset-4 transition-colors font-['Plus_Jakarta_Sans',sans-serif]"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-default btn-shadow ml-[40px] hover-up inline-flex items-center justify-center h-[48px] px-[25px] py-[10px] rounded-[8px] bg-[#3C65F5] hover:bg-[#2C52E0] text-white text-[14px] font-medium transition-all font-['Plus_Jakarta_Sans',sans-serif] whitespace-nowrap shadow-xs"
                  >
                    Sign In
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
                      className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
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
          <img src={Logo} alt="JobBox" className="w-[120px] h-auto object-contain" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition cursor-pointer"
          >
            <FiX className="text-base" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                  ? "bg-indigo-50 text-indigo-600 font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <span>{item.name}</span>
              {item.hasDropdown && <FiChevronDown className="text-xs text-slate-400" />}
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
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl text-xs font-semibold text-[#05264E] bg-slate-100 hover:bg-slate-200 transition"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-[#3C65F5] hover:bg-[#2C52E0] transition"
              >
                Sign in
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