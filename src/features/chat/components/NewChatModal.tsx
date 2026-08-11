import React, { useState } from "react";
import { FiX, FiSearch, FiBriefcase, FiPlus } from "react-icons/fi";
import { useAppSelector } from "../../../hooks/useAppSelector";
import {
  useGetMyApplicationsQuery,
  useGetRecruiterAllApplicationsQuery,
} from "../../applications/api/applicationApi";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (payload: { jobId: string; applicantId?: string }) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const isRecruiter = user?.role === "RECRUITER";

  // Queries
  const { data: jobSeekerApps = [], isLoading: isLoadingSeeker } =
    useGetMyApplicationsQuery(undefined, { skip: !isOpen || isRecruiter });

  const { data: recruiterApps = [], isLoading: isLoadingRecruiter } =
    useGetRecruiterAllApplicationsQuery(undefined, {
      skip: !isOpen || !isRecruiter,
    });

  if (!isOpen) return null;

  const isLoading = isRecruiter ? isLoadingRecruiter : isLoadingSeeker;

  const filteredRecruiterApps = recruiterApps.filter((app: any) => {
    const q = searchTerm.toLowerCase();
    const candidateFirstName =
      app.applicantProfile?.firstName ||
      (typeof app.userId === "object" ? app.userId?.email?.split("@")[0] : "Applicant");
    const candidateLastName = app.applicantProfile?.lastName || "";
    const name = `${candidateFirstName} ${candidateLastName}`.toLowerCase();
    const jobTitle = (app.jobId as any)?.title?.toLowerCase() || "";
    return name.includes(q) || jobTitle.includes(q);
  });

  const filteredJobSeekerApps = jobSeekerApps.filter((app: any) => {
    const q = searchTerm.toLowerCase();
    const jobTitle = (app.jobId as any)?.title?.toLowerCase() || "";
    const companyName = (
      (app.jobId as any)?.companyId?.name ||
      (app.jobId as any)?.companyId?.companyName ||
      ""
    ).toLowerCase();
    return jobTitle.includes(q) || companyName.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-bubble">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#E5E7EB] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#05264E] flex items-center gap-2">
              <FiPlus className="text-[#4F46E5]" />
              {isRecruiter ? "Start Chat with Applicant" : "Start Chat with Recruiter"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {isRecruiter
                ? "Select a candidate who applied for your job postings."
                : "Select a job application to message the hiring recruiter."}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-gray-400 hover:text-gray-700 cursor-pointer rounded-full hover:bg-gray-100 transition-all duration-150"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isRecruiter
                ? "Search candidate name or job title..."
                : "Search job title or company..."
            }
            aria-label="Search candidates or jobs"
            className="w-full h-[44px] rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] pl-10 pr-4 text-xs sm:text-sm font-medium text-[#05264E] placeholder:text-gray-400 focus:border-[#4F46E5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 transition-all duration-200"
          />
        </div>

        {/* List Content */}
        <div className="mt-4 flex-1 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-1 custom-scrollbar">
          {isLoading ? (
            <div className="p-8 text-center text-xs sm:text-sm text-gray-400">
              Loading list...
            </div>
          ) : isRecruiter ? (
            filteredRecruiterApps.length === 0 ? (
              <div className="p-8 text-center text-xs sm:text-sm text-gray-500">
                No applicants found for your job postings.
              </div>
            ) : (
              filteredRecruiterApps.map((app: any) => {
                const candidateUserId =
                  (app.userId as any)?._id ||
                  app.userId ||
                  (app.candidateId as any)?._id ||
                  app.candidateId ||
                  (app.applicantId as any)?._id ||
                  app.applicantId;

                const jobId =
                  typeof app.jobId === "object" && app.jobId !== null
                    ? app.jobId._id
                    : app.jobId;

                const candidateFirstName =
                  app.applicantProfile?.firstName ||
                  (typeof app.userId === "object" ? app.userId?.email?.split("@")[0] : "Applicant");
                const candidateLastName = app.applicantProfile?.lastName || "";
                const candidateName = `${candidateFirstName} ${candidateLastName}`.trim();

                return (
                  <button
                    key={app._id}
                    onClick={() => {
                      onSelect({ jobId, applicantId: candidateUserId });
                      onClose();
                    }}
                    className="flex w-full items-center justify-between p-3.5 text-left rounded-xl hover:bg-indigo-50/70 transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] font-bold text-white text-sm">
                        {candidateName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#05264E] truncate">
                          {candidateName}
                        </h4>
                        <p className="text-xs text-[#4F46E5] font-semibold flex items-center gap-1 truncate">
                          <FiBriefcase className="text-[11px]" />
                          <span>{(app.jobId as any)?.title || "Job Posting"}</span>
                        </p>
                      </div>
                    </div>
                    <span className="rounded-xl bg-[#4F46E5] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#4338CA] transition-all">
                      Chat
                    </span>
                  </button>
                );
              })
            )
          ) : filteredJobSeekerApps.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm text-gray-500">
              You haven't submitted any job applications yet.
            </div>
          ) : (
            filteredJobSeekerApps.map((app: any) => {
              const jobId =
                typeof app.jobId === "object" && app.jobId !== null
                  ? app.jobId._id
                  : app.jobId;

              const jobTitle = (app.jobId as any)?.title || "Job Position";
              const companyName =
                (app.jobId as any)?.companyId?.name ||
                (app.jobId as any)?.companyId?.companyName ||
                "Hiring Company";

              const recruiterUserId =
                (app.jobId as any)?.userId?._id ||
                (app.jobId as any)?.userId ||
                (app.jobId as any)?.recruiterId?._id ||
                (app.jobId as any)?.recruiterId ||
                (app.recruiterId as any)?._id ||
                app.recruiterId;

              return (
                <button
                  key={app._id}
                  onClick={() => {
                    onSelect({ jobId, applicantId: recruiterUserId });
                    onClose();
                  }}
                  className="flex w-full items-center justify-between p-3.5 text-left rounded-xl hover:bg-indigo-50/70 transition-all duration-200 cursor-pointer border border-transparent hover:border-indigo-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[#4F46E5] font-bold text-base">
                      <FiBriefcase />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-[#05264E] truncate">
                        {jobTitle}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium truncate">
                        {companyName}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-xl bg-[#4F46E5] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#4338CA] transition-all">
                    Chat
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
