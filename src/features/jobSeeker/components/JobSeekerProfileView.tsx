import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiEdit3,
  FiMapPin,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiDollarSign,
  FiAward,
  FiBookOpen,
  FiZap,
  FiCheckCircle,
  FiArrowRight,
  FiCamera,
  FiFileText,
  FiUploadCloud,
  FiDownload,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import toast from "react-hot-toast";
import type { JobSeekerProfile } from "../types/jobSeeker.types";
import EditProfileModal from "./EditProfileModal";
import { ResumeParserModal } from "./ResumeParserModal";
import type { ParsedResumeResponse } from "../../ai/api/aiApi";
import { useGetCurrentSubscriptionQuery } from "../../membership/api/membershipApi";
import { useUpdateProfileMutation } from "../api/jobSeekerApi";

interface JobSeekerProfileViewProps {
  profile: JobSeekerProfile;
}

const JobSeekerProfileView = ({ profile }: JobSeekerProfileViewProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [updateProfile] = useUpdateProfileMutation();
  const { data: currentSub } = useGetCurrentSubscriptionQuery();

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  const sub = currentSub?.subscription;
  const plan = currentSub?.plan;
  const hasActiveSub = Boolean(currentSub?.hasActiveSubscription && sub?.status === "ACTIVE");
  const daysRemaining = sub?.endDate
    ? Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
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
        await updateProfile({ profilePicture: json.data.url }).unwrap();
        toast.success("Profile photo uploaded to Cloudinary! (Job-portal/Profile-Images)");
      } else {
        toast.error(json.message || "Failed to upload photo");
      }
    } catch (err: any) {
      toast.error(err?.message || "Photo upload failed");
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingResume(true);
      const token = localStorage.getItem("jobbox_accessToken");
      const formData = new FormData();
      formData.append("file", file);

      const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/v1/upload/resume`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.data?.url) {
        await updateProfile({ resume: json.data.url }).unwrap();
        toast.success("Resume uploaded to Cloudinary! (Job-portal/resumes)");
      } else {
        toast.error(json.message || "Failed to upload resume");
      }
    } catch (err: any) {
      toast.error(err?.message || "Resume upload failed");
    } finally {
      setIsUploadingResume(false);
      e.target.value = "";
    }
  };

  const handleApplyParsedData = async (data: ParsedResumeResponse) => {
    try {
      const mergedSkills = Array.from(new Set([...(profile.skills || []), ...(data.skills || [])]));
      await updateProfile({
        headline: data.headline || profile.headline,
        bio: data.summary || profile.bio,
        skills: mergedSkills,
        phone: data.phone || profile.phone,
      }).unwrap();
      toast.success("Profile updated with AI parsed resume data!");
    } catch (err) {
      console.error("Failed to save parsed profile:", err);
      toast.error("Failed to auto-update profile.");
    }
  };

  return (
    <div className="space-y-8">
      <ResumeParserModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyParsedData={handleApplyParsedData}
      />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        existingProfile={profile}
      />
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-md border border-[#EAEFF7]">
        {/* Rich Gradient Banner */}
        <div className="relative min-h-[160px] sm:min-h-[180px] w-full bg-gradient-to-r from-[#0B1936] via-[#1E3A8A] to-[#2563EB] p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
          {/* Subtle Ambient Graphic Grids & Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none" />
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Top Banner Row */}
          <div className="relative z-10 flex items-center justify-between gap-4 mb-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-blue-100 ring-1 ring-white/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Candidate Control Center
            </span>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 backdrop-blur-md px-3.5 py-1 text-xs font-extrabold text-white ring-1 ring-white/20">
              <FiCheckCircle className="text-emerald-400 text-sm" /> Verified Profile
            </span>
          </div>

          {/* Banner Heading & Subtitle */}
          <div className="relative z-10 max-w-2xl pb-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">
              Welcome back, {profile.firstName || "Candidate"}! 👋
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 font-medium leading-relaxed hidden sm:block">
              Keep your profile photo, skills, and Cloudinary resume updated to increase your visibility to top hiring recruiters by up to 3x.
            </p>
          </div>
        </div>

        {/* Profile Details Bar Below Banner */}
        <div className="px-6 sm:px-8 pb-8 pt-6 relative z-10 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left Info with Cloudinary Avatar Upload */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="relative shrink-0 group">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={profile.firstName}
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl object-cover shadow-xl ring-4 ring-blue-50"
                  />
                ) : (
                  <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#1E40AF] via-[#1D4ED8] to-[#3C65F5] text-3xl sm:text-4xl font-black text-white shadow-xl ring-4 ring-blue-50">
                    {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : "J"}
                  </div>
                )}

                {/* Cloudinary Camera Icon Button */}
                <label
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#3C65F5] text-white shadow-md hover:bg-[#254BD6] transition cursor-pointer border-2 border-white"
                  title="Upload photo to Cloudinary (Job-portal/Profile-Images)"
                >
                  <FiCamera className="text-sm" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={isUploadingPhoto}
                  />
                </label>
              </div>

              {/* Text Info */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#05264E] tracking-tight">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <span className="rounded-full bg-blue-50 px-3.5 py-1 text-xs font-extrabold text-[#1D4ED8] border border-blue-100">
                    {profile.headline || "Job Seeker"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#66789C] pt-1">
                  {profile.currentLocation && (
                    <span className="flex items-center gap-1.5 bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-gray-100">
                      <FiMapPin className="text-[#1D4ED8]" />
                      {profile.currentLocation}
                    </span>
                  )}
                  {profile.userId?.email && (
                    <span className="flex items-center gap-1.5 bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-gray-100">
                      <FiMail className="text-[#1D4ED8]" />
                      {profile.userId.email}
                    </span>
                  )}
                  {profile.phone && (
                    <span className="flex items-center gap-1.5 bg-[#F8FAFC] px-3 py-1.5 rounded-xl border border-gray-100">
                      <FiPhone className="text-[#1D4ED8]" />
                      {profile.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto flex-wrap">
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 font-extrabold text-white text-sm transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg shadow-md cursor-pointer"
              >
                <HiSparkles className="text-base text-yellow-300 animate-pulse" />
                <span>✨ AI Resume Auto-Fill</span>
              </button>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#3C65F5] px-6 py-3 font-extrabold text-white text-sm transition-all hover:from-[#1E40AF] hover:to-[#254BD6] hover:shadow-lg shadow-md cursor-pointer"
              >
                <FiEdit3 className="text-base" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Bio Section */}
          {profile.bio && (
            <div className="mt-6 border-t border-gray-100 pt-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#66789C] mb-2">
                About Me
              </h3>
              <p className="text-sm text-[#05264E] leading-relaxed font-medium">
                {profile.bio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cloudinary Resume Card */}
      <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#3C65F5] shrink-0 border border-blue-100 shadow-2xs">
              <FiFileText className="text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#05264E]">Candidate CV / Resume</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {profile.resume ? "Uploaded securely to Cloudinary (Job-portal/resumes)" : "Upload your PDF/DOC resume to Cloudinary"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {profile.resume && (
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-2.5 text-xs font-bold text-[#05264E] hover:bg-gray-200 transition cursor-pointer"
              >
                <FiDownload className="text-sm" /> View Resume
              </a>
            )}

            <label className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1D4ED8] to-[#3C65F5] px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:from-[#1E40AF] hover:to-[#254BD6] transition cursor-pointer">
              <FiUploadCloud className="text-base" />
              <span>{isUploadingResume ? "Uploading..." : profile.resume ? "Replace Resume" : "Upload Resume (Cloudinary)"}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
                disabled={isUploadingResume}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Membership Plan Banner */}
      <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shrink-0 border border-amber-100 shadow-2xs">
            <FiZap className="text-2xl fill-yellow-400 text-amber-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#66789C]">
                Membership Subscription
              </span>
              {hasActiveSub && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                  <FiCheckCircle className="text-xs" /> ACTIVE
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-[#05264E]">
              {sub?.planName || plan?.name || "Free Tier Plan"}
            </h3>
            {hasActiveSub && sub?.endDate ? (
              <p className="text-xs font-bold text-emerald-600">
                {daysRemaining} Active Days Remaining (Expiring on {new Date(sub.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})
              </p>
            ) : (
              <p className="text-xs font-medium text-gray-500">
                Free plan — Upgrade to Pro or Premium for AI resume perks & priority recruiter search placement.
              </p>
            )}
          </div>
        </div>

        <Link
          to="/job-seeker/membership"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-3 text-xs font-extrabold text-white hover:bg-[#254BD6] transition-all shadow-sm shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <span>{hasActiveSub ? "Manage Subscription" : "Upgrade Plan"}</span>
          <FiArrowRight />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EBF2FF] text-[#3C65F5] shrink-0">
            <FiBriefcase className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#66789C]">Experience</p>
            <h3 className="text-xl font-bold text-[#05264E] mt-0.5">
              {profile.yearsOfExperience} Years
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E6F9F0] text-[#00BA63] shrink-0">
            <FiDollarSign className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#66789C]">Expected Salary</p>
            <h3 className="text-xl font-bold text-[#05264E] mt-0.5">
              ₹{profile.expectedSalary?.toLocaleString()} / year
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <FiAward className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#66789C]">Skills Count</p>
            <h3 className="text-xl font-bold text-[#05264E] mt-0.5">
              {profile.skills?.length || 0} Skills
            </h3>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-[#05264E] mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2.5">
          {profile.skills?.map((skill) => (
            <span
              key={skill}
              className="rounded-xl bg-[#F0F4FC] px-4 py-2 text-sm font-semibold text-[#3C65F5]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Experience & Education Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Experience Card */}
        <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <FiBriefcase className="text-xl text-[#3C65F5]" />
            <h3 className="text-lg font-bold text-[#05264E]">Work Experience</h3>
          </div>

          {profile.experience && profile.experience.length > 0 ? (
            <div className="space-y-6">
              {profile.experience.map((exp, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-[#EBF2FF] space-y-1">
                  <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-[#3C65F5] ring-4 ring-white" />
                  <h4 className="text-base font-bold text-[#05264E]">{exp.designation}</h4>
                  <p className="text-sm font-semibold text-[#3C65F5]">{exp.company}</p>
                  <p className="text-xs text-[#66789C]">{exp.employmentType}</p>
                  {exp.description && (
                    <p className="text-xs text-gray-600 mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No experience history listed.</p>
          )}
        </div>

        {/* Education Card */}
        <div className="rounded-3xl border border-[#EAEFF7] bg-white p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <FiBookOpen className="text-xl text-[#3C65F5]" />
            <h3 className="text-lg font-bold text-[#05264E]">Education</h3>
          </div>

          {profile.education && profile.education.length > 0 ? (
            <div className="space-y-6">
              {profile.education.map((edu, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-[#EBF2FF] space-y-1">
                  <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-[#3C65F5] ring-4 ring-white" />
                  <h4 className="text-base font-bold text-[#05264E]">{edu.degree}</h4>
                  <p className="text-sm font-semibold text-[#3C65F5]">{edu.institution}</p>
                  <p className="text-xs text-[#66789C]">{edu.fieldOfStudy}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No education history listed.</p>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        existingProfile={profile}
      />
    </div>
  );
};

export default JobSeekerProfileView;
