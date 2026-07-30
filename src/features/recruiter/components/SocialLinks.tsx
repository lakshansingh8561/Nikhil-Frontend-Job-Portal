import { FiLinkedin, FiGithub, FiGlobe, FiShare2 } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateRecruiterProfileInput } from "../types/recruiter.types";

interface SocialLinksProps {
  register: UseFormRegister<CreateRecruiterProfileInput>;
  errors: FieldErrors<CreateRecruiterProfileInput>;
}

const SocialLinks = ({ register, errors }: SocialLinksProps) => {
  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
        <FiShare2 className="text-[#3C65F5]" /> Social Profiles & Links
      </h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* LinkedIn Profile */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            LinkedIn Profile
          </label>
          <div className="relative flex items-center">
            <FiLinkedin className="absolute left-3.5 text-blue-600" />
            <input
              {...register("linkedin")}
              placeholder="https://linkedin.com/in/username"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
          {errors.linkedin && (
            <p className="mt-1 text-xs text-red-500">
              {errors.linkedin.message}
            </p>
          )}
        </div>

        {/* GitHub Profile */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            GitHub Profile
          </label>
          <div className="relative flex items-center">
            <FiGithub className="absolute left-3.5 text-gray-700" />
            <input
              {...register("github")}
              placeholder="https://github.com/username"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
          {errors.github && (
            <p className="mt-1 text-xs text-red-500">
              {errors.github.message}
            </p>
          )}
        </div>

        {/* Portfolio Website */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Portfolio Website
          </label>
          <div className="relative flex items-center">
            <FiGlobe className="absolute left-3.5 text-emerald-600" />
            <input
              {...register("portfolio")}
              placeholder="https://mywebsite.com"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
          {errors.portfolio && (
            <p className="mt-1 text-xs text-red-500">
              {errors.portfolio.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
