import React from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCheckCircle } from "react-icons/fi";
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

  const companyName =
    typeof job.companyId === "object" && job.companyId !== null
      ? job.companyId.companyName
      : "Hiring Company";

  const customLogo =
    typeof job.companyId === "object" && job.companyId?.logo
      ? job.companyId.logo
      : undefined;

  const fallbackLogo = getFallbackLogo(job._id || "1");
  const logoSrc =
    customLogo && customLogo.trim().length > 5 && (customLogo.startsWith("http") || customLogo.startsWith("/"))
      ? customLogo
      : fallbackLogo;

  const skillsList = job.skills || [];

  const formattedSalary =
    job.salaryMin && job.salaryMax
      ? job.salaryMin >= 1000
        ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}`
        : `$${job.salaryMin} – $${job.salaryMax}`
      : job.salaryMin
      ? `$${job.salaryMin.toLocaleString()}`
      : "Competitive";

  const salaryUnit = job.salaryMin && job.salaryMin >= 1000 ? "/yr" : "";

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
      className="saas-card-interactive p-5 flex flex-col justify-between cursor-pointer min-h-[300px]"
    >
      <div>
        {/* Top Header: Logo + Info */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 min-w-[44px] items-center justify-center rounded-xl bg-slate-50 p-2 border border-slate-200 overflow-hidden shrink-0">
              <img
                src={logoSrc}
                alt={companyName}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackLogo;
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {companyName}
              </h4>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate font-medium">
                <FiMapPin className="text-slate-400 shrink-0" />
                <span className="truncate">{job.location}</span>
              </p>
            </div>
          </div>

          <span className="saas-badge saas-badge-indigo shrink-0 text-[10px]">
            {job.employmentType ? job.employmentType.replace("_", " ") : "Full-time"}
          </span>
        </div>

        {/* Job Title */}
        <h3 className="mt-3.5 text-base font-bold text-slate-900 leading-snug transition-colors group-hover:text-indigo-600 line-clamp-1">
          {job.title}
        </h3>

        {/* Description Snippet */}
        <p className="mt-2 text-xs font-normal leading-relaxed text-slate-600 line-clamp-2">
          {job.description}
        </p>

        {/* Skill Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {skillsList.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="saas-badge saas-badge-neutral text-[10px]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Section: Salary & Apply Button */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
        <div>
          <span className="text-base font-extrabold text-slate-900">
            {formattedSalary}
          </span>
          <span className="text-xs font-semibold text-slate-500 ml-0.5">{salaryUnit}</span>
        </div>

        {isApplied ? (
          <button
            disabled
            onClick={(e) => e.stopPropagation()}
            className="saas-badge saas-badge-emerald py-1.5 px-3 text-xs"
          >
            <FiCheckCircle /> Applied
          </button>
        ) : (
          <button
            onClick={handleApply}
            className="saas-btn-primary h-8 text-xs px-3.5"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
