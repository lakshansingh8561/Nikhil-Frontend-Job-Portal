import React from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCheckCircle, FiBriefcase, FiClock, FiZap } from "react-icons/fi";
import toast from "react-hot-toast";
import type { Job } from "../../types/job.types";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useGetMyApplicationsQuery } from "../../features/applications/api/applicationApi";

import companyLogo1 from "../../assets/images/company-logo1.png";
import companyLogo2 from "../../assets/images/company-logo2.png";
import companyLogo3 from "../../assets/images/company-logo3.png";
import companyLogo4 from "../../assets/images/companyl-logo-4.png";
import companyLogo5 from "../../assets/images/company-logo5.png";

const companyLogos = [
  companyLogo1,
  companyLogo2,
  companyLogo3,
  companyLogo4,
  companyLogo5,
];

const getFallbackLogo = (idStr: string) => {
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash += idStr.charCodeAt(i);
  }
  return companyLogos[Math.abs(hash) % companyLogos.length];
};

const formatTimeAgo = (dateStr?: string | Date) => {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

interface JobCardProps {
  job: Job;
  onSelect?: (job: Job) => void;
}

const JobCard = ({ job, onSelect }: JobCardProps) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const { data: myApplications } = useGetMyApplicationsQuery(undefined, {
    skip: !user || user.role !== "JOB_SEEKER",
  });

  const isApplied = Boolean(
    myApplications?.some(
      (app) => (typeof app.jobId === "object" ? app.jobId._id : app.jobId) === job._id
    )
  );

  const compObj =
    typeof job.companyId === "object" && job.companyId !== null
      ? (job.companyId as any)
      : null;

  const companyName =
    compObj?.name ||
    compObj?.companyName ||
    (job as any).companyName ||
    "Hiring Company";

  const customLogo = compObj?.logo;
  const fallbackLogo = getFallbackLogo(job._id || "1");
  const logoSrc =
    customLogo &&
    customLogo.trim().length > 5 &&
    (customLogo.startsWith("http") || customLogo.startsWith("/"))
      ? customLogo
      : fallbackLogo;

  const skillsList = job.skills && job.skills.length > 0 ? job.skills : ["React", "NodeJS"];

  const formattedSalary =
    job.salaryMin && job.salaryMax
      ? job.salaryMin >= 1000
        ? `$${job.salaryMin.toLocaleString()}`
        : `$${job.salaryMin}`
      : job.salaryMin
      ? `$${job.salaryMin.toLocaleString()}`
      : "$250";

  const salaryUnit =
    job.salaryMin && job.salaryMin >= 1000 ? "/yr" : "/hour";

  const location =
    typeof job.location === "string" && job.location.trim()
      ? job.location.trim()
      : (job.location as any)?.city
      ? `${(job.location as any).city}${(job.location as any).country ? `, ${(job.location as any).country}` : ""}`
      : compObj?.location?.city
      ? `${compObj.location.city}${compObj.location.country ? `, ${compObj.location.country}` : ""}`
      : "New York, US";

  const employmentType = job.employmentType
    ? job.employmentType.replace("_", " ")
    : "Fulltime";

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign up or log in to apply for jobs.");
      navigate("/register");
      return;
    }
    if (user.role !== "JOB_SEEKER") {
      toast.error("Only registered Job Seekers can apply.");
      return;
    }

    if (onSelect) {
      onSelect(job);
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(job)}
      className="bg-white rounded-2xl border border-[#E0E6F6] hover:border-[#3C65F5]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden cursor-pointer min-h-[380px]"
    >
      <div>
        {/* Top Header — Exact DevTools specs: pt-[30px] px-5 pb-[15px] */}
        <div className="pt-[30px] px-5 pb-[15px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Company Logo */}
            <div className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#EAEFF7] p-2 overflow-hidden group-hover:scale-105 transition-transform shadow-2xs">
              <img
                src={logoSrc}
                alt={companyName}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackLogo;
                }}
              />
            </div>

            {/* Company Name & Location */}
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-bold text-[#05264E] truncate block font-['Plus_Jakarta_Sans',sans-serif]">
                {companyName}
              </h4>
              <p className="text-xs text-[#66789C] flex items-center gap-1 mt-0.5 truncate font-medium font-['Plus_Jakarta_Sans',sans-serif]">
                <FiMapPin className="text-xs text-[#94A3B8] shrink-0" />
                <span className="truncate">{location}</span>
              </p>
            </div>
          </div>

          {/* Flash / Highlight Icon */}
          <div className="text-emerald-500 hover:text-emerald-600 transition-colors shrink-0">
            <FiZap className="text-base" />
          </div>
        </div>

        {/* Bottom Content Area — Exact DevTools specs: padding 5px 20px 20px */}
        <div className="px-5 pb-5 pt-1">
          {/* Job Title */}
          <h3 className="text-base font-bold text-[#05264E] group-hover:text-[#3C65F5] transition-colors line-clamp-1 font-['Plus_Jakarta_Sans',sans-serif]">
            {job.title}
          </h3>

          {/* Employment Type & Time Ago */}
          <div className="flex items-center gap-3 text-xs text-[#66789C] mt-1.5 font-medium font-['Plus_Jakarta_Sans',sans-serif]">
            <span className="flex items-center gap-1 capitalize">
              <FiBriefcase className="text-xs text-[#94A3B8]" />
              {employmentType}
            </span>
            <span className="flex items-center gap-1">
              <FiClock className="text-xs text-[#94A3B8]" />
              {formatTimeAgo(job.createdAt)}
            </span>
          </div>

          {/* Description */}
          <p className="mt-3 text-xs font-normal leading-[18px] text-[#66789C] line-clamp-2 font-['Plus_Jakarta_Sans',sans-serif]">
            {job.description || "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur."}
          </p>

          {/* Skills Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5 min-h-[30px]">
            {skillsList.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="bg-[#EFF3FC] hover:bg-[#3C65F5] hover:text-white text-[#3C65F5] text-xs font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer select-none font-['Plus_Jakarta_Sans',sans-serif]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section — Exact DevTools specs: 95x38 Apply Now button */}
      <div className="mx-5 mb-5 pt-3.5 border-t border-[#F0F4FC] flex items-center justify-between">
        <div>
          <span className="text-[18px] font-extrabold text-[#3C65F5] font-['Plus_Jakarta_Sans',sans-serif]">
            {formattedSalary}
          </span>
          <span className="text-xs font-medium text-[#66789C] ml-0.5 font-['Plus_Jakarta_Sans',sans-serif]">
            {salaryUnit}
          </span>
        </div>

        {isApplied ? (
          <button
            disabled
            onClick={(e) => e.stopPropagation()}
            className="w-[95px] h-[38px] rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center gap-1 border border-emerald-200"
          >
            <FiCheckCircle /> Applied
          </button>
        ) : (
          <button
            onClick={handleApply}
            className="w-[95px] h-[38px] rounded-lg bg-[#EFF3FC] text-[#3C65F5] hover:bg-[#3C65F5] hover:text-white font-bold text-xs transition-all duration-200 flex items-center justify-center cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
