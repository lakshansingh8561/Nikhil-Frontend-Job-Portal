import { FiCamera } from "react-icons/fi";

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
      {/* Cover Gradient Banner */}
      <div className="h-36 w-full bg-gradient-to-r from-[#3C65F5] via-[#254BD6] to-[#05264E]" />

      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between px-6 pb-6 pt-0 -mt-12 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5">
          {/* Avatar / Logo Container */}
          <div className="relative group flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#3C65F5] font-extrabold text-white text-3xl shadow-xl ring-4 ring-white overflow-hidden">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{firstName ? firstName.charAt(0) : "R"}</span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
              <FiCamera className="text-white text-xl" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-[#05264E]">
              {firstName || lastName ? `${firstName} ${lastName}` : "Recruiter Profile"}
            </h2>
            <p className="text-sm font-semibold text-[#3C65F5] mt-0.5">
              {designation || "Hiring Manager"}{" "}
              {currentCompany ? `@ ${currentCompany}` : ""}
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-600 border border-emerald-200">
          Verified Recruiter
        </span>
      </div>
    </div>
  );
};

export default ProfileHeader;
