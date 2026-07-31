import React from "react";
import type { IconType } from "react-icons";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: IconType;
  iconBgColor?: string;
  iconTextColor?: string;
  description?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor = "bg-[#E8F0FE]",
  iconTextColor = "text-[#3C65F5]",
  description,
}) => {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div>
        <p className="text-xs font-semibold text-[#66789C] uppercase tracking-wider">
          {title}
        </p>
        <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#05264E]">
          {value.toLocaleString()}
        </h3>
        {description && (
          <p className="mt-1 text-xs font-medium text-gray-500">{description}</p>
        )}
      </div>

      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBgColor} ${iconTextColor} shrink-0 shadow-xs`}
      >
        <Icon className="text-2xl" />
      </div>
    </div>
  );
};

export default DashboardCard;
