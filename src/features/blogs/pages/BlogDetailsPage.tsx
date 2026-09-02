import React from "react";
import { useParams, Link } from "react-router-dom";
import { FiCalendar, FiClock, FiEye, FiArrowLeft } from "react-icons/fi";
import { useGetBlogBySlugQuery } from "../api/blogsApi";
import { BlogCommentsSection } from "../components/BlogCommentsSection";
import Container from "../../../components/common/Container";

export const BlogDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, isError } = useGetBlogBySlugQuery(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="w-full h-[372px] bg-slate-200 animate-pulse" />
        <Container className="-mt-[100px] relative z-10">
          <div className="animate-pulse space-y-6 max-w-[1116px] mx-auto bg-white p-12 rounded-2xl shadow-xl">
            <div className="w-24 h-6 bg-slate-200 rounded-md mx-auto" />
            <div className="w-full h-10 bg-slate-200 rounded-md" />
            <div className="w-2/3 h-10 bg-slate-200 rounded-md mx-auto" />
          </div>
        </Container>
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 text-center">
        <Container>
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-2xl font-bold text-[#05264E] mb-3">Blog Not Found</h2>
            <p className="text-slate-500 text-sm mb-6">
              The article you are looking for does not exist or has been removed.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3C65F5] text-white text-xs font-bold hover:bg-[#254BD6] transition"
            >
              <FiArrowLeft /> Back to All Articles
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const authorName = blog.authorDetails?.name || (typeof blog.author === "object" ? (blog.author as any).name : "Admin");
  const authorAvatar = blog.authorDetails?.profilePicture || (typeof blog.author === "object" ? (blog.author as any).profilePicture : "");
  
  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : new Date(blog.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 1. Full-Width Hero Cover Image Banner (Exact computed height: 372px) */}
      <div className="w-full h-[372px] relative bg-slate-100 overflow-hidden">
        <img
          src={blog.coverImage?.url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&auto=format&fit=crop&q=80"}
          alt={blog.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. Overlapping Card & Content Block */}
      <div className="w-full px-4 sm:px-6">
        {/* Outer Overlapping Box (div.box-white 1116px width with 50px vertical padding) */}
        <div className="max-w-[1116px] mx-auto relative -mt-[100px] bg-white rounded-2xl border border-slate-100 py-[50px] px-6 sm:px-12 shadow-xl text-center z-10">
          {/* Inner Title Content (div.max-width-single 733px width) */}
          <div className="max-w-[733px] mx-auto">
            {/* Category Pill Badge */}
            <div className="mb-4">
              <span className="bg-[#E8F0FE] text-[#3C65F5] text-xs font-semibold px-3.5 py-1 rounded-md inline-block">
                {blog.category || "Job Tips"}
              </span>
            </div>

            {/* Blog Title */}
            <h1 className="text-2xl sm:text-[32px] font-extrabold text-[#05264E] leading-tight sm:leading-[40px] mb-6 tracking-tight">
              {blog.title}
            </h1>

            {/* Author & Meta Info Row */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#66789C]">
              <div className="flex items-center gap-2">
                {authorAvatar ? (
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#3C65F5] text-white flex items-center justify-center text-[10px] font-bold">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-bold text-[#05264E]">{authorName}</span>
              </div>

              <span className="text-slate-300">•</span>

              <div className="flex items-center gap-1.5">
                <FiCalendar className="text-slate-400" />
                <span>{formattedDate}</span>
              </div>

              <span className="text-slate-300">•</span>

              <div className="flex items-center gap-1.5">
                <FiClock className="text-slate-400" />
                <span>{blog.readTime || 8} mins to read</span>
              </div>

              {blog.views !== undefined && blog.views > 0 && (
                <>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <FiEye className="text-slate-400" />
                    <span>{blog.views} views</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3. Article Rich Content Block (733px max-width, 18px font size, #4F5E64 color) */}
        <div className="max-w-[733px] mx-auto py-10 sm:py-14">
          {/* Excerpt Lead Paragraph if present */}
          {blog.excerpt && (
            <p className="text-[18px] leading-[28px] text-[#4F5E64] font-medium mb-[15px]">
              {blog.excerpt}
            </p>
          )}

          {/* Main Content HTML Render */}
          <div
            className="blog-content-body text-[18px] leading-[28px] text-[#4F5E64] font-normal space-y-[15px]"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags Footer */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-8 mt-10 mb-10 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#66789C] uppercase tracking-wider mr-2">Tags:</span>
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-[#05264E]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 4. Professional Comments & Leave a Comment Section */}
          <BlogCommentsSection blogId={blog._id} />
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
