import React from "react";
import { FiZap, FiCheckCircle } from "react-icons/fi";
import type { IMembership } from "../types/membership.types";
import { MembershipFeature } from "./MembershipFeature";

interface MembershipCardProps {
  plan: IMembership;
  isCurrentPlan: boolean;
  onSelect: (plan: IMembership) => void;
  isLoading?: boolean;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  plan,
  isCurrentPlan,
  onSelect,
  isLoading = false,
}) => {
  const isPopular = plan.isPopular;
  const isRecommended = plan.isRecommended;

  const handleCardClick = () => {
    if (!isCurrentPlan && !isLoading) {
      onSelect(plan);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative flex flex-col justify-between rounded-3xl bg-white p-8 transition-all duration-300 ${
        isCurrentPlan
          ? "border-2 border-gray-200 shadow-sm bg-gray-50/50 cursor-default"
          : isPopular || isRecommended
          ? "border-2 border-[#3C65F5] shadow-xl scale-[1.02] bg-gradient-to-b from-blue-50/20 via-white to-white cursor-pointer hover:shadow-2xl hover:border-blue-600"
          : "border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 cursor-pointer"
      }`}
    >
      {/* Badges */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {isPopular && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#3C65F5] px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-md">
            <FiZap className="text-yellow-300 fill-yellow-300" /> Most Popular
          </span>
        )}
        {isRecommended && !isPopular && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-md">
            ⭐ Recommended
          </span>
        )}
      </div>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-black text-[#05264E]">{plan.name}</h3>
          {isCurrentPlan && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-[#3C65F5]">
              <FiCheckCircle /> Current Plan
            </span>
          )}
        </div>

        <p className="text-xs font-medium text-gray-500 mb-6 min-h-[36px] leading-relaxed">
          {plan.description}
        </p>

        {/* Pricing */}
        <div className="mb-8 flex items-baseline gap-1.5 border-b border-gray-100 pb-6">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-[#05264E]">
            {plan.price === 0 ? "Free" : `₹${plan.price}`}
          </span>
          {plan.price > 0 && (
            <span className="text-sm font-semibold text-gray-500">
              /{plan.durationInDays} days
            </span>
          )}
        </div>

        {/* Feature List */}
        <div className="space-y-3 mb-8">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#05264E]/70 mb-4">
            Included Features
          </h4>
          <ul className="space-y-2">
            {plan.features.map((feature, idx) => (
              <MembershipFeature key={idx} feature={feature} />
            ))}
          </ul>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
        disabled={isCurrentPlan || isLoading}
        className={`w-full rounded-2xl py-4 text-sm font-extrabold transition-all duration-200 shadow-md cursor-pointer ${
          isCurrentPlan
            ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200"
            : isPopular || isRecommended
            ? "bg-[#3C65F5] text-white hover:bg-[#254BD6] hover:shadow-lg shadow-blue-500/20 active:scale-[0.99]"
            : "bg-[#05264E] text-white hover:bg-[#031936] hover:shadow-lg active:scale-[0.99]"
        }`}
      >
        {isCurrentPlan ? "Active Subscription" : plan.price === 0 ? "Get Free Plan" : "Upgrade Plan"}
      </button>
    </div>
  );
};
