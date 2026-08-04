import React, { useState, useRef, useEffect } from "react";
import {
  FiSend,
  FiSmile,
  FiX,
} from "react-icons/fi";
import type { IMessage } from "../types/chat.types";

interface MessageInputProps {
  onSend: (text: string, replyToId?: string) => void;
  onEditSubmit?: (text: string) => void;
  replyingTo?: IMessage | null;
  editingMessage?: IMessage | null;
  onCancelReply?: () => void;
  onCancelEdit?: () => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
}

const EMOJI_LIST = [
  "😊", "👍", "👋", "🎉", "💼", "🚀", "💡", "🔥", "🙏", "👏", "💯", "❤️", "✅", "✨", "🎯", "🤝"
];

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onEditSubmit,
  replyingTo,
  editingMessage,
  onCancelReply,
  onCancelEdit,
  onTyping,
  onStopTyping,
}) => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.message);
      inputRef.current?.focus();
    }
  }, [editingMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    if (onTyping) {
      onTyping();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (onStopTyping) {
        onStopTyping();
      }
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (editingMessage && onEditSubmit) {
      onEditSubmit(text.trim());
      if (onCancelEdit) onCancelEdit();
    } else {
      onSend(text.trim(), replyingTo ? replyingTo.id || replyingTo._id : undefined);
      if (onCancelReply) onCancelReply();
    }

    setText("");
    setShowEmojiPicker(false);
    if (onStopTyping) onStopTyping();
  };

  const handleSelectEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full border-t border-[#EAEFF7] bg-white p-3 sm:p-4">
      {/* Reply Banner */}
      {replyingTo && (
        <div className="mb-2 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2 text-xs text-[#05264E] border border-blue-100">
          <div className="min-w-0 flex-1 pr-2">
            <span className="font-bold text-[#3C65F5] block">Replying to</span>
            <p className="truncate text-gray-600">{replyingTo.message}</p>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Edit Banner */}
      {editingMessage && (
        <div className="mb-2 flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900 border border-amber-200">
          <div className="min-w-0 flex-1 pr-2">
            <span className="font-bold block">Editing Message</span>
            <p className="truncate text-amber-800">{editingMessage.message}</p>
          </div>
          <button
            onClick={onCancelEdit}
            className="p-1 text-amber-600 hover:text-amber-900 cursor-pointer"
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Emoji Quick Picker Dropdown */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 z-50 grid grid-cols-8 gap-1.5 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl">
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleSelectEmoji(emoji)}
              className="text-lg hover:scale-125 transition cursor-pointer p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2 text-gray-400 hover:text-[#3C65F5] transition cursor-pointer"
          title="Add Emoji"
        >
          <FiSmile className="text-xl" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder={
            editingMessage
              ? "Update your message..."
              : "Type your message..."
          }
          className="flex-1 rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] px-4 py-3 text-xs sm:text-sm font-medium text-[#05264E] placeholder:text-gray-400 focus:border-[#3C65F5] focus:bg-white focus:outline-none transition"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3C65F5] text-white shadow-md transition hover:bg-blue-700 disabled:opacity-40 cursor-pointer"
        >
          <FiSend className="text-lg" />
        </button>
      </form>
    </div>
  );
};
