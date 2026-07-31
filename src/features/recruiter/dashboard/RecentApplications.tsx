import { Link } from "react-router-dom";
import { FiArrowRight, FiUsers, FiExternalLink } from "react-icons/fi";
import { useGetRecruiterJobsQuery } from "../../jobs/api/jobsApi";
import { useGetApplicationsForJobQuery } from "../../applications/api/applicationApi";
import StatusBadge from "../../applications/components/StatusBadge";
import ResumeViewer from "../../applications/components/ResumeViewer";

export const RecentApplications = () => {
  const { data: jobs } = useGetRecruiterJobsQuery();
  const firstJobId = jobs && jobs.length > 0 ? jobs[0]._id : "";

  const { data: applications, isLoading } = useGetApplicationsForJobQuery(
    firstJobId,
    { skip: !firstJobId }
  );

  const applicationsList = applications || [];

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

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3C65F5] border-t-transparent" />
        </div>
      ) : applicationsList.length === 0 ? (
        <div className="py-8 text-center text-xs font-medium text-gray-500">
          <FiUsers className="mx-auto text-2xl text-gray-300 mb-2" />
          No applications received yet. <Link to="/recruiter/applications" className="text-[#3C65F5] underline">View applications dashboard</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F0F4FC] text-[11px] font-bold uppercase tracking-wider text-[#66789C]">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Resume</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F4FC] text-xs font-medium">
              {applicationsList.slice(0, 5).map((app) => {
                const applicant =
                  typeof app.applicantId === "object" && app.applicantId !== null
                    ? app.applicantId
                    : null;
                const name = applicant
                  ? `${applicant.firstName || ""} ${applicant.lastName || ""}`.trim() || "Applicant"
                  : "Applicant";
                const email =
                  applicant && typeof applicant.userId === "object" && applicant.userId !== null
                    ? applicant.userId.email
                    : "";

                return (
                  <tr key={app._id} className="hover:bg-[#F8FAFC] transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3C65F5] font-bold text-white text-xs shrink-0">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-[#05264E]">{name}</div>
                          <div className="text-[11px] font-normal text-[#66789C]">{email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <ResumeViewer resumeUrl={app.resume} applicantName={name} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-[#66789C]">
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recently"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/recruiter/applications"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#3C65F5] hover:underline"
                      >
                        Manage <FiExternalLink />
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
