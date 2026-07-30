import type { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = ({ label, error, ...props }: AuthInputProps) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-[#05264E]">
        {label}
      </label>

      <input
        {...props}
        className={`h-12 w-full rounded-xl border bg-white px-4 text-xs font-medium text-[#05264E] outline-none transition-all duration-200 placeholder:text-gray-400 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-[#EAEFF7] focus:border-[#3C65F5] focus:bg-white"
        }`}
      />

      {error && (
        <p className="text-xs font-medium text-red-500">{error}</p>
      )}
    </div>
  );
};

export default AuthInput;