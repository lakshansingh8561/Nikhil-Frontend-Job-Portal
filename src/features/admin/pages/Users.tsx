import React, { useState } from "react";
import { FiUsers, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import UserTable from "../components/UserTable";
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

export const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Selected User Modal State
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState<boolean>(false);

  // RTK Query with server-side pagination and filters
  const { data, isLoading, isError, error, refetch } = useGetAllUsersQuery({
    page: currentPage,
    limit: itemsPerPage,
    role: roleFilter,
    status: statusFilter,
    search: searchTerm,
  });

  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

  const usersList = data?.items || [];
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
        toast.success(`User ${selectedUser.email} has been unblocked.`);
      } else {
        await blockUser(selectedUser._id).unwrap();
        toast.success(`User ${selectedUser.email} has been blocked.`);
      }
      setIsBlockModalOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update user status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#05264E]">
            User Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-[#66789C]">
            Monitor all registered system accounts, manage roles, and enforce security blocks
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-white p-2.5 border border-[#EAEFF7] shadow-xs">
          <FiUsers className="text-[#3C65F5] ml-1" />
          <span className="text-xs font-bold text-[#05264E] pr-1">
            Total Users: {totalItems}
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
          placeholder="Search by name or email..."
        />

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <FilterDropdown
            label="Role"
            value={roleFilter}
            onChange={(val) => {
              setRoleFilter(val);
              setCurrentPage(1);
            }}
            options={[
              { value: "ALL", label: "All Roles" },
              { value: "JOB_SEEKER", label: "Job Seekers" },
              { value: "RECRUITER", label: "Recruiters" },
              { value: "ADMIN", label: "Admins" },
            ]}
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
            Failed to Load Users
          </h3>
          <p className="mt-1 text-xs font-medium text-gray-600">
            {(error as any)?.data?.message ||
              "An error occurred while fetching users from the server."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#254BD6] transition cursor-pointer"
          >
            <FiRefreshCw /> Retry Loading
          </button>
        </div>
      ) : usersList.length === 0 ? (
        <EmptyState
          title="No Users Found"
          message="No user accounts match your search query or selected filters."
        />
      ) : (
        <>
          <UserTable
            users={usersList}
            onView={() => {}}
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

      {/* Block/Unblock Confirmation Modal */}
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

export default Users;
