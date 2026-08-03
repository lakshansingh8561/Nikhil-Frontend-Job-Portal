import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiCheckCircle,
  FiEye,
  FiFileText,
  FiClock,
  FiCheck,
} from "react-icons/fi";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  type NotificationItem,
} from "../../features/notifications/api/notificationApi";

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch notifications with 10-second polling
  const { data } = useGetNotificationsQuery(undefined, {
    pollingInterval: 10000,
  });

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      await markAsRead(notif._id).unwrap().catch(() => null);
    }
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead().unwrap().catch(() => null);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "APPLICATION_SUBMITTED":
        return <FiFileText className="text-[#3C65F5] text-base" />;
      case "APPLICATION_VIEWED":
        return <FiEye className="text-amber-500 text-base" />;
      case "STATUS_UPDATED":
        return <FiCheckCircle className="text-emerald-500 text-base" />;
      default:
        return <FiClock className="text-gray-500 text-base" />;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#EAEFF7] bg-white text-gray-600 shadow-2xs transition hover:bg-[#E8F0FE] hover:text-[#3C65F5] cursor-pointer"
        title="Notifications"
      >
        <FiBell className="text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl border border-[#EAEFF7] bg-white p-4 shadow-2xl z-50 animate-fadeIn">
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-[#F0F4FC] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#05264E]">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#EBF2FF] px-2 py-0.5 text-[11px] font-bold text-[#3C65F5]">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-[11px] font-bold text-[#3C65F5] hover:underline cursor-pointer"
              >
                <FiCheck className="text-xs" /> Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <FiBell className="mx-auto text-2xl text-gray-300 mb-2" />
                <p className="text-xs font-semibold text-gray-500">No notifications yet</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Updates on applications & recruitment will appear here.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`group relative flex items-start gap-3 rounded-2xl p-3 transition cursor-pointer border ${
                    notif.isRead
                      ? "bg-white border-[#F0F4FC] hover:bg-[#F8FAFC]"
                      : "bg-[#F4F7FF] border-[#D9E4FF] hover:bg-[#EBF2FF]"
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs border border-[#EAEFF7] mt-0.5">
                    {getIcon(notif.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#05264E] line-clamp-1">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap">
                        {formatTimeAgo(notif.createdAt)}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-[#66789C] leading-snug line-clamp-2">
                      {notif.message}
                    </p>
                  </div>

                  {!notif.isRead && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#3C65F5] mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
