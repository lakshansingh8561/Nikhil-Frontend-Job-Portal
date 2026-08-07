import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiSmile, FiX } from "react-icons/fi";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus and populate on edit
  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.message);
      textareaRef.current?.focus();
    }
  }, [editingMessage]);

  // Auto-resize height between 36px and 120px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const computedHeight = Math.min(Math.max(scrollHeight, 36), 120);
      textareaRef.current.style.height = `${computedHeight}px`;
    }
  }, [text]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    }, 1000);
  };

  const handleSubmitForm = () => {
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

    // Reset height back to min 36px
    if (textareaRef.current) {
      textareaRef.current.style.height = "36px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without Shift -> Send Message
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitForm();
    }
    // Ctrl + Enter -> Optional Send
    else if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSubmitForm();
    }
    // Shift + Enter -> Creates new line (default textarea behavior, no preventDefault)
  };

  const handleSelectEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="relative w-full shrink-0 border-t border-[#E5E7EB] bg-white px-3 py-2 sm:px-4 sm:py-2.5">
      {/* Reply Banner */}
      {replyingTo && (
        <div className="mb-2 flex items-center justify-between rounded-lg bg-indigo-50/80 px-3 py-1.5 text-xs text-[#05264E] border border-indigo-100 animate-bubble">
          <div className="min-w-0 flex-1 pr-2">
            <span className="font-bold text-[#4F46E5] block text-[10px] uppercase tracking-wider">
              Replying to
            </span>
            <p className="truncate text-gray-700 font-medium text-xs">{replyingTo.message}</p>
          </div>
          <button
            onClick={onCancelReply}
            aria-label="Cancel reply"
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-white/60 transition cursor-pointer"
          >
            <FiX className="text-xs" />
          </button>
        </div>
      )}

      {/* Edit Banner */}
      {editingMessage && (
        <div className="mb-2 flex items-center justify-between rounded-lg bg-amber-50/90 px-3 py-1.5 text-xs text-amber-900 border border-amber-200 animate-bubble">
          <div className="min-w-0 flex-1 pr-2">
            <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-800">
              Editing Message
            </span>
            <p className="truncate text-amber-900 font-medium text-xs">{editingMessage.message}</p>
          </div>
          <button
            onClick={onCancelEdit}
            aria-label="Cancel edit"
            className="p-1 text-amber-600 hover:text-amber-900 rounded-full hover:bg-white/60 transition cursor-pointer"
          >
            <FiX className="text-xs" />
          </button>
        </div>
      )}

      {/* Emoji Quick Picker Dropdown */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 z-50 grid grid-cols-8 gap-1 rounded-xl border border-[#E5E7EB] bg-white p-2.5 shadow-xl animate-bubble">
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleSelectEmoji(emoji)}
              aria-label={`Insert emoji ${emoji}`}
              className="text-base hover:scale-125 transition-transform duration-150 cursor-pointer p-1 flex items-center justify-center rounded-md hover:bg-gray-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <div className="flex items-end gap-2">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label="Toggle emoji picker"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:text-[#4F46E5] hover:bg-[#F3F4F6] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          title="Add Emoji"
        >
          <FiSmile className="text-lg" />
        </button>

        {/* Auto Growing Textarea (Compact 36px min height) */}
        <div className="flex-1 min-w-0 relative flex items-center">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={
              editingMessage
                ? "Update your message..."
                : "Type a message..."
            }
            aria-label="Message text"
            className="w-full min-h-[36px] max-h-[120px] resize-none rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#05264E] placeholder:text-gray-400 focus:border-[#4F46E5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 transition-all duration-200 custom-scrollbar leading-snug"
          />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSubmitForm}
          disabled={!text.trim()}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4F46E5] text-white shadow-2xs transition-all duration-200 hover:bg-[#4338CA] hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-[#4F46E5] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
        >
          <FiSend className="text-base" />
        </button>
      </div>
    </div>
  );
};

