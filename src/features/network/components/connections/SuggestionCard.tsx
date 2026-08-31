import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import ConnectionButton from "./ConnectionButton";
import { CARD_CLASS } from "../common/Card";
import { useNetworkPaths } from "../../hooks/useNetworkPaths";
import { mediaUrl } from "../../utils/format";
import type { AuthorDTO } from "../../types";

interface SuggestionCardProps {
  person: AuthorDTO;
}

/** The tall card LinkedIn uses in the "People you may know" grid. */
export const SuggestionCard: React.FC<SuggestionCardProps> = ({ person }) => {
  const paths = useNetworkPaths();
  const cover = mediaUrl(person.coverPhoto);

  return (
    <article className={`${CARD_CLASS} flex flex-col overflow-hidden`}>
      <Link to={paths.profile(person.userId)} className="block">
        <div
          className="h-16 bg-[#a0b4b7] bg-cover bg-center"
          style={cover ? { backgroundImage: `url(${cover})` } : undefined}
        />
      </Link>

      <div className="-mt-9 flex flex-1 flex-col items-center px-3 pb-3 text-center">
        <Avatar
          src={person.profilePicture}
          name={person.fullName}
          email={person.email}
          size="xl"
          ring
          to={paths.profile(person.userId)}
        />

        <Link
          to={paths.profile(person.userId)}
          className="mt-2 line-clamp-1 text-base font-semibold text-[rgba(0,0,0,0.9)] hover:text-[#3C65F5] hover:underline"
        >
          {person.fullName}
        </Link>
        <p className="mt-0.5 line-clamp-2 min-h-[2rem] text-xs leading-snug text-[rgba(0,0,0,0.6)]">
          {person.headline}
        </p>
        <p className="mt-1 h-4 text-[11px] text-[rgba(0,0,0,0.6)]">
          {(person.mutualConnectionsCount ?? 0) > 0
            ? `${person.mutualConnectionsCount} mutual connection${
                person.mutualConnectionsCount === 1 ? "" : "s"
              }`
            : ""}
        </p>

        <div className="mt-auto w-full pt-2.5">
          <ConnectionButton
            userId={person.userId}
            status={person.connectionStatus}
            size="md"
            fullWidth
          />
        </div>
      </div>
    </article>
  );
};

export default SuggestionCard;
