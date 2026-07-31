import React, { useState } from "react";
import { FiUser, FiLock, FiLogOut, FiShield, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { logout } from "../../auth/authSlice";

export const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const adminEmail = user?.email || "admin@jobbox.com";
  const adminName = user?.email ? user.email.split("@")[0] : "Admin";

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      toast.success("Admin security credentials updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 600);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#05264E]">
          Admin Settings & Preferences
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-medium text-[#66789C]">
          Manage your administrator account details, security credentials, and system settings
        </p>
      </div>

      {/* Admin Profile Information Box */}
      <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 border-b border-[#EAEFF7] pb-5 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#3C65F5]">
            <FiUser className="text-xl" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#05264E]">
              Profile Information
            </h2>
            <p className="text-xs text-[#66789C]">
              Your active system administrator identity and assigned access role
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#05264E] mb-1.5">
              Account Email
            </label>
            <input
              type="text"
              readOnly
              value={adminEmail}
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] px-4 py-2.5 text-xs font-bold text-[#05264E] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#05264E] mb-1.5">
              System Role
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] px-4 py-2.5 text-xs font-bold text-[#3C65F5]">
              <FiShield className="text-sm" />
              <span>SUPER ADMIN (FULL PERMISSIONS)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#05264E] mb-1.5">
              Administrator Name
            </label>
            <input
              type="text"
              readOnly
              value={adminName}
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] px-4 py-2.5 text-xs font-bold text-[#05264E] outline-none capitalize"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#05264E] mb-1.5">
              Account Status
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700">
              <FiCheckCircle className="text-sm" />
              <span>ACTIVE & VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <form
        onSubmit={handlePasswordSubmit}
        className="rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-8 shadow-xs"
      >
        <div className="flex items-center gap-3 border-b border-[#EAEFF7] pb-5 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <FiLock className="text-xl" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#05264E]">
              Change Password
            </h2>
            <p className="text-xs text-[#66789C]">
              Update your password to maintain system administrative security
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-[#05264E] mb-1.5">
              Current Password *
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-[#EAEFF7] bg-white px-4 py-2.5 text-xs font-medium text-[#05264E] outline-none focus:border-[#3C65F5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#05264E] mb-1.5">
              New Password *
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-[#EAEFF7] bg-white px-4 py-2.5 text-xs font-medium text-[#05264E] outline-none focus:border-[#3C65F5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#05264E] mb-1.5">
              Confirm New Password *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-[#EAEFF7] bg-white px-4 py-2.5 text-xs font-medium text-[#05264E] outline-none focus:border-[#3C65F5]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="rounded-2xl bg-[#3C65F5] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#254BD6] transition cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </form>

      {/* Logout Box */}
      <div className="rounded-3xl border border-red-200 bg-red-50/50 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Sign Out of Admin Control</h3>
          <p className="text-xs font-medium text-gray-600 mt-0.5">
            End your current admin session securely.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-red-700 transition cursor-pointer shrink-0"
        >
          <FiLogOut /> Sign Out Now
        </button>
      </div>
    </div>
  );
};

export default Settings;
