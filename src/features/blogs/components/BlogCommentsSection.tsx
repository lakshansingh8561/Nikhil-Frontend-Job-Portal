import React, { useState } from "react";
import { useGetBlogCommentsQuery, useAddBlogCommentMutation } from "../api/blogsApi";
import { useAppSelector } from "../../../hooks/useAppSelector";

interface BlogCommentsSectionProps {
  blogId: string;
}

export const BlogCommentsSection: React.FC<BlogCommentsSectionProps> = ({ blogId }) => {
  const { user } = useAppSelector((state) => state.auth);

  const { data: comments, isLoading } = useGetBlogCommentsQuery(blogId);
  const [addComment, { isLoading: isPosting }] = useAddBlogCommentMutation();

  const [commentText, setCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [saveInfo, setSaveInfo] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setErrorMsg("Please enter your comment.");
      return;
    }

    if (!user && (!guestName.trim() || !guestEmail.trim())) {
      setErrorMsg("Please provide your name and email address.");
      return;
    }

    try {
      setErrorMsg("");
      await addComment({
        blogId,
        content: commentText.trim(),
        name: user ? undefined : guestName.trim(),
        email: user ? undefined : guestEmail.trim(),
      }).unwrap();

      setCommentText("");
      setSuccessMsg("Your comment has been posted!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      console.error("Failed to post comment:", err);
      setErrorMsg(err?.data?.message || err?.message || "Failed to post comment. Please try again.");
    }
  };

  return (
    <div className="pt-10 border-t border-slate-100 font-['Plus_Jakarta_Sans',sans-serif] space-y-12">
      {/* 1. Comments List */}
      <div>
        <h3 className="text-2xl sm:text-[28px] font-extrabold text-[#05264E] mb-8 tracking-tight">
          Comments {comments && comments.length > 0 && `(${comments.length})`}
        </h3>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-6 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 h-24 bg-slate-200 rounded-[16px]" />
              </div>
            ))}
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="space-y-8">
            {comments.map((cmt) => {
              const formattedDate = new Date(cmt.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div key={cmt._id} className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  {/* Left Column: Author Avatar + Name + Date */}
                  <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1.5 w-full sm:w-44 shrink-0">
                    {cmt.avatar ? (
                      <img
                        src={cmt.avatar}
                        alt={cmt.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#3C65F5] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {cmt.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-bold text-[#05264E] leading-snug">{cmt.name}</h4>
                      <span className="text-xs text-[#66789C] font-medium block">{formattedDate}</span>
                    </div>
                  </div>

                  {/* Right Column: Bordered Comment Card Box */}
                  <div className="flex-1 w-full bg-white border border-[#E0E6F7] rounded-[16px] p-5 sm:p-6 text-[#4F5E64] text-sm sm:text-base leading-relaxed">
                    <p className="whitespace-pre-line">{cmt.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">No comments yet. Be the first to leave a comment!</p>
        )}
      </div>

      {/* 2. Leave a Comment Form */}
      <div className="pt-4">
        <h3 className="text-2xl sm:text-[28px] font-extrabold text-[#05264E] mb-6 tracking-tight">
          Leave a comment
        </h3>

        <form onSubmit={handleSubmitComment} className="space-y-5">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          {/* Comment Textarea */}
          <div>
            <textarea
              rows={5}
              placeholder="Write a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-4 border border-[#E0E6F7] rounded-[16px] text-sm font-medium text-[#05264E] placeholder:text-slate-400 focus:outline-none focus:border-[#3C65F5] transition bg-white resize-none"
              required
            />
          </div>

          {/* Guest Name & Email Inputs (if not logged in) */}
          {!user && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name *"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full h-12 px-4 border border-[#E0E6F7] rounded-xl text-sm font-medium text-[#05264E] placeholder:text-slate-400 focus:outline-none focus:border-[#3C65F5] transition bg-white"
                required
              />
              <input
                type="email"
                placeholder="Your Email *"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full h-12 px-4 border border-[#E0E6F7] rounded-xl text-sm font-medium text-[#05264E] placeholder:text-slate-400 focus:outline-none focus:border-[#3C65F5] transition bg-white"
                required
              />
            </div>
          )}

          {/* Save Info Checkbox */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="saveInfoCheckbox"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#3C65F5] focus:ring-[#3C65F5] cursor-pointer"
            />
            <label htmlFor="saveInfoCheckbox" className="text-xs sm:text-sm text-[#66789C] font-medium cursor-pointer">
              Save my name, email, and website in this browser for the next time I comment.
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isPosting}
              className="px-8 py-3.5 bg-[#3C65F5] hover:bg-[#254BD6] text-white text-sm font-bold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {isPosting ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogCommentsSection;
