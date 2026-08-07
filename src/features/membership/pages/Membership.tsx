import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  useGetMembershipsQuery,
  useGetCurrentSubscriptionQuery,
  useCancelSubscriptionMutation,
  useGetSubscriptionHistoryQuery,
} from "../api/membershipApi";
import type { IMembership } from "../types/membership.types";
import { CurrentPlanCard } from "../components/CurrentPlanCard";
import { MembershipCard } from "../components/MembershipCard";
import { UpgradeModal } from "../components/UpgradeModal";
import { PaymentStatusModal } from "../components/PaymentStatusModal";
import { useRazorpayCheckout } from "../hooks/useRazorpayCheckout";
import { FiClock, FiCheckCircle, FiShield, FiAlertTriangle } from "react-icons/fi";

export const Membership: React.FC = () => {
  const { data: plans = [], isLoading: isLoadingPlans } = useGetMembershipsQuery();
  const { data: currentSub, isLoading: isLoadingSub } = useGetCurrentSubscriptionQuery();
  const { data: history = [], isLoading: isLoadingHistory } = useGetSubscriptionHistoryQuery();

  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();

  const { startCheckout, modalStatus, errorMessage, currentPlan, closeModal } = useRazorpayCheckout();

  const [selectedPlan, setSelectedPlan] = useState<IMembership | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const activePlanId = String(
    (currentSub?.subscription?.membershipId as any)?._id ||
    currentSub?.subscription?.membershipId ||
    (currentSub?.plan as any)?._id ||
    currentSub?.plan ||
    ""
  );

  const handleSelectPlan = (plan: IMembership) => {
    setSelectedPlan(plan);
    setIsUpgradeModalOpen(true);
  };

  const handleConfirmSubscribe = async (_planId: string) => {
    if (!selectedPlan) return;
    setIsUpgradeModalOpen(false);
    startCheckout(selectedPlan);
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

  return (
    <div className="space-y-10 pb-12">
      {/* Top Banner & Current Plan Status */}
      {isLoadingSub ? (
        <div className="h-56 rounded-3xl bg-gray-200 animate-pulse w-full" />
      ) : (
        <CurrentPlanCard
          currentSubscription={currentSub}
          onUpgrade={() => {
            const firstPaidPlan = plans.find((p) => p.price > 0) || plans[0];
            if (firstPaidPlan) handleSelectPlan(firstPaidPlan);
          }}
          onCancel={handleCancelSubscription}
          isCancelling={isCancelling}
        />
      )}

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
            {plans.map((plan) => {
              const planIdStr = String(plan._id || plan.id || "");
              const isCurrent = Boolean(currentSub?.hasActiveSubscription) && planIdStr === activePlanId;
              return (
                <MembershipCard
                  key={planIdStr}
                  plan={plan}
                  isCurrentPlan={isCurrent}
                  onSelect={handleSelectPlan}
                  isLoading={modalStatus !== "IDLE"}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Subscription History Section */}
      <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-8 shadow-xs">
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
                {history.map((sub) => (
                  <tr key={sub._id || sub.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 font-bold text-[#05264E]">{sub.planName}</td>
                    <td className="py-4 font-extrabold text-[#3C65F5]">
                      {sub.amount === 0 ? "Free" : `₹${sub.amount} ${sub.currency}`}
                    </td>
                    <td className="py-4 text-xs font-medium text-gray-600">
                      {new Date(sub.startDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-4 text-xs font-medium text-gray-600">
                      {new Date(sub.endDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                          sub.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-700"
                            : sub.status === "CANCELLED"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <FiCheckCircle className="text-xs" /> {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upgrade Confirmation Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        plan={selectedPlan}
        onConfirm={handleConfirmSubscribe}
        isLoading={modalStatus !== "IDLE"}
      />

      {/* Razorpay Payment Status Modal */}
      <PaymentStatusModal
        isOpen={modalStatus !== "IDLE"}
        status={modalStatus}
        errorMessage={errorMessage}
        planName={currentPlan?.name}
        onClose={closeModal}
        onRetry={() => {
          if (currentPlan) startCheckout(currentPlan);
        }}
      />
    </div>
  );
};
