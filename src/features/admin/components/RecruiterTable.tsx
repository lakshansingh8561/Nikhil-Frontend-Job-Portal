import React from "react";
import { useNavigate } from "react-router-dom";
import { FiBriefcase, FiGrid, FiSlash, FiCheckCircle } from "react-icons/fi";
import type { AdminUser } from "../types/admin.types";
import StatusBadge from "./StatusBadge";

interface RecruiterTableProps {
  recruiters: AdminUser[];
  onToggleBlock: (user: AdminUser) => void;
}

export const RecruiterTable: React.FC<RecruiterTableProps> = ({
  recruiters,
  onToggleBlock,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-3xl border border-[#EAEFF7] bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#F0F4FC] bg-[#F8FAFC] text-[11px] font-bold uppercase tracking-wider text-[#66789C]">
            <th className="py-4 px-6">Recruiter Name</th>
            <th className="py-4 px-6">Email</th>
            <th className="py-4 px-6">Membership Plan</th>
            <th className="py-4 px-6">Account Status</th>
            <th className="py-4 px-6">Registered Date</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0F4FC] text-xs font-medium">
          {recruiters.map((rec) => {
            const fullName =
              rec.firstName || rec.lastName
                ? `${rec.firstName || ""} ${rec.lastName || ""}`.trim()
                : rec.email.split("@")[0];

            const isBlocked = rec.status === "BLOCKED";
            const mem = rec.membership;
            const isSubActive = mem && mem.status === "ACTIVE";

            return (
              <tr key={rec._id} className="hover:bg-[#F8FAFC] transition">
                {/* Recruiter Name */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white text-sm shadow-xs shrink-0">
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#05264E]">{fullName}</p>
                      <p className="text-[11px] text-[#66789C]">Employer</p>
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-6 font-semibold text-[#05264E]">
                  {rec.email}
                </td>

                {/* Membership Status & Active Days */}
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`inline-flex items-center gap-1 w-fit rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${isSubActive
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {mem?.planName || "Free Tier"} {isSubActive ? "✓" : ""}
                    </span>
                    {isSubActive ? (
                      <span className="text-[11px] font-bold text-[#3C65F5]">
                        {mem?.remainingDays} Days Active Remaining
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">Free Tier</span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  <StatusBadge status={rec.status} size="sm" />
                </td>

                {/* Date */}
                <td className="py-4 px-6 text-[#66789C]">
                  {new Date(rec.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate("/admin/jobs")}
                      className="flex items-center gap-1 rounded-xl border border-[#EAEFF7] bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:border-[#3C65F5] hover:text-[#3C65F5] transition cursor-pointer"
                      title="View Jobs"
                    >
                      <FiBriefcase className="text-xs text-[#3C65F5]" /> Jobs
                    </button>

                    <button
                      onClick={() => navigate("/recruiters")}
                      className="flex items-center gap-1 rounded-xl border border-[#EAEFF7] bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:border-[#3C65F5] hover:text-[#3C65F5] transition cursor-pointer"
                      title="View Recruiter Directory"
                    >
                      <FiGrid className="text-xs text-[#3C65F5]" /> Profile
                    </button>

                    <button
                      onClick={() => onToggleBlock(rec)}
                      className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${isBlocked
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        }`}
                      title={isBlocked ? "Unblock Recruiter" : "Block Recruiter"}
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

export default RecruiterTable;
