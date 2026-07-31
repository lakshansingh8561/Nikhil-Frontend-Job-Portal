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
  const [registerUser, { isLoading }] = useRegisterMutation();

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

  const onSubmit = async (values: RegisterForm) => {
    try {
      await registerUser(values).unwrap();
      toast.success("Registration successful! Please sign in to continue.");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error?.data?.message ?? "Registration failed"
      );
    }
  };

  return (
    <AuthLayout
      category="Register"
      title="Start for free Today"
      subtitle="Access to all features. No credit card required."
    >
      <SocialLogin label="Sign up with Google" />

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
            <option value="ADMIN">System Administrator (Admin)</option>
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

        <AuthButton loading={isLoading}>
          Submit & Register
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
      </p>
    </AuthLayout>
  );
};

export default Register;