import React from "react";
import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiUser,
  FiArrowRight,
  FiAward,
  FiFileText,
  FiMessageSquare,
  FiZap,
} from "react-icons/fi";
import { useGetProfileQuery } from "../api/jobSeekerApi";
import { useGetMyApplicationsQuery } from "../../applications/api/applicationApi";
import { useGetJobsQuery } from "../../jobBrowser/api/jobBrowserApi";
import { useGetCurrentSubscriptionQuery } from "../../membership/api/membershipApi";
import StatusBadge from "../../applications/components/StatusBadge";
import ResumeViewer from "../../applications/components/ResumeViewer";
import ApplicationSkeleton from "../../applications/components/ApplicationSkeleton";
import { useAppSelector } from "../../../hooks/useAppSelector";

export const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: profile, isLoading: isLoadingProfile } = useGetProfileQuery();
  const { data: applications, isLoading: isLoadingApps } = useGetMyApplicationsQuery();
  const { data: jobsResponse } = useGetJobsQuery({ limit: 5 });
  const { data: currentSub } = useGetCurrentSubscriptionQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const sub = currentSub?.subscription;
  const hasActiveSub = Boolean(currentSub?.hasActiveSubscription && sub?.status === "ACTIVE");
  const daysRemaining = sub?.endDate
    ? Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const allApplications = applications || [];
  const totalSubmitted = allApplications.length;

  const shortlistedCount = allApplications.filter(
    (app) => app.status === "SHORTLISTED" || app.status === "INTERVIEW" || app.status === "HIRED"
  ).length;

  let completionScore = 0;
  if (profile) {
    if (profile.firstName && profile.lastName) completionScore += 20;
    if (profile.headline) completionScore += 20;
    if (profile.resume) completionScore += 20;
    if (profile.skills && profile.skills.length > 0) completionScore += 20;
    if ((profile.education && profile.education.length > 0) || (profile.experience && profile.experience.length > 0)) {
      completionScore += 20;
    }
  }

  const candidateName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || user?.email?.split("@")[0] || "Candidate"
    : user?.email?.split("@")[0] || "Candidate";

  const recentApps = allApplications.slice(0, 4);

  return (
    <div className="space-y-6 pb-10">
      {/* Welcome Banner */}
      <div className="saas-card p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 saas-badge saas-badge-indigo mb-3">
              <FiAward /> Candidate Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back, {candidateName}! 👋
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 max-w-xl">
              {profile?.headline ||
                "Track application statuses, manage profile qualifications, and discover matching job opportunities."}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/job-seeker/profile"
              className="saas-btn-secondary h-9 text-xs"
            >
              <FiUser /> Edit Profile
            </Link>
            <Link
              to="/job-seeker/jobs"
              className="saas-btn-primary h-9 text-xs"
            >
              <FiSearch /> Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Applications */}
        <div className="saas-card p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Applications
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
              {totalSubmitted}
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-400">Total submitted</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <FiFileText className="text-lg" />
          </div>
        </div>

        {/* Shortlisted / Interviewing */}
        <div className="saas-card p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Shortlisted
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
              {shortlistedCount}
            </h3>
            <p className="mt-0.5 text-[11px] text-emerald-600 font-semibold">
              Active candidate status
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <FiCheckCircle className="text-lg" />
          </div>
        </div>

        {/* Membership */}
        <div className="saas-card p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Membership
            </p>
            <h3 className="mt-1 text-base font-extrabold text-slate-900 truncate max-w-[110px]">
              {currentSub?.subscription?.planName || currentSub?.plan?.name || "Free Tier"}
            </h3>
            {hasActiveSub ? (
              <p className="mt-0.5 text-[11px] text-emerald-600 font-semibold">
                {daysRemaining} Days Left
              </p>
            ) : (
              <Link to="/job-seeker/membership" className="mt-0.5 text-[11px] text-indigo-600 font-semibold hover:underline">
                Upgrade Plan →
              </Link>
            )}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <FiZap className="text-lg" />
          </div>
        </div>

        {/* Profile Completion */}
        <div className="saas-card p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Completeness
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
              {isLoadingProfile ? "..." : `${completionScore}%`}
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-400">Profile score</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <FiUser className="text-lg" />
          </div>
        </div>

        {/* Matching Jobs */}
        <div className="saas-card p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Jobs
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
              {jobsResponse?.pagination?.total || jobsResponse?.jobs?.length || 0}
            </h3>
            <p className="mt-0.5 text-[11px] text-indigo-600 font-semibold">Open positions</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FiBriefcase className="text-lg" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applications */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Recent Submitted Applications
            </h2>
            <Link
              to="/job-seeker/applications"
              className="saas-btn-secondary h-8 text-xs px-3"
            >
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>

          {isLoadingApps ? (
            <ApplicationSkeleton count={3} />
          ) : recentApps.length === 0 ? (
            <div className="saas-card p-8 text-center">
              <FiClock className="mx-auto text-2xl text-slate-400 mb-2" />
              <h3 className="text-sm font-bold text-slate-900">
                No Applications Submitted Yet
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Explore active job postings and submit your application.
              </p>
              <Link
                to="/job-seeker/jobs"
                className="saas-btn-primary"
              >
                <FiSearch /> Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="saas-card p-0 overflow-hidden">
              <div className="table-responsive">
                <table className="w-full text-left border-collapse min-w-[540px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-2.5 px-4">Job Title & Company</th>
                      <th className="py-2.5 px-4">Resume</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Applied Date</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {recentApps.map((app) => {
                      const job = typeof app.jobId === "object" ? app.jobId : null;
                      const jobId = job?._id || (typeof app.jobId === "string" ? app.jobId : "");
                      const company =
                        job && typeof job.companyId === "object" ? job.companyId : null;

                      return (
                        <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">
                                {job?.title || "Applied Position"}
                              </p>
                              <p className="text-[11px] font-semibold text-indigo-600 line-clamp-1">
                                {company?.companyName || "Hiring Company"}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <ResumeViewer resumeUrl={app.resume} applicantName={candidateName} variant="compact" />
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={app.status} size="sm" />
                          </td>
                          <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            {jobId && (
                              <Link
                                to={`/job-seeker/messages?jobId=${jobId}`}
                                className="saas-btn-primary h-7 text-[11px] px-2.5"
                              >
                                <FiMessageSquare /> Chat
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Profile Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="saas-card p-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Profile Summary
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">
                  Headline
                </p>
                <p className="text-xs font-medium text-slate-900 mt-0.5">
                  {profile?.headline || "Add a professional headline"}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">
                  Uploaded Resume
                </p>
                <div className="mt-1">
                  {profile?.resume ? (
                    <ResumeViewer resumeUrl={profile.resume} applicantName={candidateName} />
                  ) : (
                    <span className="text-xs text-amber-600 font-medium">
                      No resume uploaded
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                  Top Skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.slice(0, 5).map((s: string) => (
                      <span
                        key={s}
                        className="saas-badge saas-badge-indigo text-[10px]"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No skills added</span>
                  )}
                </div>
              </div>

              <Link
                to="/job-seeker/profile"
                className="saas-btn-secondary w-full text-xs mt-3"
              >
                <FiUser /> Manage Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
