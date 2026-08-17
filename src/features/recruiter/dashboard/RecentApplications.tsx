import { Link } from "react-router-dom";
import { FiArrowRight, FiUsers, FiExternalLink } from "react-icons/fi";
import { useGetRecruiterAllApplicationsQuery } from "../../applications/api/applicationApi";
import StatusBadge from "../../applications/components/StatusBadge";
import ResumeViewer from "../../applications/components/ResumeViewer";

export const RecentApplications = () => {
  const { data: applications, isLoading } = useGetRecruiterAllApplicationsQuery();
  const applicationsList = applications || [];

  return (
    <div className="saas-card p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Incoming candidates across all posted openings
          </p>
        </div>

        <Link
          to="/recruiter/applications"
          className="saas-btn-secondary h-8 text-xs px-3"
        >
          <span>View All</span>
          <FiArrowRight />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
        </div>
      ) : applicationsList.length === 0 ? (
        <div className="py-10 text-center text-xs font-semibold text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <FiUsers className="mx-auto text-2xl text-slate-400" />
          <p className="font-bold text-slate-900">No applications received yet</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="w-full text-left border-collapse min-w-[540px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-3 rounded-l-lg">Candidate</th>
                <th className="py-2.5 px-3">Position</th>
                <th className="py-2.5 px-3">Resume</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
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
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-xs shrink-0">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate max-w-[120px]">{name}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <span className="truncate max-w-[130px] inline-block">{jobTitle}</span>
                    </td>

                    <td className="py-3 px-3">
                      {app.resume ? (
                        <ResumeViewer resumeUrl={app.resume} applicantName={name} variant="compact" />
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">None</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="py-3 px-3 text-right">
                      <Link
                        to="/recruiter/applications"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
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
