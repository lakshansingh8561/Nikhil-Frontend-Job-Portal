import React, { useState } from "react";
import { FiImage, FiUploadCloud, FiCheckCircle, FiLoader } from "react-icons/fi";
import type { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import type { CreateRecruiterProfileInput } from "../types/recruiter.types";
import toast from "react-hot-toast";

interface CompanyLogoUploadProps {
  register: UseFormRegister<CreateRecruiterProfileInput>;
  errors: FieldErrors<CreateRecruiterProfileInput>;
  previewUrl?: string;
  setValue?: UseFormSetValue<CreateRecruiterProfileInput>;
  onPictureChange?: (url: string) => void;
}

const CompanyLogoUpload: React.FC<CompanyLogoUploadProps> = ({
  register,
  errors,
  previewUrl,
  setValue,
  onPictureChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const token = localStorage.getItem("jobbox_accessToken");
      const formData = new FormData();
      formData.append("file", file);

      const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/v1/upload/profile-image`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.data?.url) {
        if (setValue) {
          setValue("profilePicture", json.data.url, { shouldValidate: true, shouldDirty: true });
        }
        if (onPictureChange) {
          onPictureChange(json.data.url);
        }
        toast.success("Profile photo uploaded to Cloudinary! (Job-portal/Profile-Images)");
      } else {
        toast.error(json.message || "Failed to upload image");
      }
    } catch (err: any) {
      toast.error(err?.message || "Image upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
      <h3 className="text-base font-bold text-[#05264E] mb-4 flex items-center gap-2">
        <FiImage className="text-[#3C65F5]" /> Profile Picture / Avatar (Cloudinary)
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-gray-300 overflow-hidden shadow-inner group">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <FiImage className="text-3xl text-gray-400" />
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
              <FiLoader className="text-white text-2xl animate-spin" />
            </div>
          )}
        </div>

        <div className="w-full space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="recruiter-logo-file-input"
              className="inline-flex items-center gap-2 rounded-xl bg-[#3C65F5] px-4 py-2 text-xs font-bold text-white hover:bg-[#254BD6] transition cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <FiLoader className="animate-spin" /> Uploading to Cloudinary...
                </>
              ) : (
                <>
                  <FiUploadCloud className="text-base" /> Choose Image File
                </>
              )}
            </label>
            <input
              id="recruiter-logo-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
            {previewUrl && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                <FiCheckCircle /> Photo Loaded
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#05264E] mb-1">
              Image URL (Direct Cloudinary URL)
            </label>
            <input
              {...register("profilePicture")}
              placeholder="https://res.cloudinary.com/..."
              className="w-full rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] p-3 text-xs sm:text-sm font-medium text-[#05264E] placeholder-gray-400 outline-none transition focus:border-[#3C65F5] focus:bg-white"
            />
            {errors.profilePicture && (
              <p className="mt-1 text-xs text-red-500">
                {errors.profilePicture.message}
              </p>
            )}
            <p className="mt-1.5 text-[11px] text-[#66789C]">
              Upload an image file above to automatically save to Cloudinary or paste an existing URL.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogoUpload;
