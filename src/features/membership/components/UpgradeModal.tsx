import React from "react";
import { FiX, FiCheckCircle, FiZap, FiShield } from "react-icons/fi";
import type { IMembership } from "../types/membership.types";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: IMembership | null;
  onConfirm: (planId: string) => void;
  isLoading?: boolean;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  plan,
  onConfirm,
  isLoading = false,
}) => {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer"
        >
          <FiX className="text-xl" />
        </button>

        {/* Header Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5] mb-5 border border-blue-100 shadow-xs">
          <FiZap className="text-3xl fill-yellow-400 text-yellow-500" />
        </div>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-black text-[#05264E]">
            Upgrade to {plan.name}
          </h3>
          <p className="text-xs font-medium text-gray-500 mt-1 max-w-xs mx-auto">
            {plan.description}
          </p>
        </div>

        {/* Summary Card */}
        <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5 mb-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-600">Selected Plan</span>
            <span className="font-bold text-[#05264E]">{plan.name}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-600">Duration</span>
            <span className="font-bold text-[#05264E]">
              {plan.durationInDays} Days
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200/60 pt-3 text-base">
            <span className="font-extrabold text-[#05264E]">Total Amount</span>
            <span className="text-xl font-black text-[#3C65F5]">
              {plan.price === 0 ? "Free" : `₹${plan.price}`}
            </span>
          </div>
        </div>

        {/* Payment Simulation Note (Future Ready for Stripe / Razorpay) */}
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 mb-6 flex items-start gap-2.5">
          <FiShield className="text-emerald-600 text-lg shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 font-medium leading-relaxed">
            Payment simulation active. Confirming will instantly activate your <strong>{plan.name}</strong> subscription without charge.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 rounded-xl border border-gray-200 py-3.5 text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(plan._id || plan.id || "")}
            disabled={isLoading}
            className="w-1/2 rounded-xl bg-[#3C65F5] py-3.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#254BD6] shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <FiCheckCircle className="text-lg" />
            )}
            {isLoading ? "Activating..." : "Confirm & Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
};
