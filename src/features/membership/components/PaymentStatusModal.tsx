import React from "react";
import { FiCheckCircle, FiXCircle, FiLoader, FiShield, FiArrowRight } from "react-icons/fi";

interface PaymentStatusModalProps {
  isOpen: boolean;
  status: "IDLE" | "CREATING_ORDER" | "CHECKOUT_OPEN" | "VERIFYING" | "SUCCESS" | "FAILED";
  errorMessage?: string;
  planName?: string;
  onClose: () => void;
  onRetry?: () => void;
}

export const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({
  isOpen,
  status,
  errorMessage = "Payment could not be completed.",
  planName = "Pro Plan",
  onClose,
  onRetry,
}) => {
  if (!isOpen) return null;

  const isProcessing = status === "CREATING_ORDER" || status === "CHECKOUT_OPEN" || status === "VERIFYING";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl transition-all text-center">
        {isProcessing && (
          <div className="py-6 space-y-5">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-[#3C65F5] ring-8 ring-blue-500/10">
              <FiLoader className="h-10 w-10 animate-spin" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-[#05264E]">
                {status === "CREATING_ORDER" && "Preparing Order..."}
                {status === "CHECKOUT_OPEN" && "Opening Razorpay Checkout..."}
                {status === "VERIFYING" && "Verifying Payment with Server..."}
              </h3>
              <p className="text-xs text-[#66789C]">
                Please do not refresh or close this browser window.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8FAFC] text-[11px] font-semibold text-[#3C65F5]">
              <FiShield /> Secured by Razorpay 256-bit Encryption
            </div>
          </div>
        )}

        {status === "SUCCESS" && (
          <div className="py-4 space-y-6 animate-scaleUp">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-500/10">
              <FiCheckCircle className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 rounded-full">
                Payment Verified
              </span>
              <h3 className="text-2xl font-black text-[#05264E]">
                Membership Activated! 🎉
              </h3>
              <p className="text-xs text-[#66789C]">
                Congratulations! You are now subscribed to the <strong className="text-[#3C65F5]">{planName}</strong>. All plan features and usage limits have been unlocked immediately.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#3C65F5] py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#254BD6] hover:shadow-lg transition cursor-pointer"
            >
              <span>Continue to Dashboard</span>
              <FiArrowRight />
            </button>
          </div>
        )}

        {status === "FAILED" && (
          <div className="py-4 space-y-6 animate-scaleUp">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-500/10">
              <FiXCircle className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-100/80 rounded-full">
                Transaction Failed
              </span>
              <h3 className="text-xl font-bold text-[#05264E]">
                Payment Could Not Be Completed
              </h3>
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                {errorMessage}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex-1 rounded-2xl bg-[#3C65F5] py-3 text-xs font-bold text-white shadow-md hover:bg-[#254BD6] transition cursor-pointer"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 text-xs font-bold text-[#05264E] hover:bg-gray-100 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
