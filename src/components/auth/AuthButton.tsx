import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const AuthButton = ({ children, loading, ...props }: Props) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="flex h-13 w-full items-center justify-center rounded-xl bg-[#05264E] text-xs font-bold text-white shadow-md transition-all duration-200 hover:bg-[#031936] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default AuthButton;