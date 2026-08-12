import { FiFileText } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { JobFormData } from "../validation/job.schema";

interface JobDescriptionProps {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
}

export const JobDescription = ({ register, errors }: JobDescriptionProps) => {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 shadow-xs">
          <FiFileText className="text-lg" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Job Description & Responsibilities</h3>
          <p className="text-xs text-slate-400 font-medium">Provide a comprehensive summary of key duties, requirements, and candidate expectations.</p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-900 mb-2">
          Detailed Job Description <span className="text-rose-500">*</span>
        </label>
        <textarea
          {...register("description")}
          rows={6}
          placeholder="We are seeking an ambitious Senior Developer to architect high-performance cloud applications..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs leading-relaxed"
        />
        {errors.description && (
          <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
};
