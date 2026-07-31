import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemTitle?: string;
  isLoading?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Job Listing",
  itemTitle,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl transition-all">
        <div className="flex items-center justify-between border-b border-[#EAEFF7] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <FiAlertTriangle className="text-xl" />
            </div>
            <h3 className="text-lg font-bold text-[#05264E]">{title}</h3>
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
            Are you sure you want to delete{" "}
            {itemTitle ? (
              <span className="font-bold text-[#05264E]">"{itemTitle}"</span>
            ) : (
              "this item"
            )}
            ? This action cannot be undone and will permanently remove the record.
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
            className="flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
