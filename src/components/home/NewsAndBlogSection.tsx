import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Container from "../common/Container";
import { useGetPublicBlogsQuery } from "../../features/blogs/api/blogsApi";
import { BlogCard } from "../../features/blogs/components/BlogCard";
import { BlogCardSkeleton } from "../../features/blogs/components/BlogSkeleton";
import { BlogNewsletterSection } from "../../features/blogs/components/BlogNewsletterSection";

export const NewsAndBlogSection: React.FC = () => {
  const { data, isLoading } = useGetPublicBlogsQuery({ page: 1, limit: 3 });
  const blogs = data?.blogs || [];

  return (
    <section className="py-16 bg-white border-b border-[#EAEFF7]">
      <Container className="space-y-16">
        {/* Section Header */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div className="text-center sm:text-left mx-auto sm:mx-0">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#05264E] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
                News and Blog
              </h2>
              <p className="mt-2 text-sm sm:text-base font-normal text-[#66789C] font-['Plus_Jakarta_Sans',sans-serif]">
                Get the latest news, updates and tips
              </p>
            </div>

            <Link
              to="/blog"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-extrabold text-[#3C65F5] hover:underline"
            >
              <span>View All Articles</span>
              <FiArrowRight />
            </Link>
          </div>

          {/* 3 Blog Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-sm font-medium text-slate-500 mb-4">No news articles published yet.</p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3C65F5] text-white text-xs font-bold hover:bg-[#254BD6] transition"
              >
                Explore Blog Page
              </Link>
            </div>
          )}

          {/* View All Posts Button */}
          <div className="text-center mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#05264E] hover:bg-[#3C65F5] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
            >
              <span>Explore All Blog Posts</span>
              <FiArrowRight className="text-base" />
            </Link>
          </div>
        </div>

        {/* Home Page Newsletter Component (Exact match to Screenshot 2) */}
        <BlogNewsletterSection />
      </Container>
    </section>
  );
};

export default NewsAndBlogSection;
