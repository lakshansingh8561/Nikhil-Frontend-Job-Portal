import React from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import {
  FiMapPin,
  FiBriefcase,
  FiAward,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiArrowLeft,
  FiMail,
  FiCheckCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiShare2,
} from "react-icons/fi";
import toast from "react-hot-toast";
import Container from "../../../components/common/Container";
import { useGetJobByIdQuery } from "../api/jobBrowserApi";
import { DetailSkeleton } from "../components/JobsSkeleton";
import { formatSalary, formatEmploymentType, formatExperienceLevel } from "../utils/salaryFormatter";
import { useAppSelector } from "../../../hooks/useAppSelector";

import ApplyJobModal from "../../applications/components/ApplyJobModal";
import { useGetMyApplicationsQuery } from "../../applications/api/applicationApi";
import { AIMatchScoreCard } from "../components/AIMatchScoreCard";

const defaultCompanyLogo = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);

  const isDashboardMode =
    location.pathname.startsWith("/job-seeker") || location.pathname.startsWith("/recruiter");

  const { data: job, isLoading, isError, error, refetch } = useGetJobByIdQuery(
    id || "",
    { skip: !id }
  );

  const { data: myApplications } = useGetMyApplicationsQuery(undefined, {
    skip: !isAuthenticated || user?.role !== "JOB_SEEKER",
  });

  const isApplied = Boolean(
    job?._id &&
      myApplications?.some(
        (app) => (typeof app.jobId === "object" ? app.jobId._id : app.jobId) === job._id
      )
  );

  const handleApply = () => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign up or log in to apply for jobs.");
      navigate("/register");
      return;
    }

    if (user.role !== "JOB_SEEKER") {
      toast.error("Only registered Job Seekers can apply for jobs.");
      return;
    }

    if (isApplied) {
      toast.error("You have already applied for this job.");
      return;
    }

    setIsApplyModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Job link copied to clipboard!");
    }
  };

  const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isDashboardMode) {
      return <div className="w-full pb-8">{children}</div>;
    }
    return (
      <div className="min-h-screen bg-[#F5F7FC] pt-24 pb-16">
        <Container>{children}</Container>
      </div>
    );
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <DetailSkeleton />
      </PageWrapper>
    );
  }

  if (isError || !job) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/50 p-12 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
            <FiAlertTriangle className="text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Job Not Found</h3>
          <p className="mt-2 text-xs font-medium text-gray-600 max-w-md">
            {(error as any)?.data?.message || "The requested job listing could not be found or may have expired."}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 rounded-2xl bg-white border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 cursor-pointer"
            >
              <FiRefreshCw /> Retry
            </button>
            <Link
              to={user?.role === "JOB_SEEKER" ? "/job-seeker/jobs" : "/jobs"}
              className="flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#254BD6]"
            >
              <FiArrowLeft /> Back to Jobs
            </Link>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const companyName =
    typeof job.companyId === "object" && job.companyId !== null
      ? job.companyId.companyName
      : "Company";

  const companyLogo =
    typeof job.companyId === "object" && job.companyId?.logo
      ? job.companyId.logo
      : defaultCompanyLogo;

  const companyDesc =
    typeof job.companyId === "object" && job.companyId?.description
      ? job.companyId.description
      : null;

  const recruiterEmail =
    typeof job.userId === "object" && job.userId !== null
      ? (job.userId as any).email
      : typeof job.recruiterId === "object" && job.recruiterId !== null
      ? job.recruiterId.email
      : null;

  const { formattedText, period } = formatSalary(job.salaryMin, job.salaryMax);

  const deadlineFormatted = job.deadline
    ? new Date(job.deadline).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not specified";

  const backJobsUrl = user?.role === "JOB_SEEKER" ? "/job-seeker/jobs" : "/jobs";

  return (
    <PageWrapper>
      {/* Back Link */}
      <Link
        to={backJobsUrl}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#66789C] transition hover:text-[#3C65F5] mb-5"
      >
        <FiArrowLeft /> Back to All Jobs
      </Link>

        {/* Hero Header Card */}
        <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 min-w-[80px] items-center justify-center rounded-2xl bg-[#F8FAFC] p-3 border border-[#EAEFF7] overflow-hidden shrink-0 shadow-inner">
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[#66789C]">
                    {companyName}
                  </span>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-green-600">Active Hiring</span>
                </div>

                <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#05264E]">
                  {job.title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-[#66789C]">
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="text-[#3C65F5]" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiBriefcase className="text-[#3C65F5]" /> {formatEmploymentType(job.employmentType)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiAward className="text-[#3C65F5]" /> {formatExperienceLevel(job.experienceLevel)}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
              <button
                onClick={handleShare}
                className="flex items-center justify-center h-12 w-12 rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] text-[#05264E] transition hover:bg-[#E8F0FE] hover:text-[#3C65F5] cursor-pointer shrink-0"
                title="Share Job"
              >
                <FiShare2 className="text-lg" />
              </button>
              {isApplied ? (
                <button
                  disabled
                  className="flex-1 md:flex-initial flex items-center justify-center gap-2 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 px-8 py-3.5 text-sm font-black cursor-not-allowed shadow-xs"
                >
                  <FiCheckCircle className="text-emerald-700 text-lg" /> Applied ✓
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  className="flex-1 md:flex-initial rounded-2xl bg-[#3C65F5] px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#254BD6] hover:shadow-lg cursor-pointer"
                >
                  Apply for this Job
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Left Section: Description & Skills */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview / Description */}
            <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-[#05264E] border-b border-[#EAEFF7] pb-4 mb-5">
                Job Overview & Description
              </h2>
              <div className="prose prose-blue max-w-none text-sm leading-relaxed text-[#66789C] whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Required Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-[#05264E] border-b border-[#EAEFF7] pb-4 mb-5">
                  Required Skills & Qualifications
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1.5 rounded-xl bg-[#E8F0FE] px-4 py-2 text-xs font-bold text-[#3C65F5]"
                    >
                      <FiCheckCircle className="text-xs" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Company Info */}
            {companyDesc && (
              <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 sm:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-[#05264E] border-b border-[#EAEFF7] pb-4 mb-5">
                  About {companyName}
                </h2>
                <p className="text-sm leading-relaxed text-[#66789C]">
                  {companyDesc}
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar Section: Meta Details & Recruiter Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI ATS Match Analyzer Widget */}
            <AIMatchScoreCard jobId={job._id} jobData={job} />

            {/* Key Information Box */}
            <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#05264E] border-b border-[#EAEFF7] pb-4 mb-5">
                Job Summary
              </h3>

              <div className="space-y-4">
                {/* Offered Salary */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#3C65F5] shrink-0">
                    <FiDollarSign className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#66789C]">Offered Salary</p>
                    <p className="text-sm font-bold text-[#05264E] mt-0.5">
                      {formattedText} <span className="text-xs font-normal text-gray-500">{period}</span>
                    </p>
                  </div>
                </div>

                {/* Employment Type */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#3C65F5] shrink-0">
                    <FiBriefcase className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#66789C]">Employment Type</p>
                    <p className="text-sm font-bold text-[#05264E] mt-0.5">
                      {formatEmploymentType(job.employmentType)}
                    </p>
                  </div>
                </div>

                {/* Experience Level */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#3C65F5] shrink-0">
                    <FiAward className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#66789C]">Experience Required</p>
                    <p className="text-sm font-bold text-[#05264E] mt-0.5">
                      {formatExperienceLevel(job.experienceLevel)}
                    </p>
                  </div>
                </div>

                {/* Vacancies */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#3C65F5] shrink-0">
                    <FiUsers className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#66789C]">Open Vacancies</p>
                    <p className="text-sm font-bold text-[#05264E] mt-0.5">
                      {job.vacancies} Position{job.vacancies > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Application Deadline */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FE] text-[#3C65F5] shrink-0">
                    <FiCalendar className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#66789C]">Application Deadline</p>
                    <p className="text-sm font-bold text-[#05264E] mt-0.5">
                      {deadlineFormatted}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Apply Button */}
              {isApplied ? (
                <button
                  disabled
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 py-3 text-sm font-black cursor-not-allowed shadow-xs"
                >
                  <FiCheckCircle className="text-emerald-700 text-lg" /> Applied ✓
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  className="mt-6 flex w-full items-center justify-center rounded-2xl bg-[#3C65F5] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#254BD6] cursor-pointer"
                >
                  Apply Now
                </button>
              )}
            </div>

            {/* Recruiter Information Card */}
            <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#05264E] border-b border-[#EAEFF7] pb-4 mb-4">
                Recruiter Information
              </h3>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3C65F5] text-white font-bold text-base shadow-sm">
                  {recruiterEmail ? recruiterEmail.charAt(0).toUpperCase() : "R"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#05264E]">Hiring Manager</p>
                  <p className="text-xs text-[#66789C] flex items-center gap-1.5 mt-0.5 truncate">
                    <FiMail className="text-gray-400 shrink-0" />
                    <span className="truncate">{recruiterEmail || "recruiter@jobbox.com"}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Apply Job Modal */}
      {job && (
        <ApplyJobModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          jobId={job._id}
          jobTitle={job.title}
          companyName={companyName}
        />
      )}
    </PageWrapper>
  );
};

export default JobDetails;
