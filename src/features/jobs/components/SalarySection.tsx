import { FiDollarSign } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { JobFormData } from "../validation/job.schema";

interface SalarySectionProps {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
}

export const SalarySection = ({ register, errors }: SalarySectionProps) => {
  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
        <FiDollarSign className="text-[#3C65F5]" /> Salary Offer Range
      </h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Minimum Salary */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Minimum Salary ($ / ₹ per year) <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <FiDollarSign className="absolute left-3.5 text-gray-400" />
            <input
              type="number"
              {...register("salaryMin", { valueAsNumber: true })}
              placeholder="e.g. 80000"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
          {errors.salaryMin && (
            <p className="mt-1 text-xs text-red-500">{errors.salaryMin.message}</p>
          )}
        </div>

        {/* Maximum Salary */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Maximum Salary ($ / ₹ per year) <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <FiDollarSign className="absolute left-3.5 text-gray-400" />
            <input
              type="number"
              {...register("salaryMax", { valueAsNumber: true })}
              placeholder="e.g. 150000"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
          {errors.salaryMax && (
            <p className="mt-1 text-xs text-red-500">{errors.salaryMax.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
