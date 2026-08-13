import { motion } from "framer-motion";
import { PageHeader } from "../components/PageHeader";
import { DashboardStats } from "../dashboard/DashboardStats";
import { QuickActions } from "../dashboard/QuickActions";
import { RecentJobs } from "../dashboard/RecentJobs";
import { RecentApplications } from "../dashboard/RecentApplications";
import { Link } from "react-router-dom";
import { FiPlusSquare, FiZap, FiArrowRight, FiShield, FiBriefcase, FiCalendar } from "react-icons/fi";
import { useGetCurrentRecruiterPlanQuery } from "../../membership/api/membershipApi";

export const Dashboard = () => {
  const { data: recSub } = useGetCurrentRecruiterPlanQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-10"
    >
      {/* Page Header */}
      <PageHeader
        title="Recruiter Overview Dashboard"
        description="Welcome back! Here is a summary of your hiring activities, active jobs, and candidate applications."
        action={
          <Link
            to="/recruiter/post-job"
            className="flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#254BD6]"
          >
            <FiPlusSquare className="text-base" /> Post New Job
          </Link>
        }
      />

      {/* Recruiter Membership Status Widget */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-white border border-[#EAEFF7] p-6 sm:p-8 text-[#05264E] shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 text-sm">
                <FiZap className="fill-yellow-400" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#66789C]">
                Recruiter Plan: <strong className="text-[#3C65F5] font-extrabold">{planName}</strong>
              </span>
            </div>
            <h3 className="text-xl font-black text-[#05264E]">
              {isFree ? "Free Tier — 3 Active Jobs Limit" : `${planName} Subscription Active`}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#66789C] font-medium">
              <span className="flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3 py-1 border border-[#EAEFF7]">
                <FiBriefcase className="text-[#3C65F5]" /> Jobs Posted: <strong className="text-[#05264E]">{activeJobsCount} / {maxActiveJobs}</strong>
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3 py-1 border border-[#EAEFF7]">
                <FiCalendar className="text-[#3C65F5]" /> Active Days Remaining: <strong className="text-[#05264E]">{hasActiveSub ? `${recDaysRemaining} Days` : "Free Tier"}</strong>
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] px-3 py-1 border border-[#EAEFF7]">
                <FiShield className="text-emerald-600" /> Features: <strong className="text-[#05264E]">{isFree ? "Standard Hiring" : "Unlimited Jobs & AI"}</strong>
              </span>
            </div>
          </div>

          <Link
            to="/recruiter/membership"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-3 text-xs font-bold text-white hover:bg-[#254BD6] transition-all shadow-md shrink-0 cursor-pointer"
          >
            Manage Membership <FiArrowRight />
          </Link>
        </div>
      </motion.div>

      {/* Top 4 Statistic Cards */}
      <DashboardStats />

      {/* Quick Actions Row */}
      <QuickActions />

      {/* Tables Row: Recent Jobs & Recent Applications */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RecentJobs />
        <RecentApplications />
      </div>
    </motion.div>
  );
};

export default Dashboard;
