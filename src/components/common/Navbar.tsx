import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiChevronDown, FiUser, FiFileText, FiLogOut } from "react-icons/fi";
import Container from "./Container";
import Logo from "../../assets/logo.svg";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../features/auth/authSlice";

const links = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Find a Job",
    path: "/jobs",
    dropdownItems: ["Jobs Grid", "Jobs List"],
  },
  {
    name: "Recruiters",
    path: "/recruiters",
    dropdownItems: ["Recruiter Directory"],
  },
  {
    name: "Candidates",
    path: "/candidates",
    dropdownItems: ["Candidate Directory"],
  },
];

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
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

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 w-full"
      style={{
        backgroundColor: "rgba(245, 247, 252, 0.95)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid #EAEFF7",
      }}
    >
      <Container>
        <div className="flex h-[85px] items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img src={Logo} alt="JobBox" className="h-9 w-auto" />
          </Link>

          {/* Nav Links with Hover Dropdowns */}
          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((item) => (
              <div
                key={item.name}
                className="relative group py-6"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 text-[15px] font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? "text-[#3C65F5]"
                        : "text-[#05264E] hover:text-[#3C65F5]"
                    }`
                  }
                >
                  {item.name}
                  {item.dropdownItems && (
                    <FiChevronDown className="text-gray-500 text-xs shrink-0 transition-transform duration-200 group-hover:rotate-180" />
                  )}
                </NavLink>

                {/* Dropdown Menu */}
                {item.dropdownItems && (
                  <div
                    className={`absolute top-full left-0 w-48 rounded-2xl border py-3 transition-all duration-200 ${
                      activeDropdown === item.name
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible translate-y-2 pointer-events-none"
                    }`}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "16px",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
                      borderColor: "#EAEFF7",
                    }}
                  >
                    <ul className="flex flex-col">
                      {item.dropdownItems.map((subItem) => (
                        <li key={subItem}>
                          <Link
                            to={
                              subItem === "Candidate Directory"
                                ? "/candidates"
                                : subItem === "Recruiter Directory"
                                ? "/recruiters"
                                : "/jobs"
                            }
                            className="block px-5 py-2 text-[14px] font-medium text-gray-600 hover:text-[#3C65F5] hover:bg-blue-50/70 transition-colors"
                          >
                            • {subItem}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4 shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 rounded-full bg-[#EBF2FF] p-1.5 pr-3 text-sm font-semibold text-[#05264E] hover:bg-blue-100 transition cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3C65F5] text-white font-bold text-xs">
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
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#3C65F5]"
                    >
                      <FiUser /> {isAdmin ? "Admin Dashboard" : isRecruiter ? "Dashboard" : "My Profile"}
                    </Link>
                    {!isRecruiter && !isAdmin && (
                      <Link
                        to="/job-seeker/applications"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#3C65F5]"
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
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  to="/register"
                  className="text-[15px] font-medium text-[#05264E] hover:text-[#3C65F5] underline underline-offset-4 whitespace-nowrap transition-colors"
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  className="rounded-xl bg-[#3C65F5] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#254BD6] shadow-md whitespace-nowrap"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;