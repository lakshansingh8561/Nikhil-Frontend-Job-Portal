import React from "react";
import { FiChevronDown, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";
import type { ApplicationStatus } from "../types/application.types";
import { useUpdateStatusMutation } from "../api/applicationApi";

interface StatusDropdownProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
  onStatusChange?: (newStatus: ApplicationStatus) => void;
}

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: "APPLIED", label: "Applied" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "REJECTED", label: "Rejected" },
  { value: "HIRED", label: "Hired" },
];

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  applicationId,
  currentStatus,
  onStatusChange,
}) => {
  const [updateStatus, { isLoading }] = useUpdateStatusMutation();

  const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ApplicationStatus;
    if (newStatus === currentStatus) return;

    try {
      await updateStatus({ id: applicationId, status: newStatus }).unwrap();
      toast.success(`Status updated to ${newStatus}! Email notification sent to applicant.`);
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update application status.");
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={currentStatus}
        onChange={handleSelect}
        disabled={isLoading}
        className="appearance-none rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-2 pl-3.5 pr-8 text-xs font-bold text-[#05264E] shadow-sm outline-none transition-all focus:border-[#3C65F5] focus:bg-white disabled:opacity-50 cursor-pointer"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 text-gray-400">
        {isLoading ? (
          <FiLoader className="animate-spin text-xs text-[#3C65F5]" />
        ) : (
          <FiChevronDown className="text-xs" />
        )}
      </div>
    </div>
  );
};

export default StatusDropdown;
