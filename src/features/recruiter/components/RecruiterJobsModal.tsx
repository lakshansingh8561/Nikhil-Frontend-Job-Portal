import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiX,
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiExternalLink,
  FiSend,
  FiAlertTriangle,
} from "react-icons/fi";
import type { RecruiterProfile } from "../types/recruiter.types";
import { useGetJobsQuery } from "../../jobBrowser/api/jobBrowserApi";
import { formatSalary, formatEmploymentType } from "../../jobBrowser/utils/salaryFormatter";
import { useAppSelector } from "../../../hooks/useAppSelector";
import ApplyJobModal from "../../applications/components/ApplyJobModal";

interface RecruiterJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recruiter: RecruiterProfile | null;
}

export const RecruiterJobsModal: React.FC<RecruiterJobsModalProps> = ({
  isOpen,
  onClose,
  recruiter,
}) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [selectedJobForApply, setSelectedJobForApply] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const companyName = recruiter
    ? recruiter.currentCompany || (recruiter.firstName ? `${recruiter.firstName} ${recruiter.lastName}` : "Company")
    : "Company";

  const recruiterUserId = recruiter
    ? typeof recruiter.userId === "object" && recruiter.userId !== null
      ? (recruiter.userId as any)._id
      : recruiter.userId
    : undefined;

  // Search jobs by recruiter ID or company name
  const { data, isLoading } = useGetJobsQuery(
    {
      recruiterId: recruiterUserId,
      search: recruiterUserId ? undefined : companyName,
      limit: 50,
    },
    { skip: !isOpen || !recruiter }
  );

  if (!isOpen || !recruiter) return null;

  const jobsList = data?.jobs || [];

  const handleViewJobDetails = (jobId: string) => {
    onClose();
    if (user?.role === "JOB_SEEKER") {
      navigate(`/job-seeker/jobs/${jobId}`);
    } else {
      navigate(`/jobs/${jobId}`);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-3xl bg-white p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[#EAEFF7] pb-5 mb-5 shrink-0">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3C65F5] font-extrabold text-white text-2xl shadow-md overflow-hidden shrink-0">
                {recruiter.profilePicture ? (
                  <img
                    src={recruiter.profilePicture}
                    alt={companyName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{companyName.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-extrabold text-[#05264E] truncate">
                  {companyName}
                </h2>
                <p className="text-xs font-semibold text-[#66789C] flex items-center gap-2 mt-0.5">
                  <span>{recruiter.designation || "Recruiter"}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FiMapPin className="text-[#3C65F5]" />
                    {recruiter.currentLocation || "Location N/A"}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8FAFC] text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer shrink-0"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Modal Content: List of Jobs posted by Recruiter */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#05264E]">
                Open Job Vacancies ({jobsList.length})
              </h3>
            </div>

            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent" />
              </div>
            ) : jobsList.length === 0 ? (
              <div className="rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] p-8 text-center">
                <FiAlertTriangle className="mx-auto text-3xl text-amber-500 mb-2" />
                <h4 className="text-sm font-bold text-[#05264E]">No Jobs Posted Yet</h4>
                <p className="text-xs text-[#66789C] mt-1">
                  This recruiter currently has no active open job listings.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobsList.map((job) => {
                  const { formattedText, period } = formatSalary(job.salaryMin, job.salaryMax);

                  return (
                    <div
                      key={job._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#EAEFF7] bg-[#F8FAFC] p-5 transition hover:border-[#3C65F5] hover:bg-white hover:shadow-sm"
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <h4 className="text-base font-bold text-[#05264E] truncate">
                          {job.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#66789C]">
                          <span className="flex items-center gap-1 font-semibold text-[#3C65F5]">
                            <FiDollarSign /> {formattedText} {period}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiMapPin /> {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiBriefcase /> {formatEmploymentType(job.employmentType)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleViewJobDetails(job._id)}
                          className="flex items-center gap-1.5 rounded-xl border border-[#EAEFF7] bg-white px-4 py-2 text-xs font-bold text-[#05264E] hover:bg-[#E8F0FE] hover:text-[#3C65F5] transition cursor-pointer"
                        >
                          <FiExternalLink /> Details
                        </button>

                        <button
                          onClick={() =>
                            setSelectedJobForApply({
                              id: job._id,
                              title: job.title,
                            })
                          }
                          className="flex items-center gap-1.5 rounded-xl bg-[#3C65F5] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#254BD6] transition cursor-pointer"
                        >
                          <FiSend /> Apply Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Apply Job Modal */}
      {selectedJobForApply && (
        <ApplyJobModal
          isOpen={Boolean(selectedJobForApply)}
          onClose={() => setSelectedJobForApply(null)}
          jobId={selectedJobForApply.id}
          jobTitle={selectedJobForApply.title}
          companyName={companyName}
        />
      )}
    </>
  );
};

export default RecruiterJobsModal;
