import React from "react";
import { Link } from "react-router-dom";
import type { Blog } from "../types/blog.types";

interface TrendingBlogCardProps {
  blog: Blog;
}

export const TrendingBlogCard: React.FC<TrendingBlogCardProps> = ({ blog }) => {
  const authorName = blog.authorDetails?.name || (typeof blog.author === "object" ? (blog.author as any).name : "Admin");
  const authorAvatar = blog.authorDetails?.profilePicture || (typeof blog.author === "object" ? (blog.author as any).profilePicture : "");
  
  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : "";

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group flex items-center gap-3.5 p-2 rounded-xl transition-all duration-200 hover:bg-slate-50"
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100">
        <img
          src={blog.coverImage?.url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&auto=format&fit=crop&q=80"}
          alt={blog.title}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs sm:text-sm font-bold text-[#05264E] leading-snug line-clamp-2 mb-1.5 group-hover:text-[#3C65F5] transition-colors">
          {blog.title}
        </h4>

        <div className="flex items-center gap-2">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-5 h-5 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-[#3C65F5] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}

          <span className="text-xs text-[#66789C] font-medium truncate">{authorName}</span>
          {formattedDate && <span className="text-xs text-[#94A3B8] font-medium">• {formattedDate}</span>}
        </div>
      </div>
    </Link>
  );
};

export default TrendingBlogCard;
