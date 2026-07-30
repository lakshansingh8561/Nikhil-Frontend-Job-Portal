import type { InputHTMLAttributes } from "react";

interface AuthInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const AuthInput = ({
  label,
  error,
  ...props
}: AuthInputProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-[15px] font-semibold text-[#05264E]">
        {label}
      </label>

      <input
        {...props}
        className={`h-14 w-full rounded-xl border bg-white px-5 text-[15px] text-[#05264E] outline-none transition-all duration-200 placeholder:text-gray-400
        ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
            : "border-[#D5DEEF] focus:border-[#3C65F5] focus:ring-4 focus:ring-blue-100"
        }`}
      />

      {error && (
        <p className="text-sm font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthInput;