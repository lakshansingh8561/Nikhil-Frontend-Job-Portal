import { Link } from "react-router-dom";
import { FiEye, FiArrowRight, FiBriefcase } from "react-icons/fi";
import { useGetRecruiterJobsQuery } from "../../jobs/api/jobsApi";

export const RecentJobs = () => {
  const { data: jobs, isLoading } = useGetRecruiterJobsQuery();
  const jobsList = jobs || [];

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Posted Jobs</h3>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Manage your latest active and closed job postings
          </p>
        </div>

        <Link
          to="/recruiter/my-jobs"
          className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-700 transition"
        >
          <span>View All Jobs</span>
          <FiArrowRight />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
        </div>
      ) : jobsList.length === 0 ? (
        <div className="py-10 text-center text-xs font-semibold text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <FiBriefcase className="mx-auto text-3xl text-slate-300 mb-2" />
          No jobs posted yet.{" "}
          <Link to="/recruiter/post-job" className="text-indigo-600 font-bold underline">
            Post a new job
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Job Position</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Applicants</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {jobsList.slice(0, 5).map((job) => (
                <tr key={job._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-900">
                    <div className="font-extrabold text-slate-900">{job.title}</div>
                    <div className="text-[11px] font-semibold text-slate-400">
                      {job.employmentType ? job.employmentType.replace("_", " ") : "Fulltime"} • {job.location}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black border ${
                        job.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {job.isActive ? "ACTIVE" : "CLOSED"}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-black text-indigo-600">
                    {job.applicantCount || 0} candidates
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/recruiter/jobs/${job._id}`}
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition shadow-2xs"
                        title="View Job Details"
                      >
                        <FiEye className="text-sm" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
