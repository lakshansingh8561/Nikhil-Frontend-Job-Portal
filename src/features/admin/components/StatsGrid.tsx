import React from "react";
import {
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiUserCheck,
  FiUserPlus,
  FiGrid,
} from "react-icons/fi";
import DashboardCard from "./DashboardCard";
import type { AdminDashboardStats } from "../types/admin.types";

interface StatsGridProps {
  stats?: AdminDashboardStats;
  isLoading?: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-28 rounded-3xl bg-white border border-[#EAEFF7] p-6 animate-pulse"
          >
            <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const defaultStats: AdminDashboardStats = stats || {
    totalUsers: 0,
    totalRecruiters: 0,
    totalJobSeekers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
  };

  const cardsData = [
    {
      title: "Total Users",
      value: defaultStats.totalUsers,
      icon: FiUsers,
      iconBgColor: "bg-[#E8F0FE]",
      iconTextColor: "text-[#3C65F5]",
      description: "All registered system accounts",
    },
    {
      title: "Total Recruiters",
      value: defaultStats.totalRecruiters,
      icon: FiUserCheck,
      iconBgColor: "bg-emerald-50",
      iconTextColor: "text-emerald-600",
      description: "Employers & Hiring Managers",
    },
    {
      title: "Total Job Seekers",
      value: defaultStats.totalJobSeekers,
      icon: FiUserPlus,
      iconBgColor: "bg-purple-50",
      iconTextColor: "text-purple-600",
      description: "Candidates looking for jobs",
    },
    {
      title: "Total Companies",
      value: defaultStats.totalCompanies,
      icon: FiGrid,
      iconBgColor: "bg-amber-50",
      iconTextColor: "text-amber-600",
      description: "Registered organization profiles",
    },
    {
      title: "Total Jobs",
      value: defaultStats.totalJobs,
      icon: FiBriefcase,
      iconBgColor: "bg-indigo-50",
      iconTextColor: "text-indigo-600",
      description: "Posted job openings",
    },
    {
      title: "Total Applications",
      value: defaultStats.totalApplications,
      icon: FiFileText,
      iconBgColor: "bg-rose-50",
      iconTextColor: "text-rose-600",
      description: "Submitted job applications",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cardsData.map((card) => (
        <DashboardCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default StatsGrid;
