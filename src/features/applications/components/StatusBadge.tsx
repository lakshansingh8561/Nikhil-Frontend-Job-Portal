import React from "react";
import {
  FiClock,
  FiCheckCircle,
  FiUserCheck,
  FiXCircle,
  FiAward,
} from "react-icons/fi";
import type { ApplicationStatus } from "../types/application.types";

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<
  ApplicationStatus,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  APPLIED: {
    label: "Applied",
    bg: "bg-blue-50",
    text: "text-[#3C65F5]",
    border: "border-blue-200",
    icon: FiClock,
  },
  SHORTLISTED: {
    label: "Shortlisted",
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
    icon: FiCheckCircle,
  },
  INTERVIEW: {
    label: "Interview",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    icon: FiUserCheck,
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
    icon: FiXCircle,
  },
  HIRED: {
    label: "Hired",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    icon: FiAward,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const normalizedStatus =
    status === ("SUBMITTED" as any) || (status as string) === "UNDER_REVIEW"
      ? "APPLIED"
      : (status as string) === "INTERVIEW_SCHEDULED"
      ? "INTERVIEW"
      : (status as string) === "OFFERED"
      ? "HIRED"
      : status;

  const config = statusConfig[normalizedStatus as ApplicationStatus] || statusConfig.APPLIED;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-[11px] gap-1",
    md: "px-3.5 py-1.5 text-xs gap-1.5",
    lg: "px-4 py-2 text-sm gap-2",
  };

  return (
    <span
      className={`inline-flex items-center rounded-xl font-bold border transition-all duration-200 ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      <Icon className="shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
