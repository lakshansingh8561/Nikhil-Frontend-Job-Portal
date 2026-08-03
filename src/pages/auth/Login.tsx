import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import Divider from "../../components/auth/Divider";
import SocialLogin from "../../components/auth/SocialLogin";

import { useLoginMutation, useGoogleLoginMutation } from "../../features/auth/authApi";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCredentials } from "../../features/auth/authSlice";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginUser, { isLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const handleAuthSuccess = (authData: any) => {
    const user = authData.user;
    if (!user) {
      throw new Error("User data missing from response");
    }

    dispatch(
      setCredentials({
        user: user,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
      })
    );

    toast.success("Login Successful!");

    if (user.role === "ADMIN") {
      navigate("/admin/dashboard", { replace: true });
    } else if (user.role === "RECRUITER") {
      navigate("/recruiter/dashboard", { replace: true });
    } else if (user.role === "JOB_SEEKER") {
      navigate("/job-seeker/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const onSubmit = async (values: LoginForm) => {
    try {
      const response: any = await loginUser(values).unwrap();
      const authData = response.data || response;
      handleAuthSuccess(authData);
    } catch (error: any) {
      toast.error(
        error?.data?.message ?? error?.message ?? "Invalid email or password"
      );
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    try {
      const response: any = await googleLogin({ credential }).unwrap();
      const authData = response.data || response;
      handleAuthSuccess(authData);
    } catch (error: any) {
      toast.error(
        error?.data?.message ?? "Google Authentication failed."
      );
    }
  };

  return (
    <AuthLayout
      category="Sign In"
      title="Welcome Back"
      subtitle="Access to all features. Sign in to your account."
    >
      <SocialLogin
        label="Sign in with Google"
        onSuccess={handleGoogleSuccess}
        isLoading={isGoogleLoading}
      />

      <Divider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <div className="flex items-center justify-between text-xs text-[#66789C]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded accent-[#3C65F5]"
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="font-bold text-[#3C65F5] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <AuthButton loading={isLoading || isGoogleLoading}>
          Sign In
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-xs font-medium text-[#66789C]">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-bold text-[#3C65F5] hover:underline"
        >
          Register
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;