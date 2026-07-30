import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PageHeader } from "../../recruiter/components/PageHeader";
import { JobForm } from "../components/JobForm";
import { jobSchema, type JobFormData } from "../validation/job.schema";
import { useCreateJobMutation } from "../api/jobsApi";

export const CreateJob = () => {
  const navigate = useNavigate();
  const [createJob, { isLoading }] = useCreateJobMutation();

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
    </div>
  );
};

export default CreateJob;
