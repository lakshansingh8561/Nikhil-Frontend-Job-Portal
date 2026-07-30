import { StatCard } from "../components/StatCard";
import type { StatItem } from "../types/dashboard.types";

const mockStats: StatItem[] = [
  {
    id: "1",
    title: "Total Jobs Posted",
    value: 24,
    change: "+12.5%",
    isPositive: true,
    iconName: "jobs",
  },
  {
    id: "2",
    title: "Active Openings",
    value: 18,
    change: "+8.2%",
    isPositive: true,
    iconName: "activeJobs",
  },
  {
    id: "3",
    title: "Total Applicants",
    value: 452,
    change: "+24.8%",
    isPositive: true,
    iconName: "applicants",
  },
  {
    id: "4",
    title: "Shortlisted Candidates",
    value: 38,
    change: "-3.1%",
    isPositive: false,
    iconName: "shortlisted",
  },
];

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {mockStats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
};
