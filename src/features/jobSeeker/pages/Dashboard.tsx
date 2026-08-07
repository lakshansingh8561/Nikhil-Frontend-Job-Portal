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
  const { data: currentSub } = useGetCurrentSubscriptionQuery();

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

  // Profile completion calculation
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
  const matchingJobs = jobsResponse?.jobs || [];
  const totalActiveJobs = jobsResponse?.pagination?.total || matchingJobs.length;

  return (
    <div className="h-full overflow-y-auto overscroll-contain pr-1 pb-12 space-y-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-[#EAEFF7] bg-gradient-to-r from-[#05264E] to-[#1D4ED8] p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-blue-200 backdrop-blur-xs mb-3 border border-white/10">
              <FiAward /> Job Seeker Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome Back, {candidateName}! 👋
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-medium text-blue-100 max-w-xl">
              {profile?.headline ||
                "Keep your profile updated, track application statuses, and discover new matching job openings."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/job-seeker/profile"
              className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-[#05264E] shadow-sm transition hover:bg-blue-50 cursor-pointer"
            >
              <FiUser /> Edit Profile
            </Link>
            <Link
              to="/job-seeker/jobs"
              className="flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#254BD6] cursor-pointer border border-blue-400/30"
            >
              <FiSearch /> Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Applications */}
        <div className="flex items-center justify-between rounded-3xl border border-[#EAEFF7] bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold text-[#66789C] uppercase tracking-wider">
              Applications
            </p>
            <h3 className="mt-2 text-2xl font-extrabold text-[#05264E]">
              {totalSubmitted}
            </h3>
            <p className="mt-1 text-[11px] text-[#66789C]">Total submitted</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0FE] text-[#3C65F5] shrink-0">
            <FiFileText className="text-xl" />
          </div>
        </div>

        {/* Shortlisted / Interviewing */}
        <div className="flex items-center justify-between rounded-3xl border border-[#EAEFF7] bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold text-[#66789C] uppercase tracking-wider">
              Shortlisted
            </p>
            <h3 className="mt-2 text-2xl font-extrabold text-[#05264E]">
              {shortlistedCount}
            </h3>
            <p className="mt-1 text-[11px] text-emerald-600 font-bold">
              Active candidates
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <FiCheckCircle className="text-xl" />
          </div>
        </div>

        {/* Active Membership Status & Days */}
        <div className="flex items-center justify-between rounded-3xl border border-[#EAEFF7] bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold text-[#66789C] uppercase tracking-wider">
              Membership
            </p>
            <h3 className="mt-2 text-lg font-extrabold text-[#05264E]">
              {currentSub?.subscription?.planName || currentSub?.plan?.name || "Free Tier"}
            </h3>
            {hasActiveSub ? (
              <p className="mt-1 text-[11px] text-emerald-600 font-bold">
                {daysRemaining} Active Days Left
              </p>
            ) : (
              <Link to="/job-seeker/membership" className="mt-1 text-[11px] text-[#3C65F5] font-bold hover:underline">
                Upgrade Now →
              </Link>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shrink-0">
            <FiZap className="text-xl fill-yellow-400" />
          </div>
        </div>

        {/* Profile Completion */}
        <div className="flex items-center justify-between rounded-3xl border border-[#EAEFF7] bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold text-[#66789C] uppercase tracking-wider">
              Profile Score
            </p>
            <h3 className="mt-2 text-2xl font-extrabold text-[#05264E]">
              {isLoadingProfile ? "..." : `${completionScore}%`}
            </h3>
            <p className="mt-1 text-[11px] text-[#66789C]">Completeness status</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shrink-0">
            <FiUser className="text-xl" />
          </div>
        </div>

        {/* Matching Jobs */}
        <div className="flex items-center justify-between rounded-3xl border border-[#EAEFF7] bg-white p-5 shadow-xs">
          <div>
            <p className="text-xs font-bold text-[#66789C] uppercase tracking-wider">
              Available Jobs
            </p>
            <h3 className="mt-2 text-2xl font-extrabold text-[#05264E]">
              {totalActiveJobs}
            </h3>
            <p className="mt-1 text-[11px] text-[#3C65F5] font-bold">Active openings</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5] shrink-0">
            <FiBriefcase className="text-xl" />
          </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Applications */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#05264E]">
              Recent Submitted Applications
            </h2>
            <Link
              to="/job-seeker/applications"
              className="flex items-center gap-1 text-xs font-bold text-[#3C65F5] hover:underline"
            >
              <span>View All Applications</span>
              <FiArrowRight />
            </Link>
          </div>

          {isLoadingApps ? (
            <ApplicationSkeleton count={3} />
          ) : recentApps.length === 0 ? (
            <div className="rounded-3xl border border-[#EAEFF7] bg-white p-8 text-center shadow-xs">
              <FiClock className="mx-auto text-3xl text-gray-300 mb-2" />
              <h3 className="text-sm font-bold text-[#05264E]">
                No Submitted Applications Yet
              </h3>
              <p className="text-xs text-[#66789C] mt-1 mb-4">
                Explore available job postings and apply with your uploaded resume.
              </p>
              <Link
                to="/job-seeker/jobs"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#254BD6]"
              >
                <FiSearch /> Browse Active Jobs
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-[#EAEFF7] bg-white shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F0F4FC] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#66789C]">
                    <th className="py-3.5 px-5">Job Title & Company</th>
                    <th className="py-3.5 px-5">Resume</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5">Applied Date</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F4FC] text-xs font-medium">
                  {recentApps.map((app) => {
                    const job = typeof app.jobId === "object" ? app.jobId : null;
                    const jobId = job?._id || (typeof app.jobId === "string" ? app.jobId : "");
                    const company =
                      job && typeof job.companyId === "object" ? job.companyId : null;

                    return (
                      <tr key={app._id} className="hover:bg-[#F8FAFC] transition">
                        <td className="py-3.5 px-5">
                          <div>
                            <p className="font-bold text-[#05264E]">
                              {job?.title || "Applied Job"}
                            </p>
                            <p className="text-[11px] font-semibold text-[#3C65F5]">
                              {company?.companyName || "Company"}
                            </p>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <ResumeViewer resumeUrl={app.resume} applicantName={candidateName} />
                        </td>
                        <td className="py-3.5 px-5">
                          <StatusBadge status={app.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-5 text-[#66789C]">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          {jobId && (
                            <Link
                              to={`/job-seeker/messages?jobId=${jobId}`}
                              className="inline-flex items-center gap-1 rounded-xl bg-[#3C65F5] px-3 py-1.5 text-[11px] font-bold text-white shadow-2xs hover:bg-blue-700"
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
          )}
        </div>

        {/* Right Column: Profile Summary & Job Highlights */}
        <div className="lg:col-span-4 space-y-6">
          {/* Candidate Profile Widget */}
          <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#05264E] border-b border-[#F0F4FC] pb-3 mb-4">
              Profile Qualifications
            </h3>

            <div className="space-y-3.5">
              <div>
                <p className="text-[11px] font-bold text-[#66789C] uppercase">
                  Headline
                </p>
                <p className="text-xs font-semibold text-[#05264E] mt-0.5">
                  {profile?.headline || "Add a professional headline"}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#66789C] uppercase">
                  Uploaded Resume
                </p>
                <div className="mt-1">
                  {profile?.resume ? (
                    <ResumeViewer resumeUrl={profile.resume} applicantName={candidateName} />
                  ) : (
                    <span className="text-xs text-amber-600 font-medium">
                      No resume uploaded yet
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#66789C] uppercase mb-1.5">
                  Top Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.slice(0, 5).map((s: string) => (
                      <span
                        key={s}
                        className="rounded-lg bg-[#E8F0FE] px-2.5 py-1 text-[11px] font-bold text-[#3C65F5]"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No skills added</span>
                  )}
                </div>
              </div>

              <Link
                to="/job-seeker/profile"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F8FAFC] py-2.5 text-xs font-bold text-[#3C65F5] border border-[#EAEFF7] hover:bg-[#E8F0FE] transition"
              >
                <FiUser /> Manage Full Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
