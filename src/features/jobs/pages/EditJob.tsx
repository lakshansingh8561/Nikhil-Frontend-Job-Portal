import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PageHeader } from "../../recruiter/components/PageHeader";
import { JobForm } from "../components/JobForm";
import { jobSchema, type JobFormData } from "../validation/job.schema";
import { useGetJobByIdQuery, useUpdateJobMutation } from "../api/jobsApi";

export const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: job, isLoading: isFetching } = useGetJobByIdQuery(id || "", {
    skip: !id,
  });
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      salaryMin: 0,
      salaryMax: 0,
      employmentType: "FULL_TIME",
      experienceLevel: "THREE_TO_FIVE",
      skills: [],
      vacancies: 1,
      deadline: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (job) {
      const formattedDeadline = job.deadline
        ? new Date(job.deadline).toISOString().split("T")[0]
        : "";

      reset({
        title: job.title || "",
        description: job.description || "",
        location: job.location || "",
        salaryMin: job.salaryMin || 0,
        salaryMax: job.salaryMax || 0,
        employmentType: job.employmentType || "FULL_TIME",
        experienceLevel: job.experienceLevel || "THREE_TO_FIVE",
        skills: job.skills || [],
        vacancies: job.vacancies || 1,
        deadline: formattedDeadline,
        isActive: job.isActive !== undefined ? job.isActive : true,
      });
    }
  }, [job, reset]);

  const onSubmit = async (data: JobFormData) => {
    if (!id) return;
    try {
      await updateJob({
        id,
        body: {
          ...data,
          deadline: new Date(data.deadline).toISOString(),
        },
      }).unwrap();

      toast.success("Job updated successfully!");
      navigate("/recruiter/my-jobs");
    } catch (err: unknown) {
      const errorMsg =
        typeof err === "object" && err !== null && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : "Failed to update job.";
      toast.error(errorMsg || "Failed to update job.");
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-[#EAEFF7]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Job: ${job?.title || ""}`}
        description="Update role requirements, location, salary range, and publication status."
      />

      <JobForm
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isUpdating}
        submitButtonText="Save Changes"
        onCancel={() => navigate("/recruiter/my-jobs")}
      />
    </div>
  );
};

export default EditJob;
