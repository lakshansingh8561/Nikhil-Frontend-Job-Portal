import React from "react";
import { Link } from "react-router-dom";
import { FiBookmark, FiUsers } from "react-icons/fi";
import Avatar from "../common/Avatar";
import { CARD_CLASS } from "../common/Card";
import { useNetworkPaths } from "../../hooks/useNetworkPaths";
import { formatCount } from "../../utils/format";
import type { NetworkStats, PublicProfileDTO } from "../../types";

interface ProfileRailCardProps {
  profile?: PublicProfileDTO;
  stats?: NetworkStats;
}

/** The left identity rail: cover strip, avatar, headline, network counters. */
export const ProfileRailCard: React.FC<ProfileRailCardProps> = ({ profile, stats }) => {
  const paths = useNetworkPaths();

  return (
    <div className={`${CARD_CLASS} overflow-hidden`}>
      <div
        className="h-14 bg-[#a0b4b7] bg-cover bg-center"
        style={
          profile?.coverPhoto
            ? { backgroundImage: `url(${profile.coverPhoto})` }
            : undefined
        }
      />

      <div className="-mt-8 flex flex-col items-center px-3 pb-3 text-center">
        <Avatar
          src={profile?.profilePicture}
          name={profile?.fullName}
          email={profile?.email}
          size="xl"
          ring
          to={profile?.userId ? paths.profile(profile.userId) : undefined}
        />
        <Link
          to={profile?.userId ? paths.profile(profile.userId) : "#"}
          className="mt-2 text-base font-semibold leading-tight text-[rgba(0,0,0,0.9)] hover:underline"
        >
          {profile?.fullName || "Your profile"}
        </Link>
        {profile?.headline && (
          <p className="mt-1 line-clamp-2 text-xs leading-snug text-[rgba(0,0,0,0.6)]">
            {profile.headline}
          </p>
        )}
      </div>

      <div className="border-t border-[rgba(0,0,0,0.08)] px-3 py-2.5">
        <Link
          to={paths.connections}
          className="-mx-1 flex items-center justify-between rounded px-1 py-1 transition hover:bg-[rgba(0,0,0,0.04)]"
        >
          <span className="text-xs font-semibold text-[rgba(0,0,0,0.6)]">Connections</span>
          <span className="text-xs font-bold text-[#3C65F5]">
            {formatCount(stats?.connectionsCount ?? profile?.connectionsCount ?? 0)}
          </span>
        </Link>
        <Link
          to={paths.connections}
          className="-mx-1 flex items-center justify-between rounded px-1 py-1 transition hover:bg-[rgba(0,0,0,0.04)]"
        >
          <span className="text-xs font-semibold text-[rgba(0,0,0,0.6)]">Followers</span>
          <span className="text-xs font-bold text-[#3C65F5]">
            {formatCount(stats?.followersCount ?? profile?.followersCount ?? 0)}
          </span>
        </Link>
      </div>

      <div className="border-t border-[rgba(0,0,0,0.08)]">
        <Link
          to={paths.saved}
          className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-[rgba(0,0,0,0.9)] transition hover:bg-[rgba(0,0,0,0.04)]"
        >
          <FiBookmark className="text-sm" />
          Saved items
        </Link>
        <Link
          to={paths.directory}
          className="flex items-center gap-2 border-t border-[rgba(0,0,0,0.08)] px-3 py-2.5 text-xs font-semibold text-[rgba(0,0,0,0.9)] transition hover:bg-[rgba(0,0,0,0.04)]"
        >
          <FiUsers className="text-sm" />
          Discover people
        </Link>
      </div>
    </div>
  );
};

export default ProfileRailCard;
