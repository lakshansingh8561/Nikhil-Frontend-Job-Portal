import React from "react";
import {
  FiCheck,
  FiCornerUpLeft,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import type { IMessage } from "../types/chat.types";

interface MessageBubbleProps {
  message: IMessage;
  isOwn: boolean;
  isSameSenderPrevious?: boolean;
  onReply?: (message: IMessage) => void;
  onEdit?: (message: IMessage) => void;
  onDelete?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  isSameSenderPrevious = false,
  onReply,
  onEdit,
  onDelete,
}) => {
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const canEdit =
    isOwn &&
    !message.isDeleted &&
    Date.now() - new Date(message.createdAt).getTime() <= 10 * 60 * 1000;

  return (
    <div
      className={`group relative flex w-full animate-bubble ${
        isSameSenderPrevious ? "mt-0.5" : "mt-1.5"
      } ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[80%] sm:max-w-[65%] shadow-2xs transition-all duration-200 ${
          message.isDeleted
            ? "bg-[#F1F5F9] text-slate-500 border border-[#E2E8F0] px-3 py-1.5 rounded-xl"
            : isOwn
            ? "bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white px-3 py-1.5 rounded-xl rounded-br-xs"
            : "bg-white text-[#05264E] border border-[#E5E7EB] px-3 py-1.5 rounded-xl rounded-bl-xs"
        }`}
      >
        {/* Reply preview if replying to a message */}
        {message.replyTo && !message.isDeleted && (
          <div
            className={`mb-1 rounded-lg px-2 py-1 text-xs border-l-2 transition-colors ${
              isOwn
                ? "bg-white/15 border-white/90 text-white"
                : "bg-indigo-50/80 border-[#4F46E5] text-slate-700"
            }`}
          >
            <span className="font-bold block text-[10px] uppercase tracking-wider">
              Replying to message
            </span>
            <p className="truncate italic font-medium">
              {message.replyTo.isDeleted
                ? "This message was deleted"
                : message.replyTo.message}
            </p>
          </div>
        )}

        {/* Message Content & Inline/Compact Timestamp */}
        {message.isDeleted ? (
          <p className="text-xs italic text-slate-500 font-medium flex items-center gap-1 leading-tight">
            <span>🚫</span>
            <span>This message was deleted</span>
          </p>
        ) : (
          <div className="flex flex-wrap items-baseline justify-between gap-x-2.5 gap-y-0.5">
            <p className="text-xs sm:text-[13.5px] leading-snug whitespace-pre-wrap break-words font-normal flex-1 min-w-0">
              {message.message}
            </p>

            {/* Compact inline timestamp */}
            <div
              className={`shrink-0 ml-auto text-[10px] font-medium leading-none flex items-center gap-0.5 self-end ${
                isOwn ? "text-indigo-200" : "text-slate-400"
              }`}
            >
              {message.isEdited && <span>(edited)</span>}
              <span>{formattedTime}</span>

              {/* Read / Delivered Checkmarks */}
              {isOwn && (
                <span className="flex items-center ml-0.5" aria-label={`Status: ${message.status || 'sent'}`}>
                  {message.status === "seen" || message.read || (message as any).reads?.some((r: any) => r.userId && r.userId !== (typeof message.sender === "object" ? (message.sender as any)._id : message.sender)) ? (
                    <span title="Read / Seen (2 Blue Ticks)" className="text-cyan-300 font-black flex items-center">
                      <FiCheck className="-mr-1.5 stroke-[2.5]" />
                      <FiCheck className="stroke-[2.5]" />
                    </span>
                  ) : message.status === "delivered" || message.delivered ? (
                    <span title="Delivered (2 Gray Ticks)" className="text-white/80 flex items-center">
                      <FiCheck className="-mr-1.5 stroke-[2]" />
                      <FiCheck className="stroke-[2]" />
                    </span>
                  ) : (
                    <span title="Sent (1 Gray Tick)" className="text-white/60">
                      <FiCheck className="stroke-[2]" />
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Attachments & Images */}
        {!message.isDeleted && message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {message.attachments.map((att, idx) => {
              const isImage =
                message.messageType === "image" ||
                att.fileType?.startsWith("image") ||
                /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(att.url) ||
                att.url.startsWith("data:image");

              if (isImage) {
                return (
                  <a
                    key={idx}
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-xl border border-black/10 shadow-sm transition-transform hover:scale-[1.01]"
                  >
                    <img
                      src={att.url}
                      alt={att.fileName || "Uploaded attachment"}
                      className="max-h-60 w-full object-cover rounded-xl"
                    />
                  </a>
                );
              }

              return (
                <a
                  key={idx}
                  href={att.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`block rounded-lg px-2.5 py-1.5 text-xs font-bold underline truncate transition-colors ${
                    isOwn ? "bg-white/15 text-indigo-100 hover:text-white" : "bg-gray-100 text-[#4F46E5] hover:bg-gray-200"
                  }`}
                >
                  📎 {att.fileName || "Download Attachment"}
                </a>
              );
            })}
          </div>
        )}

        {/* Options Hover Menu - Positioned cleanly above bubble */}
        {!message.isDeleted && (
          <div
            className={`absolute -top-7 ${
              isOwn ? "right-1" : "left-1"
            } hidden group-hover:flex items-center gap-1 bg-white shadow-md border border-[#E5E7EB] rounded-full px-2 py-0.5 text-slate-600 z-20 transition-all duration-200`}
          >
            {onReply && (
              <button
                onClick={() => onReply(message)}
                title="Reply"
                aria-label="Reply to message"
                className="p-1 hover:text-[#4F46E5] hover:scale-110 transition-all cursor-pointer rounded-full"
              >
                <FiCornerUpLeft className="text-xs" />
              </button>
            )}

            {canEdit && onEdit && (
              <button
                onClick={() => onEdit(message)}
                title="Edit message"
                aria-label="Edit message"
                className="p-1 hover:text-[#4F46E5] hover:scale-110 transition-all cursor-pointer rounded-full"
              >
                <FiEdit2 className="text-xs" />
              </button>
            )}

            {isOwn && onDelete && (
              <button
                onClick={() => onDelete(message.id || message._id)}
                title="Delete message"
                aria-label="Delete message"
                className="p-1 hover:text-red-600 hover:scale-110 transition-all cursor-pointer rounded-full"
              >
                <FiTrash2 className="text-xs" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};



