import { FiFileText } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateRecruiterProfileInput } from "../types/recruiter.types";

interface CompanyInformationProps {
  register: UseFormRegister<CreateRecruiterProfileInput>;
  errors: FieldErrors<CreateRecruiterProfileInput>;
}

const CompanyInformation = ({
  register,
  errors,
}: CompanyInformationProps) => {
  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
        <FiFileText className="text-[#3C65F5]" /> Professional Bio & Headline
      </h3>

      <div className="space-y-5">
        {/* Professional Headline */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Professional Headline
          </label>
          <input
            {...register("headline")}
            placeholder="Senior Tech Recruiter scaling engineering teams at TechNova"
            className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
          />
          {errors.headline && (
            <p className="mt-1 text-xs text-red-500">
              {errors.headline.message}
            </p>
          )}
        </div>

        {/* About Me */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            About Me / Summary
          </label>
          <textarea
            {...register("bio")}
            rows={4}
            placeholder="Passionate recruiter with over 5 years of experience in hiring Full Stack, DevOps, and Product leaders..."
            className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3.5 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
          />
          {errors.bio && (
            <p className="mt-1 text-xs text-red-500">
              {errors.bio.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInformation;
