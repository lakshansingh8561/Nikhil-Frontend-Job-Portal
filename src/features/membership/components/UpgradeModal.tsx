import React, { useState } from "react";
import { FiX, FiCheckCircle, FiZap, FiTag } from "react-icons/fi";
import type { IMembership } from "../types/membership.types";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: IMembership | null;
  currentPlanName?: string;
  upgradePreview?: {
    isUpgrade: boolean;
    unusedCredit: number;
    finalUpgradePrice: number;
    currency: string;
  } | null;
  onConfirm: (planId: string, gateway?: "razorpay" | "polar") => void;
  isLoading?: boolean;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  plan,
  currentPlanName = "Free",
  upgradePreview,
  onConfirm,
  isLoading = false,
}) => {
  const [gateway, setGateway] = useState<"razorpay" | "polar">("polar");

  if (!isOpen || !plan) return null;

  const isFree = plan.price === 0;
  const isUpgrade = Boolean(upgradePreview?.isUpgrade);
  const unusedCredit = upgradePreview?.unusedCredit || 0;
  const finalPrice = upgradePreview ? upgradePreview.finalUpgradePrice : plan.price;

  const handleConfirm = () => {
    onConfirm(plan._id || plan.id || "", gateway);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5]">
              <FiZap className="text-xl" />
            </span>
            <div>
              <h3 className="text-xl font-black text-[#05264E]">
                {isFree ? "Activate Free Plan" : isUpgrade ? "Upgrade Plan" : "Subscribe Plan"}
              </h3>
              <p className="text-xs font-semibold text-gray-500">
                Current Plan: <span className="font-bold text-[#05264E]">{currentPlanName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Breakdown Card */}
        <div className="rounded-2xl bg-gray-50/80 p-5 space-y-3 mb-6 border border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-600">Selected Plan</span>
            <span className="font-bold text-[#05264E]">{plan.name}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-600">Plan List Price</span>
            <span className="font-bold text-[#05264E]">{isFree ? "Free" : `$${plan.price}`}</span>
          </div>

          {isUpgrade && unusedCredit > 0 && (
            <div className="flex items-center justify-between text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
              <span className="flex items-center gap-1.5">
                <FiTag className="text-sm" /> Unused Subscription Credit
              </span>
              <span>-${unusedCredit}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-600">Duration</span>
            <span className="font-bold text-[#05264E]">
              {plan.durationInDays} Days
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200/60 pt-3 text-base">
            <span className="font-extrabold text-[#05264E]">
              {isUpgrade ? "Upgrade Amount to Pay" : "Total Amount"}
            </span>
            <span className="text-2xl font-black text-[#3C65F5]">
              {isFree ? "Free" : `$${finalPrice}`}
            </span>
          </div>
        </div>

        {/* Gateway Selection for Paid Plans */}
        {!isFree && (
          <div className="mb-6 space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500">
              Select Payment Gateway
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGateway("polar")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  gateway === "polar"
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-black shadow-xs"
                    : "border-gray-200 hover:border-gray-300 bg-white text-gray-600 font-semibold"
                }`}
              >
                <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-600">⚡ Polar</span>
                <span className="text-[10px] text-gray-500 font-normal">Card / AutoPay</span>
              </button>

              <button
                type="button"
                onClick={() => setGateway("razorpay")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  gateway === "razorpay"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900 font-black shadow-xs"
                    : "border-gray-200 hover:border-gray-300 bg-white text-gray-600 font-semibold"
                }`}
              >
                <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600">💳 Razorpay</span>
                <span className="text-[10px] text-gray-500 font-normal">Cards, UPI, Netbanking</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-1/2 rounded-xl border border-gray-200 bg-gray-50 py-3.5 text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-1/2 rounded-xl bg-[#3C65F5] py-3.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#254BD6] shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <FiCheckCircle className="text-lg" />
            )}
            {isLoading
              ? "Processing..."
              : isFree
              ? "Confirm Free Plan"
              : isUpgrade
              ? `Upgrade for $${finalPrice}`
              : gateway === "polar"
              ? "Pay with Polar"
              : "Confirm & Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
};
