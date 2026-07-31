import React, { useState } from "react";
import { FiBriefcase, FiAlertTriangle, FiRefreshCw, FiSearch } from "react-icons/fi";
import Container from "../../../components/common/Container";
import ScrollToTop from "../../../components/common/ScrollToTop";
import { useGetMyApplicationsQuery } from "../api/applicationApi";
import ApplicationCard from "../components/ApplicationCard";
import ApplicationSkeleton from "../components/ApplicationSkeleton";
import EmptyApplications from "../components/EmptyApplications";
import type { ApplicationStatus } from "../types/application.types";

export const MyApplications: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: applications, isLoading, isError, error, refetch } =
    useGetMyApplicationsQuery();

  const allApplications = applications || [];

  // Filter logic
  const filteredApplications = allApplications.filter((app) => {
    const matchesStatus =
      statusFilter === "ALL" || app.status === statusFilter;

    const job = typeof app.jobId === "object" && app.jobId !== null ? app.jobId : null;
    const company =
      job && typeof job.companyId === "object" && job.companyId !== null
        ? job.companyId
        : null;

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (job?.title && job.title.toLowerCase().includes(searchLower)) ||
      (company?.companyName &&
        company.companyName.toLowerCase().includes(searchLower)) ||
      (job?.location && job.location.toLowerCase().includes(searchLower));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5F7FC] pt-28 pb-16">
      <Container>
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#05264E]">
              My Job Applications
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#66789C]">
              Track and manage all your submitted job applications in real time
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#EAEFF7] shadow-sm">
            <FiBriefcase className="text-[#3C65F5] ml-2 text-lg" />
            <span className="text-xs font-bold text-[#05264E] pr-2">
              Total: {allApplications.length}
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#EAEFF7] bg-white p-4 shadow-sm">
          {/* Search Input */}
          <div className="flex items-center gap-2.5 rounded-xl bg-[#F8FAFC] px-3.5 py-2 border border-[#EAEFF7] w-full sm:w-72">
            <FiSearch className="text-gray-400 text-sm shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by job title or company..."
              className="w-full bg-transparent text-xs font-medium text-[#05264E] outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "ALL", label: "All" },
              { id: "APPLIED", label: "Applied" },
              { id: "SHORTLISTED", label: "Shortlisted" },
              { id: "INTERVIEW", label: "Interview" },
              { id: "REJECTED", label: "Rejected" },
              { id: "HIRED", label: "Hired" },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as ApplicationStatus | "ALL")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#3C65F5] text-white shadow-sm"
                      : "bg-[#F8FAFC] text-[#66789C] hover:bg-[#E8F0FE] hover:text-[#3C65F5]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        {isLoading ? (
          <ApplicationSkeleton count={4} />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/50 p-12 text-center shadow-sm min-h-[360px]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
              <FiAlertTriangle className="text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Failed to Load Applications
            </h3>
            <p className="mt-1 max-w-md text-xs font-medium text-gray-600">
              {(error as any)?.data?.message ||
                "There was an issue fetching your applications. Please try again."}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-6 flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#254BD6] cursor-pointer"
            >
              <FiRefreshCw /> Retry Loading
            </button>
          </div>
        ) : filteredApplications.length === 0 ? (
          <EmptyApplications
            title={
              searchTerm || statusFilter !== "ALL"
                ? "No Matching Applications Found"
                : "No Applications Submitted Yet"
            }
            message={
              searchTerm || statusFilter !== "ALL"
                ? "Try clearing your search or status filter to see all your submitted applications."
                : "You haven't submitted any job applications yet. Browse available jobs and apply today!"
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <ApplicationCard key={app._id} application={app} />
            ))}
          </div>
        )}
      </Container>

      <ScrollToTop />
    </div>
  );
};

export default MyApplications;
