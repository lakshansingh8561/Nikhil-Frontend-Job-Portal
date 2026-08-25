import React from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiUserCheck, FiUserPlus, FiUsers } from "react-icons/fi";
import { CARD_CLASS } from "../common/Card";
import { useNetworkPaths } from "../../hooks/useNetworkPaths";
import { formatCount } from "../../utils/format";
import type { NetworkStats } from "../../types";

interface NetworkStatsRailProps {
  stats?: NetworkStats;
}

/** Compact counters LinkedIn shows under the identity card. */
export const NetworkStatsRail: React.FC<NetworkStatsRailProps> = ({ stats }) => {
  const paths = useNetworkPaths();

  const rows = [
    {
      icon: <FiUsers />,
      label: "Connections",
      value: stats?.connectionsCount ?? 0,
      to: paths.connections,
    },
    {
      icon: <FiUserPlus />,
      label: "Invitations",
      value: stats?.pendingInvitesCount ?? 0,
      to: paths.connections,
      highlight: (stats?.pendingInvitesCount ?? 0) > 0,
    },
    {
      icon: <FiUserCheck />,
      label: "Followers",
      value: stats?.followersCount ?? 0,
      to: paths.connections,
    },
    {
      icon: <FiBookmark />,
      label: "Saved posts",
      value: undefined,
      to: paths.saved,
    },
  ];

  return (
    <nav className={`${CARD_CLASS} overflow-hidden`}>
      {rows.map((row, index) => (
        <Link
          key={row.label}
          to={row.to}
          className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-[rgba(0,0,0,0.9)] transition hover:bg-[rgba(0,0,0,0.04)] ${
            index > 0 ? "border-t border-[rgba(0,0,0,0.08)]" : ""
          }`}
        >
          <span className="text-sm text-[rgba(0,0,0,0.6)]">{row.icon}</span>
          <span className="flex-1 truncate">{row.label}</span>
          {row.value !== undefined && (
            <span
              className={`shrink-0 rounded-full px-1.5 text-[11px] font-bold ${
                row.highlight ? "bg-[#0a66c2] text-white" : "text-[#0a66c2]"
              }`}
            >
              {formatCount(row.value)}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default NetworkStatsRail;
