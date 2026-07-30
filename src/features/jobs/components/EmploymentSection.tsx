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
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
        <FiClock className="text-[#3C65F5]" /> Location & Employment Details
      </h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <FiMapPin className="absolute left-3.5 text-gray-400" />
            <input
              {...register("location")}
              placeholder="e.g. Noida / New York / Remote"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
          {errors.location && (
            <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>
          )}
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Employment Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("employmentType")}
            className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
          </select>
          {errors.employmentType && (
            <p className="mt-1 text-xs text-red-500">{errors.employmentType.message}</p>
          )}
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Experience Level <span className="text-red-500">*</span>
          </label>
          <div className="relative flex items-center">
            <FiAward className="absolute left-3.5 text-gray-400" />
            <select
              {...register("experienceLevel")}
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] outline-none transition focus:border-[#3C65F5] focus:bg-white"
            >
              <option value="FRESHER">Fresher (0-1 Yrs)</option>
              <option value="ONE_TO_TWO">1–2 Years</option>
              <option value="THREE_TO_FIVE">3–5 Years</option>
              <option value="FIVE_PLUS">5+ Years</option>
            </select>
          </div>
          {errors.experienceLevel && (
            <p className="mt-1 text-xs text-red-500">{errors.experienceLevel.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
