import React from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  FiBookmark,
  FiEdit2,
  FiGlobe,
  FiLink,
  FiMessageSquare,
  FiMoreHorizontal,
  FiRepeat,
  FiSend,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import Avatar from "../common/Avatar";
import { CARD_CLASS } from "../common/Card";
import SeeMoreText from "../common/SeeMoreText";
import PostMediaGrid from "./PostMediaGrid";
import ReactionPicker, { ReactionBadges } from "./ReactionPicker";
import ReactionsModal from "./ReactionsModal";
import RepostModal from "./RepostModal";
import CommentsSection from "../comments/CommentsSection";
import useDismissable from "../../hooks/useDismissable";
import { useNetworkPaths } from "../../hooks/useNetworkPaths";
import { formatCount, timeAgo } from "../../utils/format";
import { reactionMeta, safeSocialProof } from "../../utils/reactions";
import {
  useDeletePostMutation,
  useReactToPostMutation,
  useToggleSavePostMutation,
  useUpdatePostMutation,
} from "../../api/networkApi";
import type { PostDTO, ReactionType } from "../../types";

interface PostCardProps {
  post: PostDTO;
  me?: { fullName?: string; profilePicture?: string; email?: string };
  /** Opens the comment thread expanded (used on the permalink page). */
  defaultCommentsOpen?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  me,
  defaultCommentsOpen = false,
}) => {
  const paths = useNetworkPaths();

  const [reaction, setReaction] = React.useState<ReactionType | null>(post.myReaction);
  const [proof, setProof] = React.useState(() =>
    safeSocialProof(post.socialProof, post.reactionsCount)
  );
  const [commentsOpen, setCommentsOpen] = React.useState(defaultCommentsOpen);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [reactorsOpen, setReactorsOpen] = React.useState(false);
  const [repostOpen, setRepostOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(post.content);
  const [saved, setSaved] = React.useState(Boolean(post.isSavedByMe));

  const hoverTimer = React.useRef<number | null>(null);
  const menuRef = useDismissable<HTMLDivElement>(menuOpen, () => setMenuOpen(false));

  const [reactToPost] = useReactToPostMutation();
  const [toggleSave] = useToggleSavePostMutation();
  const [deletePost] = useDeletePostMutation();
  const [updatePost, { isLoading: isSavingEdit }] = useUpdatePostMutation();

  React.useEffect(() => {
    setReaction(post.myReaction);
    setProof(safeSocialProof(post.socialProof, post.reactionsCount));
    setSaved(Boolean(post.isSavedByMe));
  }, [post.myReaction, post.socialProof, post.reactionsCount, post.isSavedByMe]);

  const isRepost = Boolean(post.repostOf && post.repostOfPost);
  const shown = isRepost ? (post.repostOfPost as PostDTO) : post;
  const author = shown.author || ({} as PostDTO["author"]);
  const activeMeta = reactionMeta(reaction);

  const applyReaction = async (type: ReactionType) => {
    const previous = reaction;
    const next = previous === type ? null : type;

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
      const result = await reactToPost({ postId: post._id, type }).unwrap();
      if (result?.socialProof) setProof(safeSocialProof(result.socialProof, result.reactionsCount));
      setReaction(result?.myReaction ?? null);
    } catch {
      setReaction(previous);
      setProof(safeSocialProof(post.socialProof, post.reactionsCount));
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

  const permalink = `${window.location.origin}${paths.post(post._id)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(permalink);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy the link.");
    }
  };

  const handleSave = async () => {
    const previous = saved;
    setSaved(!previous);
    try {
      const result = await toggleSave(post._id).unwrap();
      setSaved(Boolean(result?.saved));
      toast.success(result?.saved ? "Post saved" : "Removed from saved");
    } catch {
      setSaved(previous);
      toast.error("Could not update your saved posts.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post? This can't be undone.")) return;
    try {
      await deletePost(post._id).unwrap();
      toast.success("Post deleted");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not delete the post.");
    }
  };

  const saveEdit = async () => {
    try {
      await updatePost({ id: post._id, content: editText.trim() }).unwrap();
      setEditing(false);
      toast.success("Post updated");
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update the post.");
    }
  };

  return (
    <article className={CARD_CLASS}>
      {isRepost && (
        <div className="flex items-center gap-1.5 px-4 pt-3 text-xs text-[rgba(0,0,0,0.6)]">
          <FiRepeat className="shrink-0" />
          <Link
            to={paths.profile(post.author?.userId || "")}
            className="font-semibold text-[rgba(0,0,0,0.9)] hover:text-[#0a66c2] hover:underline"
          >
            {post.author?.fullName}
          </Link>
          <span>reposted this</span>
        </div>
      )}

      <header className="flex items-start gap-2 px-4 pt-3">
        <Avatar
          src={author.profilePicture}
          name={author.fullName}
          email={author.email}
          size="lg"
          to={author.userId ? paths.profile(author.userId) : undefined}
        />

        <div className="min-w-0 flex-1">
          <Link
            to={author.userId ? paths.profile(author.userId) : "#"}
            className="block truncate text-sm font-semibold leading-tight text-[rgba(0,0,0,0.9)] hover:text-[#0a66c2] hover:underline"
          >
            {author.fullName || "Member"}
          </Link>
          {author.headline && (
            <p className="truncate text-xs leading-tight text-[rgba(0,0,0,0.6)]">
              {author.headline}
            </p>
          )}
          <p className="mt-0.5 flex items-center gap-1 text-xs text-[rgba(0,0,0,0.6)]">
            <span>{timeAgo(shown.createdAt)}</span>
            {shown.editedAt && <span>· Edited</span>}
            <span>·</span>
            {shown.visibility === "CONNECTIONS" ? (
              <FiUsers title="Connections only" />
            ) : (
              <FiGlobe title="Anyone" />
            )}
          </p>
        </div>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Post options"
            className="grid h-8 w-8 place-items-center rounded-full text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
          >
            <FiMoreHorizontal className="text-xl" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-30 mt-1 w-56 overflow-hidden rounded-lg border border-[rgba(0,0,0,0.15)] bg-white py-1 shadow-xl">
              <MenuItem icon={<FiLink />} label="Copy link to post" onClick={() => { setMenuOpen(false); copyLink(); }} />
              <MenuItem
                icon={<FiBookmark />}
                label={saved ? "Remove from saved" : "Save post"}
                onClick={() => { setMenuOpen(false); handleSave(); }}
              />
              {post.isMine && (
                <>
                  <div className="my-1 border-t border-[rgba(0,0,0,0.08)]" />
                  <MenuItem
                    icon={<FiEdit2 />}
                    label="Edit post"
                    onClick={() => { setMenuOpen(false); setEditing(true); }}
                  />
                  <MenuItem
                    icon={<FiTrash2 />}
                    label="Delete post"
                    danger
                    onClick={() => { setMenuOpen(false); handleDelete(); }}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {editing ? (
        <div className="px-4 pb-2 pt-3">
          <textarea
            value={editText}
            onChange={(event) => setEditText(event.target.value.slice(0, 3000))}
            rows={5}
            className="w-full resize-none rounded border border-[rgba(0,0,0,0.3)] px-3 py-2 text-sm outline-none focus:border-[#0a66c2]"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setEditText(post.content); setEditing(false); }}
              className="rounded-full px-3 py-1 text-sm font-semibold text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEdit}
              disabled={isSavingEdit}
              className="rounded-full bg-[#0a66c2] px-4 py-1 text-sm font-semibold text-white hover:bg-[#004182] disabled:opacity-60 enabled:cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          {isRepost && post.content?.trim() && (
            <div className="px-4 pb-2 pt-2.5">
              <SeeMoreText text={post.content} hashtagBasePath={paths.feed} />
            </div>
          )}
          {shown.content?.trim() && (
            <div className={`px-4 pb-2 ${isRepost ? "pt-0" : "pt-2.5"}`}>
              <SeeMoreText text={shown.content} hashtagBasePath={paths.feed} />
            </div>
          )}
        </>
      )}

      {isRepost ? (
        <div className="mx-4 mb-2 overflow-hidden rounded-lg border border-[rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-2 px-3 pt-3">
            <Avatar
              src={author.profilePicture}
              name={author.fullName}
              email={author.email}
              size="sm"
              to={author.userId ? paths.profile(author.userId) : undefined}
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[rgba(0,0,0,0.9)]">
                {author.fullName}
              </p>
              <p className="truncate text-[11px] text-[rgba(0,0,0,0.6)]">
                {timeAgo(shown.createdAt)}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <PostMediaGrid media={shown.media} fallbackUrls={shown.mediaUrls} />
          </div>
        </div>
      ) : (
        <PostMediaGrid media={shown.media} fallbackUrls={shown.mediaUrls} />
      )}

      {shown.jobDetails && (
        <Link
          to={`/jobs/${shown.jobDetails._id}`}
          className="mx-4 mb-2 flex items-center gap-3 rounded-lg border border-[rgba(0,0,0,0.15)] px-3 py-3 transition hover:border-[#0a66c2] hover:bg-[#0a66c2]/5"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-[rgba(0,0,0,0.9)]">
              {shown.jobDetails.title}
            </span>
            <span className="block truncate text-xs text-[rgba(0,0,0,0.6)]">
              {shown.jobDetails.jobType || "View role"}
            </span>
          </span>
          <span className="shrink-0 text-xs font-semibold text-[#0a66c2]">View job</span>
        </Link>
      )}

      {(proof.total > 0 || post.commentsCount > 0 || post.repostCount > 0) && (
        <div className="mx-4 flex items-center justify-between gap-2 border-b border-[rgba(0,0,0,0.08)] py-1.5">
          {proof.total > 0 ? (
            <button
              type="button"
              onClick={() => setReactorsOpen(true)}
              className="flex items-center gap-1 rounded text-xs text-[rgba(0,0,0,0.6)] transition hover:text-[#0a66c2] hover:underline cursor-pointer"
            >
              <ReactionBadges types={proof.topTypes} />
              <span>{formatCount(proof.total)}</span>
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2 text-xs text-[rgba(0,0,0,0.6)]">
            {post.commentsCount > 0 && (
              <button
                type="button"
                onClick={() => setCommentsOpen(true)}
                className="hover:text-[#0a66c2] hover:underline cursor-pointer"
              >
                {formatCount(post.commentsCount)}{" "}
                {post.commentsCount === 1 ? "comment" : "comments"}
              </button>
            )}
            {post.commentsCount > 0 && post.repostCount > 0 && <span>·</span>}
            {post.repostCount > 0 && (
              <span>
                {formatCount(post.repostCount)} {post.repostCount === 1 ? "repost" : "reposts"}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-around gap-1 px-2 py-1">
        <div
          className="relative flex-1"
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
          <ActionButton
            icon={
              activeMeta ? (
                <span aria-hidden="true" className="text-base leading-none">
                  {activeMeta.emoji}
                </span>
              ) : (
                <ThumbIcon />
              )
            }
            label={activeMeta ? activeMeta.label : "Like"}
            color={activeMeta?.color}
            onClick={() => applyReaction(reaction || "LIKE")}
          />
        </div>

        <ActionButton
          icon={<FiMessageSquare className="text-lg" />}
          label="Comment"
          onClick={() => setCommentsOpen((value) => !value)}
        />
        <ActionButton
          icon={<FiRepeat className="text-lg" />}
          label="Repost"
          onClick={() => setRepostOpen(true)}
        />
        <ActionButton
          icon={saved ? <FiBookmark className="text-lg fill-current" /> : <FiSend className="text-lg" />}
          label={saved ? "Saved" : "Save"}
          color={saved ? "#0a66c2" : undefined}
          onClick={handleSave}
        />
      </div>

      {commentsOpen && (
        <CommentsSection postId={post._id} me={me} autoFocusComposer={!defaultCommentsOpen} />
      )}

      <ReactionsModal post={{ ...post, socialProof: proof }} open={reactorsOpen} onClose={() => setReactorsOpen(false)} />
      <RepostModal post={post} open={repostOpen} onClose={() => setRepostOpen(false)} me={me} />
    </article>
  );
};

const ThumbIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
    <path d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1a2.75 2.75 0 00-2.75 2.75v3.5H4.5A2.5 2.5 0 002 9.75v8.5A2.5 2.5 0 004.5 20.75h11.6a3 3 0 002.95-2.44l1.4-7A2 2 0 0019.46 11zM4 18.25v-8.5a.5.5 0 01.5-.5h3.51v9.5H4.5a.5.5 0 01-.5-.5zm14.5-6.44l-1.4 7a1 1 0 01-.98.81H10v-9.7l.28-.28a9 9 0 002.17-3.52l.49-1.47a.75.75 0 011.45.26v3.5a1 1 0 001 1h3.05a.02.02 0 01.02.02l-.02.02z" />
  </svg>
);

const ActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}> = ({ icon, label, onClick, color }) => (
  <button
    type="button"
    onClick={onClick}
    style={color ? { color } : undefined}
    className={`flex flex-1 items-center justify-center gap-1.5 rounded px-1 py-2.5 text-sm font-semibold transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer ${
      color ? "" : "text-[rgba(0,0,0,0.6)]"
    }`}
  >
    {icon}
    <span className="hidden truncate sm:inline">{label}</span>
  </button>
);

const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}> = ({ icon, label, onClick, danger }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-medium transition hover:bg-[rgba(0,0,0,0.04)] cursor-pointer ${
      danger ? "text-[#b24020]" : "text-[rgba(0,0,0,0.9)]"
    }`}
  >
    <span className="text-base">{icon}</span>
    {label}
  </button>
);

export default PostCard;
