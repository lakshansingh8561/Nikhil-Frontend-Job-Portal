import React from "react";
import { Link } from "react-router-dom";
import { FiBookmark } from "react-icons/fi";
import NetworkShell from "../components/common/NetworkShell";
import { CARD_CLASS } from "../components/common/Card";
import { FeedSkeleton } from "../components/common/Skeletons";
import PostCard from "../components/post/PostCard";
import ProfileRailCard from "../components/rails/ProfileRailCard";
import NetworkStatsRail from "../components/rails/NetworkStatsRail";
import PeopleYouMayKnowRail from "../components/rails/PeopleYouMayKnowRail";
import { useNetworkPaths } from "../hooks/useNetworkPaths";
import {
  useGetMyNetworkProfileQuery,
  useGetNetworkStatsQuery,
  useGetSavedPostsQuery,
} from "../api/networkApi";

const SavedPosts: React.FC = () => {
  const paths = useNetworkPaths();
  const [page, setPage] = React.useState(1);

  const { data: profile } = useGetMyNetworkProfileQuery();
  const { data: stats } = useGetNetworkStatsQuery();
  const { data, isLoading, isFetching } = useGetSavedPostsQuery({ page, limit: 10 });

  const me = {
    fullName: profile?.fullName,
    profilePicture: profile?.profilePicture,
    email: profile?.email,
  };

  const posts = data?.posts || [];
  const pagination = data?.pagination;
  const hasMore = Boolean(pagination && pagination.page < pagination.totalPages);

  return (
    <NetworkShell
      left={
        <>
          <ProfileRailCard profile={profile} stats={stats} />
          <NetworkStatsRail stats={stats} />
        </>
      }
      right={<PeopleYouMayKnowRail />}
    >
      <header className={`${CARD_CLASS} px-4 py-3`}>
        <h1 className="flex items-center gap-2 text-lg font-semibold text-[rgba(0,0,0,0.9)]">
          <FiBookmark className="text-[#0a66c2]" /> Saved posts
        </h1>
        <p className="text-sm text-[rgba(0,0,0,0.6)]">
          Only you can see what you've saved.
        </p>
      </header>

      {isLoading ? (
        <FeedSkeleton count={2} />
      ) : posts.length === 0 ? (
        <div className={`${CARD_CLASS} px-6 py-12 text-center`}>
          <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">Nothing saved yet</h2>
          <p className="mt-1 text-sm text-[rgba(0,0,0,0.6)]">
            Use the Save action on any post to keep it here for later.
          </p>
          <Link
            to={paths.feed}
            className="mt-4 inline-block rounded-full bg-[#0a66c2] px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-[#004182]"
          >
            Browse the feed
          </Link>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} me={me} />
          ))}
          {hasMore && (
            <button
              type="button"
              onClick={() => setPage((value) => value + 1)}
              disabled={isFetching}
              className="w-full rounded-lg border border-[rgba(0,0,0,0.15)] bg-white py-2.5 text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.04)] disabled:opacity-60 enabled:cursor-pointer"
            >
              {isFetching ? "Loading" : "Show more"}
            </button>
          )}
        </>
      )}
    </NetworkShell>
  );
};

export default SavedPosts;
