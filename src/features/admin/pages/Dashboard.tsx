import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import DashboardOverview from "../dashboard/DashboardOverview";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import BlockUserModal from "../components/BlockUserModal";
import {
  useBlockUserMutation,
  useUnblockUserMutation,
  useDeleteAdminJobMutation,
} from "../api/adminApi";
import type { AdminUser, AdminJob } from "../types/admin.types";

export const Dashboard: React.FC = () => {
  // Modal States
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState<boolean>(false);

  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Mutations
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();
  const [deleteJob, { isLoading: isDeletingJob }] = useDeleteAdminJobMutation();

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

  const handleDeleteJobRequest = (job: AdminJob) => {
    setSelectedJob(job);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteJob = async () => {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-10"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#05264E]">
          System Overview & Analytics
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-medium text-[#66789C]">
          Real-time metrics, user statistics, active job postings, and recent portal activity
        </p>
      </div>

      {/* Main Dashboard Content Overview */}
      <DashboardOverview
        onToggleBlockUser={handleToggleBlockRequest}
        onDeleteJobRequest={handleDeleteJobRequest}
      />

      {/* Modals */}
      <BlockUserModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={handleConfirmBlockToggle}
        userEmail={selectedUser?.email}
        isBlocking={selectedUser?.status !== "BLOCKED"}
        isLoading={isBlocking || isUnblocking}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteJob}
        itemTitle={selectedJob?.title}
        isLoading={isDeletingJob}
      />
    </motion.div>
  );
};

export default Dashboard;
