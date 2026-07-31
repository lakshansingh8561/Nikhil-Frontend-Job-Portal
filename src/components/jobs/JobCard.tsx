import { FiClock, FiBriefcase, FiZap, FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";
import type { Job } from "../../types/job.types";
import { useAppSelector } from "../../hooks/useAppSelector";

interface JobCardProps {
  job: Job;
  onSelect?: (job: Job) => void;
}

const JobCard = ({ job, onSelect }: JobCardProps) => {
  const { user } = useAppSelector((state) => state.auth);

  const companyName =
    typeof job.companyId === "object" && job.companyId !== null
      ? job.companyId.companyName
      : "Company";

  const companyLogo =
    typeof job.companyId === "object" && job.companyId?.logo
      ? job.companyId.logo
      : undefined;

  const skillsList = job.skills || [];

  const formattedSalary =
    job.salaryMin && job.salaryMax
      ? job.salaryMin >= 1000
        ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()}`
        : `$${job.salaryMin} – $${job.salaryMax}`
      : job.salaryMin
      ? `$${job.salaryMin.toLocaleString()}`
      : "Competitive";

  const salaryUnit = job.salaryMin && job.salaryMin >= 1000 ? "/Year" : "";

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to apply for jobs.");
      return;
    }
    if (user.role !== "JOB_SEEKER") {
      toast.error("Only registered Job Seekers can apply.");
      return;
    }

    if (onSelect) {
      onSelect(job);
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(job)}
      className="card-grid-2 hover-up group relative flex flex-col justify-between rounded-2xl border border-[#EAEFF7] bg-white p-6 transition-all duration-300 cursor-pointer shadow-sm min-h-[340px]"
    >
      <div>
        {/* Top Header: Logo + Info + Bolt Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-[52px] w-[52px] min-w-[52px] items-center justify-center rounded-xl bg-[#F8FAFC] p-2 border border-[#EAEFF7] overflow-hidden shrink-0">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-[#3C65F5] font-bold text-white text-base">
                  {companyName.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[15px] font-semibold text-[#05264E] leading-tight truncate">
                {companyName}
              </h4>
              <p className="text-xs text-[#66789C] flex items-center gap-1 mt-1 truncate">
                <FiMapPin className="text-gray-400 shrink-0" />
                <span className="truncate">{job.location}</span>
              </p>
            </div>
          </div>

          {/* Green Bolt Flash Tag */}
          <div className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-lg bg-[#E6F9F0] text-[#00BA63] shrink-0">
            <FiZap className="text-sm" />
          </div>
        </div>

        {/* Job Title */}
        <h3 className="mt-4 text-[17px] font-bold text-[#05264E] leading-snug transition-colors group-hover:text-[#3C65F5] line-clamp-1">
          {job.title}
        </h3>

        {/* Meta Info: Employment Type & Posted Duration */}
        <div className="mt-2.5 flex items-center gap-3.5 text-xs text-[#66789C]">
          <span className="flex items-center gap-1.5">
            <FiBriefcase className="text-gray-400 text-xs shrink-0" />
            <span>{job.employmentType ? job.employmentType.replace("_", " ") : "Fulltime"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <FiClock className="text-gray-400 text-xs shrink-0" />
            <span>Posted recently</span>
          </span>
        </div>

        {/* Description Snippet */}
        <p className="mt-3.5 text-[14px] font-normal leading-relaxed text-[#66789C] line-clamp-2">
          {job.description}
        </p>

        {/* Skill Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skillsList.map((skill) => (
            <span
              key={skill}
              className="rounded-lg bg-[#F2F5F9] px-2.5 py-1 text-[12px] font-medium text-[#66789C]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Section: Salary & Apply Now Button */}
      <div className="mt-6 flex items-center justify-between border-t border-[#F0F4FC] pt-4">
        <div>
          <span className="text-[18px] font-extrabold text-[#3C65F5]">
            {formattedSalary}
          </span>
          <span className="text-xs font-semibold text-[#66789C]">{salaryUnit}</span>
        </div>

        <button
          onClick={handleApply}
          className="rounded-xl bg-[#E8F0FE] px-4 py-2.5 text-xs font-semibold text-[#3C65F5] transition-all duration-200 hover:bg-[#3C65F5] hover:text-white cursor-pointer"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
