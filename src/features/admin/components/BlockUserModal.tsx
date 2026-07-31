import React from "react";
import { FiSlash, FiCheckCircle, FiX } from "react-icons/fi";

interface BlockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userEmail?: string;
  isBlocking: boolean; // true = block, false = unblock
  isLoading?: boolean;
}

export const BlockUserModal: React.FC<BlockUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userEmail,
  isBlocking,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const actionText = isBlocking ? "Block" : "Unblock";
  const colorClass = isBlocking
    ? "bg-red-100 text-red-600"
    : "bg-emerald-100 text-emerald-600";
  const btnColor = isBlocking
    ? "bg-red-600 hover:bg-red-700"
    : "bg-emerald-600 hover:bg-emerald-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-[#EAEFF7] pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}
            >
              {isBlocking ? (
                <FiSlash className="text-xl" />
              ) : (
                <FiCheckCircle className="text-xl" />
              )}
            </div>
            <h3 className="text-lg font-bold text-[#05264E]">
              {actionText} User Account
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="py-5">
          <p className="text-xs sm:text-sm font-medium text-[#66789C]">
            Are you sure you want to {actionText.toLowerCase()}{" "}
            {userEmail ? (
              <span className="font-bold text-[#05264E]">{userEmail}</span>
            ) : (
              "this user"
            )}
            ?
            {isBlocking
              ? " The user will lose access to sign in to their account."
              : " The user will regain normal access to the job portal."}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#EAEFF7] pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-2xl border border-[#EAEFF7] bg-white px-5 py-2.5 text-xs font-bold text-[#05264E] hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 rounded-2xl ${btnColor} px-5 py-2.5 text-xs font-bold text-white shadow-md transition cursor-pointer disabled:opacity-50`}
          >
            {isLoading
              ? "Processing..."
              : `Confirm ${actionText}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockUserModal;
