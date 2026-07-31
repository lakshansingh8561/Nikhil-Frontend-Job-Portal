import React from "react";
import { FiInbox, FiBriefcase } from "react-icons/fi";
import { Link } from "react-router-dom";

interface EmptyApplicationsProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionLink?: string;
  isRecruiter?: boolean;
}

export const EmptyApplications: React.FC<EmptyApplicationsProps> = ({
  title = "No Applications Found",
  message = "There are no applications submitted yet.",
  actionText = "Browse Available Jobs",
  actionLink = "/jobs",
  isRecruiter = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-[#EAEFF7] bg-white p-12 text-center shadow-sm min-h-[360px]">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E8F0FE] text-[#3C65F5] mb-6">
        <FiInbox className="text-4xl" />
      </div>

      <h3 className="text-xl font-bold text-[#05264E]">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-[#66789C] leading-relaxed">
        {message}
      </p>

      {!isRecruiter && (
        <Link
          to={actionLink}
          className="mt-6 flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#254BD6] hover:shadow-lg"
        >
          <FiBriefcase className="text-base" />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
};

export default EmptyApplications;
