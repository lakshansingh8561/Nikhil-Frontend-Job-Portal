import React, { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiSearch,
  FiX,
  FiMoreVertical,
  FiTrash2,
  FiPhone,
  FiVideo,
  FiMic,
  FiMicOff,
  FiVideoOff,
  FiPhoneOff,
} from "react-icons/fi";
import type { IConversation, IMessage, IAttachment, MessageType } from "../types/chat.types";
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
import { useCall } from "../context/CallContext";
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

  const { startCall } = useCall();

  const [replyingTo, setReplyingTo] = useState<IMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<IMessage | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IMessage[] | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Active Calling State (Audio or Video)
  const [activeCall, setActiveCall] = useState<"audio" | "video" | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

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

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Force scroll to bottom when opening or switching conversations (WhatsApp behavior)
  useEffect(() => {
    if (conversationId) {
      scrollToBottom("auto");
      const timer = setTimeout(() => {
        scrollToBottom("auto");
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [conversationId]);

  // Auto-scroll to bottom on new messages load or search
  useEffect(() => {
    if (messagesData?.messages?.length) {
      scrollToBottom("smooth");
    }
  }, [messagesData?.messages?.length, searchResults]);

  const isOnline = onlineUserIds.has(conversation.recipient?.userId);
  const typingUsers = typingUsersMap[conversationId];
  const recipientIdStr = conversation.recipient?.userId;
  const isRecipientTyping = Boolean(
    typingUsers &&
      ((recipientIdStr && typingUsers.has(recipientIdStr)) || typingUsers.size > 0)
  );

  const messagesToDisplay = searchResults || messagesData?.messages || [];

  const handleSend = async (
    text: string,
    replyToId?: string,
    attachments?: IAttachment[],
    messageType?: MessageType
  ) => {
    try {
      await sendMessage({
        conversationId,
        message: text,
        replyTo: replyToId,
        attachments,
        messageType,
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
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3C65F5] font-bold text-white text-sm shadow-2xs">
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
              <FiBriefcase className="shrink-0 text-[11px] text-[#3C65F5]" />
              <span className="truncate">{conversation.jobId?.title || conversation.recipient?.role || "Recruiter"}</span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find in chat..."
                aria-label="Find in chat"
                className="w-36 sm:w-52 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-1.5 text-xs focus:border-[#3C65F5] focus:bg-white focus:outline-none transition-all duration-200"
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
              {/* Voice Calling Button */}
              <button
                type="button"
                onClick={() => {
                  const targetId = conversation.recipient?.userId;
                  if (targetId) {
                    startCall(
                      targetId,
                      conversationId,
                      "audio",
                      conversation.recipient?.name || "User",
                      conversation.recipient?.profilePicture
                    );
                  }
                }}
                className="p-2 text-gray-600 hover:text-[#3C65F5] hover:bg-blue-50 rounded-xl transition-all duration-200 cursor-pointer"
                title="Voice Call"
              >
                <FiPhone className="text-lg" />
              </button>

              {/* Video Calling Button */}
              <button
                type="button"
                onClick={() => {
                  const targetId = conversation.recipient?.userId;
                  if (targetId) {
                    startCall(
                      targetId,
                      conversationId,
                      "video",
                      conversation.recipient?.name || "User",
                      conversation.recipient?.profilePicture
                    );
                  }
                }}
                className="p-2 text-gray-600 hover:text-[#3C65F5] hover:bg-blue-50 rounded-xl transition-all duration-200 cursor-pointer"
                title="Video Call"
              >
                <FiVideo className="text-lg" />
              </button>

              {/* Search Messages */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search messages in conversation"
                className="p-2 text-gray-600 hover:text-[#3C65F5] hover:bg-[#F3F4F6] rounded-xl transition-all duration-200 cursor-pointer"
                title="Search conversation"
              >
                <FiSearch className="text-lg" />
              </button>

              {/* More Menu Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="More options"
                  className="p-2 text-gray-600 hover:text-[#3C65F5] hover:bg-[#F3F4F6] rounded-xl transition-all duration-200 cursor-pointer"
                  title="More options"
                >
                  <FiMoreVertical className="text-lg" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl animate-bubble">
                    <button
                      type="button"
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
            <div className="h-16 w-16 rounded-2xl bg-[#3C65F5]/10 text-[#3C65F5] flex items-center justify-center font-bold text-2xl mb-3 shadow-2xs border border-[#3C65F5]/20">
              💬
            </div>
            <p className="text-base font-extrabold text-[#05264E]">Start the conversation!</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xs leading-relaxed">
              Say hello to <strong className="text-[#05264E]">{conversation.recipient?.name}</strong> regarding the{" "}
              <strong className="text-[#3C65F5]">{conversation.jobId?.title}</strong> position.
            </p>
          </div>
        ) : (
          messagesToDisplay.map((msg, index) => {
            const senderId =
              typeof msg.sender === "object"
                ? (msg.sender as any)._id
                : msg.sender;
            const isOwn = senderId === currentUserId;

            const currentDateStr = msg.createdAt ? new Date(msg.createdAt).toDateString() : "";
            const prevMsg = index > 0 ? messagesToDisplay[index - 1] : null;
            const prevDateStr = prevMsg?.createdAt ? new Date(prevMsg.createdAt).toDateString() : "";
            const showDateDivider = index === 0 || currentDateStr !== prevDateStr;

            const prevSenderId = prevMsg
              ? typeof prevMsg.sender === "object"
                ? (prevMsg.sender as any)._id
                : prevMsg.sender
              : null;
            const isSameSenderPrevious = !showDateDivider && prevSenderId === senderId;

            return (
              <React.Fragment key={msg.id || msg._id}>
                {showDateDivider && currentDateStr && (
                  <div className="flex items-center justify-center my-4">
                    <span className="bg-[#E2E8F0]/70 text-slate-600 text-xs font-semibold px-3.5 py-1 rounded-full shadow-2xs border border-slate-200/60">
                      {formatDateDivider(msg.createdAt)}
                    </span>
                  </div>
                )}

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

        {isRecipientTyping && (
          <TypingIndicator userName={conversation.recipient?.name} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <MessageInput
        onSend={handleSend}
        onEditSubmit={handleEditSubmit}
        replyingTo={replyingTo}
        editingMessage={editingMessage}
        onCancelReply={() => setReplyingTo(null)}
        onCancelEdit={() => setEditingMessage(null)}
        onTyping={() => emitTyping(conversationId, conversation.recipient?.userId)}
        onStopTyping={() => emitStopTyping(conversationId, conversation.recipient?.userId)}
      />

      {/* Interactive Audio & Video Calling Modal Overlay */}
      {activeCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-bubble">
          <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl bg-[#0F172A] p-6 text-white shadow-2xl border border-slate-700 flex flex-col items-center justify-between min-h-[380px]">
            <div className="text-center mt-4">
              <span className="inline-block rounded-full bg-indigo-500/20 px-3.5 py-1 text-[11px] font-bold text-indigo-300 border border-indigo-400/30 uppercase tracking-wider mb-5">
                {activeCall === "video" ? "📹 HD Video Call" : "📞 Voice Call"}
              </span>
              <div className="relative mx-auto h-24 w-24 mb-4">
                {conversation.recipient?.profilePicture ? (
                  <img
                    src={conversation.recipient.profilePicture}
                    alt={conversation.recipient.name}
                    className="h-full w-full rounded-full object-cover border-4 border-indigo-500 shadow-xl"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 font-extrabold text-white text-3xl shadow-xl border-4 border-indigo-400">
                    {conversation.recipient?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-[#0F172A] animate-pulse" />
              </div>

              <h3 className="text-xl font-black text-white">{conversation.recipient?.name}</h3>
              <p className="text-xs text-indigo-200 mt-1 font-semibold">Calling {conversation.recipient?.role || "User"}...</p>
            </div>

            <div className="flex items-center gap-5 my-6">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all cursor-pointer ${
                  isMuted ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-slate-800 text-white hover:bg-slate-700"
                }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <FiMicOff className="text-xl" /> : <FiMic className="text-xl" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveCall(null)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                title="End Call"
              >
                <FiPhoneOff className="text-2xl" />
              </button>

              {activeCall === "video" && (
                <button
                  type="button"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all cursor-pointer ${
                    isVideoOff ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-slate-800 text-white hover:bg-slate-700"
                  }`}
                  title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
                >
                  {isVideoOff ? <FiVideoOff className="text-xl" /> : <FiVideo className="text-xl" />}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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

export default ChatWindow;
