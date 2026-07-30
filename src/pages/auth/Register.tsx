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

import { useRegisterMutation } from "../../features/auth/authApi";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCredentials } from "../../features/auth/authSlice";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  role: z.enum(["JOB_SEEKER", "RECRUITER"]),
});

type RegisterForm = z.infer<typeof schema>;

const Register = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [registerUser, { isLoading }] =
    useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: "JOB_SEEKER",
    },
  });

  const onSubmit = async (
    values: RegisterForm
  ) => {
    try {
      const data =
        await registerUser(values).unwrap();

      dispatch(setCredentials(data));

      toast.success("Registration Successful");

      if (
        data.user.role === "RECRUITER"
      ) {
        navigate("/recruiter");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ??
          "Registration failed"
      );
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join thousands of professionals finding their dream jobs."
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

        <div className="space-y-2">
          <label className="block text-[15px] font-semibold text-[#05264E]">
            Register As
          </label>

          <select
            {...register("role")}
            className="h-14 w-full rounded-xl border border-[#D5DEEF] px-5 outline-none transition focus:border-[#3C65F5] focus:ring-4 focus:ring-blue-100"
          >
            <option value="JOB_SEEKER">
              Job Seeker
            </option>

            <option value="RECRUITER">
              Recruiter
            </option>
          </select>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            className="mt-1 h-4 w-4 accent-[#3C65F5]"
          />

          <p className="text-sm text-[#66789C]">
            I agree to the{" "}
            <span className="font-semibold text-[#3C65F5]">
              Terms
            </span>{" "}
            &{" "}
            <span className="font-semibold text-[#3C65F5]">
              Privacy Policy
            </span>
          </p>
        </div>

        <AuthButton loading={isLoading}>
          Create Account
        </AuthButton>
      </form>

      <p className="mt-8 text-center text-[#66789C]">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-[#3C65F5]"
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;