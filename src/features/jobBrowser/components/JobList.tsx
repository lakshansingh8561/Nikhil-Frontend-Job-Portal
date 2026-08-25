import React from "react";
import { FiGrid, FiList, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import type { JobBrowserItem, JobBrowserPagination } from "../types/jobBrowser.types";
import JobCard from "./JobCard";
import JobsSkeleton from "./JobsSkeleton";
import EmptyJobs from "./EmptyJobs";

interface JobListProps {
  jobs: JobBrowserItem[];
  pagination: JobBrowserPagination;
  isLoading: boolean;
  isError: boolean;
  error?: any;
  refetch: () => void;
  limit: number;
  setLimit: (val: number) => void;
  layout: "grid" | "list";
  setLayout: (val: "grid" | "list") => void;
  onResetFilters: () => void;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  pagination,
  isLoading,
  isError,
  error,
  refetch,
  limit,
  setLimit,
  layout,
  setLayout,
  onResetFilters,
}) => {
  // Error state component
  if (isError) {
    const errorMessage =
      error?.data?.message || "Failed to load jobs from the server.";

    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/50 p-12 text-center shadow-sm min-h-[380px]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
          <FiAlertTriangle className="text-3xl" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Failed to Fetch Jobs</h3>
        <p className="mt-1 max-w-md text-xs font-medium text-gray-600">
          {errorMessage}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-6 flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#254BD6] cursor-pointer"
        >
          <FiRefreshCw className="text-sm" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Top Header Control Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#EAEFF7] bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold text-[#66789C]">
          Showing{" "}
          <span className="font-bold text-[#05264E]">
            {jobs.length > 0 ? 1 : 0}–{jobs.length}
          </span>{" "}
          of <span className="font-bold text-[#05264E]">{pagination.total}</span> jobs
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {/* Limit Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#66789C]">Show:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="rounded-xl border border-[#EAEFF7] bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#05264E] outline-none cursor-pointer"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
            <button
              onClick={() => setLayout("list")}
              title="List View"
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition cursor-pointer ${
                layout === "list"
                  ? "bg-[#3C65F5] text-white"
                  : "bg-[#F8FAFC] text-gray-400 hover:text-gray-700"
              }`}
            >
              <FiList className="text-base" />
            </button>
            <button
              onClick={() => setLayout("grid")}
              title="Grid View"
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition cursor-pointer ${
                layout === "grid"
                  ? "bg-[#3C65F5] text-white"
                  : "bg-[#F8FAFC] text-gray-400 hover:text-gray-700"
              }`}
            >
              <FiGrid className="text-base" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <JobsSkeleton count={limit} layout={layout} />
      ) : jobs.length === 0 ? (
        <EmptyJobs onReset={onResetFilters} />
      ) : (
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
              : "space-y-4"
          }
        >
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} layout={layout} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
