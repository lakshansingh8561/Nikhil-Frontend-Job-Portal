import React from "react";
import { FiMenu, FiBell, FiLogOut, FiShield } from "react-icons/fi";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { logout } from "../../auth/authSlice";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const adminName = user?.email ? user.email.split("@")[0] : "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#EAEFF7] bg-white px-4 sm:px-8 shadow-xs">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] text-[#05264E] lg:hidden hover:bg-[#E8F0FE] hover:text-[#3C65F5] transition cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <FiMenu className="text-xl" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3C65F5] text-white font-bold text-xs shadow-xs">
            <FiShield />
          </div>
          <span className="text-base sm:text-lg font-extrabold text-[#05264E]">
            Admin Control Center
          </span>
        </div>
      </div>

      {/* Right: Notifications & Admin User Profile & Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notifications */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] text-gray-600 transition hover:bg-[#E8F0FE] hover:text-[#3C65F5] cursor-pointer"
          title="Notifications"
        >
          <FiBell className="text-lg" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-3 border-l border-[#EAEFF7] pl-3 sm:pl-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3C65F5] font-bold text-white text-sm shadow-xs shrink-0">
            {adminName.charAt(0).toUpperCase()}
          </div>

          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-[#05264E] capitalize">
              {adminName}
            </p>
            <p className="text-[11px] font-medium text-[#66789C]">
              System Administrator
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100 cursor-pointer"
          title="Sign Out"
        >
          <FiLogOut className="text-lg" />
        </button>
      </div>
    </header>
  );
};

export default Header;
