import React from "react";
import { FiInbox } from "react-icons/fi";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Data Available",
  message = "There are no records found matching your current criteria.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-[#EAEFF7] bg-white p-12 text-center shadow-xs min-h-[300px]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F0FE] text-[#3C65F5] mb-4 shadow-xs">
        <FiInbox className="text-3xl" />
      </div>
      <h3 className="text-lg font-bold text-[#05264E]">{title}</h3>
      <p className="mt-1 max-w-sm text-xs font-medium text-[#66789C]">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
