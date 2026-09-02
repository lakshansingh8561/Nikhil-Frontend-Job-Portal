import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiCheckCircle,
  FiSlash,
} from "react-icons/fi";
import {
  useGetAdminBlogsQuery,
  useDeleteBlogMutation,
  usePublishBlogMutation,
  useUnpublishBlogMutation,
} from "../api/blogsApi";

export const AdminBlogsPage: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useGetAdminBlogsQuery({
    search: search || undefined,
    role: roleFilter as any || undefined,
    status: statusFilter as any || undefined,
  });

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const [publishBlog] = usePublishBlogMutation();
  const [unpublishBlog] = useUnpublishBlogMutation();

  const blogs = data?.blogs || [];

  const handleDeleteConfirm = async () => {
    if (!deleteBlogId) return;
    try {
      await deleteBlog(deleteBlogId).unwrap();
      setDeleteBlogId(null);
      refetch();
    } catch (err) {
      console.error("Admin delete blog error:", err);
    }
  };

  const handleTogglePublish = async (blogId: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await unpublishBlog(blogId).unwrap();
      } else {
        await publishBlog(blogId).unwrap();
      }
      refetch();
    } catch (err) {
      console.error("Admin toggle publish error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#05264E]">Blog Management</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Review, publish, edit, or delete all blogs across the platform.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/blogs/create")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#3C65F5] text-white text-xs font-bold shadow-md hover:bg-[#254BD6] transition cursor-pointer"
        >
          <FiPlus className="text-base" /> Post Admin Article
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-3 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-[#05264E] focus:outline-none focus:border-[#3C65F5]"
          />
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-[#05264E] focus:outline-none focus:border-[#3C65F5]"
        >
          <option value="">All Author Roles</option>
          <option value="JOB_SEEKER">Job Seekers</option>
          <option value="RECRUITER">Recruiters</option>
          <option value="ADMIN">Admins</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-[#05264E] focus:outline-none focus:border-[#3C65F5]"
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#05264E]">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider font-extrabold text-[11px] text-slate-500">
              <tr>
                <th className="px-6 py-4">Article</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    Loading admin blogs...
                  </td>
                </tr>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => {
                  const authorName = blog.authorDetails?.name || "User";
                  const authorRole = blog.authorRole || "USER";

                  return (
                    <tr key={blog._id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <img
                            src={blog.coverImage?.url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100&auto=format&fit=crop&q=80"}
                            alt={blog.title}
                            className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-100"
                          />
                          <span className="font-extrabold text-sm text-[#05264E] line-clamp-2">
                            {blog.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span className="font-bold text-xs block">{authorName}</span>
                          <span className="inline-block px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase bg-slate-100 text-slate-600">
                            {authorRole}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600">
                        {blog.category}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[10px] font-extrabold rounded-md uppercase tracking-wider ${
                            blog.status === "published"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-600">
                        {blog.views || 0}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                          : "Draft"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/blog/${blog.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                            title="View Post"
                          >
                            <FiEye />
                          </Link>

                          <button
                            onClick={() => handleTogglePublish(blog._id, blog.status === "published")}
                            className={`p-1.5 rounded-lg border transition ${
                              blog.status === "published"
                                ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                            title={blog.status === "published" ? "Unpublish" : "Publish"}
                          >
                            {blog.status === "published" ? <FiSlash /> : <FiCheckCircle />}
                          </button>

                          <button
                            onClick={() => navigate(`/admin/blogs/edit/${blog._id}`)}
                            className="p-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                            title="Edit Post"
                          >
                            <FiEdit />
                          </button>

                          <button
                            onClick={() => setDeleteBlogId(blog._id)}
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                            title="Delete Post"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No blogs found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteBlogId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-[#05264E]">Admin Delete Blog?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this article? As Admin, this will permanently soft-delete the article from the database.
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

export default AdminBlogsPage;
