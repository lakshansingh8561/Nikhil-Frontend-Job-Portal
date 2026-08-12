import { FiCalendar, FiCheckCircle, FiPauseCircle } from "react-icons/fi";
import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { JobFormData } from "../validation/job.schema";

interface PublishCardProps {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
  setValue: UseFormSetValue<JobFormData>;
  watch: UseFormWatch<JobFormData>;
}

export const PublishCard = ({
  register,
  errors,
  setValue,
  watch,
}: PublishCardProps) => {
  const isActive = watch("isActive");

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100/80 shadow-xs">
          <FiCalendar className="text-lg" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Application Deadline & Status</h3>
          <p className="text-xs text-slate-400 font-medium">Set the expiration date and choose whether this job is immediately published.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Deadline Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">
            Application Expiration Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            {...register("deadline")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs cursor-pointer"
          />
          {errors.deadline && (
            <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.deadline.message}</p>
          )}
        </div>

        {/* Active Toggle */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">
            Publication Status
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setValue("isActive", true)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-black transition cursor-pointer border shadow-xs ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <FiCheckCircle className={isActive ? "text-emerald-600" : ""} /> Active (Public)
            </button>

            <button
              type="button"
              onClick={() => setValue("isActive", false)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-black transition cursor-pointer border shadow-xs ${
                !isActive
                  ? "bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-500/20"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <FiPauseCircle className={!isActive ? "text-amber-600" : ""} /> Draft / Paused
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
