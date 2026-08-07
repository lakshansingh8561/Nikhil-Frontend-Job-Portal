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
} from "react-icons/fi";
import type { JobSeekerProfile } from "../types/jobSeeker.types";
import EditProfileModal from "./EditProfileModal";
import { useGetCurrentSubscriptionQuery } from "../../membership/api/membershipApi";

interface JobSeekerProfileViewProps {
  profile: JobSeekerProfile;
}

const JobSeekerProfileView = ({ profile }: JobSeekerProfileViewProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: currentSub } = useGetCurrentSubscriptionQuery();

  const sub = currentSub?.subscription;
  const plan = currentSub?.plan;
  const hasActiveSub = Boolean(currentSub?.hasActiveSubscription && sub?.status === "ACTIVE");
  const daysRemaining = sub?.endDate
    ? Math.max(0, Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-[#EAEFF7]">
        {/* Cover Accent */}
        <div className="h-36 -mx-8 -mt-8 bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#1D4ED8] mb-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Avatar overlapping cover */}
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-2xl bg-[#1D4ED8] text-4xl font-extrabold text-white shadow-xl ring-4 ring-white -mt-16 sm:-mt-20">
              {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : "J"}
            </div>

            <div className="pt-3 sm:pt-4">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#05264E] tracking-tight">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-sm sm:text-base font-bold text-[#1D4ED8] mt-0.5">
                {profile.headline || "Job Seeker"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#66789C]">
                {profile.currentLocation && (
                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="text-[#1D4ED8]" />
                    {profile.currentLocation}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <FiMail className="text-[#1D4ED8]" />
                  {profile.userId?.email}
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-1.5">
                    <FiPhone className="text-[#1D4ED8]" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#1D4ED8] px-6 py-3 font-semibold text-white transition hover:bg-[#1E40AF] shadow-md cursor-pointer self-start md:self-auto"
          >
            <FiEdit3 className="text-lg" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-8 border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#66789C] mb-2">
              About Me
            </h3>
            <p className="text-sm text-[#05264E] leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}
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
