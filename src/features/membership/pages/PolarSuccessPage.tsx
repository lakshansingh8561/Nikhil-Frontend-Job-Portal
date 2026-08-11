import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGetPolarStatusQuery } from "../api/paymentApi";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { PaymentStatusModal } from "../components/PaymentStatusModal";

export const PolarSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const checkoutId = searchParams.get("checkout_id") || searchParams.get("checkoutId") || "";

  const { data, isLoading, isError, refetch } = useGetPolarStatusQuery(checkoutId, {
    skip: !checkoutId,
    pollingInterval: checkoutId ? 3000 : 0,
  });

  const isActivated = data?.isActivated || data?.status === "COMPLETED";

  const targetDashboard =
    user?.role === "RECRUITER"
      ? "/recruiter/membership"
      : user?.role === "JOB_SEEKER"
      ? "/job-seeker/membership"
      : "/membership";

  const modalStatus = isLoading || (!isActivated && !isError)
    ? "VERIFYING"
    : isActivated
    ? "SUCCESS"
    : "FAILED";

  const planName =
    data?.subscription?.planName ||
    data?.subscription?.membershipId?.name ||
    data?.payment?.membershipId?.name ||
    "Pro";

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-gray-50/50">
      <PaymentStatusModal
        isOpen={true}
        status={modalStatus}
        planName={planName}
        errorMessage="Polar Sandbox payment verification could not be completed."
        onClose={() => navigate(targetDashboard)}
        onRetry={() => refetch()}
      />
    </div>
  );
};
