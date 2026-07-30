import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiLayers,
  FiPlusSquare,
  FiBriefcase,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiX,
  FiUser,
} from "react-icons/fi";
import Logo from "../../../assets/logo.svg";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { logout } from "../../auth/authSlice";

interface RecruiterSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const navItems = [
  { name: "Dashboard", path: "/recruiter/dashboard", icon: FiGrid },
  { name: "Company Profile", path: "/recruiter/company", icon: FiLayers },
  { name: "Post a Job", path: "/recruiter/post-job", icon: FiPlusSquare },
  { name: "My Jobs", path: "/recruiter/my-jobs", icon: FiBriefcase },
  { name: "Applications", path: "/recruiter/applications", icon: FiFileText },
  { name: "Recruiter Profile", path: "/recruiter/profile", icon: FiUser },
  { name: "Settings", path: "/recruiter/settings", icon: FiSettings },
];

export const RecruiterSidebar = ({
  isMobileOpen = false,
  onCloseMobile,
}: RecruiterSidebarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    if (onCloseMobile) onCloseMobile();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between bg-white border-r border-[#EAEFF7] p-6 transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Header Logo + Mobile Close */}
          <div className="flex items-center justify-between pb-6 border-b border-[#F0F4FC]">
            <Link to="/" className="flex items-center shrink-0">
              <img src={Logo} alt="JobBox Recruiter" className="h-9 w-auto" />
            </Link>

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <FiX className="text-xl" />
              </button>
            )}
          </div>

          {/* Recruiter Profile Summary */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#F8FAFC] p-3.5 border border-[#EAEFF7] shadow-2xs">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3C65F5] font-bold text-white text-sm shadow-xs">
              {user?.email ? user.email.charAt(0).toUpperCase() : "R"}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-[#05264E] truncate">
                {user?.email?.split("@")[0] || "Recruiter"}
              </h4>
              <p
                className="text-[11px] font-medium text-[#66789C] truncate"
                title={user?.email || "recruiter@jobbox.com"}
              >
                {user?.email || "recruiter@jobbox.com"}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-7 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-[#3C65F5] text-white shadow-md"
                        : "text-[#66789C] hover:bg-[#F8FAFC] hover:text-[#05264E]"
                    }`
                  }
                >
                  <Icon className="text-lg shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="pt-6 border-t border-[#F0F4FC]">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <FiLogOut className="text-lg shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
