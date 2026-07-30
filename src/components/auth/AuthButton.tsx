import type {
  ButtonHTMLAttributes,
} from "react";

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const AuthButton = ({
  children,
  loading,
  ...props
}: Props) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="flex h-14 w-full items-center justify-center rounded-xl bg-[#3C65F5] text-[16px] font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2954F3] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default AuthButton;