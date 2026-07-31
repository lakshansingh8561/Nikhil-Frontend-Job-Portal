import React, { useState } from "react";
import { FiFileText, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import ApplicationTable from "../components/ApplicationTable";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import SkeletonLoader from "../components/SkeletonLoader";
import { useGetAllAdminApplicationsQuery } from "../api/adminApi";

export const Applications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // RTK Query with server-side pagination
  const { data, isLoading, isError, error, refetch } =
    useGetAllAdminApplicationsQuery({
      page: currentPage,
      limit: itemsPerPage,
      status: statusFilter,
      search: searchTerm,
    });

  const applicationsList = data?.items || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#05264E]">
            Application Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-[#66789C]">
            Track all job seeker application submissions, candidate resumes, and recruitment statuses
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-white p-2.5 border border-[#EAEFF7] shadow-xs">
          <FiFileText className="text-rose-600 ml-1" />
          <span className="text-xs font-bold text-[#05264E] pr-1">
            Total Applications: {totalItems}
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-[#EAEFF7] bg-white p-4 shadow-xs">
        <SearchBar
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Search by candidate name or job title..."
        />

        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          options={[
            { value: "ALL", label: "All Statuses" },
            { value: "APPLIED", label: "Applied" },
            { value: "SHORTLISTED", label: "Shortlisted" },
            { value: "INTERVIEW", label: "Interview" },
            { value: "REJECTED", label: "Rejected" },
            { value: "HIRED", label: "Hired" },
          ]}
        />
      </div>

      {/* Main Table Content */}
      {isLoading ? (
        <SkeletonLoader rows={6} />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/50 p-12 text-center shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-3">
            <FiAlertTriangle className="text-2xl" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            Failed to Load Applications
          </h3>
          <p className="mt-1 text-xs font-medium text-gray-600">
            {(error as any)?.data?.message ||
              "An error occurred while fetching application submissions."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#254BD6] transition cursor-pointer"
          >
            <FiRefreshCw /> Retry Loading
          </button>
        </div>
      ) : applicationsList.length === 0 ? (
        <EmptyState
          title="No Applications Found"
          message="No candidate application submissions match your search query or selected filters."
        />
      ) : (
        <>
          <ApplicationTable applications={applicationsList} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default Applications;
