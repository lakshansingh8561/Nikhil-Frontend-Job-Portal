import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiMapPin,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiMessageSquare,
} from "react-icons/fi";
import type { Application } from "../types/application.types";
import StatusBadge from "./StatusBadge";
import ResumeViewer from "./ResumeViewer";

interface ApplicationCardProps {
  application: Application;
}

const defaultCompanyLogo = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
}) => {
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  const job =
    typeof application.jobId === "object" && application.jobId !== null
      ? application.jobId
      : null;

  const jobId = job?._id || (typeof application.jobId === "string" ? application.jobId : "");
  const jobTitle = job?.title || "Job Position";

  const company =
    job && typeof job.companyId === "object" && job.companyId !== null
      ? job.companyId
      : null;

  const companyName = company?.companyName || "Company";
  const companyLogo = company?.logo || defaultCompanyLogo;
  const location = job?.location || "Location";

  const appliedDate = application.createdAt
    ? new Date(application.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#3C65F5]/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Company & Job Info */}
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#66789C]">
                {companyName}
              </span>
              <span className="inline-block h-1 w-1 rounded-full bg-gray-300" />
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <FiMapPin className="text-gray-400" /> {location}
              </span>
            </div>

            <h3 className="mt-1 text-lg font-bold text-[#05264E] group-hover:text-[#3C65F5] transition-colors line-clamp-1">
              {jobTitle}
            </h3>

            <div className="mt-2 flex items-center gap-4 text-xs font-medium text-[#66789C]">
              <span className="flex items-center gap-1">
                <FiCalendar className="text-gray-400" /> Applied: {appliedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions: Status Badge & Resume & View Job & Chat */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
          <StatusBadge status={application.status} />

          <ResumeViewer resumeUrl={application.resume} />

          {jobId && (
            <>
              <Link
                to={`/job-seeker/messages?jobId=${jobId}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
              >
                <FiMessageSquare /> Chat with Recruiter
              </Link>

              <Link
                to={`/jobs/${jobId}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#F8FAFC] border border-[#EAEFF7] px-3.5 py-1.5 text-xs font-bold text-[#05264E] transition hover:bg-[#E8F0FE] hover:text-[#3C65F5]"
              >
                <FiExternalLink /> View Job
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Cover Letter Preview Accordion */}
      {application.coverLetter && (
        <div className="mt-4 border-t border-[#F0F4FC] pt-3">
          <button
            onClick={() => setShowCoverLetter(!showCoverLetter)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#3C65F5] hover:underline cursor-pointer"
          >
            <span>{showCoverLetter ? "Hide Cover Letter" : "View Cover Letter"}</span>
            {showCoverLetter ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {showCoverLetter && (
            <div className="mt-2.5 rounded-2xl bg-[#F8FAFC] p-4 text-xs leading-relaxed text-[#66789C] border border-[#EAEFF7]">
              <p className="font-semibold text-[#05264E] mb-1">Cover Letter:</p>
              <p className="whitespace-pre-line">{application.coverLetter}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
