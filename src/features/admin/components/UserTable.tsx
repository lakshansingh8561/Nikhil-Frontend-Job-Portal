import React from "react";
import { FiEye, FiSlash, FiCheckCircle } from "react-icons/fi";
import type { AdminUser } from "../types/admin.types";
import StatusBadge from "./StatusBadge";

interface UserTableProps {
  users: AdminUser[];
  onView: (user: AdminUser) => void;
  onToggleBlock: (user: AdminUser) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onView,
  onToggleBlock,
}) => {
  return (
    <div className="overflow-x-auto rounded-3xl border border-[#EAEFF7] bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#F0F4FC] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#66789C]">
            <th className="py-4 px-6">User</th>
            <th className="py-4 px-6">Email</th>
            <th className="py-4 px-6">Role</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6">Joined Date</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0F4FC] text-xs font-medium">
          {users.map((user) => {
            const fullName =
              user.firstName || user.lastName
                ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                : user.email.split("@")[0];

            const isBlocked = user.status === "BLOCKED";

            return (
              <tr key={user._id} className="hover:bg-[#F8FAFC] transition">
                {/* User Avatar + Name */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={fullName}
                        className="h-10 w-10 rounded-xl object-cover border border-[#EAEFF7]"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3C65F5] font-bold text-white text-sm shadow-xs shrink-0">
                        {fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-[#05264E]">{fullName}</p>
                      <p className="text-[11px] text-[#66789C] sm:hidden">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-6 font-semibold text-[#05264E]">
                  {user.email}
                </td>

                {/* Role Badge */}
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "RECRUITER"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-blue-100 text-[#3C65F5]"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="py-4 px-6">
                  <StatusBadge status={user.status} size="sm" />
                </td>

                {/* Created Date */}
                <td className="py-4 px-6 text-[#66789C]">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(user)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#EAEFF7] bg-white text-gray-600 hover:border-[#3C65F5] hover:text-[#3C65F5] transition cursor-pointer"
                      title="View Details"
                    >
                      <FiEye className="text-sm" />
                    </button>

                    <button
                      onClick={() => onToggleBlock(user)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                        isBlocked
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                      }`}
                      title={isBlocked ? "Unblock User" : "Block User"}
                    >
                      {isBlocked ? (
                        <>
                          <FiCheckCircle className="text-xs" /> Unblock
                        </>
                      ) : (
                        <>
                          <FiSlash className="text-xs" /> Block
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
