import React from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FiMessageSquare, FiSearch, FiUserMinus, FiUsers } from "react-icons/fi";
import NetworkShell from "../components/common/NetworkShell";
import { CARD_CLASS } from "../components/common/Card";
import Avatar from "../components/common/Avatar";
import { CardSkeleton, PersonRowSkeleton } from "../components/common/Skeletons";
import InvitationCard from "../components/connections/InvitationCard";
import SuggestionCard from "../components/connections/SuggestionCard";
import NetworkStatsRail from "../components/rails/NetworkStatsRail";
import ProfileRailCard from "../components/rails/ProfileRailCard";
import useDismissable from "../hooks/useDismissable";
import { useNetworkPaths } from "../hooks/useNetworkPaths";
import { formatCount } from "../utils/format";
import {
  useGetConnectionsQuery,
  useGetMyNetworkProfileQuery,
  useGetNetworkStatsQuery,
  useGetReceivedInvitesQuery,
  useGetSentInvitesQuery,
  useGetSuggestionsQuery,
  useRemoveConnectionMutation,
} from "../api/networkApi";
import type { AuthorDTO, InvitationDTO } from "../types";

const MyNetwork: React.FC = () => {
  const paths = useNetworkPaths();
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [showSent, setShowSent] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data: profile } = useGetMyNetworkProfileQuery();
  const { data: stats } = useGetNetworkStatsQuery();
  const { data: received, isLoading: loadingReceived } = useGetReceivedInvitesQuery({ limit: 20 });
  const { data: sent, isLoading: loadingSent } = useGetSentInvitesQuery(
    { limit: 20 },
    { skip: !showSent }
  );
  const { data: suggestions, isLoading: loadingSuggestions } = useGetSuggestionsQuery({ limit: 8 });
  const { data: connections, isLoading: loadingConnections } = useGetConnectionsQuery({
    query: debounced,
    limit: 24,
  });

  const receivedList: InvitationDTO[] = received?.invitations || [];
  const sentList: InvitationDTO[] = sent?.invitations || [];
  const suggestionList: AuthorDTO[] = suggestions?.suggestions || [];
  const connectionList: AuthorDTO[] = connections?.connections || [];

  return (
    <NetworkShell
      variant="wide"
      right={
        <>
          <ProfileRailCard profile={profile} stats={stats} />
          <NetworkStatsRail stats={stats} />
        </>
      }
    >
      {/* Invitations */}
      <section className={CARD_CLASS}>
        <header className="flex items-center justify-between gap-2 px-4 py-3">
          <h2 className="text-base font-semibold text-[rgba(0,0,0,0.9)]">
            Invitations
            {receivedList.length > 0 && (
              <span className="ml-1.5 rounded-full bg-[#0a66c2] px-2 py-0.5 text-xs font-bold text-white">
                {receivedList.length}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={() => setShowSent((value) => !value)}
            className="text-sm font-semibold text-[#0a66c2] hover:underline cursor-pointer"
          >
            {showSent ? "Hide sent" : `Sent (${formatCount(stats?.sentInvitesCount ?? 0)})`}
          </button>
        </header>

        {loadingReceived ? (
          <div className="border-t border-[rgba(0,0,0,0.08)] px-4 py-2">
            <PersonRowSkeleton />
          </div>
        ) : receivedList.length === 0 ? (
          <p className="border-t border-[rgba(0,0,0,0.08)] px-4 py-6 text-center text-sm text-[rgba(0,0,0,0.6)]">
            No pending invitations.
          </p>
        ) : (
          <ul className="divide-y divide-[rgba(0,0,0,0.08)] border-t border-[rgba(0,0,0,0.08)]">
            {receivedList.map((invitation) => (
              <InvitationCard
                key={invitation.connectionId}
                invitation={invitation}
                direction="received"
              />
            ))}
          </ul>
        )}

        {showSent && (
          <div className="border-t border-[rgba(0,0,0,0.08)] bg-[#f8f8f6]">
            <p className="px-4 pt-2 text-xs font-semibold uppercase tracking-wide text-[rgba(0,0,0,0.6)]">
              Sent invitations
            </p>
            {loadingSent ? (
              <div className="px-4 py-2">
                <PersonRowSkeleton />
              </div>
            ) : sentList.length === 0 ? (
              <p className="px-4 py-5 text-center text-sm text-[rgba(0,0,0,0.6)]">
                You haven't sent any invitations.
              </p>
            ) : (
              <ul className="divide-y divide-[rgba(0,0,0,0.08)]">
                {sentList.map((invitation) => (
                  <InvitationCard
                    key={invitation.connectionId}
                    invitation={invitation}
                    direction="sent"
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Suggestions */}
      <section className={CARD_CLASS}>
        <header className="px-4 py-3">
          <h2 className="text-base font-semibold text-[rgba(0,0,0,0.9)]">People you may know</h2>
          <p className="text-sm text-[rgba(0,0,0,0.6)]">Based on your industry and connections</p>
        </header>

        <div className="border-t border-[rgba(0,0,0,0.08)] p-4">
          {loadingSuggestions ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[0, 1, 2, 3].map((key) => (
                <CardSkeleton key={key} className="h-56" />
              ))}
            </div>
          ) : suggestionList.length === 0 ? (
            <p className="py-4 text-center text-sm text-[rgba(0,0,0,0.6)]">
              No suggestions right now.{" "}
              <Link to={paths.directory} className="font-semibold text-[#0a66c2] hover:underline">
                Browse the directory
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {suggestionList.map((person) => (
                <SuggestionCard key={person.userId} person={person} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Connections */}
      <section className={CARD_CLASS}>
        <header className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-[rgba(0,0,0,0.9)]">
            <FiUsers className="text-[#0a66c2]" />
            {formatCount(connections?.pagination?.total ?? connectionList.length)} connections
          </h2>
          <label className="relative flex items-center">
            <FiSearch className="absolute left-2.5 text-[rgba(0,0,0,0.6)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name"
              className="h-9 w-56 rounded border border-[rgba(0,0,0,0.3)] pl-8 pr-3 text-sm outline-none focus:border-[#0a66c2]"
            />
          </label>
        </header>

        {loadingConnections ? (
          <div className="border-t border-[rgba(0,0,0,0.08)] px-4 py-2">
            <PersonRowSkeleton />
            <PersonRowSkeleton />
          </div>
        ) : connectionList.length === 0 ? (
          <p className="border-t border-[rgba(0,0,0,0.08)] px-4 py-8 text-center text-sm text-[rgba(0,0,0,0.6)]">
            {debounced ? `No connections match “${debounced}”.` : "You have no connections yet."}
          </p>
        ) : (
          <ul className="divide-y divide-[rgba(0,0,0,0.08)] border-t border-[rgba(0,0,0,0.08)]">
            {connectionList.map((person) => (
              <ConnectionRow key={person.userId} person={person} />
            ))}
          </ul>
        )}
      </section>
    </NetworkShell>
  );
};

const ConnectionRow: React.FC<{ person: AuthorDTO }> = ({ person }) => {
  const paths = useNetworkPaths();
  const [removeConnection, { isLoading }] = useRemoveConnectionMutation();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [removed, setRemoved] = React.useState(false);
  const confirmRef = useDismissable<HTMLDivElement>(confirmOpen, () => setConfirmOpen(false));

  const remove = async () => {
    try {
      await removeConnection(person.userId).unwrap();
      setRemoved(true);
      toast.success(`Removed ${person.fullName} from your connections`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not remove the connection.");
    }
  };

  if (removed) return null;

  return (
    <li className="flex items-center gap-3 px-4 py-3">
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
          className="block truncate text-sm font-semibold text-[rgba(0,0,0,0.9)] hover:text-[#0a66c2] hover:underline"
        >
          {person.fullName}
        </Link>
        <p className="truncate text-xs text-[rgba(0,0,0,0.6)]">{person.headline}</p>
      </div>

      <Link
        to={paths.messages}
        className="hidden items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.6)] px-3 py-1 text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] sm:inline-flex"
      >
        <FiMessageSquare /> Message
      </Link>

      <div className="relative" ref={confirmRef}>
        <button
          type="button"
          onClick={() => setConfirmOpen((value) => !value)}
          aria-label={`Remove ${person.fullName}`}
          className="grid h-8 w-8 place-items-center rounded-full text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
        >
          <FiUserMinus />
        </button>
        {confirmOpen && (
          <div className="absolute right-0 top-full z-30 mt-1 w-52 rounded-lg border border-[rgba(0,0,0,0.15)] bg-white p-3 shadow-xl">
            <p className="text-xs text-[rgba(0,0,0,0.75)]">
              Remove {person.firstName || person.fullName} from your connections?
            </p>
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-full px-2 py-1 text-xs font-semibold text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={remove}
                disabled={isLoading}
                className="rounded-full bg-[#b24020] px-3 py-1 text-xs font-semibold text-white transition hover:bg-[#8f3319] disabled:opacity-60 enabled:cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default MyNetwork;
