import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGetPolarStatusQuery } from "../api/paymentApi";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { PaymentStatusModal } from "../components/PaymentStatusModal";

export const PolarSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const checkoutId = searchParams.get("checkout_id") || searchParams.get("checkoutId") || "";

  const [hasTimedOut, setHasTimedOut] = useState(false);

  const { data, isLoading, isError, refetch } = useGetPolarStatusQuery(checkoutId, {
    skip: !checkoutId || hasTimedOut,
    pollingInterval: checkoutId && !hasTimedOut ? 3000 : 0,
  });

  const isActivated = data?.isActivated || data?.status === "COMPLETED";

  // Polling timeout: If not activated after 15 seconds, stop polling and present retry option
  useEffect(() => {
    if (isActivated || isError || hasTimedOut) return;

    const timer = setTimeout(() => {
      setHasTimedOut(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [isActivated, isError, hasTimedOut]);

  const targetDashboard =
    user?.role === "RECRUITER"
      ? "/recruiter/membership"
      : user?.role === "JOB_SEEKER"
        ? "/job-seeker/membership"
        : "/membership";

  const modalStatus = isActivated
    ? "SUCCESS"
    : isLoading || (!isActivated && !isError && !hasTimedOut)
      ? "VERIFYING"
      : "FAILED";

  const planName =
    data?.subscription?.planName ||
    data?.subscription?.membershipId?.name ||
    data?.payment?.membershipId?.name ||
    "Pro";

  const handleRetry = () => {
    setHasTimedOut(false);
    refetch();
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-gray-50/50">
      <PaymentStatusModal
        isOpen={true}
        status={modalStatus}
        planName={planName}
        errorMessage={
          hasTimedOut
            ? "Polar payment verification is pending. If you completed payment in Polar, click 'Try Again' to re-verify."
            : "Polar Sandbox payment verification could not be completed."
        }
        onClose={() => navigate(targetDashboard)}
        onRetry={handleRetry}
      />
    </div>
  );
};
