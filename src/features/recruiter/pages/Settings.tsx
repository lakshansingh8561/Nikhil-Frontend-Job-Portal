import { PageHeader } from "../components/PageHeader";
import { FiLock, FiBell } from "react-icons/fi";

export const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Account & Security Settings"
        description="Manage notifications, email preferences, and password security."
      />

      <div className="space-y-6">
        {/* Security */}
        <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-[#05264E] mb-4 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
            <FiLock className="text-[#3C65F5]" /> Change Password
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#05264E] mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-xs font-medium text-[#05264E] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#05264E] mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-xs font-medium text-[#05264E] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-xs">
          <h3 className="text-base font-bold text-[#05264E] mb-4 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
            <FiBell className="text-[#3C65F5]" /> Email Notifications
          </h3>
          <div className="space-y-3 text-xs font-semibold text-[#05264E]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#3C65F5]" />
              <span>Receive instant email alerts for new candidate applications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#3C65F5]" />
              <span>Receive weekly summary reports of active job performance</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
