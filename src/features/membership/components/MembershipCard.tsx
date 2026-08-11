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
      className={`relative flex flex-col justify-between rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
        isCurrentPlan
          ? "bg-slate-900/90 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10 cursor-default"
          : isPopular || isRecommended
          ? "bg-gradient-to-b from-[#1E1B4B] via-[#0F172A] to-[#0F172A] border-2 border-[#6366F1] shadow-xl shadow-indigo-500/25 cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-400"
          : "bg-[#0F172A] border border-slate-800/80 shadow-md hover:border-slate-700 cursor-pointer hover:-translate-y-1"
      }`}
    >
      {/* Badges */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {isPopular && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-3.5 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-indigo-500/30">
            <FiZap className="text-yellow-300 fill-yellow-300 text-xs" /> Most Popular
          </span>
        )}
        {isRecommended && !isPopular && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3.5 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-500/30">
            ⭐ Recommended
          </span>
        )}
      </div>

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{plan.name}</h3>
          {isCurrentPlan && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
              <FiCheckCircle className="text-xs" /> Active
            </span>
          )}
        </div>

        <p className="text-xs font-medium text-slate-400 mb-4 line-clamp-2 leading-relaxed min-h-[32px]">
          {plan.description}
        </p>

        {/* Pricing */}
        <div className="mb-4 flex items-baseline gap-1.5 border-b border-slate-800 pb-4">
          <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {plan.price === 0 ? "Free" : `₹${plan.price}`}
          </span>
          {plan.price > 0 && (
            <span className="text-xs font-medium text-slate-400">
              /{plan.durationInDays} days
            </span>
          )}
        </div>

        {/* Feature List */}
        <div className="space-y-2 mb-6">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
            Included Features
          </h4>
          <ul className="space-y-1.5">
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
        className={`w-full rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all duration-200 shadow-md cursor-pointer ${
          isCurrentPlan
            ? "bg-slate-800 text-slate-400 cursor-not-allowed shadow-none border border-slate-700"
            : isPopular || isRecommended
            ? "bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/25 hover:shadow-lg active:scale-[0.99]"
            : "bg-white text-slate-900 hover:bg-slate-100 hover:shadow-lg active:scale-[0.99]"
        }`}
      >
        {isCurrentPlan ? "Active Subscription" : plan.price === 0 ? "Get Free Plan" : "Subscribe Now"}
      </button>
    </div>
  );
};
