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
  onReply?: (message: IMessage) => void;
  onEdit?: (message: IMessage) => void;
  onDelete?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
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
      className={`group relative flex w-full my-1.5 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-2xs ${
          message.isDeleted
            ? "bg-gray-100 text-gray-500 border border-gray-200"
            : isOwn
            ? "bg-[#3C65F5] text-white rounded-br-xs"
            : "bg-white text-[#05264E] border border-[#EAEFF7] rounded-bl-xs"
        }`}
      >
        {/* Reply preview if replying to a message */}
        {message.replyTo && !message.isDeleted && (
          <div
            className={`mb-2 rounded-lg p-2 text-xs border-l-3 ${
              isOwn
                ? "bg-white/15 border-white/80 text-white"
                : "bg-blue-50 border-[#3C65F5] text-gray-700"
            }`}
          >
            <span className="font-semibold block text-[11px]">
              Replying to message
            </span>
            <p className="truncate italic">
              {message.replyTo.isDeleted
                ? "This message was deleted"
                : message.replyTo.message}
            </p>
          </div>
        )}

        {/* Message Content */}
        <p
          className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
            message.isDeleted ? "italic text-gray-400 flex items-center gap-1.5" : ""
          }`}
        >
          {message.isDeleted ? "🚫 This message was deleted" : message.message}
        </p>

        {/* Attachments */}
        {!message.isDeleted && message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.attachments.map((att, idx) => (
              <a
                key={idx}
                href={att.url}
                target="_blank"
                rel="noreferrer"
                className={`block rounded-lg p-2 text-xs font-semibold underline truncate ${
                  isOwn ? "text-blue-100 hover:text-white" : "text-blue-600"
                }`}
              >
                📎 {att.fileName || "Attachment"}
              </a>
            ))}
          </div>
        )}

        {/* Timestamp & Status footer */}
        <div
          className={`mt-1 flex items-center justify-end gap-1.5 text-[10px] ${
            message.isDeleted
              ? "text-gray-400"
              : isOwn
              ? "text-blue-100"
              : "text-gray-400"
          }`}
        >
          {message.isEdited && !message.isDeleted && <span>(edited)</span>}
          <span>{formattedTime}</span>

          {/* Read / Delivered Checkmarks for Own Messages */}
          {isOwn && !message.isDeleted && (
            <span className="flex items-center ml-0.5">
              {message.read ? (
                <span title="Read / Seen" className="text-[#38BDF8] font-black flex items-center">
                  <FiCheck className="-mr-1.5 stroke-[2.5]" />
                  <FiCheck className="stroke-[2.5]" />
                </span>
              ) : message.delivered ? (
                <span title="Delivered" className="text-white/80 flex items-center">
                  <FiCheck className="-mr-1.5" />
                  <FiCheck />
                </span>
              ) : (
                <span title="Sent" className="text-white/60">
                  <FiCheck />
                </span>
              )}
            </span>
          )}
        </div>

        {/* Options Hover Menu - Positioned cleanly right above bubble header */}
        {!message.isDeleted && (
          <div
            className={`absolute -top-7 ${
              isOwn ? "right-2" : "left-2"
            } hidden group-hover:flex items-center gap-1.5 bg-white shadow-md border border-gray-200 rounded-full px-2 py-1 text-gray-600 z-20 transition-all`}
          >
            {onReply && (
              <button
                onClick={() => onReply(message)}
                title="Reply"
                className="p-0.5 hover:text-blue-600 cursor-pointer"
              >
                <FiCornerUpLeft className="text-xs" />
              </button>
            )}

            {canEdit && onEdit && (
              <button
                onClick={() => onEdit(message)}
                title="Edit (within 10m)"
                className="p-0.5 hover:text-blue-600 cursor-pointer"
              >
                <FiEdit2 className="text-xs" />
              </button>
            )}

            {isOwn && onDelete && (
              <button
                onClick={() => onDelete(message.id || message._id)}
                title="Delete"
                className="p-0.5 hover:text-red-600 cursor-pointer"
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
