import React from "react";
import { FiArrowUp, FiRefreshCw } from "react-icons/fi";
import NetworkShell from "../components/common/NetworkShell";
import { CARD_CLASS } from "../components/common/Card";
import { FeedSkeleton } from "../components/common/Skeletons";
import ComposerTrigger from "../components/composer/ComposerTrigger";
import ComposerModal from "../components/composer/ComposerModal";
import PostCard from "../components/post/PostCard";
import ProfileRailCard from "../components/rails/ProfileRailCard";
import NetworkStatsRail from "../components/rails/NetworkStatsRail";
import PeopleYouMayKnowRail from "../components/rails/PeopleYouMayKnowRail";
import FooterRail from "../components/rails/FooterRail";
import { useFeedRealtime } from "../hooks/useFeedRealtime";
import {
  useGetFeedQuery,
  useGetMyNetworkProfileQuery,
  useGetNetworkStatsQuery,
} from "../api/networkApi";
import type { PostDTO } from "../types";

type FeedTab = "for-you" | "following";

const TABS: Array<{ key: FeedTab; label: string }> = [
  { key: "for-you", label: "For you" },
  { key: "following", label: "Following" },
];

const CommunityFeed: React.FC = () => {
  const [tab, setTab] = React.useState<FeedTab>("for-you");
  const [page, setPage] = React.useState(1);
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [composerPreset, setComposerPreset] = React.useState<"media" | "document" | null>(null);
  const [incoming, setIncoming] = React.useState<PostDTO[]>([]);

  const { data: profile } = useGetMyNetworkProfileQuery();
  const { data: stats } = useGetNetworkStatsQuery();
  const { data, isLoading, isFetching, refetch } = useGetFeedQuery({ page, limit: 10, tab });

  // Buffer socket-delivered posts behind a pill instead of shifting the
  // reader's scroll position, the way LinkedIn does.
  const bufferPost = React.useCallback((post: PostDTO) => {
    setIncoming((current) =>
      current.some((item) => item._id === post._id) ? current : [post, ...current]
    );
  }, []);
  useFeedRealtime({ onNewPost: bufferPost });

  const switchTab = (next: FeedTab) => {
    if (next === tab) return;
    setTab(next);
    setPage(1);
    setIncoming([]);
  };

  const showIncoming = () => {
    setIncoming([]);
    setPage(1);
    refetch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const me = {
    fullName: profile?.fullName,
    profilePicture: profile?.profilePicture,
    email: profile?.email,
    headline: profile?.headline,
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
      right={
        <>
          <PeopleYouMayKnowRail />
          <FooterRail />
        </>
      }
    >
      <ComposerTrigger
        me={me}
        onOpen={(preset) => {
          setComposerPreset(preset ?? null);
          setComposerOpen(true);
        }}
      />

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-[rgba(0,0,0,0.15)]" />
        <div className="flex items-center gap-1">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => switchTab(item.key)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                tab === item.key
                  ? "bg-[#0a66c2] text-white"
                  : "text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {incoming.length > 0 && (
        <div className="sticky top-2 z-20 flex justify-center">
          <button
            type="button"
            onClick={showIncoming}
            className="flex items-center gap-1.5 rounded-full bg-[#0a66c2] px-4 py-1.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#004182] cursor-pointer"
          >
            <FiArrowUp />
            {incoming.length} new {incoming.length === 1 ? "post" : "posts"}
          </button>
        </div>
      )}

      {isLoading ? (
        <FeedSkeleton />
      ) : posts.length === 0 ? (
        <div className={`${CARD_CLASS} px-6 py-12 text-center`}>
          <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">
            {tab === "following" ? "Nothing from your network yet" : "Your feed is empty"}
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-[rgba(0,0,0,0.6)]">
            {tab === "following"
              ? "Connect with people or follow them to see their posts here."
              : "Be the first to share something with the community."}
          </p>
          <button
            type="button"
            onClick={() => {
              setComposerPreset(null);
              setComposerOpen(true);
            }}
            className="mt-4 rounded-full bg-[#0a66c2] px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-[#004182] cursor-pointer"
          >
            Start a post
          </button>
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
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[rgba(0,0,0,0.15)] bg-white py-2.5 text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.04)] disabled:opacity-60 enabled:cursor-pointer"
            >
              {isFetching ? <FiRefreshCw className="animate-spin" /> : null}
              {isFetching ? "Loading" : "Show more posts"}
            </button>
          )}
        </>
      )}

      <ComposerModal
        open={composerOpen}
        preset={composerPreset}
        me={me}
        onClose={() => {
          setComposerOpen(false);
          setComposerPreset(null);
        }}
        onPosted={() => {
          setPage(1);
          setIncoming([]);
        }}
      />
    </NetworkShell>
  );
};

export default CommunityFeed;
