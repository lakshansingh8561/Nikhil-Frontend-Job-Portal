import React from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import NetworkShell from "../components/common/NetworkShell";
import { CARD_CLASS } from "../components/common/Card";
import { PostSkeleton } from "../components/common/Skeletons";
import PostCard from "../components/post/PostCard";
import PeopleYouMayKnowRail from "../components/rails/PeopleYouMayKnowRail";
import FooterRail from "../components/rails/FooterRail";
import { useFeedRealtime } from "../hooks/useFeedRealtime";
import { useNetworkPaths } from "../hooks/useNetworkPaths";
import { useGetMyNetworkProfileQuery, useGetPostByIdQuery } from "../api/networkApi";

/** Permalink page — one post with its thread expanded. */
const PostDetail: React.FC = () => {
  const { postId = "" } = useParams<{ postId: string }>();
  const paths = useNetworkPaths();

  const { data: profile } = useGetMyNetworkProfileQuery();
  const { data: post, isLoading, isError } = useGetPostByIdQuery(postId, { skip: !postId });

  useFeedRealtime();

  const me = {
    fullName: profile?.fullName,
    profilePicture: profile?.profilePicture,
    email: profile?.email,
  };

  return (
    <NetworkShell
      variant="wide"
      right={
        <>
          <PeopleYouMayKnowRail />
          <FooterRail />
        </>
      }
    >
      <Link
        to={paths.feed}
        className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:text-[#0a66c2]"
      >
        <FiArrowLeft /> Back to feed
      </Link>

      {isLoading ? (
        <PostSkeleton />
      ) : isError || !post ? (
        <div className={`${CARD_CLASS} px-6 py-12 text-center`}>
          <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">Post unavailable</h2>
          <p className="mt-1 text-sm text-[rgba(0,0,0,0.6)]">
            It may have been deleted, or you don't have access to it.
          </p>
          <Link
            to={paths.feed}
            className="mt-4 inline-block rounded-full bg-[#0a66c2] px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-[#004182]"
          >
            Go to feed
          </Link>
        </div>
      ) : (
        <PostCard post={post} me={me} defaultCommentsOpen />
      )}
    </NetworkShell>
  );
};

export default PostDetail;
