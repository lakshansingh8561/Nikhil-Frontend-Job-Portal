import React, { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiBriefcase,
} from "react-icons/fi";
import type { Application } from "../types/application.types";
import StatusBadge from "./StatusBadge";
import StatusDropdown from "./StatusDropdown";
import ResumeViewer from "./ResumeViewer";

interface ApplicantCardProps {
  application: Application;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({
  application,
}) => {
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  const applicant =
    typeof application.applicantId === "object" && application.applicantId !== null
      ? application.applicantId
      : null;

  const applicantName = applicant
    ? `${applicant.firstName || ""} ${applicant.lastName || ""}`.trim() || "Applicant"
    : "Applicant";

  const applicantEmail =
    applicant && typeof applicant.userId === "object" && applicant.userId !== null
      ? applicant.userId.email
      : "No Email Provided";

  const headline = applicant?.headline || "Job Candidate";
  const location = applicant?.currentLocation || "Location N/A";
  const experience = applicant?.yearsOfExperience
    ? `${applicant.yearsOfExperience} yrs exp`
    : null;

  const appliedDate = application.createdAt
    ? new Date(application.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="group relative rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#3C65F5]/30">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Applicant Header: Avatar + Info */}
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="flex h-14 w-14 min-w-[56px] items-center justify-center rounded-2xl bg-[#3C65F5] text-xl font-bold text-white shadow-md shrink-0">
            {applicantName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-bold text-[#05264E]">{applicantName}</h3>
              <StatusBadge status={application.status} size="sm" />
            </div>

            <p className="text-xs font-semibold text-[#3C65F5] mt-0.5">
              {headline}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs font-medium text-[#66789C]">
              <span className="flex items-center gap-1.5">
                <FiMail className="text-gray-400" /> {applicantEmail}
              </span>
              {applicant?.phone && (
                <span className="flex items-center gap-1.5">
                  <FiPhone className="text-gray-400" /> {applicant.phone}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <FiMapPin className="text-gray-400" /> {location}
              </span>
              {experience && (
                <span className="flex items-center gap-1.5">
                  <FiBriefcase className="text-gray-400" /> {experience}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-gray-400">
                <FiCalendar /> Applied: {appliedDate}
              </span>
            </div>

            {/* Skills */}
            {applicant?.skills && applicant.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {applicant.skills.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-[#F2F5F9] px-2 py-0.5 text-[11px] font-medium text-[#66789C]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Resume & Status Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          <ResumeViewer
            resumeUrl={application.resume}
            applicantName={applicantName}
            applicantEmail={applicantEmail}
            applicantPhone={applicant?.phone || ""}
            applicantLocation={location}
            applicantHeadline={headline}
            applicantSkills={applicant?.skills || []}
            coverLetter={application.coverLetter}
          />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#66789C]">Update Status:</span>
            <StatusDropdown
              applicationId={application._id}
              currentStatus={application.status}
            />
          </div>
        </div>
      </div>

      {/* Cover Letter Section */}
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
              <p className="font-semibold text-[#05264E] mb-1">Cover Letter Note:</p>
              <p className="whitespace-pre-line">{application.coverLetter}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicantCard;
