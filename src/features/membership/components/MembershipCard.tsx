import React from "react";
import { motion } from "framer-motion";
import { FiZap, FiCheckCircle, FiLock } from "react-icons/fi";
import type { IMembership } from "../types/membership.types";
import { MembershipFeature } from "./MembershipFeature";

interface MembershipCardProps {
  plan: IMembership;
  isCurrentPlan: boolean;
  isHigherPlanActive?: boolean;
  isUpgrade?: boolean;
  onSelect: (plan: IMembership) => void;
  isLoading?: boolean;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  plan,
  isCurrentPlan,
  isHigherPlanActive = false,
  isUpgrade = false,
  onSelect,
  isLoading = false,
}) => {
  const isPopular = plan.isPopular;
  const isRecommended = plan.isRecommended;

  const isDisabled = isCurrentPlan || isHigherPlanActive || isLoading;

  const handleCardClick = () => {
    if (!isDisabled) {
      onSelect(plan);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isDisabled ? { y: -6 } : {}}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 ${isCurrentPlan
          ? "bg-[#0B132B] border-2 border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.2)] cursor-default"
          : isHigherPlanActive
            ? "bg-[#0B132B]/80 border border-slate-800 opacity-60 cursor-not-allowed"
            : isPopular || isRecommended
              ? "bg-[#0B132B] border-2 border-indigo-500/80 shadow-[0_0_35px_rgba(99,102,241,0.25)] cursor-pointer"
              : "bg-[#0B132B] border border-slate-800/80 shadow-xl hover:border-slate-700 cursor-pointer"
        }`}
    >
      {/* Top Badge */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {isPopular && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-md">
            <FiZap className="text-yellow-300 fill-yellow-300 text-xs" /> Most Popular
          </span>
        )}
        {isRecommended && !isPopular && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-md">
            ⭐ Recommended
          </span>
        )}
      </div>

      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-3xl font-black text-white tracking-tight">{plan.name}</h3>
          {isCurrentPlan && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/40">
              <FiCheckCircle className="text-xs" /> Current Plan
            </span>
          )}
          {isHigherPlanActive && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-3 py-0.5 text-xs font-bold text-slate-400 border border-slate-700">
              <FiLock className="text-xs" /> Higher Active
            </span>
          )}
        </div>

        <p className="text-xs font-medium text-slate-400 mb-5 leading-relaxed min-h-[36px]">
          {plan.description}
        </p>

        {/* Pricing Display */}
        <div className="mb-6 flex items-baseline gap-1.5 border-b border-slate-800/80 pb-5">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            {plan.price === 0
              ? "Free"
              : plan.currency === "INR" || plan.currency === "₹"
              ? `₹${plan.price}`
              : `$${plan.price}`}
          </span>
          {plan.price > 0 && (
            <span className="text-xs font-semibold text-slate-400">
              /{plan.durationInDays} days
            </span>
          )}
        </div>

        {/* Features Checklist */}
        <div className="space-y-3 mb-8">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">
            INCLUDED FEATURES
          </h4>
          <ul className="space-y-2">
            {plan.features.map((feature, idx) => (
              <MembershipFeature key={idx} feature={feature} />
            ))}
          </ul>
        </div>
      </div>

      {/* Primary CTA Button */}
      <motion.button
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}
        disabled={isDisabled}
        className={`w-full rounded-2xl py-3.5 text-xs sm:text-sm font-black tracking-wide transition-all duration-200 shadow-md ${isCurrentPlan
            ? "bg-slate-800/80 text-slate-400 cursor-not-allowed border border-slate-700/80"
            : isHigherPlanActive
              ? "bg-slate-900/60 text-slate-500 cursor-not-allowed border border-slate-800"
              : isUpgrade
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] cursor-pointer"
                : "bg-white text-[#0B132B] hover:bg-slate-100 active:scale-[0.98] cursor-pointer"
          }`}
      >
        {isCurrentPlan
          ? "Active Subscription"
          : isHigherPlanActive
            ? "Included in Current Plan"
            : isUpgrade
              ? `Upgrade to ${plan.name}`
              : plan.price === 0
                ? "Get Free Plan"
                : "Subscribe Now"}
      </motion.button>
    </motion.div>
  );
};
