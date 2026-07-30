import { FiImage, FiTrash2 } from "react-icons/fi";
import type { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import type { CompanyFormData } from "../validation/company.schema";

interface CompanyLogoUploadProps {
  register: UseFormRegister<CompanyFormData>;
  errors: FieldErrors<CompanyFormData>;
  setValue: UseFormSetValue<CompanyFormData>;
  logoUrl?: string;
  coverUrl?: string;
}

export const CompanyLogoUpload = ({
  register,
  errors,
  setValue,
  logoUrl,
  coverUrl,
}: CompanyLogoUploadProps) => {
  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-6 flex items-center gap-2 border-b border-[#F0F4FC] pb-3">
        <FiImage className="text-[#3C65F5]" /> Branding & Media Assets
      </h3>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Company Logo Upload */}
        <div className="flex flex-col justify-between rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-4">
          <div>
            <label className="block text-xs font-bold text-[#05264E] mb-2">
              Company Logo URL
            </label>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white border border-[#EAEFF7] overflow-hidden p-1 shadow-xs">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <FiImage className="text-2xl text-gray-400" />
                )}
              </div>

              <div className="w-full">
                <input
                  {...register("logo")}
                  placeholder="https://example.com/logo.png"
                  className="w-full rounded-xl border border-[#EAEFF7] bg-white p-2.5 text-xs font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5]"
                />
                {errors.logo && (
                  <p className="mt-1 text-xs text-red-500">{errors.logo.message}</p>
                )}
              </div>
            </div>
          </div>

          {logoUrl && (
            <button
              type="button"
              onClick={() => setValue("logo", "")}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 cursor-pointer"
            >
              <FiTrash2 /> Remove Logo
            </button>
          )}
        </div>

        {/* Cover Banner Upload */}
        <div className="flex flex-col justify-between rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-4">
          <div>
            <label className="block text-xs font-bold text-[#05264E] mb-2">
              Cover Banner URL
            </label>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-xl bg-white border border-[#EAEFF7] overflow-hidden p-1 shadow-xs">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt="Cover Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiImage className="text-2xl text-gray-400" />
                )}
              </div>

              <div className="w-full">
                <input
                  {...register("coverImage")}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full rounded-xl border border-[#EAEFF7] bg-white p-2.5 text-xs font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5]"
                />
                {errors.coverImage && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.coverImage.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {coverUrl && (
            <button
              type="button"
              onClick={() => setValue("coverImage", "")}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 cursor-pointer"
            >
              <FiTrash2 /> Remove Cover
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
