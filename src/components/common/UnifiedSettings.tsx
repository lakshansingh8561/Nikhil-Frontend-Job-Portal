import React, { useState } from "react";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiBell,
  FiShield,
  FiUser,
  FiGlobe,
  FiClock,
  FiLogOut,
  FiCheckCircle,
  FiSliders,
  FiKey,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { logout } from "../../features/auth/authSlice";
import { useChangePasswordMutation } from "../../features/auth/authApi";

interface UnifiedSettingsProps {
  roleTitle: string;
  roleBadgeText: string;
  roleDescription: string;
}

export const UnifiedSettings: React.FC<UnifiedSettingsProps> = ({
  roleTitle,
  roleBadgeText,
  roleDescription,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<"security" | "notifications" | "preferences" | "sessions">("security");

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    candidateApplications: true,
    weeklyDigest: true,
    directMessages: true,
    platformAnnouncements: false,
    securityAlerts: true,
  });

  // Account Preferences State
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("(GMT+05:30) India Standard Time (IST)");
  const [privacyMode, setPrivacyMode] = useState("Public");

  const userEmail = user?.email || "user@jobbox.com";
  const userName = user?.email ? user.email.split("@")[0] : "User";

  // Handle Real Backend Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      toast.success(res?.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password. Verify current password.");
    }
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      toast.success("Notification preferences updated!");
      return updated;
    });
  };

  const handlePreferencesSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Account preferences saved successfully!");
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Signed out successfully.");
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#05264E] tracking-tight">
          {roleTitle}
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-medium text-[#66789C]">
          {roleDescription}
        </p>
      </div>

      {/* User Identity Card */}
      <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1D4ED8] font-black text-white text-2xl shadow-lg ring-4 ring-blue-50">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#05264E] capitalize">
                {userName}
              </h2>
              <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-[11px] font-extrabold text-emerald-700 border border-emerald-200">
                ACTIVE
              </span>
            </div>
            <p className="text-xs font-semibold text-[#66789C] mt-0.5">
              {userEmail}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-[#F8FAFC] px-4 py-2.5 border border-[#EAEFF7] self-start sm:self-auto">
          <FiShield className="text-[#1D4ED8] text-base" />
          <span className="text-xs font-extrabold text-[#05264E] uppercase tracking-wide">
            Role: {roleBadgeText}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EAEFF7] pb-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
            activeTab === "security"
              ? "bg-[#1D4ED8] text-white shadow-md"
              : "bg-white text-[#66789C] hover:bg-[#F8FAFC] hover:text-[#05264E] border border-[#EAEFF7]"
          }`}
        >
          <FiLock /> Security & Password
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
            activeTab === "notifications"
              ? "bg-[#1D4ED8] text-white shadow-md"
              : "bg-white text-[#66789C] hover:bg-[#F8FAFC] hover:text-[#05264E] border border-[#EAEFF7]"
          }`}
        >
          <FiBell /> Notifications
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
            activeTab === "preferences"
              ? "bg-[#1D4ED8] text-white shadow-md"
              : "bg-white text-[#66789C] hover:bg-[#F8FAFC] hover:text-[#05264E] border border-[#EAEFF7]"
          }`}
        >
          <FiSliders /> Preferences
        </button>

        <button
          onClick={() => setActiveTab("sessions")}
          className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
            activeTab === "sessions"
              ? "bg-[#1D4ED8] text-white shadow-md"
              : "bg-white text-[#66789C] hover:bg-[#F8FAFC] hover:text-[#05264E] border border-[#EAEFF7]"
          }`}
        >
          <FiKey /> Active Sessions & Danger Zone
        </button>
      </div>

      {/* TAB 1: SECURITY & PASSWORD */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <form
            onSubmit={handlePasswordSubmit}
            className="rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-8 shadow-xs space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-[#EAEFF7] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF2FF] text-[#1D4ED8]">
                <FiLock className="text-xl" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#05264E]">
                  Change Password
                </h3>
                <p className="text-xs text-[#66789C]">
                  Update your login password to protect your account.
                </p>
              </div>
            </div>

            <div className="space-y-5 max-w-xl">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-[#05264E] mb-1.5">
                  Current Password *
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] px-4 py-3 text-xs font-bold text-[#05264E] outline-none focus:border-[#1D4ED8] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#05264E] mb-1.5">
                  New Password *
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] px-4 py-3 text-xs font-bold text-[#05264E] outline-none focus:border-[#1D4ED8] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-[#05264E] mb-1.5">
                  Confirm New Password *
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] px-4 py-3 text-xs font-bold text-[#05264E] outline-none focus:border-[#1D4ED8] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="rounded-2xl bg-[#1D4ED8] px-8 py-3.5 text-xs font-extrabold text-white shadow-md hover:bg-[#1E40AF] transition disabled:opacity-50 cursor-pointer"
              >
                {isChangingPassword ? "Saving Password..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: NOTIFICATION PREFERENCES */}
      {activeTab === "notifications" && (
        <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-[#EAEFF7] pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <FiBell className="text-xl" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#05264E]">
                Notification Preferences
              </h3>
              <p className="text-xs text-[#66789C]">
                Control which email & system alerts you wish to receive.
              </p>
            </div>
          </div>

          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between p-4 rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC]">
              <div>
                <h4 className="text-xs font-extrabold text-[#05264E]">
                  Job Applications & Candidate Alerts
                </h4>
                <p className="text-[11px] text-[#66789C] mt-0.5">
                  Receive instant alerts when a candidate applies or status changes.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.candidateApplications}
                onChange={() => handleNotificationToggle("candidateApplications")}
                className="h-5 w-5 rounded-md accent-[#1D4ED8] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC]">
              <div>
                <h4 className="text-xs font-extrabold text-[#05264E]">
                  Direct Chat Messages
                </h4>
                <p className="text-[11px] text-[#66789C] mt-0.5">
                  Get notified whenever someone sends you an instant message.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.directMessages}
                onChange={() => handleNotificationToggle("directMessages")}
                className="h-5 w-5 rounded-md accent-[#1D4ED8] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC]">
              <div>
                <h4 className="text-xs font-extrabold text-[#05264E]">
                  Weekly Performance Summary Digest
                </h4>
                <p className="text-[11px] text-[#66789C] mt-0.5">
                  Receive weekly analytics on your posted jobs & profile views.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.weeklyDigest}
                onChange={() => handleNotificationToggle("weeklyDigest")}
                className="h-5 w-5 rounded-md accent-[#1D4ED8] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC]">
              <div>
                <h4 className="text-xs font-extrabold text-[#05264E]">
                  Security Alerts & Login Notifications
                </h4>
                <p className="text-[11px] text-[#66789C] mt-0.5">
                  Get notified when your account is accessed from a new device.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications.securityAlerts}
                onChange={() => handleNotificationToggle("securityAlerts")}
                className="h-5 w-5 rounded-md accent-[#1D4ED8] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACCOUNT PREFERENCES */}
      {activeTab === "preferences" && (
        <form
          onSubmit={handlePreferencesSave}
          className="rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-[#EAEFF7] pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <FiGlobe className="text-xl" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#05264E]">
                Regional & Privacy Preferences
              </h3>
              <p className="text-xs text-[#66789C]">
                Configure display language, timezones, and profile visibility.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-[#05264E] mb-1.5 flex items-center gap-1.5">
                <FiGlobe /> Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] px-4 py-3 text-xs font-bold text-[#05264E] outline-none focus:border-[#1D4ED8] cursor-pointer"
              >
                <option value="English (US)">English (US)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="French">French (Français)</option>
                <option value="German">German (Deutsch)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#05264E] mb-1.5 flex items-center gap-1.5">
                <FiClock /> Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] px-4 py-3 text-xs font-bold text-[#05264E] outline-none focus:border-[#1D4ED8] cursor-pointer"
              >
                <option value="(GMT+05:30) India Standard Time (IST)">(GMT+05:30) India (IST)</option>
                <option value="(GMT-05:00) Eastern Time (US)">(GMT-05:00) Eastern Time (US)</option>
                <option value="(GMT+00:00) Greenwich Mean Time (GMT)">(GMT+00:00) London (GMT)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#05264E] mb-1.5 flex items-center gap-1.5">
                <FiUser /> Profile Privacy Mode
              </label>
              <select
                value={privacyMode}
                onChange={(e) => setPrivacyMode(e.target.value)}
                className="w-full rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] px-4 py-3 text-xs font-bold text-[#05264E] outline-none focus:border-[#1D4ED8] cursor-pointer"
              >
                <option value="Public">Public — Discoverable by recruiters & search engines</option>
                <option value="Recruiter Only">Recruiter Only — Only verified employers can view profile</option>
                <option value="Private">Private — Hide profile from public listings</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="rounded-2xl bg-[#1D4ED8] px-8 py-3.5 text-xs font-extrabold text-white shadow-md hover:bg-[#1E40AF] transition cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: SESSIONS & DANGER ZONE */}
      {activeTab === "sessions" && (
        <div className="space-y-6">
          {/* Active Sessions */}
          <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#EAEFF7] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1D4ED8]">
                  <FiKey className="text-xl" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#05264E]">
                    Current Active Session
                  </h3>
                  <p className="text-xs text-[#66789C]">
                    Devices currently signed into your account.
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200">
                Current Device
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC]">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-[#EAEFF7] text-[#1D4ED8] font-bold text-sm">
                  PC
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#05264E]">
                    Web Browser (Windows OS)
                  </h4>
                  <p className="text-[11px] text-[#66789C] mt-0.5">
                    IP: 127.0.0.1 • Last Active: Just now
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-600">
                <FiCheckCircle /> Active Now
              </span>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-3xl border border-red-200 bg-red-50/40 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Sign Out of Account</h3>
              <p className="text-xs font-medium text-gray-600 mt-0.5">
                End your active session securely on this device.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3.5 text-xs font-extrabold text-white shadow-md hover:bg-red-700 transition cursor-pointer shrink-0"
            >
              <FiLogOut /> Sign Out Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedSettings;
