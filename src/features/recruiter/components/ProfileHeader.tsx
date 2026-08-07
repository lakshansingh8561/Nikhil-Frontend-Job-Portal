import { FiCamera, FiCheckCircle } from "react-icons/fi";

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
}: ProfileHeaderProps) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm border border-[#EAEFF7]">
      {/* Premium Dark Navy Cover Banner */}
      <div className="h-40 w-full bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#1D4ED8] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
      </div>

      {/* Info Section - Generous top spacing so text never touches the cover banner */}
      <div className="p-6 sm:p-8 pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            {/* Avatar Container with isolated negative top margin */}
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
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
                <FiCamera className="text-white text-xl" />
              </div>
            </div>

            {/* Recruiter Name & Designation with generous top padding below banner */}
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

          <span className="self-start sm:self-center mt-2 sm:mt-0 flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-extrabold text-emerald-700 border border-emerald-200 shadow-2xs">
            <FiCheckCircle className="text-xs" /> Verified Recruiter
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
