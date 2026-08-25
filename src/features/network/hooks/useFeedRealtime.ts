import { useEffect } from "react";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useSocket } from "../../chat/context/SocketContext";
import { networkApi } from "../api/networkApi";
import type { CommentDTO, PostDTO, SocialProof } from "../types";

type FeedTab = "for-you" | "following";
const TABS: FeedTab[] = ["for-you", "following"];

interface ReactionEvent {
  postId: string;
  reactionsCount: number;
  likesCount: number;
  socialProof: SocialProof;
}

interface CommentEvent {
  postId: string;
  comment: CommentDTO;
  commentsCount: number;
}

interface Options {
  /** Set on the feed page so incoming posts are buffered instead of injected. */
  onNewPost?: (post: PostDTO) => void;
}

/**
 * Bridges the app-wide chat socket into the RTK Query cache so reactions,
 * comments and deletions land without a refetch. Reactions and comments patch
 * in place; brand-new posts are handed to the caller so the feed can show
 * LinkedIn's "New posts" pill rather than shifting content under the reader.
 */
export const useFeedRealtime = ({ onNewPost }: Options = {}) => {
  const { socket } = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket) return;

    /** Applies a transform to a post across every cached feed tab. */
    const patchPostEverywhere = (postId: string, apply: (post: PostDTO) => void) => {
      TABS.forEach((tab) => {
        dispatch(
          networkApi.util.updateQueryData("getFeed", { tab }, (draft) => {
            const target = draft?.posts?.find((post) => post._id === postId);
            if (target) apply(target);
            // A repost embeds the original, so its counters live in two places.
            draft?.posts?.forEach((post) => {
              if (post.repostOfPost && post.repostOfPost._id === postId) {
                apply(post.repostOfPost);
              }
            });
          })
        );
      });

      dispatch(
        networkApi.util.updateQueryData("getPostById", postId, (draft) => {
          if (draft) apply(draft);
        })
      );
    };

    const handleReaction = (event: ReactionEvent) => {
      if (!event?.postId) return;
      patchPostEverywhere(event.postId, (post) => {
        post.reactionsCount = event.reactionsCount ?? post.reactionsCount;
        post.likesCount = event.likesCount ?? post.likesCount;
        if (event.socialProof) post.socialProof = event.socialProof;
      });
    };

    const handleComment = (event: CommentEvent) => {
      if (!event?.postId) return;

      patchPostEverywhere(event.postId, (post) => {
        if (typeof event.commentsCount === "number") {
          post.commentsCount = event.commentsCount;
        }
      });

      // Only top-level comments belong in the first page of the thread list.
      if (event.comment && !event.comment.parentCommentId) {
        (["relevant", "recent"] as const).forEach((sort) => {
          dispatch(
            networkApi.util.updateQueryData(
              "getPostComments",
              { postId: event.postId, page: 1, limit: 10, sort },
              (draft) => {
                if (!draft?.comments) return;
                if (draft.comments.some((comment) => comment._id === event.comment._id)) return;
                draft.comments.unshift(event.comment);
              }
            )
          );
        });
      }
    };

    const handleNewPost = (event: { post?: PostDTO }) => {
      if (event?.post && onNewPost) onNewPost(event.post);
    };

    const handleDeleted = (event: { postId?: string }) => {
      if (!event?.postId) return;
      TABS.forEach((tab) => {
        dispatch(
          networkApi.util.updateQueryData("getFeed", { tab }, (draft) => {
            if (!draft?.posts) return;
            draft.posts = draft.posts.filter((post) => post._id !== event.postId);
          })
        );
      });
    };

    const invalidateNetwork = () => {
      dispatch(networkApi.util.invalidateTags(["Network"]));
    };

    socket.on("post:reaction", handleReaction);
    socket.on("post:comment", handleComment);
    socket.on("feed:new-post", handleNewPost);
    socket.on("feed:post-deleted", handleDeleted);
    socket.on("network:invite", invalidateNetwork);
    socket.on("network:invite-accepted", invalidateNetwork);

    return () => {
      socket.off("post:reaction", handleReaction);
      socket.off("post:comment", handleComment);
      socket.off("feed:new-post", handleNewPost);
      socket.off("feed:post-deleted", handleDeleted);
      socket.off("network:invite", invalidateNetwork);
      socket.off("network:invite-accepted", invalidateNetwork);
    };
  }, [socket, dispatch, onNewPost]);
};
