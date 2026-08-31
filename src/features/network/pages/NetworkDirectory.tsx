import React from "react";
import { FiSearch } from "react-icons/fi";
import NetworkShell from "../components/common/NetworkShell";
import { CARD_CLASS } from "../components/common/Card";
import { CardSkeleton } from "../components/common/Skeletons";
import SuggestionCard from "../components/connections/SuggestionCard";
import ProfileRailCard from "../components/rails/ProfileRailCard";
import NetworkStatsRail from "../components/rails/NetworkStatsRail";
import {
  useGetMyNetworkProfileQuery,
  useGetNetworkStatsQuery,
  useSearchDirectoryQuery,
} from "../api/networkApi";
import { formatCount } from "../utils/format";

const ROLE_FILTERS = [
  { key: "", label: "Everyone" },
  { key: "JOB_SEEKER", label: "Job seekers" },
  { key: "RECRUITER", label: "Recruiters" },
];

const NetworkDirectory: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [role, setRole] = React.useState("");
  const [limit, setLimit] = React.useState(12);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounced(search.trim());
      setLimit(12);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data: profile } = useGetMyNetworkProfileQuery();
  const { data: stats } = useGetNetworkStatsQuery();
  const { data, isLoading, isFetching } = useSearchDirectoryQuery({
    query: debounced,
    role,
    page: 1,
    limit,
  });

  const users = data?.users || [];
  const total = data?.pagination?.total ?? users.length;
  const hasMore = users.length < total;

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
      <header className={`${CARD_CLASS} px-4 py-3`}>
        <h1 className="text-xl font-semibold text-[rgba(0,0,0,0.9)]">Discover people</h1>
        <p className="text-sm text-[rgba(0,0,0,0.6)]">
          Search every member by name, headline, company or skill.
        </p>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative flex flex-1 items-center">
            <FiSearch className="absolute left-3 text-[rgba(0,0,0,0.6)]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search people"
              className="h-10 w-full rounded border border-[rgba(0,0,0,0.3)] pl-9 pr-3 text-sm outline-none transition focus:border-[#3C65F5]"
            />
          </label>

          <div className="flex items-center gap-1">
            {ROLE_FILTERS.map((filter) => (
              <button
                key={filter.key || "all"}
                type="button"
                onClick={() => {
                  setRole(filter.key);
                  setLimit(12);
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  role === filter.key
                    ? "bg-[#3C65F5] text-white"
                    : "border border-[rgba(0,0,0,0.3)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3, 4, 5].map((key) => (
            <CardSkeleton key={key} className="h-56" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className={`${CARD_CLASS} px-6 py-12 text-center`}>
          <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">No members found</h2>
          <p className="mt-1 text-sm text-[rgba(0,0,0,0.6)]">
            {debounced ? `Nothing matches “${debounced}”.` : "Try a different filter."}
          </p>
        </div>
      ) : (
        <>
          <p className="px-1 text-sm text-[rgba(0,0,0,0.6)]">
            {formatCount(total)} {total === 1 ? "member" : "members"}
          </p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {users.map((person) => (
              <SuggestionCard key={person.userId} person={person} />
            ))}
          </div>
          {hasMore && (
            <button
              type="button"
              onClick={() => setLimit((value) => value + 12)}
              disabled={isFetching}
              className="w-full rounded-lg border border-[rgba(0,0,0,0.15)] bg-white py-2.5 text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.04)] disabled:opacity-60 enabled:cursor-pointer"
            >
              {isFetching ? "Loading" : "Show more people"}
            </button>
          )}
        </>
      )}
    </NetworkShell>
  );
};

export default NetworkDirectory;
