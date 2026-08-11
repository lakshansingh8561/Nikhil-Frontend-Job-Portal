import React, { useState } from "react";
import { FiCamera, FiCheckCircle, FiLoader } from "react-icons/fi";
import toast from "react-hot-toast";

interface ProfileHeaderProps {
  firstName?: string;
  lastName?: string;
  designation?: string;
  currentCompany?: string;
  profilePicture?: string;
  onPictureChange?: (url: string) => void;
}

const ProfileHeader = ({
  firstName,
  lastName,
  designation,
  currentCompany,
  profilePicture,
  onPictureChange,
}: ProfileHeaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (onPictureChange) {
          onPictureChange(json.data.url);
        }
        toast.success("Recruiter profile photo uploaded to Cloudinary! 🎉");
      } else {
        toast.error(json.message || "Failed to upload photo");
      }
    } catch (err: any) {
      toast.error(err?.message || "Photo upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm border border-[#EAEFF7]">
      {/* Premium Dark Navy Cover Banner */}
      <div className="h-40 w-full bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#1D4ED8] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
      </div>

      {/* Info Section */}
      <div className="p-6 sm:p-8 pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Avatar Container with Cloudinary Upload */}
            <div className="relative group flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#1D4ED8] font-black text-white text-3xl shadow-xl ring-4 ring-white overflow-hidden -mt-12">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{firstName ? firstName.charAt(0).toUpperCase() : "R"}</span>
              )}

              {/* Upload Overlay */}
              <label
                htmlFor="recruiter-avatar-header-upload"
                className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition cursor-pointer z-10"
                title="Upload photo to Cloudinary (Job-portal/Profile-Images)"
              >
                {isUploading ? (
                  <FiLoader className="text-white text-2xl animate-spin" />
                ) : (
                  <>
                    <FiCamera className="text-white text-xl" />
                    <span className="text-[10px] font-bold text-white mt-0.5">Upload</span>
                  </>
                )}
              </label>
              <input
                id="recruiter-avatar-header-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
            </div>

            {/* Recruiter Name & Designation */}
            <div className="pt-3 sm:pt-4">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-[#05264E]">
                  {firstName || lastName ? `${firstName} ${lastName}` : "Recruiter Profile"}
                </h2>
                <FiCheckCircle className="text-[#1D4ED8] text-xl" title="Verified Recruiter" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#1D4ED8] mt-1">
                {designation || "Hiring Manager"}{" "}
                {currentCompany ? `@ ${currentCompany}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
