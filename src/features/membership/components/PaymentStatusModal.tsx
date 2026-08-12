import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiXCircle,
  FiLoader,
  FiShield,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";
import { fireSuccessConfetti } from "../utils/fireSuccessConfetti";

interface PaymentStatusModalProps {
  isOpen: boolean;
  status: "IDLE" | "CREATING_ORDER" | "CHECKOUT_OPEN" | "VERIFYING" | "SUCCESS" | "FAILED";
  errorMessage?: string;
  planName?: string;
  amount?: number;
  currency?: string;
  orderId?: string;
  onClose: () => void;
  onRetry?: () => void;
}

export const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({
  isOpen,
  status,
  errorMessage = "Payment could not be completed.",
  planName = "Pro Plan",
  amount,
  currency = "INR",
  orderId,
  onClose,
  onRetry,
}) => {
  useEffect(() => {
    if (isOpen && status === "SUCCESS") {
      fireSuccessConfetti();
    }
  }, [isOpen, status]);

  if (!isOpen) return null;

  const isProcessing =
    status === "CREATING_ORDER" || status === "CHECKOUT_OPEN" || status === "VERIFYING";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto">
        {/* Dynamic Glowing Radial Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.25),transparent_70%)] pointer-events-none" />

        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#0D0B1E] border border-purple-500/30 p-6 sm:p-8 shadow-[0_0_80px_rgba(139,92,246,0.35)] text-center text-white"
        >
          {/* Top Laser Light Beam */}
          <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-purple-500/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-indigo-600/30 blur-3xl pointer-events-none" />

          {/* 1. PROCESSING STATE */}
          {isProcessing && (
            <div className="py-8 space-y-6">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-indigo-500"
                />
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-400 shadow-inner">
                  <FiLoader className="h-8 w-8 animate-spin" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-white">
                  {status === "CREATING_ORDER" && "Preparing Order..."}
                  {status === "CHECKOUT_OPEN" && "Opening Razorpay Gateway..."}
                  {status === "VERIFYING" && "Verifying Payment with Server..."}
                </h3>
                <p className="text-xs text-purple-200/80 max-w-xs mx-auto">
                  Please do not refresh or close this browser window while we confirm your payment securely.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-purple-950/60 px-4 py-2 text-xs font-semibold text-purple-300 border border-purple-800/40">
                <FiShield className="text-emerald-400 text-sm" /> 256-Bit SSL Encrypted Razorpay Gateway
              </div>
            </div>
          )}

          {/* 2. SUCCESS STATE */}
          {status === "SUCCESS" && (
            <div className="py-4 space-y-6">
              {/* Glowing Animated Checkmark Badge */}
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.6, times: [0, 0.7, 1] }}
                  className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md animate-pulse"
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-400/30"
                >
                  <FiCheckCircle className="h-10 w-10 stroke-[2.5]" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-950/80 rounded-full border border-emerald-500/40">
                  <FiZap className="text-emerald-400" /> Payment Successful
                </span>
                <h3 className="text-3xl font-black text-white tracking-tight">
                  Membership Activated! 🎉
                </h3>
                <p className="text-xs text-purple-200/90 max-w-sm mx-auto leading-relaxed">
                  Congratulations! You are now subscribed to the{" "}
                  <strong className="text-purple-300 font-bold">{planName}</strong>. All premium features and posting limits have been unlocked immediately!
                </p>
              </div>

              {/* Order Receipt Details Box */}
              <div className="rounded-2xl bg-purple-950/40 border border-purple-500/20 p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center text-purple-200/80">
                  <span>Activated Plan:</span>
                  <span className="font-bold text-white">{planName}</span>
                </div>
                {amount !== undefined && amount > 0 && (
                  <div className="flex justify-between items-center text-purple-200/80">
                    <span>Total Amount Paid:</span>
                    <span className="font-bold text-emerald-400">
                      ₹{amount} {currency}
                    </span>
                  </div>
                )}
                {orderId && (
                  <div className="flex justify-between items-center text-purple-200/80">
                    <span>Transaction Reference:</span>
                    <span className="font-mono text-[10px] text-purple-300">
                      {orderId.slice(0, 18)}...
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-purple-200/80 pt-1 border-t border-purple-800/30">
                  <span>Access Duration:</span>
                  <span className="font-bold text-indigo-300">Instant (30 Days Active)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 py-3.5 text-xs font-black tracking-wide text-white shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
                >
                  <span>Continue to Dashboard</span>
                  <FiArrowRight className="text-sm" />
                </button>
              </div>
            </div>
          )}

          {/* 3. FAILED STATE */}
          {status === "FAILED" && (
            <div className="py-6 space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-950/80 text-red-400 ring-8 ring-red-500/20 border border-red-500/30">
                <FiXCircle className="h-10 w-10" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-red-300 bg-red-950/80 rounded-full border border-red-500/40">
                  Transaction Failed
                </span>
                <h3 className="text-2xl font-black text-white">
                  Payment Could Not Be Completed
                </h3>
                <p className="text-xs text-red-300 bg-red-950/50 p-3 rounded-xl border border-red-500/30">
                  {errorMessage}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-lg hover:brightness-110 transition cursor-pointer"
                  >
                    Try Again
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 rounded-2xl border border-purple-800/40 bg-purple-950/40 py-3 text-xs font-bold text-purple-200 hover:bg-purple-900/40 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
