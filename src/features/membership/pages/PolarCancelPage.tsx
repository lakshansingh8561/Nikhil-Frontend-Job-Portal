import React from "react";
import { useNavigate } from "react-router-dom";
import { FiXCircle, FiArrowLeft } from "react-icons/fi";

export const PolarCancelPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
        <div className="py-6 space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 shadow-xs">
            <FiXCircle className="text-4xl" />
          </div>
          <div>
            <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-extrabold text-rose-800 mb-2">
              Polar Checkout Cancelled
            </span>
            <h2 className="text-2xl font-black text-[#05264E]">Payment Was Cancelled</h2>
            <p className="text-xs font-medium text-gray-500 mt-1 max-w-xs mx-auto">
              You cancelled the Polar Sandbox checkout session. No charges were made and your membership remains unchanged.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate("/job-seeker/membership")}
              className="w-full rounded-2xl bg-[#3C65F5] py-4 text-sm font-extrabold text-white hover:bg-[#254BD6] shadow-lg transition cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <FiArrowLeft className="text-lg" /> Return to Membership Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
