import { Link } from "react-router-dom";
import { FiPlusSquare, FiEye, FiEdit3, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import {
  useGetRecruiterJobsQuery,
  useDeleteJobMutation,
} from "../../jobs/api/jobsApi";

export const MyJobs = () => {
  const { data: jobs = [], isLoading, error } = useGetRecruiterJobsQuery();
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();

  const handleDelete = async (jobId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteJob(jobId).unwrap();
      toast.success("Job deleted successfully!");
    } catch (err: unknown) {
      const errorMsg =
        typeof err === "object" && err !== null && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : "Failed to delete job.";
      toast.error(errorMsg || "Failed to delete job.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Posted Jobs"
        description="Manage live job listings, edit requirements, view applications, or delete postings."
        action={
          <Link
            to="/recruiter/jobs/create"
            className="flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-3 text-xs font-semibold text-white shadow-md hover:bg-[#254BD6]"
          >
            <FiPlusSquare className="text-base" /> Create New Job
          </Link>
        }
      />

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-[#EAEFF7]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 text-xs font-semibold">
          Failed to load your posted jobs from backend API. Please make sure you are logged in as a Recruiter.
        </div>
      ) : jobs.length > 0 ? (
        <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F0F4FC] text-[11px] font-bold uppercase tracking-wider text-[#66789C]">
                  <th className="py-3.5 px-4">Job Title</th>
                  <th className="py-3.5 px-4">Employment</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Salary</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4FC] text-xs font-medium">
                {jobs.map((job) => {
                  const formattedSalary =
                    job.salaryMin >= 1000
                      ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}/Yr`
                      : `$${job.salaryMin} – $${job.salaryMax}/Hr`;

                  return (
                    <tr key={job._id} className="hover:bg-[#F8FAFC] transition">
                      <td className="py-4 px-4 font-bold text-[#05264E]">
                        <div>{job.title}</div>
                        <div className="text-[11px] font-normal text-[#66789C]">
                          Vacancies: {job.vacancies} • Posted {new Date(job.createdAt || Date.now()).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#05264E]">
                        {job.employmentType.replace("_", " ")}
                      </td>
                      <td className="py-4 px-4 text-[#66789C]">{job.location}</td>
                      <td className="py-4 px-4 font-bold text-[#3C65F5]">
                        {formattedSalary}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                            job.isActive
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-amber-50 text-amber-600 border-amber-200"
                          }`}
                        >
                          {job.isActive ? "Active" : "Closed / Draft"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/recruiter/jobs/${job._id}`}
                            className="p-2 rounded-lg border border-[#EAEFF7] bg-white text-gray-600 hover:text-[#3C65F5] hover:border-[#3C65F5] transition"
                            title="View Job Details"
                          >
                            <FiEye className="text-sm" />
                          </Link>
                          <Link
                            to={`/recruiter/jobs/edit/${job._id}`}
                            className="p-2 rounded-lg border border-[#EAEFF7] bg-white text-gray-600 hover:text-[#3C65F5] hover:border-[#3C65F5] transition"
                            title="Edit Job"
                          >
                            <FiEdit3 className="text-sm" />
                          </Link>
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() => handleDelete(job._id, job.title)}
                            className="p-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
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
        </div>
      ) : (
        <EmptyState
          title="No Jobs Found"
          description="You haven't posted any jobs yet. Create your first job posting to start receiving applications from top candidates!"
          action={
            <Link
              to="/recruiter/jobs/create"
              className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-[#254BD6]"
            >
              <FiPlusSquare className="text-base" /> Post Your First Job
            </Link>
          }
        />
      )}
    </div>
  );
};

export default MyJobs;
