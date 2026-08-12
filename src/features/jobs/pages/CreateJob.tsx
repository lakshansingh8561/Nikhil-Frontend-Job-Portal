import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { PageHeader } from "../../recruiter/components/PageHeader";
import { JobForm } from "../components/JobForm";
import { jobSchema, type JobFormData } from "../validation/job.schema";
import { useCreateJobMutation } from "../api/jobsApi";
import { useGetMyCompanyQuery } from "../../company/api/companyApi";
import { useGetCurrentRecruiterPlanQuery } from "../../membership/api/membershipApi";
import { FiZap, FiAlertTriangle, FiArrowRight, FiBriefcase } from "react-icons/fi";

export const CreateJob = () => {
  const navigate = useNavigate();
  const [createJob, { isLoading }] = useCreateJobMutation();
  const { data: company, isError: noCompany } = useGetMyCompanyQuery();
  const { data: recSub, isLoading: isLoadingSub } = useGetCurrentRecruiterPlanQuery();

  const hasCompany = Boolean(company && !noCompany);
  const canPostJob = recSub?.canPostJob !== false && hasCompany;
  const activeJobsCount = recSub?.activeJobsCount || 0;
  const maxActiveJobs = recSub?.maxActiveJobs || 3;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      salaryMin: 80000,
      salaryMax: 150000,
      employmentType: "FULL_TIME",
      experienceLevel: "THREE_TO_FIVE",
      skills: ["React", "Node.js", "MongoDB"],
      vacancies: 1,
      deadline: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      isActive: true,
    },
  });

  const onSubmit = async (data: JobFormData) => {
    if (!hasCompany) {
      toast.error("Please create your company profile before posting a job!");
      navigate("/recruiter/company");
      return;
    }

    if (!canPostJob) {
      toast.error("Job posting limit reached. Please upgrade your membership to post more jobs.");
      return;
    }

    try {
      await createJob({
        ...data,
        deadline: new Date(data.deadline).toISOString(),
      }).unwrap();

      toast.success("Job posted successfully!");
      navigate("/recruiter/my-jobs");
    } catch (err: unknown) {
      const errorMsg =
        typeof err === "object" && err !== null && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : "Failed to post job. Please ensure your company profile is created first.";
      toast.error(errorMsg || "Failed to post job.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Post a New Job Opening"
        description="Publish a new job listing powered directly by live backend API endpoints."
      />

      {/* Company Profile Required Alert */}
      {!hasCompany && (
        <div className="rounded-3xl bg-blue-50 border border-blue-200 p-6 text-blue-950 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-[#3C65F5] font-bold text-xl">
              <FiBriefcase />
            </div>
            <div>
              <h4 className="text-base font-black text-[#05264E]">
                Company Profile Required
              </h4>
              <p className="text-xs text-[#66789C] font-medium mt-0.5">
                You must set up your company profile before publishing job postings.
              </p>
            </div>
          </div>
          <Link
            to="/recruiter/company"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-3 text-xs font-black text-white hover:bg-[#254BD6] shadow-md transition shrink-0 cursor-pointer"
          >
            Create Company Profile <FiArrowRight />
          </Link>
        </div>
      )}

      {/* Membership Limit Lock Alert */}
      {!isLoadingSub && !canPostJob && (
        <div className="rounded-3xl bg-amber-50 border border-amber-200 p-6 text-amber-900 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 font-bold text-xl">
              <FiAlertTriangle />
            </div>
            <div>
              <h4 className="text-base font-black text-amber-950">
                Active Job Limit Reached ({activeJobsCount} / {maxActiveJobs} Jobs)
              </h4>
              <p className="text-xs text-amber-800 font-medium mt-0.5">
                Your Free Recruiter Plan is limited to 3 active jobs. Upgrade to Professional or Enterprise for unlimited job listings.
              </p>
            </div>
          </div>
          <Link
            to="/recruiter/membership"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-3 text-xs font-black text-white hover:bg-[#254BD6] shadow-md transition shrink-0 cursor-pointer"
          >
            <FiZap className="fill-yellow-300 text-yellow-300" /> Upgrade Membership <FiArrowRight />
          </Link>
        </div>
      )}

      {canPostJob ? (
        <JobForm
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
          onSubmit={handleSubmit(onSubmit)}
          isSubmitting={isLoading}
          submitButtonText="Publish Job Opening"
          onCancel={() => navigate("/recruiter/my-jobs")}
        />
      ) : (
        <div className="rounded-3xl bg-white p-12 text-center border border-gray-200 shadow-sm space-y-4">
          <FiZap className="mx-auto text-4xl text-yellow-500 fill-yellow-400" />
          <h3 className="text-2xl font-black text-[#05264E]">
            Unlock Unlimited Job Postings
          </h3>
          <p className="text-sm font-medium text-gray-500 max-w-md mx-auto">
            Upgrade your recruiter account to Professional or Enterprise plan to create unlimited job postings, search candidates, and access AI candidate matching.
          </p>
          <Link
            to="/recruiter/membership"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-8 py-4 text-sm font-extrabold text-white hover:bg-[#254BD6] shadow-lg transition cursor-pointer"
          >
            Upgrade Membership Now <FiArrowRight />
          </Link>
        </div>
      )}
    </div>
  );
};

export default CreateJob;
