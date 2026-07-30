import type { ReactNode } from "react";
import { FiFolder } from "react-icons/fi";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#EAEFF7] bg-white p-12 text-center shadow-xs">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8FAFC] text-gray-400 text-3xl mb-4">
        <FiFolder />
      </div>
      <h3 className="text-lg font-bold text-[#05264E]">{title}</h3>
      <p className="mt-1 text-xs text-[#66789C] max-w-sm font-medium">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
