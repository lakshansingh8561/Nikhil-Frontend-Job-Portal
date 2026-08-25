import { useState } from "react";
import toast from "react-hot-toast";
import {
  useCreatePaymentOrderMutation,
  useVerifyPaymentMutation,
  useCreateRazorpaySubscriptionMutation,
  useVerifyRazorpaySubscriptionMutation,
} from "../api/paymentApi";
import { loadRazorpayScript } from "../utils/razorpay";
import type { IMembership } from "../types/membership.types";

export type PaymentModalState = "IDLE" | "CREATING_ORDER" | "CHECKOUT_OPEN" | "VERIFYING" | "SUCCESS" | "FAILED";

export const useRazorpayCheckout = () => {
  const [createPaymentOrder] = useCreatePaymentOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [createRazorpaySubscription] = useCreateRazorpaySubscriptionMutation();
  const [verifyRazorpaySubscription] = useVerifyRazorpaySubscriptionMutation();

  const [modalStatus, setModalStatus] = useState<PaymentModalState>("IDLE");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentPlan, setCurrentPlan] = useState<IMembership | null>(null);

  const startCheckout = async (plan: IMembership, billingCycle: "monthly" | "yearly" = "monthly") => {
    setCurrentPlan(plan);
    setErrorMessage("");

    try {
      setModalStatus("CREATING_ORDER");

      // Free Plan Path
      if (plan.price === 0) {
        const res = await createPaymentOrder({ membershipId: plan._id || plan.id || "", billingCycle }).unwrap();
        if (res.isFree) {
          setModalStatus("SUCCESS");
          toast.success("Free plan activated successfully! 🎉");
          return;
        }
      }

      // Load Razorpay Checkout Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay SDK. Please check your internet connection.");
      }

      // ── Try Razorpay Recurring Subscription API ──────────────────────────────
      let isSubscriptionFlow = false;
      let subscriptionData: any = null;
      let orderData: any = null;

      try {
        const subRes = await createRazorpaySubscription({
          membershipId: plan._id || plan.id || "",
          billingCycle,
        }).unwrap();

        if (subRes && subRes.subscriptionId) {
          isSubscriptionFlow = true;
          subscriptionData = subRes;
        }
      } catch (subErr: any) {
        console.warn("[Razorpay] Subscription API fallback to Order API:", subErr);
        // Fallback to standard Order API if subscription creation failed
        const orderRes = await createPaymentOrder({ membershipId: plan._id || plan.id || "", billingCycle }).unwrap();
        if (!orderRes.data) {
          throw new Error(subErr?.data?.message || subErr?.message || "Payment order creation failed.");
        }
        orderData = orderRes.data;
      }

      // Configure Razorpay Checkout Modal
      setModalStatus("CHECKOUT_OPEN");

      const keyId =
        (isSubscriptionFlow ? subscriptionData.keyId : orderData?.keyId) ||
        import.meta.env.VITE_RAZORPAY_KEY_ID ||
        "rzp_test_TMlkPEtyNc6Xi6";

      const options: any = {
        key: keyId,
        name: "JobBox Portal",
        description: `${plan.name} Plan Subscription`,
        image: "/logo.svg",
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id?: string;
          razorpay_order_id?: string;
          razorpay_signature: string;
        }) => {
          try {
            setModalStatus("VERIFYING");

            if (response.razorpay_subscription_id) {
              await verifyRazorpaySubscription({
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }).unwrap();
            } else {
              await verifyPayment({
                razorpay_order_id: response.razorpay_order_id!,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }).unwrap();
            }

            setModalStatus("SUCCESS");
            toast.success("Subscription payment verified & plan activated! 🎉");
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

      if (isSubscriptionFlow) {
        options.subscription_id = subscriptionData.subscriptionId;
      } else {
        options.amount = orderData.amount;
        options.currency = orderData.currency || "INR";
        options.order_id = orderData.orderId;
      }

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
