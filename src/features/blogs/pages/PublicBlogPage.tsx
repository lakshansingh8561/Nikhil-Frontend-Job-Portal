import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  useGetPublicBlogsQuery,
  useGetTrendingBlogsQuery,
  useGetBlogCategoriesQuery,
} from "../api/blogsApi";
import { FeaturedBlogCard } from "../components/FeaturedBlogCard";
import { BlogCard } from "../components/BlogCard";
import { TrendingBlogCard } from "../components/TrendingBlogCard";
import { BlogGalleryWidget } from "../components/BlogGalleryWidget";
import { BlogNewsletterSection } from "../components/BlogNewsletterSection";
import {
  FeaturedSkeleton,
  BlogCardSkeleton,
  TrendingSkeleton,
} from "../components/BlogSkeleton";
import Container from "../../../components/common/Container";

export const PublicBlogPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // API Queries
  const {
    data: featuredData,
    isLoading: isFeaturedLoading,
  } = useGetPublicBlogsQuery({ page: 1, limit: 3, sort: "latest" });

  const {
    data: blogsData,
    isLoading: isBlogsLoading,
    isFetching: isBlogsFetching,
  } = useGetPublicBlogsQuery({
    page: currentPage,
    limit: 6,
    search: debouncedSearch || undefined,
    category: selectedCategory || undefined,
    sort: "latest",
  });

  const {
    data: trendingBlogs,
    isLoading: isTrendingLoading,
  } = useGetTrendingBlogsQuery(5);

  const { data: categories } = useGetBlogCategoriesQuery();

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory((prev) => (prev === categoryName ? "" : categoryName));
    setCurrentPage(1);
  };

  const blogs = blogsData?.blogs || [];
  const pagination = blogsData?.pagination;
  const featuredBlogs = featuredData?.blogs || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Hero Header Banner */}
      <section className="relative py-5 sm:py-6 bg-[#F5F8FF] border-b border-slate-200/60 overflow-hidden">
        <Container>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#05264E] tracking-tight mb-1">
                Blog
              </h1>
              <p className="text-[#66789C] text-sm sm:text-base font-medium">
                Get the latest news, updates and tips
              </p>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold shadow-xs">
              <Link to="/" className="text-slate-500 hover:text-[#3C65F5] transition-colors">
                Home
              </Link>
              <span className="text-slate-400">&gt;</span>
              <span className="text-[#05264E] font-bold">Blog</span>
            </div>
          </div>
        </Container>
      </section>

      <Container className="pt-6 pb-12 sm:pt-8 sm:pb-16 space-y-10 sm:space-y-12">
        {/* 2. Featured Blogs Top Grid (Top 3 Cards) */}
        {!selectedCategory && !debouncedSearch && (
          <section>
            {isFeaturedLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <FeaturedSkeleton />
                <FeaturedSkeleton />
                <FeaturedSkeleton />
              </div>
            ) : featuredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {featuredBlogs.map((blog) => (
                  <FeaturedBlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            ) : null}
          </section>
        )}

        {/* 3. Main Content: Latest Posts Header + 2-Column Grid & Sidebar */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#05264E] tracking-tight mb-1">
              Latest Posts
            </h2>
            <p className="text-[#66789C] text-sm sm:text-base font-medium">
              Do not miss the trending news
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Category Pills + Main Cards Grid + Pagination */}
            <div className="lg:col-span-8 space-y-8">
              {/* Category Filter Pills */}
              {categories && categories.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  <button
                    onClick={() => handleCategorySelect("")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === ""
                        ? "bg-[#3C65F5] text-white shadow-md"
                        : "bg-white text-[#66789C] border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedCategory === cat.name
                          ? "bg-[#3C65F5] text-white shadow-md"
                          : "bg-white text-[#66789C] border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {cat.name} {cat.count > 0 && `(${cat.count})`}
                    </button>
                  ))}
                </div>
              )}

              {/* Main Grid */}
              {isBlogsLoading || isBlogsFetching ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <BlogCardSkeleton />
                  <BlogCardSkeleton />
                  <BlogCardSkeleton />
                  <BlogCardSkeleton />
                </div>
              ) : blogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {blogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 shadow-xs my-6">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#3C65F5] text-2xl font-bold">
                    🔍
                  </div>
                  <h3 className="text-lg font-bold text-[#05264E] mb-2">No blogs found</h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                    {debouncedSearch
                      ? `No articles matched your search query "${debouncedSearch}". Try searching for something else.`
                      : selectedCategory
                      ? `No blogs available in the "${selectedCategory}" category.`
                      : "No blogs published yet. Check back soon!"}
                  </p>
                  {(debouncedSearch || selectedCategory) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("");
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#3C65F5] text-white text-xs font-bold hover:bg-[#254BD6] transition cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
                    title="Previous Page"
                  >
                    <FiChevronLeft className="text-base" />
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-[#3C65F5] text-white shadow-md"
                          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition cursor-pointer"
                    title="Next Page"
                  >
                    <FiChevronRight className="text-base" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar (Search + Trending Now + Gallery + Hiring Widget) */}
            <div className="lg:col-span-4 space-y-8">
              {/* Search Box Card */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-xs">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-4 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-[#05264E] placeholder:text-slate-400 focus:outline-none focus:border-[#3C65F5] transition"
                  />
                  <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                </div>
              </div>

              {/* Trending Now Card */}
              <div className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-xs">
                <h3 className="text-lg font-extrabold text-[#05264E] pb-4 mb-4 border-b border-slate-100">
                  Trending Now
                </h3>

                {isTrendingLoading ? (
                  <div className="space-y-4">
                    <TrendingSkeleton />
                    <TrendingSkeleton />
                    <TrendingSkeleton />
                  </div>
                ) : trendingBlogs && trendingBlogs.length > 0 ? (
                  <div className="space-y-4">
                    {trendingBlogs.map((blog) => (
                      <TrendingBlogCard key={blog._id} blog={blog} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No trending articles yet.</p>
                )}
              </div>

              {/* Gallery Widget (Matching Screenshot 1) */}
              <BlogGalleryWidget />

              {/* We Are Hiring Promo Card */}
              <div className="rounded-[24px] bg-[#E9F0FD] p-6 text-left border border-indigo-100 shadow-xs relative overflow-hidden">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3C65F5] block mb-1">
                  WE ARE HIRING
                </span>
                <h4 className="text-2xl font-black text-[#05264E] leading-tight mb-3">
                  HIRING
                </h4>
                <p className="text-xs text-[#66789C] leading-relaxed mb-6 font-medium">
                  Search all the open positions on the web. Find your next career opportunity today.
                </p>
                <Link
                  to="/jobs"
                  className="inline-block px-5 py-2.5 rounded-xl bg-[#3C65F5] text-white text-xs font-bold shadow-md hover:bg-[#254BD6] transition"
                >
                  Know More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Newsletter Banner Section (Matching Screenshot 2) */}
        <section className="pt-6">
          <BlogNewsletterSection />
        </section>
      </Container>
    </div>
  );
};

export default PublicBlogPage;
