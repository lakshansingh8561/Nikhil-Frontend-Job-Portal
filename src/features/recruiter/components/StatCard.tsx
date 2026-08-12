import React from "react";
import { motion } from "framer-motion";
import { FiBriefcase, FiCheckCircle, FiUsers, FiStar, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import type { StatItem } from "../types/dashboard.types";

interface StatCardProps {
  stat: StatItem;
}

const iconMap = {
  jobs: { icon: FiBriefcase, color: "bg-[#3C65F5] text-white shadow-md shadow-blue-500/20" },
  activeJobs: { icon: FiCheckCircle, color: "bg-emerald-600 text-white shadow-md shadow-emerald-500/20" },
  applicants: { icon: FiUsers, color: "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" },
  shortlisted: { icon: FiStar, color: "bg-amber-500 text-white shadow-md shadow-amber-500/20" },
};

export const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const config = iconMap[stat.iconName] || iconMap.jobs;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-xs hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${config.color} group-hover:scale-105 transition-transform duration-300`}>
          <Icon className="text-xl" />
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wide ${
            stat.isPositive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
              : "bg-amber-50 text-amber-700 border border-amber-200/80"
          }`}
        >
          {stat.isPositive ? <FiTrendingUp className="text-xs" /> : <FiTrendingDown className="text-xs" />}
          <span>{stat.change}</span>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-3xl font-black text-[#05264E] tracking-tight">{stat.value}</h3>
        <p className="mt-1 text-xs font-bold text-[#66789C]">{stat.title}</p>
      </div>
    </motion.div>
  );
};
