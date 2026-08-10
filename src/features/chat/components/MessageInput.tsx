import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiSmile, FiX, FiImage } from "react-icons/fi";
import type { IMessage, IAttachment, MessageType } from "../types/chat.types";

interface MessageInputProps {
  onSend: (
    text: string,
    replyToId?: string,
    attachments?: IAttachment[],
    messageType?: MessageType
  ) => void;
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
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    fileName: string;
    fileType: string;
  } | null>(null);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setSelectedImage({
          url: reader.result as string,
          fileName: file.name,
          fileType: file.type || "image/jpeg",
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmitForm = () => {
    const messageContent = text.trim();
    if (!messageContent && !selectedImage) return;

    if (editingMessage && onEditSubmit) {
      onEditSubmit(messageContent || "Image attachment");
      if (onCancelEdit) onCancelEdit();
    } else {
      const attachmentsArr: IAttachment[] = selectedImage
        ? [{ url: selectedImage.url, fileName: selectedImage.fileName, fileType: selectedImage.fileType }]
        : [];
      const msgType: MessageType = selectedImage ? "image" : "text";

      onSend(
        messageContent || "📷 Image attachment",
        replyingTo ? replyingTo.id || replyingTo._id : undefined,
        attachmentsArr,
        msgType
      );
      if (onCancelReply) onCancelReply();
    }

    setText("");
    setSelectedImage(null);
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
    } else if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSubmitForm();
    }
  };

  const handleSelectEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="relative w-full shrink-0 border-t border-[#E5E7EB] bg-white px-3 py-2 sm:px-4 sm:py-2.5">
      {/* Hidden Image File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />

      {/* Selected Image Preview Thumbnail Bar */}
      {selectedImage && (
        <div className="mb-2 flex items-center justify-between rounded-xl bg-blue-50/80 p-2 border border-blue-200">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={selectedImage.url}
              alt="Attachment preview"
              className="h-10 w-10 object-cover rounded-lg border border-blue-300 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#05264E] truncate block">
                {selectedImage.fileName}
              </span>
              <span className="text-[10px] text-[#3C65F5] font-semibold">
                Image attached ready to send
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-white transition cursor-pointer"
            title="Remove image"
          >
            <FiX className="text-sm" />
          </button>
        </div>
      )}

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
        {/* Image Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload Image"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:text-[#4F46E5] hover:bg-[#F3F4F6] transition-all duration-200 cursor-pointer"
          title="Upload Image"
        >
          <FiImage className="text-lg" />
        </button>

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
                : selectedImage
                ? "Add an optional image caption..."
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
          disabled={!text.trim() && !selectedImage}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#4F46E5] text-white shadow-2xs transition-all duration-200 hover:bg-[#4338CA] hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:bg-[#4F46E5] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
        >
          <FiSend className="text-base" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
