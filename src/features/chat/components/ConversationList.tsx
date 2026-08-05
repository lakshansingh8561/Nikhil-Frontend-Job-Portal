import React, { useState } from "react";
import { FiSearch, FiBriefcase, FiPlus } from "react-icons/fi";
import type { IConversation } from "../types/chat.types";
import { UnreadBadge } from "./UnreadBadge";

interface ConversationListProps {
  conversations: IConversation[];
  activeConversationId?: string;
  onSelectConversation: (conversation: IConversation) => void;
  onlineUserIds: Set<string>;
  isLoading?: boolean;
  onOpenNewChatModal?: () => void;
}

const formatWhatsAppTime = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: "long" });
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onlineUserIds,
  isLoading = false,
  onOpenNewChatModal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const sortedConversations = [...conversations].sort((a, b) => {
    const timeA = new Date(a.lastMessageAt || a.updatedAt || a.createdAt).getTime();
    const timeB = new Date(b.lastMessageAt || b.updatedAt || b.createdAt).getTime();
    return timeB - timeA;
  });

  const filteredConversations = sortedConversations.filter((conv) => {
    const q = searchQuery.toLowerCase();
    const recipientName = conv.recipient?.name?.toLowerCase() || "";
    const jobTitle = conv.jobId?.title?.toLowerCase() || "";
    return recipientName.includes(q) || jobTitle.includes(q);
  });

  return (
    <div className="flex h-full flex-col bg-white border-r border-[#EAEFF7]">
      {/* Header & Search */}
      <div className="p-4 border-b border-[#EAEFF7]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-extrabold text-[#05264E]">Messages</h3>
          {onOpenNewChatModal && (
            <button
              onClick={onOpenNewChatModal}
              className="inline-flex items-center gap-1 rounded-xl bg-[#3C65F5] px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 transition cursor-pointer"
            >
              <FiPlus /> Start New Chat
            </button>
          )}
        </div>

        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] pl-9 pr-4 py-2 text-xs font-medium text-[#05264E] placeholder:text-gray-400 focus:border-[#3C65F5] focus:bg-white focus:outline-none transition"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 animate-pulse"
              >
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                  <div className="h-2 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500 space-y-3">
            <p>{searchQuery ? "No matching conversations" : "No conversations yet"}</p>
            {onOpenNewChatModal && !searchQuery && (
              <button
                onClick={onOpenNewChatModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
              >
                <FiPlus /> Start a New Chat
              </button>
            )}
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = (conv.id || conv._id) === activeConversationId;
            const isOnline = onlineUserIds.has(conv.recipient?.userId);

            const lastMessageText = conv.lastMessage
              ? conv.lastMessage.isDeleted
                ? "This message was deleted"
                : conv.lastMessage.message
              : "No messages yet";

            const lastTime = formatWhatsAppTime(conv.lastMessageAt || conv.updatedAt);

            return (
              <button
                key={conv.id || conv._id}
                onClick={() => onSelectConversation(conv)}
                className={`flex w-full items-center gap-3.5 p-4 text-left transition cursor-pointer hover:bg-blue-50/50 ${
                  isActive ? "bg-blue-50/80 border-l-4 border-[#3C65F5]" : ""
                }`}
              >
                {/* Avatar with Online Dot */}
                <div className="relative shrink-0">
                  {conv.recipient?.profilePicture ? (
                    <img
                      src={conv.recipient.profilePicture}
                      alt={conv.recipient.name}
                      className="h-11 w-11 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3C65F5] font-bold text-white text-sm">
                      {conv.recipient?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}

                  {isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="text-xs font-bold text-[#05264E] truncate">
                      {conv.recipient?.name}
                    </h4>
                    {lastTime && (
                      <span className="text-[10px] font-medium text-gray-400 shrink-0">
                        {lastTime}
                      </span>
                    )}
                  </div>

                  {/* Job Title Badge */}
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#3C65F5] truncate mb-1">
                    <FiBriefcase className="shrink-0 text-[10px]" />
                    <span className="truncate">{conv.jobId?.title}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-gray-500 truncate">
                      {lastMessageText}
                    </p>

                    <UnreadBadge count={conv.unreadCount} />
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
