import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiArrowLeft, FiRefreshCw, FiCheckCircle } from "react-icons/fi";

import AuthLayout from "../../layouts/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import Divider from "../../components/auth/Divider";
import SocialLogin from "../../components/auth/SocialLogin";

import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useGoogleLoginMutation,
} from "../../features/auth/authApi";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCredentials } from "../../features/auth/authSlice";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  role: z.enum(["JOB_SEEKER", "RECRUITER", "ADMIN"]),
});

type RegisterForm = z.infer<typeof schema>;

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<"REGISTER" | "VERIFY_OTP">("REGISTER");
  const [pendingValues, setPendingValues] = useState<RegisterForm | null>(null);
  const [otpInput, setOtpInput] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(60);

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "JOB_SEEKER",
    },
  });

  const selectedRole = watch("role");

  // Resend OTP Cooldown Timer
  useEffect(() => {
    let interval: any = null;
    if (step === "VERIFY_OTP" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  // Step 1: Submit Register details & trigger OTP email
  const handleRegisterSubmit = async (values: RegisterForm) => {
    try {
      await sendOtp({ email: values.email }).unwrap();
      setPendingValues(values);
      setStep("VERIFY_OTP");
      setResendTimer(60);
      toast.success(`Verification OTP code sent to ${values.email}`);
    } catch (error: any) {
      toast.error(
        error?.data?.message ?? "Failed to send verification OTP code."
      );
    }
  };

  // Step 2: Verify OTP & finalize registration
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingValues) return;
    if (!otpInput || otpInput.trim().length !== 6) {
      toast.error("Please enter the 6-digit verification code sent to your email.");
      return;
    }

    try {
      const response: any = await verifyOtp({
        ...pendingValues,
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

      toast.success("Account verified and registered successfully!");

      if (user?.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user?.role === "RECRUITER") {
        navigate("/recruiter/dashboard", { replace: true });
      } else if (user?.role === "JOB_SEEKER") {
        navigate("/job-seeker/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ?? "Incorrect OTP code. Registration failed."
      );
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!pendingValues || resendTimer > 0) return;
    try {
      await sendOtp({ email: pendingValues.email }).unwrap();
      setResendTimer(60);
      toast.success(`Fresh verification code sent to ${pendingValues.email}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend OTP.");
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    try {
      const response: any = await googleLogin({ credential, role: selectedRole }).unwrap();
      const authData = response.data || response;
      const user = authData.user;

      if (!user) {
        throw new Error("User profile not received");
      }

      dispatch(
        setCredentials({
          user: user,
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
        })
      );

      toast.success("Google Registration Successful!");

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user.role === "RECRUITER") {
        navigate("/recruiter/dashboard", { replace: true });
      } else if (user.role === "JOB_SEEKER") {
        navigate("/job-seeker/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ?? "Google Registration failed."
      );
    }
  };

  return (
    <AuthLayout
      category={step === "REGISTER" ? "Register" : "Verify Email"}
      title={step === "REGISTER" ? "Start for free Today" : "Enter Verification Code"}
      subtitle={
        step === "REGISTER"
          ? "Access to all features. No credit card required."
          : `We sent a 6-digit OTP code to ${pendingValues?.email || "your Gmail"}`
      }
    >
      {step === "REGISTER" ? (
        <>
          <SocialLogin
            label="Sign up with Google"
            onSuccess={handleGoogleSuccess}
            isLoading={isGoogleLoading}
          />

          <Divider />

          <form onSubmit={handleSubmit(handleRegisterSubmit)} className="space-y-5">
            <AuthInput
              label="Email *"
              placeholder="e.g. stevenjob@gmail.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <AuthInput
              type="password"
              label="Password *"
              placeholder="••••••••••••"
              {...register("password")}
              error={errors.password?.message}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#05264E]">
                Register As *
              </label>

              <select
                {...register("role")}
                className="h-12 w-full rounded-xl border border-[#EAEFF7] bg-white px-4 text-xs font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5]"
              >
                <option value="JOB_SEEKER">Job Seeker</option>
                <option value="RECRUITER">Recruiter</option>
              </select>
            </div>

            <div className="flex items-center justify-between text-xs text-[#66789C]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded accent-[#3C65F5]"
                />
                <span>Agree our terms and policy</span>
              </label>

              <a href="#" className="text-gray-400 hover:underline">
                Learn more
              </a>
            </div>

            <AuthButton loading={isSendingOtp || isGoogleLoading}>
              Submit & Send Verification Code
            </AuthButton>
          </form>

          <p className="mt-6 text-center text-xs font-medium text-[#66789C]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#3C65F5] hover:underline"
            >
              Sign in
            </Link>
            {" • "}
            <Link
              to="/forgot-password"
              className="font-bold text-[#3C65F5] hover:underline"
            >
              Forgot Password?
            </Link>
          </p>
        </>
      ) : (
        /* STEP 2: VERIFY OTP UI */
        <div className="space-y-6">
          <div className="rounded-2xl bg-blue-50/60 p-4 border border-blue-100 flex items-start gap-3">
            <FiMail className="text-2xl text-[#3C65F5] shrink-0 mt-0.5" />
            <div className="text-xs text-[#05264E]">
              <p className="font-bold">Check your Gmail Inbox</p>
              <p className="mt-0.5 text-[#66789C]">
                Enter the 6-digit code sent to{" "}
                <span className="font-extrabold text-[#05264E]">{pendingValues?.email}</span>
              </p>
              <button
                type="button"
                onClick={() => setStep("REGISTER")}
                className="mt-1 font-bold text-[#3C65F5] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FiArrowLeft className="text-xs" /> Edit email address
              </button>
            </div>
          </div>

          <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
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
                <FiCheckCircle /> Verify & Complete Registration
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
      )}
    </AuthLayout>
  );
};

export default Register;