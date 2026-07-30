import { FiImage } from "react-icons/fi";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CreateRecruiterProfileInput } from "../types/recruiter.types";

interface CompanyLogoUploadProps {
  register: UseFormRegister<CreateRecruiterProfileInput>;
  errors: FieldErrors<CreateRecruiterProfileInput>;
  previewUrl?: string;
}

const CompanyLogoUpload = ({
  register,
  errors,
  previewUrl,
}: CompanyLogoUploadProps) => {
  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-4 flex items-center gap-2">
        <FiImage className="text-[#3C65F5]" /> Profile Picture / Avatar
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#EAEFF7] overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <FiImage className="text-2xl text-gray-400" />
          )}
        </div>

        <div className="w-full">
          <label className="block text-xs font-semibold text-[#05264E] mb-1">
            Image URL
          </label>
          <input
            {...register("profilePicture")}
            placeholder="https://example.com/avatar.jpg"
            className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
          />
          {errors.profilePicture && (
            <p className="mt-1 text-xs text-red-500">
              {errors.profilePicture.message}
            </p>
          )}
          <p className="mt-1.5 text-[11px] text-[#66789C]">
            Provide a direct image URL (PNG, JPG, or WEBP).
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogoUpload;
