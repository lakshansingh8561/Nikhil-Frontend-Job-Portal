import React from "react";
import { Link } from "react-router-dom";
import type { Blog } from "../types/blog.types";

interface BlogCardProps {
  blog: Blog;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const authorName = blog.authorDetails?.name || (typeof blog.author === "object" ? (blog.author as any).name : "Admin");
  const authorAvatar = blog.authorDetails?.profilePicture || (typeof blog.author === "object" ? (blog.author as any).profilePicture : "");
  
  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date(blog.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group flex flex-col justify-between h-full bg-white rounded-[24px] border border-slate-100 p-4 sm:p-5 shadow-xs transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div>
        {/* Card Image */}
        <div className="relative w-full h-[210px] rounded-[18px] overflow-hidden mb-5 bg-slate-100">
          <img
            src={blog.coverImage?.url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80"}
            alt={blog.title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-bold rounded-lg bg-[#E0E6F7] text-[#3C65F5]">
            {blog.category || "General"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-extrabold text-[#05264E] leading-snug mb-3 line-clamp-2 group-hover:text-[#3C65F5] transition-colors">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[#66789C] text-sm leading-relaxed mb-6 line-clamp-3 font-normal">
          {blog.excerpt}
        </p>
      </div>

      {/* Author & Read Time Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-3">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#3C65F5] text-white flex items-center justify-center text-xs font-bold">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#05264E]">{authorName}</span>
            <span className="text-[11px] text-[#66789C] font-medium">{formattedDate}</span>
          </div>
        </div>

        <span className="text-xs font-medium text-[#66789C]">
          {blog.readTime || 5} mins to read
        </span>
      </div>
    </Link>
  );
};

export default BlogCard;
