import React from "react";
import toast from "react-hot-toast";
import Avatar from "../common/Avatar";
import { useAddCommentMutation } from "../../api/networkApi";

interface CommentComposerProps {
  postId: string;
  parentCommentId?: string;
  me?: { fullName?: string; profilePicture?: string; email?: string };
  placeholder?: string;
  autoFocus?: boolean;
  onPosted?: () => void;
  onCancel?: () => void;
  compact?: boolean;
}

export const CommentComposer: React.FC<CommentComposerProps> = ({
  postId,
  parentCommentId,
  me,
  placeholder = "Add a comment…",
  autoFocus = false,
  onPosted,
  onCancel,
  compact = false,
}) => {
  const [text, setText] = React.useState("");
  const [focused, setFocused] = React.useState(autoFocus);
  const [addComment, { isLoading }] = useAddCommentMutation();
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const submit = async () => {
    const content = text.trim();
    if (!content || isLoading) return;

    try {
      await addComment({ postId, content, parentCommentId }).unwrap();
      setText("");
      setFocused(false);
      onPosted?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not post your comment.");
    }
  };

  return (
    <div className="flex gap-2">
      <Avatar
        src={me?.profilePicture}
        name={me?.fullName}
        email={me?.email}
        size={compact ? "sm" : "md"}
      />

      <div className="min-w-0 flex-1">
        <div className="rounded-2xl border border-[rgba(0,0,0,0.3)] bg-white px-3 py-2 focus-within:border-[rgba(0,0,0,0.6)]">
          <textarea
            ref={inputRef}
            value={text}
            onFocus={() => setFocused(true)}
            onChange={(event) => setText(event.target.value.slice(0, 1500))}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                submit();
              }
            }}
            rows={focused ? 2 : 1}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent text-sm leading-snug text-[rgba(0,0,0,0.9)] outline-none placeholder:text-[rgba(0,0,0,0.6)]"
          />
        </div>

        {(focused || text.length > 0) && (
          <div className="mt-1.5 flex items-center justify-end gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={() => {
                  setText("");
                  onCancel();
                }}
                className="rounded-full px-3 py-1 text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={submit}
              disabled={!text.trim() || isLoading}
              className="rounded-full bg-[#3C65F5] px-4 py-1 text-sm font-semibold text-white transition hover:bg-[#2C52E0] disabled:cursor-not-allowed disabled:bg-[rgba(0,0,0,0.08)] disabled:text-[rgba(0,0,0,0.3)] enabled:cursor-pointer"
            >
              {isLoading ? "Posting…" : parentCommentId ? "Reply" : "Comment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentComposer;
