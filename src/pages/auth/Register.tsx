import { useNavigate, Link } from "react-router-dom";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout";

import { useRegisterMutation } from "../../Redux/api/authApi";

import { useAppDispatch } from "../../hooks/useAppDispatch";

import { setCredentials } from "../../Redux/slices/authSlice";

const schema = z.object({
  email: z
    .string()
    .email("Enter a valid email"),

  password: z.string().min(8),

  role: z.enum([
    "JOB_SEEKER",
    "RECRUITER",
  ]),
});

type RegisterForm = z.infer<typeof schema>;

const Register = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [registerApi] =
    useRegisterMutation();

  const {
    register,
    handleSubmit,
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
        await registerApi(values).unwrap();

      dispatch(setCredentials(data));

      toast.success(
        "Registration Successful"
      );

      navigate("/");
    } catch (error: any) {
      toast.error(
        error?.data?.message ??
        "Registration Failed"
      );
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our platform today"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full rounded-xl border p-4"
        />

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full rounded-xl border p-4"
        />

        <select
          {...register("role")}
          className="w-full rounded-xl border p-4"
        >
          <option value="JOB_SEEKER">
            Job Seeker
          </option>

          <option value="RECRUITER">
            Recruiter
          </option>
        </select>

        <button className="w-full rounded-xl bg-[#3C65F5] py-4 font-semibold text-white">
          Create Account
        </button>

        <p className="text-center">
          Already have an account?

          <Link
            to="/login"
            className="ml-2 font-semibold text-[#3C65F5]"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;