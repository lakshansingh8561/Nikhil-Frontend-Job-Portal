import React from "react";
import toast from "react-hot-toast";
import Avatar from "../common/Avatar";
import Modal from "../common/Modal";
import { useRepostMutation } from "../../api/networkApi";
import { timeAgo } from "../../utils/format";
import type { PostDTO } from "../../types";

interface RepostModalProps {
  post: PostDTO;
  open: boolean;
  onClose: () => void;
  me?: { fullName?: string; profilePicture?: string; email?: string };
}

/** "Repost with your thoughts" — quotes the original inside a preview card. */
export const RepostModal: React.FC<RepostModalProps> = ({ post, open, onClose, me }) => {
  const [text, setText] = React.useState("");
  const [repost, { isLoading }] = useRepostMutation();

  const original = post.repostOfPost || post;

  const submit = async () => {
    try {
      await repost({ postId: post._id, content: text.trim() }).unwrap();
      toast.success("Reposted");
      setText("");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not repost.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Repost"
      widthClass="max-w-[640px]"
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={submit}
            disabled={isLoading}
            className="rounded-full bg-[#3C65F5] px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-[#2C52E0] disabled:opacity-60 enabled:cursor-pointer"
          >
            {isLoading ? "Posting…" : "Post"}
          </button>
        </div>
      }
    >
      <div className="px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Avatar src={me?.profilePicture} name={me?.fullName} email={me?.email} size="lg" />
          <p className="text-sm font-semibold text-[rgba(0,0,0,0.9)]">{me?.fullName || "You"}</p>
        </div>

        <textarea
          value={text}
          onChange={(event) => setText(event.target.value.slice(0, 3000))}
          rows={4}
          autoFocus
          placeholder="Add your thoughts (optional)"
          className="mt-3 w-full resize-none border-0 bg-transparent text-base text-[rgba(0,0,0,0.9)] outline-none placeholder:text-[rgba(0,0,0,0.6)]"
        />

        <div className="mt-2 rounded-lg border border-[rgba(0,0,0,0.15)] p-3">
          <div className="flex items-center gap-2">
            <Avatar
              src={original.author?.profilePicture}
              name={original.author?.fullName}
              email={original.author?.email}
              size="sm"
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[rgba(0,0,0,0.9)]">
                {original.author?.fullName}
              </p>
              <p className="truncate text-[11px] text-[rgba(0,0,0,0.6)]">
                {original.author?.headline} · {timeAgo(original.createdAt)}
              </p>
            </div>
          </div>
          <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm text-[rgba(0,0,0,0.9)]">
            {original.content}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default RepostModal;
