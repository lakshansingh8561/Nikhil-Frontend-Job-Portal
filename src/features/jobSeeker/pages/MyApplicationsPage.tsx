import { FiBriefcase, FiClock, FiCheckCircle } from "react-icons/fi";
import Container from "../../../components/common/Container";
import { useGetMyApplicationsQuery } from "../api/applicationsApi";

const MyApplicationsPage = () => {
  const { data: applications, isLoading } = useGetMyApplicationsQuery();

  return (
    <div className="min-h-screen bg-[#F5F7FC] pt-28 pb-16">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#05264E]">
            My Job Applications
          </h1>
          <p className="text-sm text-[#66789C] mt-1">
            Track the status of all your submitted job applications.
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl bg-white border border-[#EAEFF7]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3C65F5] border-t-transparent" />
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => {
              const jobTitle = typeof app.jobId === "object" ? app.jobId.title : "Applied Job";
              const location = typeof app.jobId === "object" ? app.jobId.location : "Location";

              return (
                <div
                  key={app._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-[#EAEFF7] bg-white p-6 shadow-sm gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EBF2FF] text-[#3C65F5]">
                      <FiBriefcase className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#05264E]">{jobTitle}</h3>
                      <p className="text-xs text-[#66789C] mt-0.5">📍 {location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#66789C]">
                      <FiClock />
                      <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold ${
                        app.status === "ACCEPTED"
                          ? "bg-green-100 text-green-700"
                          : app.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <FiCheckCircle />
                      {app.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-12 text-center border border-[#EAEFF7] shadow-sm">
            <FiBriefcase className="mx-auto text-4xl text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-[#05264E]">No Applications Found</h3>
            <p className="text-xs text-[#66789C] mt-1">
              You haven't applied for any jobs yet. Browse available jobs and apply!
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default MyApplicationsPage;
