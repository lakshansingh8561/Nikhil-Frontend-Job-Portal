import { useState } from "react";
import Container from "../../../components/common/Container";
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
    <div className="min-h-screen bg-[#F5F7FC] pt-28 pb-16">
      <Container>
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
      </Container>
    </div>
  );
};

export default JobSeekerProfilePage;
