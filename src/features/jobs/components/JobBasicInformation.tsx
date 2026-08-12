import { FiBriefcase, FiUsers } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { JobFormData } from "../validation/job.schema";

interface JobBasicInformationProps {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
}

export const JobBasicInformation = ({
  register,
  errors,
}: JobBasicInformationProps) => {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/80 shadow-xs">
          <FiBriefcase className="text-lg" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Basic Information</h3>
          <p className="text-xs text-slate-400 font-medium">Specify the job position title and open headcount.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Job Title */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-900 mb-2">
            Job Title <span className="text-rose-500">*</span>
          </label>
          <input
            {...register("title")}
            placeholder="e.g. Senior Full Stack Engineer (React & Node.js)"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs"
          />
          {errors.title && (
            <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.title.message}</p>
          )}
        </div>

        {/* Vacancies */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">
            Number of Vacancies <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <FiUsers className="absolute left-4 text-slate-400 text-base pointer-events-none" />
            <input
              type="number"
              {...register("vacancies", { valueAsNumber: true })}
              placeholder="1"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs"
            />
          </div>
          {errors.vacancies && (
            <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.vacancies.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
