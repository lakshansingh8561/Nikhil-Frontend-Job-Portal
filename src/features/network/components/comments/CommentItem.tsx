import React from "react";
import toast from "react-hot-toast";
import { FiMoreHorizontal } from "react-icons/fi";
import { Link } from "react-router-dom";
import Avatar from "../common/Avatar";
import CommentComposer from "./CommentComposer";
import { ReactionBadges, ReactionPicker } from "../post/ReactionPicker";
import useDismissable from "../../hooks/useDismissable";
import { useNetworkPaths } from "../../hooks/useNetworkPaths";
import { formatCount, timeAgo } from "../../utils/format";
import { linkify } from "../../utils/linkify";
import { reactionMeta, safeSocialProof } from "../../utils/reactions";
import {
  useDeleteCommentMutation,
  useGetCommentRepliesQuery,
  useReactToCommentMutation,
  useUpdateCommentMutation,
} from "../../api/networkApi";
import type { CommentDTO, ReactionType } from "../../types";

interface CommentItemProps {
  comment: CommentDTO;
  postId: string;
  me?: { fullName?: string; profilePicture?: string; email?: string };
  /** Replies are one level deep, matching LinkedIn. */
  isReply?: boolean;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  me,
  isReply = false,
}) => {
  const paths = useNetworkPaths();

  const [reaction, setReaction] = React.useState<ReactionType | null>(comment.myReaction);
  const [proof, setProof] = React.useState(() =>
    safeSocialProof(comment.socialProof, comment.reactionsCount)
  );
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [replying, setReplying] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(comment.content);
  const [showReplies, setShowReplies] = React.useState(false);
  const [repliesPage, setRepliesPage] = React.useState(1);
  const [localReplyBump, setLocalReplyBump] = React.useState(0);

  const hoverTimer = React.useRef<number | null>(null);
  const menuRef = useDismissable<HTMLDivElement>(menuOpen, () => setMenuOpen(false));

  const [reactToComment] = useReactToCommentMutation();
  const [updateComment, { isLoading: isSaving }] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  React.useEffect(() => {
    setReaction(comment.myReaction);
    setProof(safeSocialProof(comment.socialProof, comment.reactionsCount));
  }, [comment.myReaction, comment.socialProof, comment.reactionsCount]);

  const totalReplies = (comment.repliesCount || 0) + localReplyBump;
  const shouldFetchReplies = showReplies && !isReply;

  const { data: replyData, isFetching: loadingReplies } = useGetCommentRepliesQuery(
    { commentId: comment._id, page: repliesPage, limit: 10 },
    { skip: !shouldFetchReplies }
  );

  const replies: CommentDTO[] = React.useMemo(() => {
    const fetched = replyData?.replies || [];
    if (fetched.length > 0) return fetched;
    return comment.replies || [];
  }, [replyData?.replies, comment.replies]);

  const applyReaction = async (type: ReactionType) => {
    const previous = reaction;
    const next = previous === type ? null : type;

    // Optimistic: LinkedIn's like feels instant, so patch first and reconcile.
    setReaction(next);
    setProof((current) => {
      const delta = (next ? 1 : 0) - (previous ? 1 : 0);
      const total = Math.max(0, current.total + delta);
      const types = next
        ? Array.from(new Set([next, ...current.topTypes])).slice(0, 3)
        : current.topTypes;
      return { ...current, total, topTypes: total > 0 ? types : [] };
    });

    try {
      const result = await reactToComment({ commentId: comment._id, type }).unwrap();
      if (result?.socialProof) {
        setProof(safeSocialProof(result.socialProof, result.reactionsCount));
      }
      if (result && "myReaction" in result) setReaction(result.myReaction ?? null);
    } catch {
      setReaction(previous);
      setProof(safeSocialProof(comment.socialProof, comment.reactionsCount));
      toast.error("Could not save your reaction.");
    }
  };

  const openPickerSoon = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setPickerOpen(true), 420);
  };
  const cancelPicker = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    window.setTimeout(() => setPickerOpen(false), 180);
  };

  const saveEdit = async () => {
    const content = editText.trim();
    if (!content) return;
    try {
      await updateComment({ commentId: comment._id, content }).unwrap();
      comment.content = content;
      setEditing(false);
      toast.success("Comment updated");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update the comment.");
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment({ commentId: comment._id, postId }).unwrap();
      toast.success("Comment deleted");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not delete the comment.");
    }
  };

  const activeMeta = reactionMeta(reaction);
  const author = comment.author || ({} as CommentDTO["author"]);

  return (
    <div className={isReply ? "pl-8 sm:pl-10" : ""}>
      <div className="flex gap-2">
        <Avatar
          src={author.profilePicture}
          name={author.fullName}
          email={author.email}
          size={isReply ? "sm" : "md"}
          to={author.userId ? paths.profile(author.userId) : undefined}
        />

        <div className="min-w-0 flex-1">
          <div className="relative rounded-lg bg-[#f4f2ee] px-3 py-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  to={author.userId ? paths.profile(author.userId) : "#"}
                  className="block truncate text-sm font-semibold text-[rgba(0,0,0,0.9)] hover:text-[#0a66c2] hover:underline"
                >
                  {author.fullName || "Member"}
                </Link>
                {author.headline && (
                  <p className="truncate text-xs text-[rgba(0,0,0,0.6)]">{author.headline}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <span className="text-xs text-[rgba(0,0,0,0.6)]">
                  {timeAgo(comment.createdAt)}
                  {comment.editedAt ? " · Edited" : ""}
                </span>
                {comment.isMine && (
                  <div className="relative" ref={menuRef}>
                    <button
                      type="button"
                      onClick={() => setMenuOpen((value) => !value)}
                      aria-label="Comment options"
                      className="grid h-6 w-6 place-items-center rounded-full text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
                    >
                      <FiMoreHorizontal />
                    </button>
                    {menuOpen && (
                      <div className="absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-[rgba(0,0,0,0.15)] bg-white py-1 shadow-xl">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(true);
                            setMenuOpen(false);
                          }}
                          className="block w-full px-3 py-2 text-left text-sm font-medium text-[rgba(0,0,0,0.9)] transition hover:bg-[rgba(0,0,0,0.04)] cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            remove();
                          }}
                          className="block w-full px-3 py-2 text-left text-sm font-medium text-[#b24020] transition hover:bg-[rgba(0,0,0,0.04)] cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {editing ? (
              <div className="mt-2">
                <textarea
                  value={editText}
                  onChange={(event) => setEditText(event.target.value.slice(0, 1500))}
                  rows={3}
                  className="w-full resize-none rounded border border-[rgba(0,0,0,0.3)] bg-white px-2 py-1.5 text-sm outline-none focus:border-[#0a66c2]"
                />
                <div className="mt-1.5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditText(comment.content);
                      setEditing(false);
                    }}
                    className="rounded-full px-3 py-1 text-xs font-semibold text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEdit}
                    disabled={isSaving}
                    className="rounded-full bg-[#0a66c2] px-3 py-1 text-xs font-semibold text-white hover:bg-[#004182] disabled:opacity-60 enabled:cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-snug text-[rgba(0,0,0,0.9)]">
                {linkify(comment.content, { hashtagBasePath: paths.feed })}
              </p>
            )}

            {proof.total > 0 && (
              <span className="absolute -bottom-2.5 right-2 inline-flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
                <ReactionBadges types={proof.topTypes} size="xs" />
                <span className="text-[11px] text-[rgba(0,0,0,0.6)]">
                  {formatCount(proof.total)}
                </span>
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-1 pl-1">
            <div
              className="relative"
              onMouseEnter={openPickerSoon}
              onMouseLeave={cancelPicker}
            >
              <ReactionPicker
                open={pickerOpen}
                onPick={applyReaction}
                onRequestClose={() => setPickerOpen(false)}
                onHoverChange={(hovering) => {
                  if (hovering && hoverTimer.current) window.clearTimeout(hoverTimer.current);
                  if (!hovering) cancelPicker();
                }}
              />
              <button
                type="button"
                onClick={() => applyReaction(reaction || "LIKE")}
                style={activeMeta ? { color: activeMeta.color } : undefined}
                className={`rounded px-1.5 py-0.5 text-xs font-semibold transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer ${
                  activeMeta ? "" : "text-[rgba(0,0,0,0.6)]"
                }`}
              >
                {activeMeta ? activeMeta.label : "Like"}
              </button>
            </div>

            {!isReply && (
              <>
                <span className="text-[rgba(0,0,0,0.3)]">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setReplying(true);
                    setShowReplies(true);
                  }}
                  className="rounded px-1.5 py-0.5 text-xs font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
                >
                  Reply
                </button>
              </>
            )}
          </div>

          {replying && !isReply && (
            <div className="mt-2">
              <CommentComposer
                postId={postId}
                parentCommentId={comment._id}
                me={me}
                autoFocus
                compact
                placeholder={`Reply to ${author.fullName || "this comment"}…`}
                onCancel={() => setReplying(false)}
                onPosted={() => {
                  setReplying(false);
                  setShowReplies(true);
                  setLocalReplyBump((value) => value + 1);
                  setRepliesPage(1);
                }}
              />
            </div>
          )}

          {!isReply && totalReplies > 0 && !showReplies && (
            <button
              type="button"
              onClick={() => setShowReplies(true)}
              className="mt-1.5 rounded px-1.5 py-0.5 text-xs font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] hover:text-[#0a66c2] cursor-pointer"
            >
              {totalReplies === 1 ? "1 reply" : `${formatCount(totalReplies)} replies`}
            </button>
          )}

          {!isReply && showReplies && (
            <div className="mt-2 space-y-3">
              {replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  postId={postId}
                  me={me}
                  isReply
                />
              ))}

              {loadingReplies && (
                <p className="pl-10 text-xs text-[rgba(0,0,0,0.6)]">Loading replies…</p>
              )}

              {replyData?.pagination &&
                repliesPage < (replyData.pagination.totalPages || 1) && (
                  <button
                    type="button"
                    onClick={() => setRepliesPage((page) => page + 1)}
                    className="ml-10 rounded px-1.5 py-0.5 text-xs font-semibold text-[rgba(0,0,0,0.6)] hover:text-[#0a66c2] cursor-pointer"
                  >
                    Load more replies
                  </button>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
