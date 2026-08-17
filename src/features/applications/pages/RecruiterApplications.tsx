import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiBriefcase,
  FiAlertTriangle,
  FiRefreshCw,
  FiSearch,
  FiLayers,
} from "react-icons/fi";
import ScrollToTop from "../../../components/common/ScrollToTop";
import {
  useGetApplicationsForJobQuery,
  useGetRecruiterAllApplicationsQuery,
} from "../api/applicationApi";
import { useGetRecruiterJobsQuery } from "../../jobs/api/jobsApi";
import ApplicantCard from "../components/ApplicantCard";
import ApplicationSkeleton from "../components/ApplicationSkeleton";
import EmptyApplications from "../components/EmptyApplications";
import type { ApplicationStatus } from "../types/application.types";

export const RecruiterApplications: React.FC = () => {
  const { jobId: paramJobId } = useParams<{ jobId?: string }>();
  const navigate = useNavigate();

  // Fetch recruiter's posted jobs to allow job selection
  const { data: recruiterJobs, isLoading: isLoadingJobs } =
    useGetRecruiterJobsQuery();

  const jobsList = recruiterJobs || [];

  // Active selected job state (empty string means All Jobs)
  const [selectedJobId, setSelectedJobId] = useState<string>(
    paramJobId || ""
  );
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (paramJobId) {
      setSelectedJobId(paramJobId);
    }
  }, [paramJobId]);

  // Query for all recruiter applications
  const {
    data: allApplicationsData,
    isLoading: isLoadingAllApps,
    isError: isErrorAll,
    error: errorAll,
    refetch: refetchAll,
  } = useGetRecruiterAllApplicationsQuery(undefined, {
    skip: Boolean(selectedJobId),
  });

  // Query for job-specific applications
  const {
    data: jobApplicationsData,
    isLoading: isLoadingJobApps,
    isError: isErrorJob,
    error: errorJob,
    refetch: refetchJob,
  } = useGetApplicationsForJobQuery(selectedJobId, {
    skip: !selectedJobId,
  });

  const applications = selectedJobId ? jobApplicationsData : allApplicationsData;
  const isLoadingApps = selectedJobId ? isLoadingJobApps : isLoadingAllApps;
  const isError = selectedJobId ? isErrorJob : isErrorAll;
  const error = selectedJobId ? errorJob : errorAll;
  const refetch = selectedJobId ? refetchJob : refetchAll;

  const allApplicants = applications || [];

  // Active job details object if a specific job is selected
  const activeJob = jobsList.find((j) => j._id === selectedJobId);

  // Filtering applicants
  const filteredApplicants = allApplicants.filter((app) => {
    const rawStatus = (app.status || "").toUpperCase();

    // Map backend status to filter tabs
    let matchesStatus = false;
    if (statusFilter === "ALL") {
      matchesStatus = true;
    } else if (statusFilter === "APPLIED") {
      matchesStatus =
        rawStatus === "APPLIED" ||
        rawStatus === "SUBMITTED" ||
        rawStatus === "UNDER_REVIEW";
    } else if (statusFilter === "SHORTLISTED") {
      matchesStatus = rawStatus === "SHORTLISTED";
    } else if (statusFilter === "INTERVIEW") {
      matchesStatus =
        rawStatus === "INTERVIEW" || rawStatus === "INTERVIEW_SCHEDULED";
    } else if (statusFilter === "REJECTED") {
      matchesStatus = rawStatus === "REJECTED";
    } else if (statusFilter === "HIRED") {
      matchesStatus = rawStatus === "HIRED" || rawStatus === "OFFERED";
    } else {
      matchesStatus = rawStatus === statusFilter;
    }

    const applicant =
      typeof app.applicantId === "object" && app.applicantId !== null
        ? app.applicantId
        : null;

    const applicantName = applicant
      ? `${applicant.firstName || ""} ${applicant.lastName || ""}`
      : typeof app.applicantProfile === "object" && app.applicantProfile !== null
      ? `${app.applicantProfile.firstName || ""} ${app.applicantProfile.lastName || ""}`
      : "";

    const email =
      applicant && typeof applicant.userId === "object" && applicant.userId !== null
        ? applicant.userId.email
        : typeof app.userId === "object" && app.userId !== null
        ? (app.userId as any).email || ""
        : "";

    const jobTitle =
      typeof app.jobId === "object" && app.jobId !== null
        ? app.jobId.title || ""
        : "";

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      applicantName.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      jobTitle.toLowerCase().includes(searchLower) ||
      (applicant?.headline && applicant.headline.toLowerCase().includes(searchLower));

    return matchesStatus && matchesSearch;
  });

  const handleJobSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newJobId = e.target.value;
    setSelectedJobId(newJobId);
    if (newJobId) {
      navigate(`/recruiter/jobs/${newJobId}/applications`, { replace: true });
    } else {
      navigate(`/recruiter/applications`, { replace: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAEFF7] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#05264E]">
            Applicant Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-[#66789C]">
            Review candidate resumes, evaluate cover letters, and update application statuses
          </p>
        </div>

        {/* Job Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-[#05264E] whitespace-nowrap flex items-center gap-1.5">
            <FiBriefcase className="text-[#1D4ED8]" /> Filter by Job:
          </label>
          <select
            value={selectedJobId}
            onChange={handleJobSelectChange}
            disabled={isLoadingJobs}
            className="rounded-2xl border border-[#EAEFF7] bg-white px-4 py-2.5 text-xs font-bold text-[#05264E] shadow-sm outline-none focus:border-[#1D4ED8] cursor-pointer max-w-xs truncate"
          >
            <option value="">All Posted Jobs (All Applications)</option>
            {jobsList.map((j) => (
              <option key={j._id} value={j._id}>
                {j.title} ({j.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Job Meta Information Banner */}
      {selectedJobId && activeJob ? (
        <div className="rounded-2xl border border-[#EAEFF7] bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#05264E]">{activeJob.title}</h2>
            <p className="text-xs text-[#66789C] mt-0.5">
              Location: <span className="font-semibold text-[#05264E]">{activeJob.location}</span> • 
              Vacancies: <span className="font-semibold text-[#05264E]">{activeJob.vacancies}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#E8F0FE] px-3.5 py-1.5 text-xs font-bold text-[#3C65F5]">
            <FiUsers />
            <span>{allApplicants.length} Total Applicants</span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#EAEFF7] bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#1D4ED8] font-bold">
              <FiLayers className="text-lg" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#05264E]">All Posted Jobs Workspace</h2>
              <p className="text-xs text-[#66789C] mt-0.5">
                Showing candidate applications submitted across all your active job postings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-[#E8F0FE] px-3.5 py-1.5 text-xs font-bold text-[#3C65F5]">
            <FiUsers />
            <span>{allApplicants.length} Total Applicants</span>
          </div>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#EAEFF7] bg-white p-4 shadow-sm">
        {/* Search Input */}
        <div className="flex items-center gap-2.5 rounded-xl bg-[#F8FAFC] px-3.5 py-2 border border-[#EAEFF7] w-full sm:w-72">
          <FiSearch className="text-gray-400 text-sm shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by candidate, job title..."
            className="w-full bg-transparent text-xs font-medium text-[#05264E] outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Applicants" },
            { id: "APPLIED", label: "Applied" },
            { id: "SHORTLISTED", label: "Shortlisted" },
            { id: "INTERVIEW", label: "Interview" },
            { id: "REJECTED", label: "Rejected" },
            { id: "HIRED", label: "Hired" },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as ApplicationStatus | "ALL")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#1D4ED8] text-white shadow-sm"
                    : "bg-[#F8FAFC] text-[#66789C] hover:bg-[#E8F0FE] hover:text-[#1D4ED8]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Applicants List */}
      {isLoadingApps || isLoadingJobs ? (
        <ApplicationSkeleton count={4} />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/50 p-12 text-center shadow-sm min-h-[360px]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
            <FiAlertTriangle className="text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Failed to Load Applicants
          </h3>
          <p className="mt-1 max-w-md text-xs font-medium text-gray-600">
            {(error as any)?.data?.message ||
              "There was an error fetching candidates for this view."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-6 flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#254BD6] cursor-pointer"
          >
            <FiRefreshCw /> Retry Loading
          </button>
        </div>
      ) : filteredApplicants.length === 0 ? (
        <EmptyApplications
          title={
            searchTerm || statusFilter !== "ALL"
              ? "No Matching Applicants"
              : "No Applicants Yet"
          }
          message={
            searchTerm || statusFilter !== "ALL"
              ? "Try adjusting your search query or status filter."
              : "No candidates have applied to your job postings yet."
          }
          isRecruiter={true}
        />
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((app) => (
            <ApplicantCard key={app._id} application={app} />
          ))}
        </div>
      )}

      <ScrollToTop />
    </div>
  );
};

export default RecruiterApplications;
