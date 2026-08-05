import React, { useEffect, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiSearch,
  FiX,
} from "react-icons/fi";
import type { IConversation, IMessage } from "../types/chat.types";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Queries & Mutations
  const { data: messagesData, isLoading: isMessagesLoading } =
    useGetMessagesQuery({ conversationId, limit: 50 });

  const [sendMessage] = useSendMessageMutation();
  const [editMessage] = useEditMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [triggerSearch] = useLazySearchMessagesQuery();

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

  // Auto-scroll to bottom on load/new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData?.messages]);

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
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-[#EAEFF7] bg-white px-4 sm:px-6 shadow-2xs z-10">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition cursor-pointer flex items-center justify-center"
              title="Back to conversations"
            >
              <FiArrowLeft className="text-xl" />
            </button>
          )}

          {/* Avatar */}
          <div className="relative shrink-0">
            {conversation.recipient?.profilePicture ? (
              <img
                src={conversation.recipient.profilePicture}
                alt={conversation.recipient.name}
                className="h-10 w-10 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3C65F5] font-bold text-white text-sm">
                {conversation.recipient?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#05264E] truncate">
                {conversation.recipient?.name}
              </h3>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isOnline
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#3C65F5] font-semibold truncate">
              <FiBriefcase className="shrink-0 text-[11px]" />
              <span className="truncate">{conversation.jobId?.title}</span>
            </div>
          </div>
        </div>

        {/* Search Toggle */}
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find in chat..."
                className="w-36 sm:w-48 rounded-lg border border-gray-300 px-3 py-1 text-xs focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchResults(null);
                  setSearchQuery("");
                }}
                className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <FiX />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-400 hover:text-[#3C65F5] transition cursor-pointer"
              title="Search conversation"
            >
              <FiSearch className="text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2"
      >
        {isMessagesLoading ? (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            Loading messages...
          </div>
        ) : messagesToDisplay.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-6">
            <div className="h-12 w-12 rounded-full bg-blue-50 text-[#3C65F5] flex items-center justify-center font-bold text-xl mb-2">
              💬
            </div>
            <p className="text-sm font-bold text-[#05264E]">Start the conversation!</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              Say hello to {conversation.recipient?.name} regarding the{" "}
              <strong>{conversation.jobId?.title}</strong> role.
            </p>
          </div>
        ) : (
          messagesToDisplay.map((msg) => {
            const senderId =
              typeof msg.sender === "object"
                ? (msg.sender as any)._id
                : msg.sender;
            const isOwn = senderId === currentUserId;

            return (
              <MessageBubble
                key={msg.id || msg._id}
                message={msg}
                isOwn={isOwn}
                onReply={(m) => setReplyingTo(m)}
                onEdit={(m) => setEditingMessage(m)}
                onDelete={(id) => handleDelete(id)}
              />
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
    </div>
  );
};
