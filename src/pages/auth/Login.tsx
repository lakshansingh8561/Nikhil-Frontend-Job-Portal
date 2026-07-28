import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";

import { useLoginMutation } from "../../Redux/api/authApi";

import { useAppDispatch } from "../../hooks/useAppDispatch";

import { setCredentials } from "../../Redux/slices/authSlice";

const schema = z.object({
  email: z
    .string()
    .email("Enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});

type LoginForm = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [login] = useLoginMutation();

  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      const data =
        await login(values).unwrap();

      dispatch(setCredentials(data));

      toast.success("Login Successful");

      if (data.user.role === "ADMIN") {
        navigate("/admin");
      } else if (
        data.user.role === "RECRUITER"
      ) {
        navigate("/recruiter");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ??
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full rounded-xl border p-4"
          />

          <p className="text-sm text-red-500">
            {errors.email?.message}
          </p>
        </div>

        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full rounded-xl border p-4"
          />

          <p className="text-sm text-red-500">
            {errors.password?.message}
          </p>
        </div>

        <button className="w-full rounded-xl bg-[#3C65F5] py-4 font-semibold text-white">
          {loading
            ? "Signing In..."
            : "Sign In"}
        </button>

        <p className="text-center">
          Don't have an account?

          <Link
            to="/register"
            className="ml-2 font-semibold text-[#3C65F5]"
          >
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;