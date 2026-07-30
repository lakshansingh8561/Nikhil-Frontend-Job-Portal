import { Link } from "react-router-dom";
import { FiEye, FiEdit3, FiArrowRight } from "react-icons/fi";
import type { DashboardJob } from "../types/dashboard.types";

const mockRecentJobs: DashboardJob[] = [
  {
    id: "1",
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "Noida, India",
    type: "FULL_TIME",
    status: "ACTIVE",
    applicantCount: 42,
    postedDate: "July 27, 2026",
  },
  {
    id: "2",
    title: "Lead Frontend Developer (React)",
    department: "Engineering",
    location: "Remote",
    type: "FULL_TIME",
    status: "ACTIVE",
    applicantCount: 89,
    postedDate: "July 25, 2026",
  },
  {
    id: "3",
    title: "UI/UX Designer",
    department: "Design",
    location: "New York, US",
    type: "CONTRACT",
    status: "ACTIVE",
    applicantCount: 23,
    postedDate: "July 20, 2026",
  },
  {
    id: "4",
    title: "DevOps Architect",
    department: "Infrastructure",
    location: "Remote",
    type: "FULL_TIME",
    status: "CLOSED",
    applicantCount: 115,
    postedDate: "July 12, 2026",
  },
];

export const RecentJobs = () => {
  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#F0F4FC] pb-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#05264E]">Recent Posted Jobs</h3>
          <p className="text-xs text-[#66789C] font-medium mt-0.5">
            Manage your latest active and closed job postings
          </p>
        </div>

        <Link
          to="/recruiter/my-jobs"
          className="flex items-center gap-1 text-xs font-bold text-[#3C65F5] hover:underline"
        >
          <span>View All Jobs</span>
          <FiArrowRight />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F0F4FC] text-[11px] font-bold uppercase tracking-wider text-[#66789C]">
              <th className="py-3 px-4">Job Title</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Applicants</th>
              <th className="py-3 px-4">Posted Date</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F4FC] text-xs font-medium">
            {mockRecentJobs.map((job) => (
              <tr key={job.id} className="hover:bg-[#F8FAFC] transition">
                <td className="py-3.5 px-4 font-bold text-[#05264E]">
                  <div>{job.title}</div>
                  <div className="text-[11px] font-normal text-[#66789C]">
                    {job.department} • {job.location}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                      job.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-extrabold text-[#3C65F5]">
                  {job.applicantCount} candidates
                </td>
                <td className="py-3.5 px-4 text-[#66789C]">{job.postedDate}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to="/recruiter/my-jobs"
                      className="p-1.5 rounded-lg border border-[#EAEFF7] bg-white text-gray-600 hover:text-[#3C65F5] hover:border-[#3C65F5] transition"
                      title="View Job"
                    >
                      <FiEye className="text-sm" />
                    </Link>
                    <Link
                      to="/recruiter/my-jobs"
                      className="p-1.5 rounded-lg border border-[#EAEFF7] bg-white text-gray-600 hover:text-[#3C65F5] hover:border-[#3C65F5] transition"
                      title="Edit Job"
                    >
                      <FiEdit3 className="text-sm" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
