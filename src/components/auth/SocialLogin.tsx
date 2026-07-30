import { FcGoogle } from "react-icons/fc";

interface SocialLoginProps {
  label?: string;
}

const SocialLogin = ({ label = "Sign up with Google" }: SocialLoginProps) => {
  return (
    <button
      type="button"
      className="flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-[#EAEFF7] bg-white py-3 px-4 text-sm font-semibold text-[#05264E] shadow-2xs hover:bg-gray-50 transition cursor-pointer"
    >
      <FcGoogle size={22} />
      <span>{label}</span>
    </button>
  );
};

export default SocialLogin;