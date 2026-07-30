import { FiBriefcase, FiCheckCircle, FiUsers, FiStar, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import type { StatItem } from "../types/dashboard.types";

interface StatCardProps {
  stat: StatItem;
}

const iconMap = {
  jobs: { icon: FiBriefcase, color: "bg-blue-50 text-[#3C65F5]" },
  activeJobs: { icon: FiCheckCircle, color: "bg-emerald-50 text-emerald-600" },
  applicants: { icon: FiUsers, color: "bg-[#EBF2FF] text-[#3C65F5]" },
  shortlisted: { icon: FiStar, color: "bg-amber-50 text-amber-500" },
};

export const StatCard = ({ stat }: StatCardProps) => {
  const config = iconMap[stat.iconName] || iconMap.jobs;
  const Icon = config.icon;

  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-xs hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${config.color}`}>
          <Icon className="text-xl" />
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            stat.isPositive
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {stat.isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
          <span>{stat.change}</span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-extrabold text-[#05264E]">{stat.value}</h3>
        <p className="mt-0.5 text-xs font-semibold text-[#66789C]">{stat.title}</p>
      </div>
    </div>
  );
};
