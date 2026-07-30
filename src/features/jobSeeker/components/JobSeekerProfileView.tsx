import { useState } from "react";
import {
  FiEdit3,
  FiMapPin,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiDollarSign,
  FiAward,
  FiBookOpen,
} from "react-icons/fi";
import type { JobSeekerProfile } from "../types/jobSeeker.types";
import EditProfileModal from "./EditProfileModal";

interface JobSeekerProfileViewProps {
  profile: JobSeekerProfile;
}

const JobSeekerProfileView = ({ profile }: JobSeekerProfileViewProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-[#EAEFF7]">
        {/* Cover Accent */}
        <div className="h-32 -mx-8 -mt-8 bg-gradient-to-r from-[#3C65F5] to-[#05264E] mb-6" />

        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Avatar */}
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-[#3C65F5] text-4xl font-extrabold text-white shadow-xl ring-4 ring-white">
              {profile.firstName ? profile.firstName.charAt(0) : "J"}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#05264E]">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-base font-semibold text-[#3C65F5] mt-1">
                {profile.headline}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-[#66789C]">
                <span className="flex items-center gap-1">
                  <FiMapPin className="text-gray-400" />
                  {profile.currentLocation}
                </span>
                <span className="flex items-center gap-1">
                  <FiMail className="text-gray-400" />
                  {profile.userId?.email}
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <FiPhone className="text-gray-400" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#3C65F5] px-6 py-3 font-semibold text-white transition hover:bg-[#254BD6] shadow-md cursor-pointer self-start md:self-auto"
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#EBF2FF] text-[#3C65F5]">
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
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E6F9F0] text-[#00BA63]">
            <FiDollarSign className="text-2xl" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#66789C]">Expected Salary</p>
            <h3 className="text-xl font-bold text-[#05264E] mt-0.5">
              ₹{profile.expectedSalary?.toLocaleString()} / year
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
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
