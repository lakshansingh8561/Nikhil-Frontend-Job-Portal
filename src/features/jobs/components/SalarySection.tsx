import { FiDollarSign } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { JobFormData } from "../validation/job.schema";

interface SalarySectionProps {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
}

export const SalarySection = ({ register, errors }: SalarySectionProps) => {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 shadow-xs">
          <FiDollarSign className="text-lg" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Salary Offer Range</h3>
          <p className="text-xs text-slate-400 font-medium">Specify the expected minimum and maximum annual compensation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Minimum Salary */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">
            Minimum Annual Compensation <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <FiDollarSign className="absolute left-4 text-emerald-600 text-base pointer-events-none" />
            <input
              type="number"
              {...register("salaryMin", { valueAsNumber: true })}
              placeholder="e.g. 80000"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs"
            />
          </div>
          {errors.salaryMin && (
            <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.salaryMin.message}</p>
          )}
        </div>

        {/* Maximum Salary */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">
            Maximum Annual Compensation <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <FiDollarSign className="absolute left-4 text-emerald-600 text-base pointer-events-none" />
            <input
              type="number"
              {...register("salaryMax", { valueAsNumber: true })}
              placeholder="e.g. 150000"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs"
            />
          </div>
          {errors.salaryMax && (
            <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.salaryMax.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
