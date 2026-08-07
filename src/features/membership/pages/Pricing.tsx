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
import { FiCheckCircle, FiShield, FiHelpCircle } from "react-icons/fi";

export const Pricing: React.FC = () => {
  const { data: plans = [], isLoading: isLoadingPlans } = useGetMembershipsQuery();
  const { data: currentSubscription } = useGetCurrentSubscriptionQuery();

  const { startCheckout, modalStatus, errorMessage, currentPlan, closeModal } = useRazorpayCheckout();

  const [selectedPlan, setSelectedPlan] = useState<IMembership | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#3C65F5] border border-blue-100 mb-4 shadow-2xs">
            <FiShield className="text-sm" /> Simple, Transparent Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-[#05264E] tracking-tight">
            Supercharge Your Job Search & Career Growth
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-500 font-medium leading-relaxed">
            Unlock AI resume optimization, priority recruiter search ranking, unlimited job applications, and personalized career roadmaps.
          </p>
        </div>

        {/* Loading Skeleton */}
        {isLoadingPlans ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[520px] rounded-3xl bg-white p-8 border border-gray-200 shadow-xs animate-pulse"
              >
                <div className="h-6 w-1/3 bg-gray-200 rounded-lg mb-4" />
                <div className="h-4 w-2/3 bg-gray-100 rounded-lg mb-8" />
                <div className="h-12 w-1/2 bg-gray-200 rounded-xl mb-8" />
                <div className="space-y-3 mb-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-gray-100 rounded-md w-full" />
                  ))}
                </div>
                <div className="h-12 bg-gray-200 rounded-2xl w-full mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          /* Membership Cards Grid */
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            {plans.map((plan) => {
              const planIdStr = String(plan._id || plan.id || "");
              const isCurrent = Boolean(currentSubscription?.hasActiveSubscription) && planIdStr === activePlanId;
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

        {/* Guarantee Banner */}
        <div className="mt-20 rounded-3xl bg-white p-8 sm:p-10 border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 font-bold text-2xl border border-emerald-100">
              <FiCheckCircle />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-[#05264E]">
                30-Day Satisfaction Guarantee
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                Cancel anytime with a single click. No hidden fees or lock-in contracts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#3C65F5]">
            <FiHelpCircle className="text-base" /> Need custom enterprise plan? Contact Sales
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
    </div>
  );
};
