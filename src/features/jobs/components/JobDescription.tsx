import { FiFileText } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { JobFormData } from "../validation/job.schema";

interface JobDescriptionProps {
  register: UseFormRegister<JobFormData>;
  errors: FieldErrors<JobFormData>;
}

export const JobDescription = ({ register, errors }: JobDescriptionProps) => {
  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
        <FiFileText className="text-[#3C65F5]" /> Job Description & Requirements
      </h3>

      <div>
        <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
          Detailed Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description")}
          rows={6}
          placeholder="We are looking for an experienced backend developer with Node.js and MongoDB skills to build high-performance microservices..."
          className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3.5 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
};
