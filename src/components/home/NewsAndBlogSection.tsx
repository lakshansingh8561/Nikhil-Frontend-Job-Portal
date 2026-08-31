import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiLoader } from "react-icons/fi";
import Container from "../common/Container";

import imgNews1 from "../../assets/images/img-news1.png";
import imgNews2 from "../../assets/images/img-news2.png";
import imgNews3 from "../../assets/images/img-news3.png";
import user1 from "../../assets/images/user1.png";
import user2 from "../../assets/images/user2.png";
import user3 from "../../assets/images/user3.png";

interface BlogPost {
  id: number;
  image: string;
  category: "News" | "Events";
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    date: string;
  };
  readTime: string;
}

const initialBlogPosts: BlogPost[] = [
  {
    id: 1,
    image: imgNews1,
    category: "News",
    title: "21 Job Interview Tips: How To Make a Great Impression",
    excerpt:
      "Our mission is to create the world's most sustainable healthcare company by creating high-quality healthcare products in iconic, sustainable packaging.",
    author: {
      name: "Sarah Harding",
      avatar: user1,
      date: "06 September",
    },
    readTime: "8 mins to read",
  },
  {
    id: 2,
    image: imgNews2,
    category: "Events",
    title: "39 Strengths and Weaknesses To Discuss in a Job Interview",
    excerpt:
      "Our mission is to create the world's most sustainable healthcare company by creating high-quality healthcare products in iconic, sustainable packaging.",
    author: {
      name: "Steven Jobs",
      avatar: user2,
      date: "06 September",
    },
    readTime: "6 mins to read",
  },
  {
    id: 3,
    image: imgNews3,
    category: "News",
    title: "Interview Question: Why Dont You Have a Degree?",
    excerpt:
      "Learn how to respond if an interviewer asks you why you dont have a degree, and read example answers that can help you craft",
    author: {
      name: "William Kend",
      avatar: user3,
      date: "06 September",
    },
    readTime: "9 mins to read",
  },
];

export const NewsAndBlogSection: React.FC = () => {
  const [posts] = useState<BlogPost[]>(initialBlogPosts);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : posts.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < posts.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="py-16 bg-white border-b border-[#EAEFF7]">
      <Container>
        {/* Section Header with Carousel Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div className="text-center sm:text-left mx-auto sm:mx-0">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#05264E] font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
              News and Blog
            </h2>
            <p className="mt-2 text-sm sm:text-base font-normal text-[#66789C] font-['Plus_Jakarta_Sans',sans-serif]">
              Get the latest news, updates and tips
            </p>
          </div>

          {/* Navigation Controls (Arrows) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous posts"
              className={`w-10 h-10 rounded-full border border-[#E0E6F6] bg-white text-[#66789C] hover:bg-[#3C65F5] hover:border-[#3C65F5] hover:text-white flex items-center justify-center transition shadow-xs cursor-pointer ${
                activeIndex === 0 ? "opacity-70" : ""
              }`}
            >
              <FiChevronLeft className="text-lg" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next posts"
              className="w-10 h-10 rounded-full border border-[#E0E6F6] bg-white text-[#66789C] hover:bg-[#3C65F5] hover:border-[#3C65F5] hover:text-white flex items-center justify-center transition shadow-xs cursor-pointer"
            >
              <FiChevronRight className="text-lg" />
            </button>
          </div>
        </div>

        {/* 3 Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-2xl border border-[#E0E6F6] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#3C65F5]/30 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif]"
            >
              <div>
                {/* Image Banner */}
                <div className="w-full h-[185px] sm:h-[195px] rounded-xl overflow-hidden mb-4 bg-gray-100 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Category Tag */}
                <div className="mb-3">
                  <span className="bg-[#E8F0FE] text-[#3C65F5] text-xs font-semibold px-3 py-1 rounded-md inline-block">
                    {post.category}
                  </span>
                </div>

                {/* Post Title */}
                <h3 className="text-[20px] leading-[26px] font-bold text-[#05264E] group-hover:text-[#3C65F5] transition-colors line-clamp-2 mb-2.5">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[14px] leading-[22px] text-[#4F5E64] line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Bottom Author & Read Time Info */}
              <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-9 h-9 rounded-full object-cover border border-gray-100"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#05264E] leading-tight">
                      {post.author.name}
                    </h4>
                    <span className="text-[12px] text-[#66789C]">
                      {post.author.date}
                    </span>
                  </div>
                </div>

                <span className="text-[12px] font-medium text-[#66789C]">
                  {post.readTime}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Posts Button */}
        <div className="text-center mt-12">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#05264E] hover:bg-[#3C65F5] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer font-['Plus_Jakarta_Sans',sans-serif]"
          >
            <FiLoader className="text-base animate-spin" />
            <span>Load More Posts</span>
          </button>
        </div>
      </Container>
    </section>
  );
};

export default NewsAndBlogSection;
