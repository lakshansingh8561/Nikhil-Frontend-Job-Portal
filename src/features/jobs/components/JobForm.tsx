import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { JobFormData } from "../validation/job.schema";
import { JobBasicInformation } from "./JobBasicInformation";
import { JobDescription } from "./JobDescription";
import { EmploymentSection } from "./EmploymentSection";
import { SalarySection } from "./SalarySection";
import { SkillsSection } from "./SkillsSection";
import { PublishCard } from "./PublishCard";
import { FiSend } from "react-icons/fi";

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

      {/* Action Buttons Bar */}
      <div className="flex items-center justify-end gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 px-8 py-3.5 text-xs font-black text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
        >
          <FiSend className="text-sm" />
          <span>{isSubmitting ? "Saving..." : submitButtonText}</span>
        </button>
      </div>
    </form>
  );
};
