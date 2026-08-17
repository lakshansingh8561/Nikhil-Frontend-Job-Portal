import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiArrowLeft, FiRefreshCw, FiCheckCircle } from "react-icons/fi";

import AuthLayout from "../../layouts/AuthLayout";
import AuthButton from "../../components/auth/AuthButton";
import { useSendOtpMutation, useVerifyOtpMutation } from "../../features/auth/authApi";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCredentials } from "../../features/auth/authSlice";

export const VerifyOtp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const emailParam = searchParams.get("email") || "";
  const [email, setEmail] = useState<string>(emailParam);
  const [otpInput, setOtpInput] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(60);

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();

  useEffect(() => {
    let interval: any = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email address is missing.");
      return;
    }
    if (!otpInput || otpInput.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }

    try {
      const response: any = await verifyOtp({
        email,
        password: "", // fallback if direct verify
        role: "JOB_SEEKER",
        otp: otpInput.trim(),
      }).unwrap();

      const authData = response.data || response;
      const user = authData.user;

      if (user) {
        dispatch(
          setCredentials({
            user: user,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
          })
        );
      }

      toast.success("Account verified successfully!");
      navigate("/login", { replace: true });
    } catch (error: any) {
      toast.error(
        error?.data?.message ?? "Incorrect OTP code. Verification failed."
      );
    }
  };

  const handleResendOtp = async () => {
    if (!email || resendTimer > 0) return;
    try {
      await sendOtp({ email }).unwrap();
      setResendTimer(60);
      toast.success(`Fresh verification code sent to ${email}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <AuthLayout
      category="Verify Email"
      title="Enter Verification Code"
      subtitle={`We sent a 6-digit OTP code to ${email || "your email"}`}
    >
      <div className="space-y-6">
        <div className="rounded-2xl bg-blue-50/60 p-4 border border-blue-100 flex items-start gap-3">
          <FiMail className="text-2xl text-[#3C65F5] shrink-0 mt-0.5" />
          <div className="text-xs text-[#05264E]">
            <p className="font-bold">Check your Inbox</p>
            <p className="mt-0.5 text-[#66789C]">
              Enter the 6-digit verification code sent to{" "}
              <span className="font-extrabold text-[#05264E]">{email || "your address"}</span>
            </p>
            <Link
              to="/register"
              className="mt-1 font-bold text-[#3C65F5] hover:underline flex items-center gap-1 inline-flex"
            >
              <FiArrowLeft className="text-xs" /> Back to Register
            </Link>
          </div>
        </div>

        <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#05264E]">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@gmail.com"
              className="h-12 w-full rounded-xl border border-[#EAEFF7] bg-white px-4 text-xs font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#05264E]">
              Enter 6-Digit OTP Code *
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 123456"
                className="h-14 w-full rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] px-4 text-center text-2xl font-black tracking-[8px] text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white placeholder:tracking-normal placeholder:text-sm placeholder:font-normal placeholder:text-gray-400"
                autoFocus
                required
              />
              <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <AuthButton loading={isVerifyingOtp}>
            <span className="flex items-center justify-center gap-2">
              <FiCheckCircle /> Verify OTP Code
            </span>
          </AuthButton>
        </form>

        <div className="flex items-center justify-between text-xs border-t border-[#EAEFF7] pt-4">
          <span className="text-[#66789C] font-medium">Didn't receive the code?</span>
          {resendTimer > 0 ? (
            <span className="font-bold text-gray-400">
              Resend in <span className="text-[#3C65F5]">{resendTimer}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isSendingOtp}
              className="font-bold text-[#3C65F5] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <FiRefreshCw className={isSendingOtp ? "animate-spin" : ""} /> Resend OTP Code
            </button>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyOtp;
