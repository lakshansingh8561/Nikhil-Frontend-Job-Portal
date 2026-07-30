import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiXCircle } from "react-icons/fi";
import type { DashboardApplicant } from "../types/dashboard.types";

const mockApplications: DashboardApplicant[] = [
  {
    id: "1",
    candidateName: "Rahul Sharma",
    candidateEmail: "rahul.sharma@example.com",
    jobTitle: "Senior Backend Engineer",
    experience: "3.5 Years",
    status: "SHORTLISTED",
    appliedDate: "Today",
  },
  {
    id: "2",
    candidateName: "Ananya Patel",
    candidateEmail: "ananya.patel@example.com",
    jobTitle: "Lead Frontend Developer (React)",
    experience: "5 Years",
    status: "PENDING",
    appliedDate: "Yesterday",
  },
  {
    id: "3",
    candidateName: "Vikram Malhotra",
    candidateEmail: "vikram.m@example.com",
    jobTitle: "UI/UX Designer",
    experience: "2 Years",
    status: "ACCEPTED",
    appliedDate: "July 26",
  },
  {
    id: "4",
    candidateName: "Neha Gupta",
    candidateEmail: "neha.gupta@example.com",
    jobTitle: "Senior Backend Engineer",
    experience: "4 Years",
    status: "REJECTED",
    appliedDate: "July 24",
  },
];

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-200",
  SHORTLISTED: "bg-blue-50 text-[#3C65F5] border-blue-200",
  ACCEPTED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  REJECTED: "bg-red-50 text-red-600 border-red-200",
};

export const RecentApplications = () => {
  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#F0F4FC] pb-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#05264E]">Recent Candidate Applications</h3>
          <p className="text-xs text-[#66789C] font-medium mt-0.5">
            Review incoming applications from job seekers
          </p>
        </div>

        <Link
          to="/recruiter/applications"
          className="flex items-center gap-1 text-xs font-bold text-[#3C65F5] hover:underline"
        >
          <span>View All Applications</span>
          <FiArrowRight />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F0F4FC] text-[11px] font-bold uppercase tracking-wider text-[#66789C]">
              <th className="py-3 px-4">Candidate</th>
              <th className="py-3 px-4">Applied Job</th>
              <th className="py-3 px-4">Experience</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F4FC] text-xs font-medium">
            {mockApplications.map((app) => (
              <tr key={app.id} className="hover:bg-[#F8FAFC] transition">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3C65F5] font-bold text-white text-xs">
                      {app.candidateName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[#05264E]">{app.candidateName}</div>
                      <div className="text-[11px] font-normal text-[#66789C]">
                        {app.candidateEmail}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-bold text-[#05264E]">{app.jobTitle}</td>
                <td className="py-3.5 px-4 text-[#66789C]">{app.experience}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                      statusStyles[app.status]
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
                      title="Shortlist Candidate"
                    >
                      <FiCheckCircle className="text-sm" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
                      title="Reject Candidate"
                    >
                      <FiXCircle className="text-sm" />
                    </button>
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
