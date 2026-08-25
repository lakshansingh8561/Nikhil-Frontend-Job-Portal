import React from "react";
import { Link } from "react-router-dom";
import { CARD_CLASS } from "../common/Card";
import PostCard from "../post/PostCard";
import { PostSkeleton } from "../common/Skeletons";
import { useNetworkPaths } from "../../hooks/useNetworkPaths";
import { formatCount } from "../../utils/format";
import { useGetUserPostsQuery } from "../../api/networkApi";
import type { PublicProfileDTO } from "../../types";

interface ActivityProps {
  profile: PublicProfileDTO;
  me?: { fullName?: string; profilePicture?: string; email?: string };
}

/** The member's posts, paginated the way LinkedIn's activity section is. */
export const Activity: React.FC<ActivityProps> = ({ profile, me }) => {
  const paths = useNetworkPaths();
  // `getUserPosts` has no page-merge config, so a growing limit is used instead
  // of a page cursor — that keeps earlier posts on screen when "show more" runs.
  const [limit, setLimit] = React.useState(5);

  const { data, isLoading, isFetching } = useGetUserPostsQuery(
    { userId: profile.userId, page: 1, limit },
    { skip: !profile.userId }
  );

  const posts = data?.posts || [];
  const pagination = data?.pagination;
  const hasMore = Boolean(pagination && posts.length < pagination.total);

  return (
    <section className="space-y-2">
      <div className={`${CARD_CLASS} px-4 py-3`}>
        <h2 className="text-xl font-semibold text-[rgba(0,0,0,0.9)]">Activity</h2>
        <p className="text-sm text-[rgba(0,0,0,0.6)]">
          {formatCount(pagination?.total ?? profile.postsCount ?? 0)} posts ·{" "}
          {formatCount(profile.followersCount)} followers
        </p>

        {!isLoading && posts.length === 0 && (
          <p className="mt-2 text-sm text-[rgba(0,0,0,0.6)]">
            {profile.isSelf ? (
              <>
                You haven't posted yet.{" "}
                <Link to={paths.feed} className="font-semibold text-[#0a66c2] hover:underline">
                  Share your first post
                </Link>
              </>
            ) : (
              `${profile.firstName || profile.fullName} hasn't posted yet.`
            )}
          </p>
        )}
      </div>

      {isLoading ? (
        <PostSkeleton />
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} me={me} />
          ))}
          {hasMore && (
            <button
              type="button"
              onClick={() => setLimit((value) => value + 5)}
              disabled={isFetching}
              className="w-full rounded-lg border border-[rgba(0,0,0,0.15)] bg-white py-2.5 text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.04)] disabled:opacity-60 enabled:cursor-pointer"
            >
              {isFetching ? "Loading" : "Show more activity"}
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default Activity;
