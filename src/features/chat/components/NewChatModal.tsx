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

  // Filter lists based on search
  const filteredRecruiterApps = recruiterApps.filter((app: any) => {
    const q = searchTerm.toLowerCase();
    const name = `${app.applicantProfile?.firstName || ""} ${app.applicantProfile?.lastName || ""}`.toLowerCase();
    const jobTitle = (app.jobId as any)?.title?.toLowerCase() || "";
    return name.includes(q) || jobTitle.includes(q);
  });

  const filteredJobSeekerApps = jobSeekerApps.filter((app: any) => {
    const q = searchTerm.toLowerCase();
    const jobTitle = (app.jobId as any)?.title?.toLowerCase() || "";
    const companyName = (app.jobId as any)?.companyId?.companyName?.toLowerCase() || "";
    return jobTitle.includes(q) || companyName.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-[#05264E] flex items-center gap-2">
              <FiPlus className="text-[#3C65F5]" />
              {isRecruiter ? "Start Chat with Applicant" : "Start Chat with Recruiter"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {isRecruiter
                ? "Select a candidate who applied for your job postings."
                : "Select a job application to message the hiring recruiter."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 cursor-pointer rounded-full hover:bg-gray-100 transition"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isRecruiter
                ? "Search candidate name or job title..."
                : "Search job title or company..."
            }
            className="w-full rounded-xl border border-gray-200 bg-[#F8FAFC] pl-9 pr-4 py-2.5 text-xs font-medium text-[#05264E] placeholder:text-gray-400 focus:border-[#3C65F5] focus:bg-white focus:outline-none transition"
          />
        </div>

        {/* List Content */}
        <div className="mt-4 flex-1 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-1">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-gray-400">
              Loading list...
            </div>
          ) : isRecruiter ? (
            filteredRecruiterApps.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                No applicants found for your job postings.
              </div>
            ) : (
              filteredRecruiterApps.map((app: any) => {
                const applicantUserId =
                  typeof app.applicantId === "object" && app.applicantId !== null
                    ? app.applicantId._id
                    : app.applicantId;

                const jobId =
                  typeof app.jobId === "object" && app.jobId !== null
                    ? app.jobId._id
                    : app.jobId;

                const candidateName = `${app.applicantProfile?.firstName || "Candidate"} ${app.applicantProfile?.lastName || ""}`.trim();

                return (
                  <button
                    key={app._id}
                    onClick={() => {
                      onSelect({ jobId, applicantId: applicantUserId });
                      onClose();
                    }}
                    className="flex w-full items-center justify-between p-3.5 text-left rounded-2xl hover:bg-blue-50 transition cursor-pointer border border-transparent hover:border-blue-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3C65F5] font-bold text-white text-sm">
                        {candidateName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#05264E] truncate">
                          {candidateName}
                        </h4>
                        <p className="text-[11px] text-[#3C65F5] font-semibold flex items-center gap-1 truncate">
                          <FiBriefcase className="text-[10px]" />
                          <span>{(app.jobId as any)?.title || "Job Posting"}</span>
                        </p>
                      </div>
                    </div>
                    <span className="rounded-xl bg-[#3C65F5] px-3 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-blue-700">
                      Chat
                    </span>
                  </button>
                );
              })
            )
          ) : filteredJobSeekerApps.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              You haven't submitted any job applications yet.
            </div>
          ) : (
            filteredJobSeekerApps.map((app: any) => {
              const jobId =
                typeof app.jobId === "object" && app.jobId !== null
                  ? app.jobId._id
                  : app.jobId;

              const jobTitle = (app.jobId as any)?.title || "Job Position";
              const companyName = (app.jobId as any)?.companyId?.companyName || "Hiring Company";

              return (
                <button
                  key={app._id}
                  onClick={() => {
                    onSelect({ jobId });
                    onClose();
                  }}
                  className="flex w-full items-center justify-between p-3.5 text-left rounded-2xl hover:bg-blue-50 transition cursor-pointer border border-transparent hover:border-blue-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-[#3C65F5] font-bold text-sm">
                      <FiBriefcase />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#05264E] truncate">
                        {jobTitle}
                      </h4>
                      <p className="text-[11px] text-[#66789C] font-medium truncate">
                        {companyName}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-xl bg-[#3C65F5] px-3 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-blue-700">
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
