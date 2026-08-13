import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  useGetMembershipsQuery,
  useGetCurrentSubscriptionQuery,
  useCancelSubscriptionMutation,
  useGetSubscriptionHistoryQuery,
  useReactivateAutopayMutation,
} from "../api/membershipApi";
import { useCreatePolarCheckoutMutation } from "../api/paymentApi";
import type { IMembership } from "../types/membership.types";
import { CurrentPlanCard } from "../components/CurrentPlanCard";
import { MembershipCard } from "../components/MembershipCard";
import { UpgradeModal } from "../components/UpgradeModal";
import { PaymentStatusModal } from "../components/PaymentStatusModal";
import { useRazorpayCheckout } from "../hooks/useRazorpayCheckout";
import { FiClock, FiShield, FiAlertTriangle, FiRefreshCw, FiXCircle } from "react-icons/fi";

const JOB_SEEKER_PLAN_LEVELS: Record<string, number> = {
  Free: 1,
  Pro: 2,
  Premium: 3,
};

export const Membership: React.FC = () => {
  const { data: plans = [], isLoading: isLoadingPlans } = useGetMembershipsQuery();
  const { data: currentSub, isLoading: isLoadingSub } = useGetCurrentSubscriptionQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: history = [], isLoading: isLoadingHistory } = useGetSubscriptionHistoryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();
  const [reactivateAutopay, { isLoading: isReactivating }] = useReactivateAutopayMutation();
  const [createPolarCheckout] = useCreatePolarCheckoutMutation();

  const { startCheckout, modalStatus, errorMessage, currentPlan, closeModal } = useRazorpayCheckout();

  const [selectedPlan, setSelectedPlan] = useState<IMembership | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const hasActiveSub = currentSub?.hasActiveSubscription;
  const sub = currentSub?.subscription;
  const currentPlanObj = currentSub?.plan;
  const currentPlanName = (sub?.planName || (currentPlanObj as any)?.name || "Free");
  const currentLevel = JOB_SEEKER_PLAN_LEVELS[currentPlanName] || 1;

  // ── Detect last expired subscription ──────────────────────────────────────
  const lastExpiredSub = !hasActiveSub
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

  // Find the plan object matching the expired plan so user can re-subscribe directly
  const expiredPlanObject = lastExpiredPlanName
    ? plans.find((p) => p.name === lastExpiredPlanName) ?? null
    : null;

  const handleSelectPlan = (plan: IMembership) => {
    setSelectedPlan(plan);
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
    if (!window.confirm("Are you sure you want to cancel your active subscription?")) return;
    try {
      await cancelSubscription().unwrap();
      toast.success("Subscription Cancelled Successfully.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to cancel subscription.");
    }
  };

  const handleReactivateAutoPay = async () => {
    try {
      await reactivateAutopay().unwrap();
      toast.success("AutoPay reactivated! Your subscription will auto-renew 🎉");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reactivate AutoPay.");
    }
  };

  const getUpgradePreview = (targetPlan: IMembership | null) => {
    if (!targetPlan || !hasActiveSub || !sub || targetPlan.price === 0) return null;
    const targetLevel = JOB_SEEKER_PLAN_LEVELS[targetPlan.name] || 1;
    if (targetLevel <= currentLevel) return null;

    const now = new Date();
    const endDate = sub.endDate ? new Date(sub.endDate) : null;
    if (!endDate || endDate <= now) return null;

    const remainingMs = endDate.getTime() - now.getTime();
    const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
    const oldDailyPrice = (sub.amount || (currentPlanObj as any)?.price || 0) / 30;
    const unusedCredit = Math.round(oldDailyPrice * remainingDays);
    const finalUpgradePrice = Math.max(0, Math.round(targetPlan.price - unusedCredit));

    return {
      isUpgrade: true,
      unusedCredit,
      finalUpgradePrice,
      currency: targetPlan.currency || "INR",
    };
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-amber-100 text-amber-700",
    EXPIRED: "bg-red-100 text-red-700",
    PENDING: "bg-blue-100 text-blue-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10 pb-12"
    >
      {/* Top Banner & Current Plan Status */}
      {isLoadingSub ? (
        <div className="h-56 rounded-3xl bg-gray-200 animate-pulse w-full" />
      ) : (
        <CurrentPlanCard
          currentSubscription={currentSub}
          onUpgrade={() => {
            const higherPlan = plans.find((p) => (JOB_SEEKER_PLAN_LEVELS[p.name] || 1) > currentLevel);
            if (higherPlan) handleSelectPlan(higherPlan);
          }}
          onCancel={handleCancelSubscription}
          onReactivate={handleReactivateAutoPay}
          isCancelling={isCancelling}
          isReactivating={isReactivating}
        />
      )}

      {/* ── Expired Membership Banner ──────────────────────────────────── */}
      <AnimatePresence>
        {!isLoadingSub && !hasActiveSub && lastExpiredSub && (
          <motion.div
            key="expired-banner"
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
                    Membership Expired
                  </p>
                  <h3 className="text-xl font-black text-red-800">
                    Your <span className="text-red-600">{lastExpiredPlanName}</span> plan has ended
                  </h3>
                  {lastExpiredDate && (
                    <p className="mt-1 text-sm font-medium text-red-700/80">
                      Expired on <strong>{lastExpiredDate}</strong>. Renew now to restore all premium features.
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleRenewExpiredPlan}
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-red-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-md hover:bg-red-700 active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <FiRefreshCw className="text-base" />
                Renew Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available Plans Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-[#05264E] tracking-tight">
              Membership Plans & Upgrades
            </h3>
            <p className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5">
              Select the plan that matches your career goals.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-[#3C65F5] border border-blue-100">
            <FiShield /> Instant Activation
          </span>
        </div>

        {isLoadingPlans ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-white p-6 border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((planItem) => {
              const planLevel = JOB_SEEKER_PLAN_LEVELS[planItem.name] || 1;
              const isCurrent = Boolean(hasActiveSub && currentPlanName === planItem.name);
              const isHigherPlanActive = Boolean(hasActiveSub && currentLevel > planLevel);
              const isUpgrade = Boolean(hasActiveSub && planLevel > currentLevel);

              return (
                <MembershipCard
                  key={planItem._id || planItem.name}
                  plan={planItem}
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

      {/* Subscription History Section */}
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
              <h4 className="text-lg font-extrabold text-[#05264E]">
                Subscription Billing History
              </h4>
              <p className="text-xs text-gray-500 font-medium">
                Track all past plans, invoices, and active periods.
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
            <p className="text-sm font-semibold text-gray-600">No subscription history found</p>
            <p className="text-xs text-gray-400 mt-1">Upgrade to a Pro or Premium plan to get started.</p>
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
                      {hSub.amount === 0 ? "Free" : `${hSub.currency === "INR" ? "₹" : "$"}${hSub.amount} ${hSub.currency}`}
                    </td>
                    <td className="py-4 text-xs font-medium text-gray-600">
                      {new Date(hSub.startDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-4 text-xs font-medium text-gray-600">
                      {new Date(hSub.endDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${statusColors[hSub.status] ?? "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {hSub.status}
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
