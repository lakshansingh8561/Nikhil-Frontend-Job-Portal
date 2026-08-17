import React from "react";
import { FiBriefcase, FiCheckCircle, FiUsers, FiStar, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import type { StatItem } from "../types/dashboard.types";

interface StatCardProps {
  stat: StatItem;
}

const iconMap = {
  jobs: { icon: FiBriefcase, color: "bg-indigo-50 text-indigo-600 border border-indigo-200" },
  activeJobs: { icon: FiCheckCircle, color: "bg-emerald-50 text-emerald-600 border border-emerald-200" },
  applicants: { icon: FiUsers, color: "bg-blue-50 text-blue-600 border border-blue-200" },
  shortlisted: { icon: FiStar, color: "bg-amber-50 text-amber-600 border border-amber-200" },
};

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const config = iconMap[stat.iconName] || iconMap.jobs;
  const Icon = config.icon;

  return (
    <div className="saas-card p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.color}`}>
          <Icon className="text-base" />
        </div>

        <span className="saas-badge saas-badge-neutral text-[10px]">
          {stat.isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
          {stat.change}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
        <p className="mt-0.5 text-xs font-semibold text-slate-500">{stat.title}</p>
      </div>
    </div>
  );
};
