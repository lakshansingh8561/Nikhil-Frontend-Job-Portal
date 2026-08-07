import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiAward,
  FiUsers,
  FiZap,
  FiExternalLink,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import type { JobBrowserItem } from "../types/jobBrowser.types";
import { formatSalary, formatEmploymentType, formatExperienceLevel } from "../utils/salaryFormatter";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useGetMyApplicationsQuery } from "../../applications/api/applicationApi";

import companyLogo1 from "../../../assets/images/company-logo1.png";
import companyLogo2 from "../../../assets/images/company-logo2.png";
import companyLogo3 from "../../../assets/images/company-logo3.png";
import companyLogo4 from "../../../assets/images/companyl-logo-4.png";
import companyLogo5 from "../../../assets/images/company-logo5.png";

const companyLogos = [
  companyLogo1,
  companyLogo2,
  companyLogo3,
  companyLogo4,
  companyLogo5,
];

interface JobCardProps {
  job: JobBrowserItem;
  layout?: "grid" | "list";
}

const JobCard: React.FC<JobCardProps> = ({ job, layout = "grid" }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: myApplications } = useGetMyApplicationsQuery(undefined, {
    skip: !isAuthenticated || user?.role !== "JOB_SEEKER",
  });

  const isApplied = Boolean(
    myApplications?.some(
      (app) => (typeof app.jobId === "object" ? app.jobId._id : app.jobId) === job._id
    )
  );

  const companyName =
    typeof job.companyId === "object" && job.companyId !== null
      ? job.companyId.companyName
      : "Company";

  // Pick one of the company logos based on job ID hash if logo is missing
  const getFallbackLogo = (idStr: string) => {
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash += idStr.charCodeAt(i);
    }
    return companyLogos[Math.abs(hash) % companyLogos.length];
  };

  const companyLogo =
    typeof job.companyId === "object" && job.companyId?.logo
      ? job.companyId.logo
      : getFallbackLogo(job._id || "1");

  const { formattedText, period } = formatSalary(job.salaryMin, job.salaryMax);

  const getJobDetailsUrl = (jobId: string) => {
    return user?.role === "JOB_SEEKER" ? `/job-seeker/jobs/${jobId}` : `/jobs/${jobId}`;
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error("Please sign up or log in to apply for jobs.");
      navigate("/register");
      return;
    }
    if (user.role !== "JOB_SEEKER") {
      toast.error("Only registered Job Seekers can apply for jobs.");
      return;
    }

    // Navigate to job details within job seeker dashboard workspace
    navigate(`/job-seeker/jobs/${job._id}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(getJobDetailsUrl(job._id));
  };

  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Recently";

  if (layout === "list") {
    return (
      <div
        onClick={handleViewDetails}
        className="group relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#3C65F5]/30 cursor-pointer"
      >
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="flex h-14 w-14 min-w-[56px] items-center justify-center rounded-2xl bg-[#F8FAFC] p-2 border border-[#EAEFF7] overflow-hidden shrink-0">
            <img
              src={companyLogo}
              alt={companyName}
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-[#66789C]">
                {companyName}
              </span>
              <span className="inline-block h-1 w-1 rounded-full bg-gray-300" />
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <FiMapPin className="text-gray-400" /> {job.location}
              </span>
            </div>

            <h3 className="mt-1 text-lg font-bold text-[#05264E] group-hover:text-[#3C65F5] transition-colors line-clamp-1">
              {job.title}
            </h3>

            <div className="mt-2.5 flex items-center gap-4 text-xs font-medium text-[#66789C] flex-wrap">
              <span className="flex items-center gap-1 bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#EAEFF7]">
                <FiBriefcase className="text-[#3C65F5]" />
                {formatEmploymentType(job.employmentType)}
              </span>
              <span className="flex items-center gap-1 bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#EAEFF7]">
                <FiAward className="text-[#3C65F5]" />
                {formatExperienceLevel(job.experienceLevel)}
              </span>
              <span className="flex items-center gap-1 bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#EAEFF7]">
                <FiUsers className="text-[#3C65F5]" />
                {job.vacancies} {job.vacancies === 1 ? "Vacancy" : "Vacancies"}
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <FiClock /> {postedDate}
              </span>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-[#F2F5F9] px-2 py-0.5 text-[11px] font-medium text-[#66789C]"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 4 && (
                  <span className="text-[11px] font-medium text-gray-400">
                    +{job.skills.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Salary & Actions */}
        <div className="flex flex-col md:items-end justify-between gap-3 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
          <div>
            <div className="text-right font-extrabold text-[#3C65F5] text-lg">
              {formattedText}
            </div>
            <div className="text-right text-xs font-semibold text-[#66789C]">
              {period}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleViewDetails}
              className="flex items-center gap-1 rounded-xl bg-[#F8FAFC] px-3.5 py-2 text-xs font-semibold text-[#05264E] border border-[#EAEFF7] transition hover:bg-[#E8F0FE] hover:text-[#3C65F5] cursor-pointer"
            >
              <FiExternalLink /> View Details
            </button>
            {isApplied ? (
              <button
                disabled
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-2 text-xs font-extrabold cursor-not-allowed shadow-2xs"
              >
                <FiCheckCircle className="text-emerald-700" /> Applied ✓
              </button>
            ) : (
              <button
                onClick={handleApplyClick}
                className="rounded-xl bg-[#3C65F5] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#254BD6] shadow-sm cursor-pointer"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (Default)
  return (
    <div
      onClick={handleViewDetails}
      className="group relative flex flex-col justify-between rounded-2xl border border-[#EAEFF7] bg-white p-4.5 sm:p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#3C65F5]/30 cursor-pointer min-h-[300px]"
    >
      <div>
        {/* Header: Company Logo + Name + Zap Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 min-w-[44px] items-center justify-center rounded-xl bg-[#F8FAFC] p-1.5 border border-[#EAEFF7] overflow-hidden shrink-0">
              <img
                src={companyLogo}
                alt={companyName}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getFallbackLogo(job._id || "1");
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[13px] font-semibold text-[#05264E] truncate">
                {companyName}
              </h4>
              <p className="text-[11px] text-[#66789C] flex items-center gap-1 mt-0.5 truncate">
                <FiMapPin className="text-gray-400 shrink-0" />
                <span className="truncate">{job.location}</span>
              </p>
            </div>
          </div>

          <div className="flex h-7 w-7 min-w-[28px] items-center justify-center rounded-lg bg-[#E6F9F0] text-[#00BA63] shrink-0">
            <FiZap className="text-[11px]" />
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-[15px] font-bold text-[#05264E] leading-snug group-hover:text-[#3C65F5] transition-colors line-clamp-1">
          {job.title}
        </h3>

        {/* Meta badges */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#66789C]">
          <span className="flex items-center gap-1 rounded-md bg-[#F8FAFC] px-2 py-0.5 border border-[#EAEFF7]">
            <FiBriefcase className="text-[#3C65F5] text-[11px]" />
            {formatEmploymentType(job.employmentType)}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-[#F8FAFC] px-2 py-0.5 border border-[#EAEFF7]">
            <FiAward className="text-[#3C65F5] text-[11px]" />
            {formatExperienceLevel(job.experienceLevel)}
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-[10px] ml-auto">
            <FiClock /> {postedDate}
          </span>
        </div>

        {/* Description snippet */}
        <p className="mt-2 text-xs text-[#66789C] line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills */}
        <div className="mt-3 flex flex-wrap gap-1">
          {job.skills && job.skills.length > 0
            ? job.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-[#F2F5F9] px-2 py-0.5 text-[10px] font-medium text-[#66789C]"
                >
                  {skill}
                </span>
              ))
            : null}
          {job.skills && job.skills.length > 3 && (
            <span className="rounded-md bg-[#F2F5F9] px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
              +{job.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Salary & Actions */}
      <div className="mt-4 border-t border-[#F0F4FC] pt-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm sm:text-base font-extrabold text-[#3C65F5]">
              {formattedText}
            </span>
            <span className="text-[11px] font-semibold text-[#66789C] ml-1">
              {period}
            </span>
          </div>

          <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-md">
            <FiUsers className="text-[#3C65F5]" /> {job.vacancies} Openings
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleViewDetails}
            className="flex items-center justify-center gap-1 rounded-lg bg-[#F8FAFC] py-1.5 text-xs font-semibold text-[#05264E] border border-[#EAEFF7] transition hover:bg-[#E8F0FE] hover:text-[#3C65F5] cursor-pointer"
          >
            <FiExternalLink /> Details
          </button>
          {isApplied ? (
            <button
              disabled
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 py-1.5 text-xs font-extrabold cursor-not-allowed shadow-2xs"
            >
              <FiCheckCircle className="text-emerald-700" /> Applied ✓
            </button>
          ) : (
            <button
              onClick={handleApplyClick}
              className="rounded-lg bg-[#3C65F5] py-1.5 text-xs font-semibold text-white transition hover:bg-[#254BD6] shadow-2xs cursor-pointer"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
