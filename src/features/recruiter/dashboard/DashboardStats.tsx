import { StatCard } from "../components/StatCard";
import type { StatItem } from "../types/dashboard.types";
import { useGetRecruiterJobsQuery } from "../../jobs/api/jobsApi";

export const DashboardStats = () => {
  const { data: jobs } = useGetRecruiterJobsQuery();
  const jobsList = jobs || [];

  const totalJobs = jobsList.length;
  const activeJobs = jobsList.filter((j) => j.isActive).length;
  const totalApplicants = jobsList.reduce(
    (acc, j) => acc + (j.applicantCount || 0),
    0
  );
  const closedJobs = totalJobs - activeJobs;

  const liveStats: StatItem[] = [
    {
      id: "1",
      title: "Total Jobs Posted",
      value: totalJobs,
      change: "Live",
      isPositive: true,
      iconName: "jobs",
    },
    {
      id: "2",
      title: "Active Openings",
      value: activeJobs,
      change: "Live",
      isPositive: true,
      iconName: "activeJobs",
    },
    {
      id: "3",
      title: "Total Applicants",
      value: totalApplicants,
      change: "Live",
      isPositive: true,
      iconName: "applicants",
    },
    {
      id: "4",
      title: "Closed Postings",
      value: closedJobs,
      change: "Live",
      isPositive: false,
      iconName: "shortlisted",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {liveStats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
};
