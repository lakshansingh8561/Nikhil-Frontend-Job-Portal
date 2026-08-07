import { PageHeader } from "../components/PageHeader";
import { DashboardStats } from "../dashboard/DashboardStats";
import { QuickActions } from "../dashboard/QuickActions";
import { RecentJobs } from "../dashboard/RecentJobs";
import { RecentApplications } from "../dashboard/RecentApplications";
import { Link } from "react-router-dom";
import { FiPlusSquare, FiZap, FiArrowRight, FiShield, FiBriefcase, FiCalendar } from "react-icons/fi";
import { useGetCurrentRecruiterPlanQuery } from "../../membership/api/membershipApi";

export const Dashboard = () => {
  const { data: recSub } = useGetCurrentRecruiterPlanQuery();

  const sub = recSub?.subscription;
  const planName = sub?.planName || recSub?.plan?.name || "Free";
  const activeJobsCount = recSub?.activeJobsCount || 0;
  const maxActiveJobs = recSub?.maxActiveJobs || 3;
  const isFree = planName === "Free";
  const hasActiveSub = Boolean(recSub?.hasActiveSubscription && sub?.status === "ACTIVE");
  const recDaysRemaining = sub?.endDate
    ? Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Recruiter Overview Dashboard"
        description="Welcome back! Here is a summary of your hiring activities, active jobs, and candidate applications."
        action={
          <Link
            to="/recruiter/post-job"
            className="flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-5 py-3 text-xs font-semibold text-white shadow-md transition hover:bg-[#1E40AF]"
          >
            <FiPlusSquare className="text-base" /> Post New Job
          </Link>
        }
      />

      {/* Recruiter Membership Status Widget */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#05264E] via-[#0F396E] to-[#1D4ED8] p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-400/20 text-yellow-300 text-sm">
                <FiZap className="fill-yellow-300" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Recruiter Plan: <strong className="text-yellow-300 font-black">{planName}</strong>
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {isFree ? "Free Tier — 3 Active Jobs Limit" : `${planName} Subscription Active`}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-blue-100/90 font-medium">
              <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 border border-white/10">
                <FiBriefcase className="text-yellow-300" /> Jobs Posted: <strong>{activeJobsCount} / {maxActiveJobs}</strong>
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 border border-white/10">
                <FiCalendar className="text-blue-300" /> Active Days Remaining: <strong>{hasActiveSub ? `${recDaysRemaining} Days` : "Free Tier"}</strong>
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 border border-white/10">
                <FiShield className="text-emerald-400" /> Features: <strong>{isFree ? "Standard Hiring" : "Unlimited Jobs & AI"}</strong>
              </span>
            </div>
          </div>

          <Link
            to="/recruiter/membership"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-xs font-extrabold text-[#05264E] hover:bg-blue-50 transition-all shadow-md shrink-0 cursor-pointer"
          >
            Manage Membership <FiArrowRight />
          </Link>
        </div>
      </div>

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
