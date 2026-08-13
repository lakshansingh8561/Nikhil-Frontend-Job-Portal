import React from "react";
import { FiZap, FiCalendar, FiShield, FiAlertCircle, FiClock, FiRefreshCw } from "react-icons/fi";
import type { CurrentSubscriptionResponse } from "../types/membership.types";

interface CurrentPlanCardProps {
  currentSubscription: CurrentSubscriptionResponse | undefined;
  onUpgrade: () => void;
  onCancel: () => void;
  onReactivate?: () => void;
  isCancelling?: boolean;
  isReactivating?: boolean;
}

export const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
  currentSubscription,
  onUpgrade,
  onCancel,
  onReactivate,
  isCancelling = false,
  isReactivating = false,
}) => {
  const hasSub = currentSubscription?.hasActiveSubscription;
  const sub = currentSubscription?.subscription;
  const plan = currentSubscription?.plan;

  const isFree = !hasSub || !sub || sub.planName === "Free" || (plan as any)?.price === 0;

  const now = new Date();
  const startDate = sub?.startDate ? new Date(sub.startDate) : null;
  const endDateStr = sub?.endDate || sub?.currentPeriodEnd;
  const endDate = endDateStr ? new Date(endDateStr) : null;

  const formattedStartDate = startDate
    ? startDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  const formattedEndDate = endDate
    ? endDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
    : "Lifetime";

  const daysRemaining = endDate
    ? Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : null;

  const isExpiringSoon = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 3;
  const isExpired = daysRemaining !== null && daysRemaining === 0;

  const priceVal = sub?.amount ?? (plan as any)?.price ?? 0;
  const currencySymbol = sub?.currency === "INR" ? "₹" : "$";
  const billingCycle = sub?.billingCycle || "monthly";
  const isAutoPayActive = !sub?.cancelAtPeriodEnd;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-[#EAEFF7] p-8 text-[#05264E] shadow-xs">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Plan Info */}
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-inner">
              <FiZap className="text-xl fill-yellow-400" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#66789C]">
                Current Subscription
              </span>
              <h2 className="text-3xl font-black tracking-tight text-[#05264E] flex items-center gap-2">
                {sub?.planName || (plan as any)?.name || "Free Tier"}
                {!isFree && (
                  <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full">
                    {currencySymbol}{priceVal} / {billingCycle}
                  </span>
                )}
              </h2>
            </div>
          </div>

          <p className="text-sm text-[#66789C] font-normal leading-relaxed">
            {(plan as any)?.description || "Enjoy essential tools to build your career."}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#66789C] pt-2">
            <span className="flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3 py-1.5 border border-[#EAEFF7]">
              <FiShield className="text-emerald-600 text-sm" />
              Status: <strong className="text-[#05264E] uppercase font-bold">{isExpired ? "EXPIRED" : sub?.status || "ACTIVE"}</strong>
            </span>

            {!isFree && (
              <span className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 border font-bold ${
                isAutoPayActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
                <FiRefreshCw className="text-xs" />
                AutoPay: {isAutoPayActive ? "Active (Auto-renews)" : "Cancelled (Ends on period end)"}
              </span>
            )}

            {startDate && (
              <span className="flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3 py-1.5 border border-[#EAEFF7]">
                <FiCalendar className="text-[#3C65F5] text-sm" />
                Started: <strong className="text-[#05264E] font-bold">{formattedStartDate}</strong>
              </span>
            )}

            {endDate && (
              <span className="flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3 py-1.5 border border-[#EAEFF7]">
                <FiCalendar className="text-[#3C65F5] text-sm" />
                Period End: <strong className="text-[#05264E] font-bold">{formattedEndDate}</strong>
              </span>
            )}

            {daysRemaining !== null && !isFree && (
              <span
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 border font-bold ${
                  isExpiringSoon
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : isExpired
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-blue-50 text-[#3C65F5] border-blue-200"
                }`}
              >
                <FiClock className="text-sm" />
                {isExpired
                  ? "Subscription Expired"
                  : isExpiringSoon
                  ? `Expires in ${daysRemaining} day${daysRemaining > 1 ? "s" : ""}`
                  : `${daysRemaining} Days Remaining`}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <button
            onClick={onUpgrade}
            className="rounded-2xl bg-[#3C65F5] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#254BD6] transition-all duration-200 shadow-md active:scale-[0.99] cursor-pointer"
          >
            {isFree ? "Upgrade Plan Now" : isExpired ? "Renew Plan Now" : "Change / Upgrade Plan"}
          </button>

          {!isFree && sub?.status === "ACTIVE" && !isExpired && (
            isAutoPayActive ? (
              <button
                onClick={onCancel}
                disabled={isCancelling}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-red-50 hover:bg-red-100 px-6 py-3 text-xs font-bold text-red-600 transition-all border border-red-200 cursor-pointer disabled:opacity-50"
              >
                <FiAlertCircle />
                {isCancelling ? "Cancelling..." : "Cancel AutoPay"}
              </button>
            ) : (
              <button
                onClick={onReactivate}
                disabled={isReactivating}
                className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 px-6 py-3 text-xs font-bold text-emerald-700 transition-all border border-emerald-200 cursor-pointer disabled:opacity-50 shadow-xs"
              >
                <FiRefreshCw />
                {isReactivating ? "Reactivating..." : "Reactivate AutoPay"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
