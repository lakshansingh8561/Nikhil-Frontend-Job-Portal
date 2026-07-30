import { FiLinkedin, FiFacebook, FiTwitter, FiInstagram, FiGithub, FiYoutube, FiShare2 } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CompanyFormData } from "../validation/company.schema";

interface CompanySocialLinksProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
}

export const CompanySocialLinks = ({
  register,
  errors,
}: CompanySocialLinksProps) => {
  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
        <FiShare2 className="text-[#3C65F5]" /> Official Social Links
      </h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* LinkedIn */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            LinkedIn Page
          </label>
          <div className="relative flex items-center">
            <FiLinkedin className="absolute left-3.5 text-blue-600 text-base" />
            <input
              {...register("linkedin")}
              placeholder="https://linkedin.com/company/name"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
          {errors.linkedin && (
            <p className="mt-1 text-xs text-red-500">{errors.linkedin.message}</p>
          )}
        </div>

        {/* Facebook */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Facebook Page
          </label>
          <div className="relative flex items-center">
            <FiFacebook className="absolute left-3.5 text-blue-700 text-base" />
            <input
              {...register("facebook")}
              placeholder="https://facebook.com/company"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
          {errors.facebook && (
            <p className="mt-1 text-xs text-red-500">{errors.facebook.message}</p>
          )}
        </div>

        {/* Twitter */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Twitter / X Profile
          </label>
          <div className="relative flex items-center">
            <FiTwitter className="absolute left-3.5 text-sky-500 text-base" />
            <input
              {...register("twitter")}
              placeholder="https://twitter.com/handle"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
          {errors.twitter && (
            <p className="mt-1 text-xs text-red-500">{errors.twitter.message}</p>
          )}
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            Instagram Profile
          </label>
          <div className="relative flex items-center">
            <FiInstagram className="absolute left-3.5 text-pink-600 text-base" />
            <input
              {...register("instagram")}
              placeholder="https://instagram.com/handle"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            GitHub Organization
          </label>
          <div className="relative flex items-center">
            <FiGithub className="absolute left-3.5 text-gray-800 text-base" />
            <input
              {...register("github")}
              placeholder="https://github.com/company"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
        </div>

        {/* YouTube */}
        <div>
          <label className="block text-xs font-semibold text-[#05264E] mb-1.5">
            YouTube Channel
          </label>
          <div className="relative flex items-center">
            <FiYoutube className="absolute left-3.5 text-red-600 text-base" />
            <input
              {...register("youtube")}
              placeholder="https://youtube.com/@channel"
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] py-3 pl-10 pr-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
