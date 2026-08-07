import React from "react";
import { FiZap, FiCalendar, FiShield, FiAlertCircle } from "react-icons/fi";
import type { CurrentSubscriptionResponse } from "../types/membership.types";

interface CurrentPlanCardProps {
  currentSubscription: CurrentSubscriptionResponse | undefined;
  onUpgrade: () => void;
  onCancel: () => void;
  isCancelling?: boolean;
}

export const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
  currentSubscription,
  onUpgrade,
  onCancel,
  isCancelling = false,
}) => {
  const hasSub = currentSubscription?.hasActiveSubscription;
  const sub = currentSubscription?.subscription;
  const plan = currentSubscription?.plan;

  const isFree = !hasSub || !sub || sub.planName === "Free" || plan?.price === 0;

  const formattedEndDate = sub?.endDate
    ? new Date(sub.endDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Lifetime";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#05264E] via-[#0F396E] to-[#3C65F5] p-8 text-white shadow-xl">
      {/* Decorative Blur */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Plan Info */}
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-yellow-300 border border-white/10 shadow-inner">
              <FiZap className="text-xl fill-yellow-300" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Current Subscription
              </span>
              <h2 className="text-3xl font-black tracking-tight text-white">
                {sub?.planName || plan?.name || "Free Tier"}
              </h2>
            </div>
          </div>

          <p className="text-sm text-blue-100/90 font-normal leading-relaxed">
            {plan?.description || "Enjoy essential job search and application tools."}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-blue-200/90 pt-2">
            <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-xs border border-white/10">
              <FiShield className="text-emerald-400 text-sm" />
              Status: <strong className="text-white uppercase font-bold">{sub?.status || "ACTIVE"}</strong>
            </span>
            <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-xs border border-white/10">
              <FiCalendar className="text-blue-300 text-sm" />
              Expires: <strong className="text-white font-bold">{formattedEndDate}</strong>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <button
            onClick={onUpgrade}
            className="rounded-2xl bg-white px-8 py-3.5 text-sm font-extrabold text-[#05264E] hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.99] cursor-pointer"
          >
            {isFree ? "Upgrade Plan Now" : "Change / Upgrade Plan"}
          </button>

          {!isFree && sub?.status === "ACTIVE" && (
            <button
              onClick={onCancel}
              disabled={isCancelling}
              className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-red-500/20 hover:bg-red-500/30 px-6 py-3 text-xs font-bold text-red-200 transition-all border border-red-400/30 cursor-pointer disabled:opacity-50"
            >
              <FiAlertCircle />
              {isCancelling ? "Cancelling..." : "Cancel Subscription"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
