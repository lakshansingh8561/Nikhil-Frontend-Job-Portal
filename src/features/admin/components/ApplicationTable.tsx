import React from "react";
import { useNavigate } from "react-router-dom";
import { FiBriefcase, FiUser } from "react-icons/fi";
import type { AdminApplication } from "../types/admin.types";
import StatusBadge from "./StatusBadge";
import ResumeViewer from "../../applications/components/ResumeViewer";

interface ApplicationTableProps {
  applications: AdminApplication[];
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-3xl border border-[#EAEFF7] bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#F0F4FC] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#66789C]">
            <th className="py-4 px-6">Applicant</th>
            <th className="py-4 px-6">Applied Job & Company</th>
            <th className="py-4 px-6">Resume</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6">Applied Date</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0F4FC] text-xs font-medium">
          {applications.map((app) => {
            const applicantObj =
              typeof app.applicantId === "object" && app.applicantId !== null
                ? app.applicantId
                : null;

            const applicantName = applicantObj
              ? `${applicantObj.firstName || ""} ${applicantObj.lastName || ""}`.trim() || "Applicant"
              : "Applicant";

            const applicantEmail =
              applicantObj &&
              typeof applicantObj.userId === "object" &&
              applicantObj.userId !== null
                ? applicantObj.userId.email
                : "";

            const jobObj =
              typeof app.jobId === "object" && app.jobId !== null
                ? app.jobId
                : null;

            const jobTitle = jobObj ? jobObj.title : "Applied Job";
            const jobId = jobObj ? jobObj._id : "";

            const companyObj =
              jobObj &&
              typeof jobObj.companyId === "object" &&
              jobObj.companyId !== null
                ? jobObj.companyId
                : null;

            const companyName = companyObj ? companyObj.companyName : "Company";

            return (
              <tr key={app._id} className="hover:bg-[#F8FAFC] transition">
                {/* Applicant */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3C65F5] font-bold text-white text-sm shadow-xs shrink-0">
                      {applicantName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#05264E]">{applicantName}</p>
                      <p className="text-[11px] text-[#66789C]">
                        {applicantEmail}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Job Title & Company */}
                <td className="py-4 px-6">
                  <div>
                    <p className="font-bold text-[#05264E]">{jobTitle}</p>
                    <p className="text-[11px] font-semibold text-[#3C65F5]">
                      {companyName}
                    </p>
                  </div>
                </td>

                {/* Resume */}
                <td className="py-4 px-6">
                  <ResumeViewer resumeUrl={app.resume} applicantName={applicantName} />
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  <StatusBadge status={app.status} size="sm" />
                </td>

                {/* Applied Date */}
                <td className="py-4 px-6 text-[#66789C]">
                  {new Date(app.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {jobId && (
                      <button
                        onClick={() => navigate(`/jobs/${jobId}`)}
                        className="flex items-center gap-1 rounded-xl border border-[#EAEFF7] bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:border-[#3C65F5] hover:text-[#3C65F5] transition cursor-pointer"
                        title="View Job"
                      >
                        <FiBriefcase className="text-xs text-[#3C65F5]" /> Job
                      </button>
                    )}

                    <button
                      onClick={() => navigate("/candidates")}
                      className="flex items-center gap-1 rounded-xl border border-[#EAEFF7] bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:border-[#3C65F5] hover:text-[#3C65F5] transition cursor-pointer"
                      title="View Candidate"
                    >
                      <FiUser className="text-xs text-[#3C65F5]" /> Applicant
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationTable;
