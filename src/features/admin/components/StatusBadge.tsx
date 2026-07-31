import React from "react";
import { FiCheckCircle, FiSlash, FiClock, FiXCircle, FiAward } from "react-icons/fi";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const normalized = status.toUpperCase();

  const getStyle = () => {
    switch (normalized) {
      case "ACTIVE":
        return {
          bgColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: FiCheckCircle,
        };
      case "BLOCKED":
        return {
          bgColor: "bg-red-50 text-red-700 border-red-200",
          icon: FiSlash,
        };
      case "APPLIED":
        return {
          bgColor: "bg-blue-50 text-[#3C65F5] border-blue-200",
          icon: FiClock,
        };
      case "SHORTLISTED":
        return {
          bgColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: FiCheckCircle,
        };
      case "INTERVIEW":
        return {
          bgColor: "bg-amber-50 text-amber-700 border-amber-200",
          icon: FiClock,
        };
      case "REJECTED":
        return {
          bgColor: "bg-rose-50 text-rose-700 border-rose-200",
          icon: FiXCircle,
        };
      case "HIRED":
        return {
          bgColor: "bg-teal-50 text-teal-700 border-teal-200",
          icon: FiAward,
        };
      default:
        return {
          bgColor: "bg-gray-50 text-gray-700 border-gray-200",
          icon: FiCheckCircle,
        };
    }
  };

  const { bgColor, icon: Icon } = getStyle();
  const sizeClasses =
    size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold ${bgColor} ${sizeClasses}`}
    >
      <Icon className="shrink-0" />
      <span>{normalized}</span>
    </span>
  );
};

export default StatusBadge;
