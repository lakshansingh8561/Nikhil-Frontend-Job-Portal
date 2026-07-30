import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiEdit3,
  FiArrowLeft,
} from "react-icons/fi";
import { PageHeader } from "../../recruiter/components/PageHeader";
import { useGetJobByIdQuery } from "../api/jobsApi";

export const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: job, isLoading, error } = useGetJobByIdQuery(id || "", {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-[#EAEFF7]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="rounded-3xl bg-white p-12 text-center border border-[#EAEFF7] shadow-sm">
        <h3 className="text-lg font-bold text-[#05264E]">Job Not Found</h3>
        <p className="text-xs text-[#66789C] mt-1">
          The requested job posting does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/recruiter/my-jobs")}
          className="mt-5 rounded-xl bg-[#3C65F5] px-6 py-2.5 text-xs font-semibold text-white"
        >
          Back to My Jobs
        </button>
      </div>
    );
  }

  const companyName =
    typeof job.companyId === "object" && job.companyId !== null
      ? job.companyId.companyName
      : "Your Company";

  const companyLogo =
    typeof job.companyId === "object" && job.companyId !== null
      ? job.companyId.logo
      : undefined;

  const formattedSalary =
    job.salaryMin >= 1000
      ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}/Year`
      : `$${job.salaryMin} – $${job.salaryMax}/Hour`;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/recruiter/my-jobs")}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAEFF7] bg-white text-gray-600 hover:bg-gray-50 transition"
        >
          <FiArrowLeft />
        </button>
        <PageHeader
          title={job.title}
          description={`${companyName} • Posted ${new Date(job.createdAt || Date.now()).toLocaleDateString()}`}
          action={
            <Link
              to={`/recruiter/jobs/edit/${job._id}`}
              className="flex items-center gap-2 rounded-xl bg-[#3C65F5] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#254BD6]"
            >
              <FiEdit3 /> Edit Job
            </Link>
          }
        />
      </div>

      {/* Main Details Card */}
      <div className="rounded-3xl border border-[#EAEFF7] bg-white p-8 shadow-sm space-y-6">
        <div className="flex items-start justify-between gap-4 border-b border-[#F0F4FC] pb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8FAFC] border border-[#EAEFF7] p-2 overflow-hidden">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#3C65F5] font-extrabold text-white text-2xl">
                  {companyName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#05264E]">{job.title}</h2>
              <p className="text-xs font-semibold text-[#3C65F5] mt-0.5">{companyName}</p>
            </div>
          </div>

          <span
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold border ${
              job.isActive
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-amber-50 text-amber-600 border-amber-200"
            }`}
          >
            {job.isActive ? "Active" : "Draft / Closed"}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs font-medium text-[#66789C]">
          <div className="rounded-2xl bg-[#F8FAFC] p-4 border border-[#EAEFF7]">
            <div className="flex items-center gap-1.5 text-[#3C65F5] font-bold mb-1">
              <FiBriefcase /> Employment
            </div>
            <div className="font-bold text-[#05264E]">
              {job.employmentType.replace("_", " ")}
            </div>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-4 border border-[#EAEFF7]">
            <div className="flex items-center gap-1.5 text-[#3C65F5] font-bold mb-1">
              <FiMapPin /> Location
            </div>
            <div className="font-bold text-[#05264E]">{job.location}</div>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-4 border border-[#EAEFF7]">
            <div className="flex items-center gap-1.5 text-[#3C65F5] font-bold mb-1">
              <FiDollarSign /> Salary Offer
            </div>
            <div className="font-bold text-[#05264E]">{formattedSalary}</div>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-4 border border-[#EAEFF7]">
            <div className="flex items-center gap-1.5 text-[#3C65F5] font-bold mb-1">
              <FiUsers /> Vacancies
            </div>
            <div className="font-bold text-[#05264E]">{job.vacancies} Positions</div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-base font-bold text-[#05264E] mb-2">Job Description</h3>
          <p className="text-sm leading-relaxed text-[#66789C] whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="border-t border-[#F0F4FC] pt-4">
            <h3 className="text-base font-bold text-[#05264E] mb-3">Required Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-xl bg-[#EBF2FF] px-3.5 py-1.5 text-xs font-bold text-[#3C65F5]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Deadline */}
        <div className="flex items-center justify-between border-t border-[#F0F4FC] pt-4 text-xs text-[#66789C]">
          <span className="flex items-center gap-1 font-semibold">
            <FiCalendar className="text-[#3C65F5]" /> Application Deadline:{" "}
            <strong className="text-[#05264E]">
              {new Date(job.deadline).toLocaleDateString()}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
