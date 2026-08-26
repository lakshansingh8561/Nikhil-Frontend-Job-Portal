import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiArrowLeft, FiCheckCircle, FiRefreshCw, FiEye, FiEyeOff } from "react-icons/fi";

import AuthLayout from "../../layouts/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

import {
  useSendForgotPasswordOtpMutation,
  useResetPasswordWithOtpMutation,
} from "../../features/auth/authApi";

export const ForgotPassword = () => {
  const navigate = useNavigate();

  // Wizard Steps: 1 = Email Request, 2 = Verify OTP Code, 3 = Reset Password
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const [sendOtp, { isLoading: isSendingOtp }] = useSendForgotPasswordOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordWithOtpMutation();

  // 60-second cooldown timer for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Step 1: Send OTP to Gmail
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const res = await sendOtp({ email: email.trim().toLowerCase() }).unwrap();
      toast.success(res?.message || `Verification code sent to ${email}`);
      setStep(2);
      setResendTimer(60);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send reset code. Verify your email.");
    }
  };

  // Step 2: Resend OTP handler
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      const res = await sendOtp({ email: email.trim().toLowerCase() }).unwrap();
      toast.success(res?.message || "A new verification code has been sent!");
      setResendTimer(60);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend code.");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      toast.error("Please enter the 6-digit verification code sent to your email.");
      return;
    }
    setStep(3);
  };

  // Step 3: Reset Password Submit
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const res = await resetPassword({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      }).unwrap();

      toast.success(res?.message || "Password reset successfully! Log in with your new password.");
      navigate("/login", { replace: true });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reset password. Please check your verification code.");
    }
  };

  return (
    <AuthLayout
      category="Password Recovery"
      title="Reset Your Password"
      subtitle="Follow the steps to verify your email and set a new password."
    >
      {/* Wizard Progress Indicator */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-black ${step >= 1 ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"}`}>
            1
          </div>
          <span className="hidden sm:inline">Email</span>
        </div>
        <div className={`h-0.5 flex-1 mx-3 ${step >= 2 ? "bg-indigo-600 dark:bg-indigo-500" : "bg-slate-200 dark:bg-slate-800"}`} />
        <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-black ${step >= 2 ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"}`}>
            2
          </div>
          <span className="hidden sm:inline">Verify OTP</span>
        </div>
        <div className={`h-0.5 flex-1 mx-3 ${step >= 3 ? "bg-indigo-600 dark:bg-indigo-500" : "bg-slate-200 dark:bg-slate-800"}`} />
        <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-black ${step >= 3 ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"}`}>
            3
          </div>
          <span className="hidden sm:inline">New Password</span>
        </div>
      </div>

      {/* STEP 1: REQUEST EMAIL */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs leading-relaxed flex items-start gap-2.5">
            <FiMail className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span>
              Enter your registered Gmail or email address. We will send you a 6-digit verification code to reset your password.
            </span>
          </div>

          <AuthInput
            label="Email Address *"
            type="email"
            placeholder="e.g. yourname@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <AuthButton loading={isSendingOtp}>
            Send Reset Code
          </AuthButton>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <FiArrowLeft /> Back to Login
            </Link>
          </div>
        </form>
      )}

      {/* STEP 2: VERIFY OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs leading-relaxed flex items-start gap-2.5">
            <FiCheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Verification code sent!</p>
              <p className="text-[11px] mt-0.5 opacity-90">
                Check your Gmail inbox for <span className="font-bold underline">{email}</span> and enter the 6-digit code below.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
              <span>6-Digit Verification Code *</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Change Email
              </button>
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                className="w-full h-12 text-center text-2xl tracking-[10px] font-black rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>Didn't receive code?</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || isSendingOtp}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <FiRefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? "animate-spin" : ""}`} />
              {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : "Resend Code"}
            </button>
          </div>

          <AuthButton>
            Verify Code & Continue
          </AuthButton>
        </form>
      )}

      {/* STEP 3: NEW PASSWORD */}
      {step === 3 && (
        <form onSubmit={handleResetSubmit} className="space-y-5">
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs leading-relaxed flex items-start gap-2.5">
            <FiLock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span>
              Create a strong new password for your JobBox account. Password must be at least 6 characters long.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              New Password *
            </label>
            <div className="relative flex items-center">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full h-11 px-4 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Confirm New Password *
            </label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full h-11 px-4 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <AuthButton loading={isResetting}>
            Reset Password & Log In
          </AuthButton>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
