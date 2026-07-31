import { useState, type InputHTMLAttributes } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = ({ label, error, type, ...props }: AuthInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-[#05264E]">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          type={inputType}
          className={`h-12 w-full rounded-xl border bg-white px-4 text-xs font-medium text-[#05264E] outline-none transition-all duration-200 placeholder:text-gray-400 ${
            isPasswordField ? "pr-10" : ""
          } ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-[#EAEFF7] focus:border-[#3C65F5] focus:bg-white"
          }`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3C65F5] transition cursor-pointer"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FiEyeOff className="text-base" />
            ) : (
              <FiEye className="text-base" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};

export default AuthInput;