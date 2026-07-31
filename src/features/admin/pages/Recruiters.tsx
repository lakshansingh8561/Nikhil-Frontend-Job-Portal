import React, { useState } from "react";
import { FiUserCheck, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import RecruiterTable from "../components/RecruiterTable";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import SkeletonLoader from "../components/SkeletonLoader";
import BlockUserModal from "../components/BlockUserModal";
import {
  useGetAllUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
} from "../api/adminApi";
import type { AdminUser } from "../types/admin.types";

export const Recruiters: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Selected User Modal State
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState<boolean>(false);

  // RTK Query with server-side pagination for RECRUITER role
  const { data, isLoading, isError, error, refetch } = useGetAllUsersQuery({
    page: currentPage,
    limit: itemsPerPage,
    role: "RECRUITER",
    status: statusFilter,
    search: searchTerm,
  });

  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

  const recruitersList = data?.items || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 1;

  const handleToggleBlockRequest = (user: AdminUser) => {
    setSelectedUser(user);
    setIsBlockModalOpen(true);
  };

  const handleConfirmBlockToggle = async () => {
    if (!selectedUser) return;
    try {
      if (selectedUser.status === "BLOCKED") {
        await unblockUser(selectedUser._id).unwrap();
        toast.success(`Recruiter ${selectedUser.email} has been unblocked.`);
      } else {
        await blockUser(selectedUser._id).unwrap();
        toast.success(`Recruiter ${selectedUser.email} has been blocked.`);
      }
      setIsBlockModalOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update recruiter status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#05264E]">
            Recruiter Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-[#66789C]">
            Manage employer accounts, review company hiring managers, and audit recruiters
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-white p-2.5 border border-[#EAEFF7] shadow-xs">
          <FiUserCheck className="text-indigo-600 ml-1" />
          <span className="text-xs font-bold text-[#05264E] pr-1">
            Total Recruiters: {totalItems}
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-[#EAEFF7] bg-white p-4 shadow-xs">
        <SearchBar
          value={searchTerm}
          onChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          placeholder="Search by recruiter name or email..."
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
            { value: "ACTIVE", label: "Active" },
            { value: "BLOCKED", label: "Blocked" },
          ]}
        />
      </div>

      {/* Main Content */}
      {isLoading ? (
        <SkeletonLoader rows={6} />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50/50 p-12 text-center shadow-xs">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-3">
            <FiAlertTriangle className="text-2xl" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            Failed to Load Recruiters
          </h3>
          <p className="mt-1 text-xs font-medium text-gray-600">
            {(error as any)?.data?.message ||
              "An error occurred while fetching recruiters."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#254BD6] transition cursor-pointer"
          >
            <FiRefreshCw /> Retry Loading
          </button>
        </div>
      ) : recruitersList.length === 0 ? (
        <EmptyState
          title="No Recruiters Found"
          message="No recruiter accounts match your search query or selected filters."
        />
      ) : (
        <>
          <RecruiterTable
            recruiters={recruitersList}
            onToggleBlock={handleToggleBlockRequest}
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

      {/* Block Confirmation Modal */}
      <BlockUserModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={handleConfirmBlockToggle}
        userEmail={selectedUser?.email}
        isBlocking={selectedUser?.status !== "BLOCKED"}
        isLoading={isBlocking || isUnblocking}
      />
    </div>
  );
};

export default Recruiters;
