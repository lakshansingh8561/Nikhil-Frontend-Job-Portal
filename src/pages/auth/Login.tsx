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

import { useLoginMutation } from "../../features/auth/authApi";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCredentials } from "../../features/auth/authSlice";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [loginUser, { isLoading }] =
    useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (
    values: LoginForm
  ) => {
    try {
      const data =
        await loginUser(values).unwrap();

      dispatch(setCredentials(data));

      toast.success("Login Successful");

      switch (data.user.role) {
        case "ADMIN":
          navigate("/admin");
          break;

        case "RECRUITER":
          navigate("/recruiter");
          break;

        default:
          navigate("/");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ??
          "Invalid email or password"
      );
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your job search journey."
    >
      <SocialLogin />

      <Divider />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <AuthInput
          label="Email Address"
          placeholder="Enter your email"
          {...register("email")}
          error={errors.email?.message}
        />

        <AuthInput
          type="password"
          label="Password"
          placeholder="Enter your password"
          {...register("password")}
          error={errors.password?.message}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-[#66789C]">
            <input
              type="checkbox"
              className="accent-[#3C65F5]"
            />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-[#3C65F5] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <AuthButton loading={isLoading}>
          Sign In
        </AuthButton>
      </form>

      <p className="mt-8 text-center text-[#66789C]">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#3C65F5]"
        >
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;