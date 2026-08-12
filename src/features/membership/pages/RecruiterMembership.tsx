import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  useGetRecruiterPlansQuery,
  useGetCurrentRecruiterPlanQuery,
  useCancelRecruiterMembershipMutation,
  useGetRecruiterHistoryQuery,
} from "../api/membershipApi";
import { useCreatePolarCheckoutMutation } from "../api/paymentApi";
import type { IMembership } from "../types/membership.types";
import { MembershipCard } from "../components/MembershipCard";
import { UpgradeModal } from "../components/UpgradeModal";
import { PaymentStatusModal } from "../components/PaymentStatusModal";
import { useRazorpayCheckout } from "../hooks/useRazorpayCheckout";
import {
  FiZap,
  FiCalendar,
  FiShield,
  FiBriefcase,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiXCircle,
} from "react-icons/fi";

const RECRUITER_PLAN_LEVELS: Record<string, number> = {
  Free: 1,
  Professional: 2,
  Enterprise: 3,
};

export const RecruiterMembership: React.FC = () => {
  const { data: plans = [], isLoading: isLoadingPlans } = useGetRecruiterPlansQuery();
  const { data: currentSub, isLoading: isLoadingSub } = useGetCurrentRecruiterPlanQuery();
  const { data: history = [], isLoading: isLoadingHistory } = useGetRecruiterHistoryQuery();

  const [cancelRecruiterMembership, { isLoading: isCancelling }] = useCancelRecruiterMembershipMutation();
  const [createPolarCheckout] = useCreatePolarCheckoutMutation();

  const { startCheckout, modalStatus, errorMessage, currentPlan, closeModal } = useRazorpayCheckout();

  const [selectedPlan, setSelectedPlan] = useState<IMembership | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  const hasSub = currentSub?.hasActiveSubscription;
  const sub = currentSub?.subscription;
  const currentPlanObj = currentSub?.plan;
  const currentPlanName = (sub?.planName || (currentPlanObj as any)?.name || "Free");
  const currentLevel = RECRUITER_PLAN_LEVELS[currentPlanName] || 1;

  const isFree = !hasSub || !sub || currentPlanName === "Free" || (currentPlanObj as any)?.price === 0;

  // Calculate remaining days
  const remainingDays = sub?.endDate
    ? Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 30;

  // ── Detect last expired subscription ──────────────────────────────────────
  const lastExpiredSub = !hasSub
    ? history.find((h) => h.status === "EXPIRED")
    : null;

  const lastExpiredPlanName = lastExpiredSub?.planName;
  const lastExpiredDate = lastExpiredSub?.endDate
    ? new Date(lastExpiredSub.endDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const expiredPlanObject = lastExpiredPlanName
    ? plans.find((p) => p.name === lastExpiredPlanName) ?? null
    : null;

  const handleSelectPlan = (planToSelect: IMembership) => {
    setSelectedPlan(planToSelect);
    setIsUpgradeModalOpen(true);
  };

  const handleRenewExpiredPlan = () => {
    if (expiredPlanObject) {
      handleSelectPlan(expiredPlanObject);
    } else {
      const paidPlan = plans.find((p) => p.price > 0);
      if (paidPlan) handleSelectPlan(paidPlan);
    }
  };

  const handleConfirmSubscribe = async (planId: string, gateway: "razorpay" | "polar" = "polar") => {
    if (!selectedPlan) return;
    setIsUpgradeModalOpen(false);

    if (selectedPlan.price === 0 || gateway === "razorpay") {
      startCheckout(selectedPlan);
    } else {
      const toastId = toast.loading("Creating Polar Sandbox Checkout...");
      try {
        const res = await createPolarCheckout({ membershipId: planId }).unwrap();
        toast.success("Redirecting to Polar Sandbox...", { id: toastId });
        if (res.checkoutUrl) {
          window.location.href = res.checkoutUrl;
        } else {
          toast.error("Polar Checkout URL not received.", { id: toastId });
        }
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to create Polar checkout.", { id: toastId });
      }
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your recruiter subscription?")) return;
    try {
      await cancelRecruiterMembership().unwrap();
      toast.success("Recruiter Subscription Cancelled.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel subscription.");
    }
  };

  // Calculate upgrade preview breakdown
  const getUpgradePreview = (targetPlan: IMembership | null) => {
    if (!targetPlan || !hasSub || !sub || targetPlan.price === 0) return null;
    const targetLevel = RECRUITER_PLAN_LEVELS[targetPlan.name] || 1;
    if (targetLevel <= currentLevel) return null;

    const now = new Date();
    const endDate = sub.endDate ? new Date(sub.endDate) : null;
    if (!endDate || endDate <= now) return null;

    const remainingMs = endDate.getTime() - now.getTime();
    const remDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
    const oldDailyPrice = (sub.amount || (currentPlanObj as any)?.price || 0) / 30;
    const unusedCredit = Math.round(oldDailyPrice * remDays);
    const finalUpgradePrice = Math.max(0, Math.round(targetPlan.price - unusedCredit));

    return {
      isUpgrade: true,
      unusedCredit,
      finalUpgradePrice,
      currency: targetPlan.currency || "INR",
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10 pb-12"
    >
      {/* Top Banner / Current Plan Card */}
      {isLoadingSub ? (
        <div className="h-56 rounded-3xl bg-gray-200 animate-pulse w-full" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#05264E] via-[#0F396E] to-[#3C65F5] p-8 text-white shadow-xl"
        >
          {/* Decorative Blur Effects */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Plan Details */}
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-yellow-300 border border-white/10 shadow-inner">
                  <FiZap className="text-2xl fill-yellow-300" />
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    Recruiter Subscription Status
                  </span>
                  <h2 className="text-3xl font-black tracking-tight text-white">
                    {sub?.planName || (currentPlanObj as any)?.name || "Free Tier"}
                  </h2>
                </div>
              </div>

              <p className="text-sm text-blue-100/90 font-medium leading-relaxed">
                {(currentPlanObj as any)?.description || "Essential features to post jobs and view candidate applications."}
              </p>

              {/* Status & Metrics Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-blue-100 pt-1">
                <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-1.5 backdrop-blur-xs border border-white/10">
                  <FiShield className="text-emerald-400 text-sm" />
                  Status: <strong className="text-white uppercase font-bold">{sub?.status || "ACTIVE"}</strong>
                </span>
                <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-1.5 backdrop-blur-xs border border-white/10">
                  <FiCalendar className="text-blue-300 text-sm" />
                  Remaining: <strong className="text-white font-bold">{remainingDays} Days</strong>
                </span>
                <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-1.5 backdrop-blur-xs border border-white/10">
                  <FiBriefcase className="text-yellow-300 text-sm" />
                  Active Jobs Posted:{" "}
                  <strong className="text-white font-bold">
                    {currentSub?.activeJobsCount || 0} / {currentSub?.maxActiveJobs || (isFree ? 3 : "Unlimited")}
                  </strong>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => {
                  const higherPlan = plans.find((p) => (RECRUITER_PLAN_LEVELS[p.name] || 1) > currentLevel);
                  if (higherPlan) handleSelectPlan(higherPlan);
                }}
                className="rounded-2xl bg-white px-8 py-3.5 text-xs font-extrabold text-[#05264E] hover:bg-blue-50 transition-all duration-200 shadow-md active:scale-[0.99] cursor-pointer"
              >
                {isFree ? "Upgrade Recruiter Plan" : "Change / Upgrade Plan"}
              </button>

              {!isFree && sub?.status === "ACTIVE" && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                  className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-red-500/20 hover:bg-red-500/30 px-6 py-3 text-xs font-bold text-red-100 transition-all border border-red-400/30 cursor-pointer disabled:opacity-50"
                >
                  <FiAlertCircle />
                  {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Expired Membership Banner ──────────────────────────────────── */}
      <AnimatePresence>
        {!isLoadingSub && !hasSub && lastExpiredSub && (
          <motion.div
            key="recruiter-expired-banner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 p-6 sm:p-8 shadow-sm"
          >
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-red-200/40 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-orange-200/30 blur-2xl" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 shadow-inner">
                  <FiXCircle className="text-2xl" />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-red-500 mb-1">
                    Recruiter Plan Expired
                  </p>
                  <h3 className="text-xl font-black text-red-800">
                    Your <span className="text-red-600">{lastExpiredPlanName}</span> plan has ended
                  </h3>
                  {lastExpiredDate && (
                    <p className="mt-1 text-sm font-medium text-red-700/80">
                      Expired on <strong>{lastExpiredDate}</strong>. Renew to post unlimited jobs and access premium features.
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleRenewExpiredPlan}
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-red-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-md hover:bg-red-700 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <FiRefreshCw className="text-base" />
                Renew Plan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recruiter Plans Grid Header & Toggle */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#05264E] tracking-tight">
              Recruiter Membership Plans
            </h3>
            <p className="text-xs sm:text-sm font-medium text-[#66789C] mt-1">
              Scale your hiring with job postings, candidate search, and AI candidate matching.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center rounded-full bg-[#F0F4FC] p-1.5 border border-[#EAEFF7] shrink-0">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#3C65F5] text-white shadow-sm"
                  : "text-[#66789C] hover:text-[#05264E]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === "annually"
                  ? "bg-[#3C65F5] text-white shadow-sm"
                  : "text-[#66789C] hover:text-[#05264E]"
              }`}
            >
              <span>Annually</span>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {isLoadingPlans ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-white p-6 border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
            {plans.map((planItem) => {
              const planLevel = RECRUITER_PLAN_LEVELS[planItem.name] || 1;
              const isCurrent = Boolean(hasSub && currentPlanName === planItem.name);
              const isHigherPlanActive = Boolean(hasSub && currentLevel > planLevel);
              const isUpgrade = Boolean(hasSub && planLevel > currentLevel);

              const displayPlan = {
                ...planItem,
                price: billingCycle === "annually" && planItem.price > 0 ? Math.round(planItem.price * 0.8) : planItem.price,
              };

              return (
                <MembershipCard
                  key={planItem._id || planItem.name}
                  plan={displayPlan}
                  isCurrentPlan={isCurrent}
                  isHigherPlanActive={isHigherPlanActive}
                  isUpgrade={isUpgrade}
                  onSelect={handleSelectPlan}
                  isLoading={modalStatus !== "IDLE"}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Subscription Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-8 shadow-xs"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5]">
              <FiClock className="text-xl" />
            </div>
            <div>
              <h4 className="text-lg font-black text-[#05264E]">
                Recruiter Billing History
              </h4>
              <p className="text-xs text-gray-500 font-medium">
                Review all past recruiter subscriptions and payment receipts.
              </p>
            </div>
          </div>
        </div>

        {isLoadingHistory ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <FiAlertTriangle className="mx-auto text-2xl text-gray-400 mb-2" />
            <p className="text-sm font-semibold text-gray-600">No recruiter subscription history found</p>
            <p className="text-xs text-gray-400 mt-1">Upgrade to Professional or Enterprise to expand your hiring power.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-[#05264E]/70 uppercase tracking-wider">
                  <th className="pb-3">Plan Name</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Start Date</th>
                  <th className="pb-3">End Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((hSub) => (
                  <tr key={hSub._id || hSub.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 font-bold text-[#05264E]">{hSub.planName}</td>
                    <td className="py-4 font-extrabold text-[#3C65F5]">
                      {hSub.amount === 0 ? "Free" : `₹${hSub.amount} ${hSub.currency}`}
                    </td>
                    <td className="py-4 text-xs font-medium text-gray-600">
                      {new Date(hSub.startDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-4 text-xs font-medium text-gray-600">
                      {new Date(hSub.endDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                          hSub.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : hSub.status === "CANCELLED"
                            ? "bg-amber-100 text-amber-700"
                            : hSub.status === "EXPIRED"
                            ? "bg-red-100 text-red-700"
                            : hSub.status === "PENDING"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <FiCheckCircle className="text-xs" /> {hSub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        plan={selectedPlan}
        currentPlanName={currentPlanName}
        upgradePreview={getUpgradePreview(selectedPlan)}
        onConfirm={handleConfirmSubscribe}
        isLoading={modalStatus !== "IDLE"}
      />

      {/* Razorpay Payment Status Modal with Confetti Celebration */}
      <PaymentStatusModal
        isOpen={modalStatus !== "IDLE"}
        status={modalStatus}
        errorMessage={errorMessage}
        planName={currentPlan?.name}
        amount={currentPlan?.price}
        currency={currentPlan?.currency || "INR"}
        onClose={closeModal}
        onRetry={() => {
          if (currentPlan) startCheckout(currentPlan);
        }}
      />
    </motion.div>
  );
};
