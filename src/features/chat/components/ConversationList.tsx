import React, { useState } from "react";
import { FiSearch, FiBriefcase, FiPlus, FiTrash2 } from "react-icons/fi";
import type { IConversation } from "../types/chat.types";
import { UnreadBadge } from "./UnreadBadge";
import { useDeleteConversationMutation } from "../api/chatApi";

interface ConversationListProps {
  conversations: IConversation[];
  activeConversationId?: string;
  onSelectConversation: (conversation: IConversation) => void;
  onDeleteActiveConversation?: () => void;
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

// Memoized individual conversation item with Delete Chat button
interface ConversationCardProps {
  conv: IConversation;
  isActive: boolean;
  isOnline: boolean;
  onSelect: (conv: IConversation) => void;
  onDeleteRequest: (conv: IConversation, e: React.MouseEvent) => void;
}

const ConversationCard: React.FC<ConversationCardProps> = React.memo(
  ({ conv, isActive, isOnline, onSelect, onDeleteRequest }) => {
    const lastMessageText = conv.lastMessage
      ? conv.lastMessage.isDeleted
        ? "This message was deleted"
        : conv.lastMessage.message
      : "No messages yet";

    const lastTime = formatWhatsAppTime(conv.lastMessageAt || conv.updatedAt || conv.createdAt);

    return (
      <div
        onClick={() => onSelect(conv)}
        role="button"
        tabIndex={0}
        aria-label={`Conversation with ${conv.recipient?.name || 'User'}`}
        className={`group relative flex w-full items-center gap-2.5 px-3 py-2 text-left transition-all duration-200 cursor-pointer ${
          isActive
            ? "bg-[#3C65F5]/10 border-l-3 border-[#3C65F5] shadow-2xs"
            : "hover:bg-[#F3F4F6] border-l-3 border-transparent"
        }`}
      >
        {/* Avatar with Online Dot - Compact 36px */}
        <div className="relative shrink-0">
          {conv.recipient?.profilePicture ? (
            <img
              src={conv.recipient.profilePicture}
              alt={conv.recipient.name}
              className="h-9 w-9 rounded-full object-cover border border-gray-200 shadow-2xs"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3C65F5] font-bold text-white text-xs shadow-2xs">
              {conv.recipient?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          {isOnline && (
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            {/* Recruiter / User Name */}
            <h4 className="text-xs sm:text-sm font-bold text-[#05264E] truncate leading-tight">
              {conv.recipient?.name}
            </h4>
            {/* Time */}
            {lastTime && (
              <span className="text-[10px] font-medium text-gray-400 shrink-0">
                {lastTime}
              </span>
            )}
          </div>

          {/* Role / Job Title */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 truncate leading-tight">
            <FiBriefcase className="shrink-0 text-[10px] text-[#4F46E5]" />
            <span className="truncate">{conv.jobId?.title || conv.recipient?.role || "Job Applicant"}</span>
          </div>

          {/* Last Message */}
          <div className="flex items-center justify-between gap-1.5 mt-0.5">
            <p className="text-[11px] sm:text-xs text-gray-500 truncate font-normal leading-tight">
              {lastMessageText}
            </p>

            <UnreadBadge count={conv.unreadCount} />
          </div>
        </div>

        {/* Delete Chat Quick Action Button (Visible on Hover / Focus) */}
        <button
          onClick={(e) => onDeleteRequest(conv, e)}
          title="Delete Chat"
          aria-label="Delete chat"
          className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center justify-center h-7 w-7 rounded-lg bg-white shadow-xs border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition-all cursor-pointer z-10"
        >
          <FiTrash2 className="text-xs" />
        </button>
      </div>
    );
  }
);

ConversationCard.displayName = "ConversationCard";

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteActiveConversation,
  onlineUserIds,
  isLoading = false,
  onOpenNewChatModal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingConv, setDeletingConv] = useState<IConversation | null>(null);

  const [deleteConversation, { isLoading: isDeleting }] = useDeleteConversationMutation();

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

  const handleDeleteClick = (conv: IConversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingConv(conv);
  };

  const handleConfirmDelete = async () => {
    if (!deletingConv) return;
    const convId = deletingConv.id || deletingConv._id;
    try {
      await deleteConversation(convId).unwrap();
      if (convId === activeConversationId && onDeleteActiveConversation) {
        onDeleteActiveConversation();
      }
      setDeletingConv(null);
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white border-r border-[#E5E7EB] relative">
      {/* Header & Compact Search */}
      <div className="p-3 border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-lg font-extrabold text-[#05264E] tracking-tight">Messages</h3>
          {onOpenNewChatModal && (
            <button
              onClick={onOpenNewChatModal}
              aria-label="Start new chat"
              className="inline-flex items-center gap-1 rounded-lg bg-[#4F46E5] px-2.5 py-1 text-xs font-bold text-white shadow-2xs hover:bg-[#4338CA] hover:scale-[1.02] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              <FiPlus className="text-xs" /> New Chat
            </button>
          )}
        </div>

        {/* 36px Height Compact Search Box */}
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            aria-label="Search conversations"
            className="h-[36px] w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] pl-8 pr-3 text-xs font-medium text-[#05264E] placeholder:text-gray-400 focus:border-[#4F46E5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
        {isLoading ? (
          <div className="p-3 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 animate-pulse"
              >
                <div className="h-9 w-9 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-2/3 rounded bg-gray-200" />
                  <div className="h-2 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500 space-y-2">
            <p className="text-xs font-medium text-gray-500">
              {searchQuery ? "No matching conversations found" : "No conversations yet"}
            </p>
            {onOpenNewChatModal && !searchQuery && (
              <button
                onClick={onOpenNewChatModal}
                className="inline-flex items-center gap-1 rounded-lg bg-[#4F46E5] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#4338CA] transition-all cursor-pointer"
              >
                <FiPlus /> Start a New Chat
              </button>
            )}
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const convId = conv.id || conv._id;
            const isActive = convId === activeConversationId;
            const isOnline = onlineUserIds.has(conv.recipient?.userId);

            return (
              <ConversationCard
                key={convId}
                conv={conv}
                isActive={isActive}
                isOnline={isOnline}
                onSelect={onSelectConversation}
                onDeleteRequest={handleDeleteClick}
              />
            );
          })
        )}
      </div>

      {/* Confirmation Modal for Deleting Chat Conversation */}
      {deletingConv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-bubble">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-lg font-bold shrink-0">
                🗑️
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#05264E]">Delete Chat Conversation?</h4>
                <p className="text-xs text-gray-500">
                  Delete chat history with <strong>{deletingConv.recipient?.name || "this user"}</strong>?
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              This will permanently delete this conversation and all message history.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeletingConv(null)}
                className="px-3.5 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



