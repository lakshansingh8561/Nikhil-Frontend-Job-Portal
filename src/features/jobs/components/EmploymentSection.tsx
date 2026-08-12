import { FiMapPin, FiClock, FiAward } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { JobFormData } from "../validation/job.schema";

interface EmploymentSectionProps {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
}

export const EmploymentSection = ({
  register,
  errors,
}: EmploymentSectionProps) => {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/80 shadow-xs">
          <FiClock className="text-lg" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Location & Employment Details</h3>
          <p className="text-xs text-slate-400 font-medium">Set the primary work location, job type, and experience requirement.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Location */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">
            Location <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <FiMapPin className="absolute left-4 text-slate-400 text-base pointer-events-none" />
            <input
              {...register("location")}
              placeholder="e.g. Noida / New York / Remote"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs"
            />
          </div>
          {errors.location && (
            <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.location.message}</p>
          )}
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">
            Employment Type <span className="text-rose-500">*</span>
          </label>
          <select
            {...register("employmentType")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs cursor-pointer"
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
          </select>
          {errors.employmentType && (
            <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.employmentType.message}</p>
          )}
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">
            Experience Level <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center">
            <FiAward className="absolute left-4 text-slate-400 text-base pointer-events-none" />
            <select
              {...register("experienceLevel")}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs cursor-pointer"
            >
              <option value="FRESHER">Fresher / Entry Level (0-1 yrs)</option>
              <option value="ONE_TO_TWO">Junior (1-2 yrs)</option>
              <option value="THREE_TO_FIVE">Mid-Level (3-5 yrs)</option>
              <option value="FIVE_PLUS">Senior / Lead (5+ yrs)</option>
            </select>
          </div>
          {errors.experienceLevel && (
            <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.experienceLevel.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
