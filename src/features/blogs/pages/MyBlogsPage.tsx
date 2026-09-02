import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiFileText,
  FiCheckCircle,
  FiSlash,
} from "react-icons/fi";
import {
  useGetMyBlogsQuery,
  useDeleteBlogMutation,
  usePublishBlogMutation,
  useUnpublishBlogMutation,
} from "../api/blogsApi";
import { useAppSelector } from "../../../hooks/useAppSelector";

export const MyBlogsPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [activeStatus, setActiveStatus] = useState<"" | "published" | "draft">("");
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetMyBlogsQuery({
    status: activeStatus || undefined,
  });

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [publishBlog, { isLoading: isPublishing }] = usePublishBlogMutation();
  const [unpublishBlog, { isLoading: isUnpublishing }] = useUnpublishBlogMutation();

  const rolePath = user?.role === "ADMIN" ? "/admin" : user?.role === "RECRUITER" ? "/recruiter" : "/job-seeker";

  const blogs = data?.blogs || [];

  const handleDeleteConfirm = async () => {
    if (!deleteBlogId) return;
    try {
      await deleteBlog(deleteBlogId).unwrap();
      setDeleteBlogId(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  const handleTogglePublish = async (blogId: string, isCurrentlyPublished: boolean) => {
    try {
      if (isCurrentlyPublished) {
        await unpublishBlog(blogId).unwrap();
      } else {
        await publishBlog(blogId).unwrap();
      }
      refetch();
    } catch (err) {
      console.error("Failed to update publish status:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#05264E]">My Blogs</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage your articles, drafts, and publication status.
          </p>
        </div>

        <button
          onClick={() => navigate(`${rolePath}/blogs/create`)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#3C65F5] text-white text-xs font-bold shadow-md hover:bg-[#254BD6] transition cursor-pointer"
        >
          <FiPlus className="text-base" /> Create New Blog
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveStatus("")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeStatus === ""
              ? "bg-[#3C65F5] text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Posts
        </button>
        <button
          onClick={() => setActiveStatus("published")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeStatus === "published"
              ? "bg-[#3C65F5] text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setActiveStatus("draft")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeStatus === "draft"
              ? "bg-[#3C65F5] text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Blog List / Table */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-100 transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={blog.coverImage?.url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200&auto=format&fit=crop&q=80"}
                  alt={blog.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-slate-100"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider ${
                        blog.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {blog.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">• {blog.category}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-[#05264E] truncate max-w-md">
                    {blog.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{blog.views || 0} views</span>
                    <span>•</span>
                    <span>{blog.readTime || 5} min read</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <Link
                  to={`/blog/${blog.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                  title="View Public Post"
                >
                  <FiEye className="text-sm" />
                </Link>

                <button
                  onClick={() => handleTogglePublish(blog._id, blog.status === "published")}
                  disabled={isPublishing || isUnpublishing}
                  className={`p-2 rounded-lg border transition cursor-pointer ${
                    blog.status === "published"
                      ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                  title={blog.status === "published" ? "Unpublish Blog" : "Publish Blog"}
                >
                  {blog.status === "published" ? <FiSlash className="text-sm" /> : <FiCheckCircle className="text-sm" />}
                </button>

                <button
                  onClick={() => navigate(`${rolePath}/blogs/edit/${blog._id}`)}
                  className="p-2 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition cursor-pointer"
                  title="Edit Blog"
                >
                  <FiEdit className="text-sm" />
                </button>

                <button
                  onClick={() => setDeleteBlogId(blog._id)}
                  className="p-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                  title="Delete Blog"
                >
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80">
          <FiFileText className="text-4xl text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#05264E] mb-1">No articles written yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Share your knowledge, career tips, or industry updates with the community.
          </p>
          <button
            onClick={() => navigate(`${rolePath}/blogs/create`)}
            className="px-5 py-2.5 rounded-xl bg-[#3C65F5] text-white text-xs font-bold hover:bg-[#254BD6] transition cursor-pointer"
          >
            Create Your First Blog
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteBlogId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-[#05264E]">Delete Blog Article?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this blog post? This action cannot be undone and will remove the post permanently.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteBlogId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Blog"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogsPage;
