import React from "react";
import CommentComposer from "./CommentComposer";
import CommentItem from "./CommentItem";
import { useGetPostCommentsQuery } from "../../api/networkApi";
import type { CommentDTO } from "../../types";

interface CommentsSectionProps {
  postId: string;
  me?: { fullName?: string; profilePicture?: string; email?: string };
  /** Focuses the composer when the section is opened via the Comment button. */
  autoFocusComposer?: boolean;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  postId,
  me,
  autoFocusComposer = false,
}) => {
  const [sort, setSort] = React.useState<"relevant" | "recent">("relevant");
  const [page, setPage] = React.useState(1);
  const [pages, setPages] = React.useState<CommentDTO[][]>([]);

  const { data, isFetching } = useGetPostCommentsQuery({ postId, page, limit: 10, sort });

  // Accumulate pages locally so "Load more comments" appends.
  React.useEffect(() => {
    if (!data?.comments) return;
    setPages((current) => {
      const next = [...current];
      next[page - 1] = data.comments;
      return next;
    });
  }, [data?.comments, page]);

  React.useEffect(() => {
    setPages([]);
    setPage(1);
  }, [sort, postId]);

  const comments = React.useMemo(() => {
    const seen = new Set<string>();
    return pages
      .flat()
      .filter(Boolean)
      .filter((comment) => {
        if (seen.has(comment._id)) return false;
        seen.add(comment._id);
        return true;
      });
  }, [pages]);

  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="border-t border-[rgba(0,0,0,0.08)] px-4 pb-3 pt-3">
      <CommentComposer postId={postId} me={me} autoFocus={autoFocusComposer} />

      {comments.length > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as "relevant" | "recent")}
            className="cursor-pointer rounded bg-transparent py-0.5 text-xs font-semibold text-[rgba(0,0,0,0.6)] outline-none hover:bg-[rgba(0,0,0,0.04)]"
          >
            <option value="relevant">Most relevant</option>
            <option value="recent">Most recent</option>
          </select>
        </div>
      )}

      <div className="mt-3 space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={postId} me={me} />
        ))}
      </div>

      {isFetching && comments.length === 0 && (
        <p className="py-3 text-center text-sm text-[rgba(0,0,0,0.6)]">Loading comments…</p>
      )}

      {!isFetching && comments.length === 0 && (
        <p className="py-3 text-center text-sm text-[rgba(0,0,0,0.6)]">
          No comments yet. Start the conversation.
        </p>
      )}

      {page < totalPages && (
        <button
          type="button"
          onClick={() => setPage((value) => value + 1)}
          disabled={isFetching}
          className="mt-3 rounded px-2 py-1 text-sm font-semibold text-[rgba(0,0,0,0.6)] transition hover:bg-[rgba(0,0,0,0.08)] hover:text-[rgba(0,0,0,0.9)] enabled:cursor-pointer"
        >
          {isFetching ? "Loading…" : "Load more comments"}
        </button>
      )}
    </div>
  );
};

export default CommentsSection;
