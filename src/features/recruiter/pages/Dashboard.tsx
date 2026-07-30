import { PageHeader } from "../components/PageHeader";
import { DashboardStats } from "../dashboard/DashboardStats";
import { QuickActions } from "../dashboard/QuickActions";
import { RecentJobs } from "../dashboard/RecentJobs";
import { RecentApplications } from "../dashboard/RecentApplications";
import { Link } from "react-router-dom";
import { FiPlusSquare } from "react-icons/fi";

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Recruiter Overview Dashboard"
        description="Welcome back! Here is a summary of your hiring activities, active jobs, and candidate applications."
        action={
          <Link
            to="/recruiter/post-job"
            className="flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-3 text-xs font-semibold text-white shadow-md transition hover:bg-[#254BD6]"
          >
            <FiPlusSquare className="text-base" /> Post New Job
          </Link>
        }
      />

      {/* Top 4 Statistic Cards */}
      <DashboardStats />

      {/* Quick Actions Row */}
      <QuickActions />

      {/* Tables Row: Recent Jobs & Recent Applications */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RecentJobs />
        <RecentApplications />
      </div>
    </div>
  );
};

export default Dashboard;
