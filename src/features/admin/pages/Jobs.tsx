import React, { useState } from "react";
import { FiBriefcase, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import JobTable from "../components/JobTable";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import SkeletonLoader from "../components/SkeletonLoader";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import {
  useGetAllAdminJobsQuery,
  useDeleteAdminJobMutation,
} from "../api/adminApi";
import type { AdminJob } from "../types/admin.types";

export const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Modal State
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // RTK Query with server-side pagination
  const { data, isLoading, isError, error, refetch } = useGetAllAdminJobsQuery({
    page: currentPage,
    limit: itemsPerPage,
    employmentType: typeFilter,
    search: searchTerm,
  });

  const [deleteJob, { isLoading: isDeleting }] = useDeleteAdminJobMutation();

  const jobsList = data?.items || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 1;

  const handleDeleteRequest = (job: AdminJob) => {
    setSelectedJob(job);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedJob) return;
    try {
      await deleteJob(selectedJob._id).unwrap();
      toast.success("Job posting deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedJob(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete job posting.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#05264E]">
            Job Moderation & Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-[#66789C]">
            Review all active and closed job listings posted across the portal
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-white p-2.5 border border-[#EAEFF7] shadow-xs">
          <FiBriefcase className="text-indigo-600 ml-1" />
          <span className="text-xs font-bold text-[#05264E] pr-1">
            Total Jobs: {totalItems}
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
          placeholder="Search by job title or location..."
        />

        <FilterDropdown
          label="Employment Type"
          value={typeFilter}
          onChange={(val) => {
            setTypeFilter(val);
            setCurrentPage(1);
          }}
          options={[
            { value: "ALL", label: "All Types" },
            { value: "FULL_TIME", label: "Full Time" },
            { value: "PART_TIME", label: "Part Time" },
            { value: "CONTRACT", label: "Contract" },
            { value: "INTERNSHIP", label: "Internship" },
          ]}
        />
      </div>

      {/* Main Job Table Content */}
      {isLoading ? (
        <SkeletonLoader rows={6} />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/50 p-12 text-center shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-3">
            <FiAlertTriangle className="text-2xl" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            Failed to Load Jobs
          </h3>
          <p className="mt-1 text-xs font-medium text-gray-600">
            {(error as any)?.data?.message ||
              "An error occurred while fetching job listings."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#254BD6] transition cursor-pointer"
          >
            <FiRefreshCw /> Retry Loading
          </button>
        </div>
      ) : jobsList.length === 0 ? (
        <EmptyState
          title="No Jobs Found"
          message="No job postings match your search query or selected filters."
        />
      ) : (
        <>
          <JobTable
            jobs={jobsList}
            onDeleteRequest={handleDeleteRequest}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemTitle={selectedJob?.title}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Jobs;
