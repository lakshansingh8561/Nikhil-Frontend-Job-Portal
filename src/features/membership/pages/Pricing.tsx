import React, { useState } from "react";
import {
  useGetMembershipsQuery,
  useGetCurrentSubscriptionQuery,
} from "../api/membershipApi";
import type { IMembership } from "../types/membership.types";
import { MembershipCard } from "../components/MembershipCard";
import { UpgradeModal } from "../components/UpgradeModal";
import { PaymentStatusModal } from "../components/PaymentStatusModal";
import { useRazorpayCheckout } from "../hooks/useRazorpayCheckout";
import { FiCheckCircle, FiHelpCircle, FiZap } from "react-icons/fi";

export const Pricing: React.FC = () => {
  const { data: plans = [], isLoading: isLoadingPlans } = useGetMembershipsQuery();
  const { data: currentSubscription } = useGetCurrentSubscriptionQuery();

  const { startCheckout, modalStatus, errorMessage, currentPlan, closeModal } = useRazorpayCheckout();

  const [selectedPlan, setSelectedPlan] = useState<IMembership | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  const activePlanId = String(
    (currentSubscription?.subscription?.membershipId as any)?._id ||
    currentSubscription?.subscription?.membershipId ||
    (currentSubscription?.plan as any)?._id ||
    currentSubscription?.plan ||
    ""
  );

  const handleSelectPlan = (plan: IMembership) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleConfirmSubscribe = async (_planId: string) => {
    if (!selectedPlan) return;
    setIsModalOpen(false);
    startCheckout(selectedPlan);
  };

  return (
    <div className="relative min-h-screen bg-[#090514] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Top Right Laser Light Beam */}
      <div className="absolute top-0 right-0 w-[700px] h-[550px] bg-gradient-to-bl from-purple-500/40 via-indigo-600/30 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[450px] bg-gradient-to-tr from-indigo-900/30 via-purple-900/20 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-purple-950/80 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/20">
            <FiZap className="text-yellow-400 text-sm" /> 💎 Pricing
          </span>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Flexible Pricing Plans <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent">
              for Every Need
            </span>
          </h1>

          <p className="text-sm sm:text-base text-purple-200/80 font-medium leading-relaxed max-w-2xl mx-auto">
            Choose the plan that best fits your requirements and start optimizing your job search and career growth today!
          </p>

          {/* Billing Cycle Toggle Switch */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex items-center rounded-full bg-[#120A2B] p-1.5 border border-purple-900/40 shadow-2xl">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                    : "text-purple-300/70 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annually")}
                className={`px-5 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === "annually"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                    : "text-purple-300/70 hover:text-white"
                }`}
              >
                <span>Annually</span>
                <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Save up to 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoadingPlans ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[520px] rounded-3xl bg-[#0F0826]/80 p-8 border border-purple-900/30 shadow-2xl animate-pulse"
              >
                <div className="h-6 w-1/3 bg-purple-900/40 rounded-lg mb-4" />
                <div className="h-4 w-2/3 bg-purple-950/40 rounded-lg mb-8" />
                <div className="h-12 w-1/2 bg-purple-900/40 rounded-xl mb-8" />
                <div className="space-y-3 mb-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-purple-950/40 rounded-md w-full" />
                  ))}
                </div>
                <div className="h-12 bg-purple-900/40 rounded-2xl w-full mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          /* Membership Cards Grid */
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {plans.map((plan) => {
              const planIdStr = String(plan._id || plan.id || "");
              const isCurrent = Boolean(currentSubscription?.hasActiveSubscription) && planIdStr === activePlanId;
              
              // Apply discount indicator if annually selected
              const displayPlan = {
                ...plan,
                price: billingCycle === "annually" && plan.price > 0 ? Math.round(plan.price * 0.8) : plan.price,
              };

              return (
                <MembershipCard
                  key={planIdStr}
                  plan={displayPlan}
                  isCurrentPlan={isCurrent}
                  onSelect={handleSelectPlan}
                  isLoading={modalStatus !== "IDLE"}
                />
              );
            })}
          </div>
        )}

        {/* Guarantee Banner */}
        <div className="mt-20 rounded-3xl bg-gradient-to-r from-[#120A2B] via-[#1A0F3D] to-[#120A2B] p-8 sm:p-10 border border-purple-800/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold text-2xl border border-emerald-500/30 shadow-inner">
              <FiCheckCircle />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-white">
                30-Day Satisfaction Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-purple-200/70 font-medium mt-0.5">
                Cancel anytime with a single click. Instant feature activation with 256-bit encryption security.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-purple-300 bg-purple-950/80 px-4 py-2 rounded-xl border border-purple-800/40">
            <FiHelpCircle className="text-base text-purple-400" /> Need Custom Enterprise Limits? Contact Support
          </div>
        </div>

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plan={selectedPlan}
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
      </div>
    </div>
  );
};
