import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import { CARD_CLASS } from "../common/Card";
import ConnectionButton from "../connections/ConnectionButton";
import { RailSkeleton } from "../common/Skeletons";
import { useGetSuggestionsQuery } from "../../api/networkApi";
import { useNetworkPaths } from "../../hooks/useNetworkPaths";

/** "People you may know" — the right rail's suggestion list. */
export const PeopleYouMayKnowRail: React.FC = () => {
  const paths = useNetworkPaths();
  const { data, isLoading } = useGetSuggestionsQuery({ limit: 15 });

  if (isLoading) return <RailSkeleton />;

  const people = data?.suggestions || [];
  if (people.length === 0) return null;

  return (
    <section className={CARD_CLASS}>
      <header className="border-b border-[rgba(0,0,0,0.08)] px-4 py-3">
        <h2 className="text-base font-semibold text-[rgba(0,0,0,0.9)]">People you may know</h2>
        <p className="text-xs text-[rgba(0,0,0,0.6)]">From your industry and network</p>
      </header>

      <ul className="max-h-[240px] divide-y divide-[rgba(0,0,0,0.08)] overflow-y-auto overscroll-contain pr-1 custom-rail-scrollbar">
        {people.map((person) => (
          <li key={person.userId} className="flex items-start gap-2 px-4 py-3">
            <Avatar
              src={person.profilePicture}
              name={person.fullName}
              email={person.email}
              size="lg"
              to={paths.profile(person.userId)}
            />
            <div className="min-w-0 flex-1">
              <Link
                to={paths.profile(person.userId)}
                className="block truncate text-sm font-semibold leading-tight text-[rgba(0,0,0,0.9)] hover:text-[#3C65F5] hover:underline"
              >
                {person.fullName}
              </Link>
              <p className="line-clamp-2 text-xs leading-snug text-[rgba(0,0,0,0.6)]">
                {person.headline}
              </p>
              {(person.mutualConnectionsCount ?? 0) > 0 && (
                <p className="mt-0.5 text-[11px] text-[rgba(0,0,0,0.6)]">
                  {person.mutualConnectionsCount} mutual
                </p>
              )}
              <div className="mt-1.5">
                <ConnectionButton
                  userId={person.userId}
                  status={person.connectionStatus}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Link
        to={paths.directory}
        className="sticky bottom-0 z-10 block border-t border-[rgba(0,0,0,0.08)] bg-white px-4 py-2.5 text-center text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.04)] hover:text-[rgba(0,0,0,0.9)] shadow-sm"
      >
        View all
      </Link>
    </section>
  );
};

export default PeopleYouMayKnowRail;
