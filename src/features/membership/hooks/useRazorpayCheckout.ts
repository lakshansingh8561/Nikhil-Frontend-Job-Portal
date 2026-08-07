import { useState } from "react";
import toast from "react-hot-toast";
import { useCreatePaymentOrderMutation, useVerifyPaymentMutation } from "../api/paymentApi";
import { loadRazorpayScript } from "../utils/razorpay";
import type { IMembership } from "../types/membership.types";

export type PaymentModalState = "IDLE" | "CREATING_ORDER" | "CHECKOUT_OPEN" | "VERIFYING" | "SUCCESS" | "FAILED";

export const useRazorpayCheckout = () => {
  const [createPaymentOrder] = useCreatePaymentOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const [modalStatus, setModalStatus] = useState<PaymentModalState>("IDLE");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentPlan, setCurrentPlan] = useState<IMembership | null>(null);

  const startCheckout = async (plan: IMembership) => {
    setCurrentPlan(plan);
    setErrorMessage("");

    try {
      setModalStatus("CREATING_ORDER");

      // 1. Backend Create Razorpay Order
      const res = await createPaymentOrder({ membershipId: plan._id || plan.id || "" }).unwrap();

      // Free Plan Path
      if (res.isFree) {
        setModalStatus("SUCCESS");
        toast.success("Free plan activated successfully! 🎉");
        return;
      }

      if (!res.data) {
        throw new Error("Invalid order data received from server.");
      }

      // 2. Load Razorpay Checkout Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK. Please check your internet connection.");
      }

      // 3. Configure Razorpay Standard Checkout
      setModalStatus("CHECKOUT_OPEN");
      const { orderId, amount, currency, keyId } = res.data;

      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TMlkPEtyNc6Xi6",
        amount,
        currency: currency || "INR",
        name: "JobBox Portal",
        description: `${plan.name} Plan Subscription`,
        image: "/logo.svg",
        order_id: orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // 4. Server-Side HMAC Signature Verification
          try {
            setModalStatus("VERIFYING");
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            setModalStatus("SUCCESS");
            toast.success("Payment verified! Membership activated 🎉");
          } catch (verifyErr: any) {
            setModalStatus("FAILED");
            setErrorMessage(verifyErr?.data?.message || "Server verification failed for payment signature.");
          }
        },
        modal: {
          ondismiss: () => {
            setModalStatus("FAILED");
            setErrorMessage("Payment checkout was closed before completion.");
          },
        },
        prefill: {},
        theme: {
          color: "#3C65F5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setModalStatus("FAILED");
        setErrorMessage(response.error?.description || "Payment attempt failed.");
      });
      rzp.open();
    } catch (err: any) {
      setModalStatus("FAILED");
      setErrorMessage(err?.data?.message || err?.message || "Payment initiation failed.");
    }
  };

  const closeModal = () => {
    setModalStatus("IDLE");
    setErrorMessage("");
  };

  return {
    startCheckout,
    modalStatus,
    errorMessage,
    currentPlan,
    closeModal,
  };
};
