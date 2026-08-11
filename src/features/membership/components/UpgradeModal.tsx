import React, { useState } from "react";
import { FiX, FiCheckCircle, FiZap, FiCreditCard, FiGlobe } from "react-icons/fi";
import type { IMembership } from "../types/membership.types";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: IMembership | null;
  onConfirm: (planId: string, gateway?: "razorpay" | "polar") => void;
  isLoading?: boolean;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  plan,
  onConfirm,
  isLoading = false,
}) => {
  const [gateway, setGateway] = useState<"razorpay" | "polar">("polar");

  if (!isOpen || !plan) return null;

  const isFree = plan.price === 0;

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
        <div className="rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5 mb-5 space-y-3">
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
              {isFree ? "Free" : `₹${plan.price}`}
            </span>
          </div>
        </div>

        {/* Gateway Selection for Paid Plans */}
        {!isFree && (
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Select Payment Gateway
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGateway("polar")}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition cursor-pointer ${
                  gateway === "polar"
                    ? "border-[#3C65F5] bg-blue-50/60 text-[#3C65F5] shadow-xs"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <FiGlobe className="text-2xl mb-1 text-[#3C65F5]" />
                <span className="text-xs font-extrabold">Polar Sandbox</span>
                <span className="text-[10px] text-gray-500 font-medium">Global Dummy Test</span>
              </button>

              <button
                type="button"
                onClick={() => setGateway("razorpay")}
                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition cursor-pointer ${
                  gateway === "razorpay"
                    ? "border-[#3C65F5] bg-blue-50/60 text-[#3C65F5] shadow-xs"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <FiCreditCard className="text-2xl mb-1 text-indigo-600" />
                <span className="text-xs font-extrabold">Razorpay</span>
                <span className="text-[10px] text-gray-500 font-medium">India / UPI / Cards</span>
              </button>
            </div>
          </div>
        )}

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
            onClick={() => onConfirm(plan._id || plan.id || "", gateway)}
            disabled={isLoading}
            className="w-1/2 rounded-xl bg-[#3C65F5] py-3.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#254BD6] shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <FiCheckCircle className="text-lg" />
            )}
            {isLoading ? "Redirecting..." : gateway === "polar" && !isFree ? "Pay with Polar" : "Confirm & Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
};
