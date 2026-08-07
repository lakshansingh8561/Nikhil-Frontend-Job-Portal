import React, { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiSearch,
  FiX,
  FiMoreVertical,
  FiTrash2,
} from "react-icons/fi";
import type { IConversation, IMessage } from "../types/chat.types";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useDeleteConversationMutation,
  useMarkAsReadMutation,
  useLazySearchMessagesQuery,
} from "../api/chatApi";
import { useSocket } from "../context/SocketContext";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";

interface ChatWindowProps {
  conversation: IConversation;
  onBack?: () => void;
}

const formatDateDivider = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) return "Today";

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  onBack,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const currentUserId = user?.id || (user as any)?.userId || "";

  const conversationId = conversation.id || conversation._id;

  const {
    joinConversation,
    leaveConversation,
    isConnected,
    onlineUserIds,
    typingUsersMap,
    emitTyping,
    emitStopTyping,
    emitMarkRead,
  } = useSocket();

  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<IMessage | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IMessage[] | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Queries & Mutations
  const { data: messagesData, isLoading: isMessagesLoading } =
    useGetMessagesQuery({ conversationId, limit: 50 });

  const [sendMessage] = useSendMessageMutation();
  const [editMessage] = useEditMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [deleteConversation, { isLoading: isDeletingConv }] = useDeleteConversationMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [triggerSearch] = useLazySearchMessagesQuery();

  const handleDeleteConversation = async () => {
    try {
      await deleteConversation(conversationId).unwrap();
      setIsConfirmDeleteOpen(false);
      if (onBack) onBack();
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };


  // Socket join/leave & Mark Read on Mount
  useEffect(() => {
    if (!conversationId) return;

    if (isConnected) {
      joinConversation(conversationId);
      markAsRead(conversationId);
      emitMarkRead(conversationId);
    }

    return () => {
      if (isConnected) {
        leaveConversation(conversationId);
      }
    };
  }, [conversationId, isConnected, joinConversation, leaveConversation, markAsRead, emitMarkRead]);

  // Mark as read whenever new messages arrive while ChatWindow is active
  useEffect(() => {
    if (!conversationId || !messagesData?.messages?.length) return;

    const hasUnread = messagesData.messages.some(
      (m) =>
        (typeof m.sender === "object" ? (m.sender as any)._id : m.sender) !== currentUserId &&
        (!m.read || m.status !== "seen")
    );

    if (hasUnread) {
      markAsRead(conversationId);
      if (isConnected) {
        emitMarkRead(conversationId);
      }
    }
  }, [conversationId, messagesData?.messages, currentUserId, isConnected, markAsRead, emitMarkRead]);

  // Smart auto-scroll: Scroll to bottom on load/send, but respect user scrolling up (Requirement 13)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (isNearBottom || (messagesData?.messages?.length && messagesData.messages.length <= 1)) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData?.messages, searchResults]);

  const isOnline = onlineUserIds.has(conversation.recipient?.userId);
  const typingUsers = typingUsersMap[conversationId];
  const isRecipientTyping =
    typingUsers && typingUsers.has(conversation.recipient?.userId);

  const messagesToDisplay = searchResults || messagesData?.messages || [];

  const handleSend = async (text: string, replyToId?: string) => {
    try {
      await sendMessage({
        conversationId,
        message: text,
        replyTo: replyToId,
      }).unwrap();
      setReplyingTo(null);
      // Force scroll to bottom when user sends a message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } catch (err: any) {
      console.error("Failed to send message:", err);
    }
  };

  const handleEditSubmit = async (text: string) => {
    if (!editingMessage) return;
    try {
      await editMessage({
        messageId: editingMessage.id || editingMessage._id,
        message: text,
      }).unwrap();
      setEditingMessage(null);
    } catch (err: any) {
      console.error("Failed to edit message:", err);
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await deleteMessage(messageId).unwrap();
    } catch (err: any) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await triggerSearch({
        conversationId,
        query: searchQuery.trim(),
      }).unwrap();
      setSearchResults(res);
    } catch (err) {
      console.error("Failed to search messages:", err);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#F8FAFC]">
      {/* Compact 56px Sticky Chat Header */}
      <div className="sticky top-0 z-10 flex h-[56px] min-h-[56px] max-h-[56px] items-center justify-between border-b border-[#E5E7EB] bg-white px-3 sm:px-5 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Back to conversations list"
              className="p-1.5 text-slate-500 hover:text-[#05264E] hover:bg-[#F3F4F6] rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center lg:hidden"
              title="Back to conversations"
            >
              <FiArrowLeft className="text-lg" />
            </button>
          )}

          {/* Avatar with Online Badge - Compact 36px */}
          <div className="relative shrink-0">
            {conversation.recipient?.profilePicture ? (
              <img
                src={conversation.recipient.profilePicture}
                alt={conversation.recipient.name}
                className="h-9 w-9 rounded-full object-cover border border-gray-200 shadow-2xs"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4F46E5] font-bold text-white text-sm shadow-2xs">
                {conversation.recipient?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {/* Recruiter / User Name */}
              <h3 className="text-sm sm:text-base font-bold text-[#05264E] truncate leading-tight">
                {conversation.recipient?.name}
              </h3>
              {/* Online/Offline Badge */}
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  isOnline
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

            {/* Role / Job Title */}
            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium truncate">
              <FiBriefcase className="shrink-0 text-[11px] text-[#4F46E5]" />
              <span className="truncate">{conversation.jobId?.title || conversation.recipient?.role || "Recruiter"}</span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find in chat..."
                aria-label="Find in chat"
                className="w-36 sm:w-52 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-1.5 text-xs focus:border-[#4F46E5] focus:bg-white focus:outline-none transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchResults(null);
                  setSearchQuery("");
                }}
                aria-label="Close search"
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-[#F3F4F6] rounded-lg cursor-pointer transition-all"
              >
                <FiX className="text-base" />
              </button>
            </form>
          ) : (
            <>
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search messages in conversation"
                className="p-2 text-gray-500 hover:text-[#4F46E5] hover:bg-[#F3F4F6] rounded-xl transition-all duration-200 cursor-pointer"
                title="Search conversation"
              >
                <FiSearch className="text-xl" />
              </button>

              {/* More Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="More options"
                  className="p-2 text-gray-500 hover:text-[#4F46E5] hover:bg-[#F3F4F6] rounded-xl transition-all duration-200 cursor-pointer"
                  title="More options"
                >
                  <FiMoreVertical className="text-xl" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl animate-bubble">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsConfirmDeleteOpen(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                    >
                      <FiTrash2 className="text-sm" />
                      <span>Delete Conversation</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>


      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#F8FAFC] custom-scrollbar"
      >
        {isMessagesLoading ? (
          <div className="flex h-full items-center justify-center text-xs sm:text-sm text-gray-400 font-medium">
            Loading messages...
          </div>
        ) : messagesToDisplay.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-6">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center font-bold text-2xl mb-3 shadow-2xs border border-indigo-100">
              💬
            </div>
            <p className="text-base font-extrabold text-[#05264E]">Start the conversation!</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xs leading-relaxed">
              Say hello to <strong className="text-[#05264E]">{conversation.recipient?.name}</strong> regarding the{" "}
              <strong className="text-[#4F46E5]">{conversation.jobId?.title}</strong> position.
            </p>
          </div>
        ) : (
          messagesToDisplay.map((msg, index) => {
            const senderId =
              typeof msg.sender === "object"
                ? (msg.sender as any)._id
                : msg.sender;
            const isOwn = senderId === currentUserId;

            // Date divider calculation
            const currentDateStr = msg.createdAt ? new Date(msg.createdAt).toDateString() : "";
            const prevMsg = index > 0 ? messagesToDisplay[index - 1] : null;
            const prevDateStr = prevMsg?.createdAt ? new Date(prevMsg.createdAt).toDateString() : "";
            const showDateDivider = index === 0 || currentDateStr !== prevDateStr;

            // Same sender in close succession calculation (Requirement 9)
            const prevSenderId = prevMsg
              ? typeof prevMsg.sender === "object"
                ? (prevMsg.sender as any)._id
                : prevMsg.sender
              : null;
            const isSameSenderPrevious = !showDateDivider && prevSenderId === senderId;

            return (
              <React.Fragment key={msg.id || msg._id}>
                {/* Centered Date Divider (Requirement 9) */}
                {showDateDivider && currentDateStr && (
                  <div className="flex items-center justify-center my-4">
                    <span className="bg-[#E2E8F0]/70 text-slate-600 text-xs font-semibold px-3.5 py-1 rounded-full shadow-2xs border border-slate-200/60">
                      {formatDateDivider(msg.createdAt)}
                    </span>
                  </div>
                )}

                {/* Message Bubble */}
                <MessageBubble
                  message={msg}
                  isOwn={isOwn}
                  isSameSenderPrevious={isSameSenderPrevious}
                  onReply={(m) => setReplyingTo(m)}
                  onEdit={(m) => setEditingMessage(m)}
                  onDelete={(id) => handleDelete(id)}
                />
              </React.Fragment>
            );
          })
        )}

        {/* Typing Indicator */}
        {isRecipientTyping && (
          <TypingIndicator userName={conversation.recipient?.name} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        onEditSubmit={handleEditSubmit}
        replyingTo={replyingTo}
        editingMessage={editingMessage}
        onCancelReply={() => setReplyingTo(null)}
        onCancelEdit={() => setEditingMessage(null)}
        onTyping={() => emitTyping(conversationId)}
        onStopTyping={() => emitStopTyping(conversationId)}
      />

      {/* Confirmation Modal for Deleting Conversation from Header Menu */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-bubble">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-lg font-bold shrink-0">
                🗑️
              </div>
              <div>
                <h4 className="text-base font-extrabold text-[#05264E]">Delete Conversation?</h4>
                <p className="text-xs text-gray-500">
                  Delete chat history with <strong>{conversation.recipient?.name}</strong>?
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              This will permanently delete this conversation and remove it from your chat list.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="px-3.5 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConversation}
                disabled={isDeletingConv}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {isDeletingConv ? "Deleting..." : "Delete Conversation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


