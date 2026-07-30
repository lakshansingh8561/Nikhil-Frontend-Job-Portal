import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { JobFormData } from "../validation/job.schema";
import { JobBasicInformation } from "./JobBasicInformation";
import { JobDescription } from "./JobDescription";
import { EmploymentSection } from "./EmploymentSection";
import { SalarySection } from "./SalarySection";
import { SkillsSection } from "./SkillsSection";
import { PublishCard } from "./PublishCard";

interface JobFormProps {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
  setValue: UseFormSetValue<JobFormData>;
  watch: UseFormWatch<JobFormData>;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitButtonText?: string;
  onCancel?: () => void;
}

export const JobForm = ({
  register,
  errors,
  setValue,
  watch,
  onSubmit,
  isSubmitting,
  submitButtonText = "Publish Job Opening",
  onCancel,
}: JobFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
      <JobBasicInformation register={register} errors={errors} />

      <JobDescription register={register} errors={errors} />

      <EmploymentSection register={register} errors={errors} />

      <SalarySection register={register} errors={errors} />

      <SkillsSection setValue={setValue} watch={watch} errors={errors} />

      <PublishCard
        register={register}
        errors={errors}
        setValue={setValue}
        watch={watch}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[#EAEFF7] bg-white px-6 py-3 text-xs font-semibold text-[#66789C] transition hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#3C65F5] px-8 py-3 text-xs font-semibold text-white shadow-md transition hover:bg-[#254BD6] disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Saving..." : submitButtonText}
        </button>
      </div>
    </form>
  );
};
