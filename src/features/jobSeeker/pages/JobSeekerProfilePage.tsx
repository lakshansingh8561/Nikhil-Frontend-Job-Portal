import { useState } from "react";
import JobSeekerProfileView from "../components/JobSeekerProfileView";
import EditProfileModal from "../components/EditProfileModal";
import { useGetProfileQuery } from "../api/jobSeekerApi";

const JobSeekerProfilePage = () => {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F7FC]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto overscroll-contain pr-1 pb-12 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
      {profile ? (
        <JobSeekerProfileView profile={profile} />
      ) : (
        <div className="mx-auto max-w-xl text-center rounded-3xl bg-white p-10 border border-[#EAEFF7] shadow-sm">
          <h2 className="text-2xl font-bold text-[#05264E]">
            Setup Your Job Seeker Profile
          </h2>
          <p className="mt-3 text-sm text-[#66789C]">
            Create your profile to showcase your skills, experience, and education to recruiters worldwide.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-6 inline-flex rounded-xl bg-[#3C65F5] px-8 py-3.5 font-semibold text-white transition hover:bg-[#254BD6] shadow-md cursor-pointer"
          >
            Create Profile Now
          </button>

          <EditProfileModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default JobSeekerProfilePage;
