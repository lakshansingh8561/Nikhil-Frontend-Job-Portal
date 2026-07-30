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
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
        <FiBriefcase className="text-[#3C65F5]" /> Basic Information
      </h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Job Title */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title")}
            placeholder="e.g. Senior Backend Developer (Node.js & Express)"
            className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Vacancies */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Number of Vacancies <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <FiUsers className="absolute left-3.5 text-gray-400" />
            <input
              type="number"
              {...register("vacancies", { valueAsNumber: true })}
              placeholder="1"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
          {errors.vacancies && (
            <p className="mt-1 text-xs text-red-500">{errors.vacancies.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
