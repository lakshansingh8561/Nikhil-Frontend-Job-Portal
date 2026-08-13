import React from "react";
import { useGetPaymentHistoryQuery } from "../api/paymentApi";
import { FiCreditCard, FiCheckCircle, FiXCircle, FiClock, FiCalendar } from "react-icons/fi";

export const PaymentHistoryPage: React.FC = () => {
  const { data: payments = [], isLoading, isError } = useGetPaymentHistoryQuery();

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAEFF7] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#05264E] flex items-center gap-3">
              <FiCreditCard className="text-[#3C65F5]" /> Payment & Billing History
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#66789C] mt-1">
              View all your past membership subscriptions, invoices, and transaction records.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent" />
            <p className="text-xs font-semibold text-[#66789C]">Loading payment transactions...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="rounded-2xl bg-red-50 p-6 text-center text-red-600 border border-red-100">
            <p className="text-sm font-bold">Failed to load payment history.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && payments.length === 0 && (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-[#EAEFF7] space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#3C65F5]">
              <FiCreditCard className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-[#05264E]">No Payment Transactions Found</h3>
            <p className="text-xs text-[#66789C] max-w-md mx-auto">
              You haven't made any paid membership purchases yet. When you subscribe to a plan, your billing records will appear here.
            </p>
          </div>
        )}

        {/* Transactions Table */}
        {!isLoading && !isError && payments.length > 0 && (
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-[#EAEFF7]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-medium text-[#05264E]">
                <thead className="bg-[#F8FAFC] border-b border-[#EAEFF7] text-[11px] font-bold uppercase tracking-wider text-[#66789C]">
                  <tr>
                    <th className="px-6 py-4">Transaction Date</th>
                    <th className="px-6 py-4">Plan Name</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Gateway / Provider</th>
                    <th className="px-6 py-4">Razorpay Payment ID</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEFF7]">
                  {payments.map((payment) => {
                    const isSuccess = payment.status === "SUCCESS" || (payment.status as string) === "CAPTURED";
                    const isFailed = payment.status === "FAILED";
                    const formattedDate = payment.createdAt
                      ? new Date(payment.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—";

                    // Handle paise vs rupees display
                    const displayAmount = payment.amount > 1000 ? (payment.amount / 100).toFixed(2) : payment.amount;

                    return (
                      <tr key={payment._id} className="hover:bg-[#F8FAFC]/60 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-[#66789C] flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          {formattedDate}
                        </td>
                        <td className="px-6 py-4 font-bold text-[#05264E]">
                          {payment.membershipId?.name || "Membership Plan"}
                        </td>
                        <td className="px-6 py-4 font-black text-[#05264E]">
                          {payment.currency === "INR" ? "₹" : "$"}{displayAmount} {payment.currency}
                        </td>
                        <td className="px-6 py-4 text-[#66789C] font-semibold">
                          {payment.provider || "RAZORPAY"}
                        </td>
                        <td className="px-6 py-4 font-mono text-[11px] text-[#66789C]">
                          {payment.providerPaymentId || payment.providerOrderId || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isSuccess && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-[11px] font-bold">
                              <FiCheckCircle /> SUCCESS
                            </span>
                          )}
                          {isFailed && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-red-700 text-[11px] font-bold">
                              <FiXCircle /> FAILED
                            </span>
                          )}
                          {!isSuccess && !isFailed && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-700 text-[11px] font-bold">
                              <FiClock /> PENDING
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
