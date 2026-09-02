import React from "react";
import { Link } from "react-router-dom";
import type { Blog } from "../types/blog.types";

interface FeaturedBlogCardProps {
  blog: Blog;
}

export const FeaturedBlogCard: React.FC<FeaturedBlogCardProps> = ({ blog }) => {
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
      className="group relative block w-full h-[518px] rounded-[16px] sm:rounded-[20px] overflow-hidden shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 font-['Plus_Jakarta_Sans',sans-serif]"
    >
      {/* Background Cover Image */}
      <img
        src={blog.coverImage?.url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80"}
        alt={blog.title}
        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      {/* Bottom Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col justify-end text-white">
        {/* Title: 28px font, mb 20px, white text */}
        <h3 className="text-[24px] sm:text-[28px] font-bold leading-[34px] text-white mb-[20px] line-clamp-3 group-hover:text-[#3C65F5] transition-colors tracking-tight">
          {blog.title}
        </h3>

        {/* Author & Date: 14px font, white text */}
        <div className="flex items-center gap-3">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-9 h-9 rounded-full object-cover border-2 border-white/80 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#3C65F5] text-white flex items-center justify-center text-xs font-bold border-2 border-white/80 shrink-0">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex items-center gap-4 text-[14px] font-medium text-white tracking-wide">
            <span className="font-semibold">{authorName}</span>
            <span className="text-white/80">{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedBlogCard;
