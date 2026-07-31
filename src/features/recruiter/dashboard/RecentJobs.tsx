import { Link } from "react-router-dom";
import { FiEye, FiEdit3, FiArrowRight, FiBriefcase } from "react-icons/fi";
import { useGetRecruiterJobsQuery } from "../../jobs/api/jobsApi";

export const RecentJobs = () => {
  const { data: jobs, isLoading } = useGetRecruiterJobsQuery();
  const jobsList = jobs || [];

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

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3C65F5] border-t-transparent" />
        </div>
      ) : jobsList.length === 0 ? (
        <div className="py-8 text-center text-xs font-medium text-gray-500">
          <FiBriefcase className="mx-auto text-2xl text-gray-300 mb-2" />
          No jobs posted yet. <Link to="/recruiter/post-job" className="text-[#3C65F5] underline">Post a new job</Link>
        </div>
      ) : (
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
              {jobsList.slice(0, 5).map((job) => (
                <tr key={job._id} className="hover:bg-[#F8FAFC] transition">
                  <td className="py-3.5 px-4 font-bold text-[#05264E]">
                    <div>{job.title}</div>
                    <div className="text-[11px] font-normal text-[#66789C]">
                      {job.employmentType ? job.employmentType.replace("_", " ") : "Fulltime"} • {job.location}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                        job.isActive
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                      }`}
                    >
                      {job.isActive ? "ACTIVE" : "CLOSED"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-[#3C65F5]">
                    {job.applicantCount || 0} candidates
                  </td>
                  <td className="py-3.5 px-4 text-[#66789C]">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/recruiter/jobs/${job._id}`}
                        className="p-1.5 rounded-lg border border-[#EAEFF7] bg-white text-gray-600 hover:text-[#3C65F5] hover:border-[#3C65F5] transition"
                        title="View Job Details"
                      >
                        <FiEye className="text-sm" />
                      </Link>
                      <Link
                        to={`/recruiter/jobs/edit/${job._id}`}
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
      )}
    </div>
  );
};
