import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiUsers, FiUserCheck, FiBriefcase, FiFileText } from "react-icons/fi";
import StatsGrid from "../components/StatsGrid";
import UserTable from "../components/UserTable";
import RecruiterTable from "../components/RecruiterTable";
import JobTable from "../components/JobTable";
import ApplicationTable from "../components/ApplicationTable";
import SkeletonLoader from "../components/SkeletonLoader";
import EmptyState from "../components/EmptyState";
import { useGetDashboardStatsQuery } from "../api/adminApi";
import type { AdminUser, AdminJob } from "../types/admin.types";

interface DashboardOverviewProps {
  onToggleBlockUser?: (user: AdminUser) => void;
  onDeleteJobRequest?: (job: AdminJob) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onToggleBlockUser = () => {},
  onDeleteJobRequest = () => {},
}) => {
  const { data: stats, isLoading: isLoadingStats } = useGetDashboardStatsQuery();

  const recentUsers = stats?.recentUsers || [];
  const recentRecruiters = stats?.recentRecruiters || [];
  const recentJobs = stats?.recentJobs || [];
  const recentApplications = stats?.recentApplications || [];

  const handleUserView = (_user: AdminUser) => {};

  return (
    <div className="space-y-8">
      {/* Analytics Cards Grid */}
      <StatsGrid stats={stats} isLoading={isLoadingStats} />

      {/* Recent Users Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiUsers className="text-[#3C65F5] text-lg" />
            <h2 className="text-lg font-extrabold text-[#05264E]">
              Recent Registered Users
            </h2>
          </div>
          <Link
            to="/admin/users"
            className="flex items-center gap-1 text-xs font-bold text-[#3C65F5] hover:underline"
          >
            <span>View All Users ({stats?.totalUsers || 0})</span>
            <FiArrowRight />
          </Link>
        </div>

        {isLoadingStats ? (
          <SkeletonLoader rows={3} />
        ) : recentUsers.length === 0 ? (
          <EmptyState
            title="No Users Registered"
            message="No user accounts have been created yet."
          />
        ) : (
          <UserTable
            users={recentUsers}
            onView={handleUserView}
            onToggleBlock={onToggleBlockUser}
          />
        )}
      </div>

      {/* Recent Recruiters Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiUserCheck className="text-indigo-600 text-lg" />
            <h2 className="text-lg font-extrabold text-[#05264E]">
              Recent Recruiters
            </h2>
          </div>
          <Link
            to="/admin/recruiters"
            className="flex items-center gap-1 text-xs font-bold text-[#3C65F5] hover:underline"
          >
            <span>View All Recruiters ({stats?.totalRecruiters || 0})</span>
            <FiArrowRight />
          </Link>
        </div>

        {isLoadingStats ? (
          <SkeletonLoader rows={3} />
        ) : recentRecruiters.length === 0 ? (
          <EmptyState
            title="No Recruiters Found"
            message="No recruiter accounts have registered yet."
          />
        ) : (
          <RecruiterTable
            recruiters={recentRecruiters}
            onToggleBlock={onToggleBlockUser}
          />
        )}
      </div>

      {/* Recent Jobs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiBriefcase className="text-indigo-600 text-lg" />
            <h2 className="text-lg font-extrabold text-[#05264E]">
              Recent Jobs Posted
            </h2>
          </div>
          <Link
            to="/admin/jobs"
            className="flex items-center gap-1 text-xs font-bold text-[#3C65F5] hover:underline"
          >
            <span>View All Jobs ({stats?.totalJobs || 0})</span>
            <FiArrowRight />
          </Link>
        </div>

        {isLoadingStats ? (
          <SkeletonLoader rows={3} />
        ) : recentJobs.length === 0 ? (
          <EmptyState
            title="No Jobs Posted"
            message="No job listings have been published yet."
          />
        ) : (
          <JobTable jobs={recentJobs} onDeleteRequest={onDeleteJobRequest} />
        )}
      </div>

      {/* Recent Applications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiFileText className="text-rose-600 text-lg" />
            <h2 className="text-lg font-extrabold text-[#05264E]">
              Recent Applications Submitted
            </h2>
          </div>
          <Link
            to="/admin/applications"
            className="flex items-center gap-1 text-xs font-bold text-[#3C65F5] hover:underline"
          >
            <span>View All Applications ({stats?.totalApplications || 0})</span>
            <FiArrowRight />
          </Link>
        </div>

        {isLoadingStats ? (
          <SkeletonLoader rows={3} />
        ) : recentApplications.length === 0 ? (
          <EmptyState
            title="No Applications Submitted"
            message="No candidate job applications have been submitted yet."
          />
        ) : (
          <ApplicationTable applications={recentApplications} />
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
