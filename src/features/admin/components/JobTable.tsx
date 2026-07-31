import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiTrash2, FiMapPin, FiBriefcase } from "react-icons/fi";
import type { AdminJob } from "../types/admin.types";

interface JobTableProps {
  jobs: AdminJob[];
  onDeleteRequest: (job: AdminJob) => void;
}

export const JobTable: React.FC<JobTableProps> = ({ jobs, onDeleteRequest }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-3xl border border-[#EAEFF7] bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#F0F4FC] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#66789C]">
            <th className="py-4 px-6">Job Title & Company</th>
            <th className="py-4 px-6">Recruiter</th>
            <th className="py-4 px-[#11px]">Type & Level</th>
            <th className="py-4 px-6">Location</th>
            <th className="py-4 px-6">Salary</th>
            <th className="py-4 px-6">Posted Date</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0F4FC] text-xs font-medium">
          {jobs.map((job) => {
            const companyName =
              typeof job.companyId === "object" && job.companyId !== null
                ? job.companyId.companyName
                : "Company";

            const companyLogo =
              typeof job.companyId === "object" && job.companyId?.logo
                ? job.companyId.logo
                : null;

            const recruiterEmail =
              typeof job.recruiterId === "object" && job.recruiterId !== null
                ? job.recruiterId.email
                : "Recruiter";

            const salaryText =
              job.salaryMin && job.salaryMax
                ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
                : job.salaryMin
                ? `$${job.salaryMin.toLocaleString()}`
                : "Competitive";

            return (
              <tr key={job._id} className="hover:bg-[#F8FAFC] transition">
                {/* Job Title & Company */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC] p-1.5 border border-[#EAEFF7] shrink-0 overflow-hidden">
                      {companyLogo ? (
                        <img
                          src={companyLogo}
                          alt={companyName}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#3C65F5] font-bold text-white text-xs">
                          {companyName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#05264E]">{job.title}</p>
                      <p className="text-[11px] font-semibold text-[#3C65F5]">
                        {companyName}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Recruiter */}
                <td className="py-4 px-6 font-semibold text-[#05264E]">
                  {recruiterEmail}
                </td>

                {/* Employment Type & Level */}
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#05264E]">
                      <FiBriefcase className="text-gray-400 text-xs" />
                      {job.employmentType ? job.employmentType.replace("_", " ") : "Full Time"}
                    </span>
                    <span className="text-[11px] text-[#66789C]">
                      {job.experienceLevel || "Mid Level"}
                    </span>
                  </div>
                </td>

                {/* Location */}
                <td className="py-4 px-6 text-[#66789C]">
                  <span className="flex items-center gap-1">
                    <FiMapPin className="text-gray-400 text-xs shrink-0" />
                    <span>{job.location}</span>
                  </span>
                </td>

                {/* Salary */}
                <td className="py-4 px-6 font-extrabold text-[#3C65F5]">
                  {salaryText}
                </td>

                {/* Posted Date */}
                <td className="py-4 px-6 text-[#66789C]">
                  {new Date(job.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#EAEFF7] bg-white text-gray-600 hover:border-[#3C65F5] hover:text-[#3C65F5] transition cursor-pointer"
                      title="View Job Details"
                    >
                      <FiEye className="text-sm" />
                    </button>

                    <button
                      onClick={() => onDeleteRequest(job)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                      title="Delete Job"
                    >
                      <FiTrash2 className="text-sm" />
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

export default JobTable;
