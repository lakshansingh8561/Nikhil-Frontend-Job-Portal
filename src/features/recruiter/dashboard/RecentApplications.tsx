import { Link } from "react-router-dom";
import { FiArrowRight, FiUsers, FiExternalLink } from "react-icons/fi";
import { useGetRecruiterAllApplicationsQuery } from "../../applications/api/applicationApi";
import StatusBadge from "../../applications/components/StatusBadge";
import ResumeViewer from "../../applications/components/ResumeViewer";

export const RecentApplications = () => {
  const { data: applications, isLoading } = useGetRecruiterAllApplicationsQuery();
  const applicationsList = applications || [];

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Candidate Applications</h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Review incoming applications from job seekers
          </p>
        </div>

        <Link
          to="/recruiter/applications"
          className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-700 transition"
        >
          <span>View Applications</span>
          <FiArrowRight />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
        </div>
      ) : applicationsList.length === 0 ? (
        <div className="py-10 text-center text-xs font-semibold text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2">
          <FiUsers className="mx-auto text-3xl text-slate-300" />
          <p className="font-bold text-slate-900">No applications received yet.</p>
          <Link to="/recruiter/applications" className="text-indigo-600 font-bold underline">
            View applications workspace
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Candidate</th>
                <th className="py-3 px-3">Applied Position</th>
                <th className="py-3 px-3">Resume</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {applicationsList.slice(0, 5).map((app) => {
                const applicant =
                  typeof app.applicantId === "object" && app.applicantId !== null
                    ? app.applicantId
                    : null;

                const name = applicant
                  ? `${(applicant as any).firstName || ""} ${(applicant as any).lastName || ""}`.trim() || "Applicant"
                  : "Applicant";

                const email =
                  applicant && typeof (applicant as any).userId === "object" && (applicant as any).userId !== null
                    ? (applicant as any).userId.email
                    : (applicant as any)?.email || "";

                const jobTitle =
                  typeof app.jobId === "object" && app.jobId !== null
                    ? app.jobId.title
                    : "Position";

                return (
                  <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-extrabold text-white text-xs shrink-0 shadow-xs">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-extrabold text-slate-900 truncate max-w-[120px]">{name}</div>
                          <div className="text-[10px] font-medium text-slate-400 truncate max-w-[120px]">{email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-slate-800">
                      <span className="truncate max-w-[130px] inline-block">{jobTitle}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      {app.resume ? (
                        <ResumeViewer resumeUrl={app.resume} applicantName={name} />
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium italic">No file</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <Link
                        to="/recruiter/applications"
                        className="inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-600 hover:underline"
                      >
                        <span>Manage</span>
                        <FiExternalLink />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
