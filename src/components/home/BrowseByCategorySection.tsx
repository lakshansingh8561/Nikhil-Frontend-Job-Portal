import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import marketingSvg from "../../assets/images/marketing.svg";
import customerSvg from "../../assets/images/customer.svg";
import financeSvg from "../../assets/images/finance.svg";
import lightningSvg from "../../assets/images/lightning.svg";
import humanSvg from "../../assets/images/human.svg";
import managementSvg from "../../assets/images/management.svg";
import retailSvg from "../../assets/images/retail.svg";
import securitySvg from "../../assets/images/security.svg";
import contentSvg from "../../assets/images/content.svg";
import researchSvg from "../../assets/images/research.svg";

interface CategoryItem {
  name: string;
  jobsCount: string;
  icon: string;
  query: string;
  isBig: boolean;
}

// Exact sequence: 2 big, 2 small, 1 big, 1 small, 2 big, 1 small, 1 big
const categoriesData: CategoryItem[] = [
  {
    name: "Marketing & Sale",
    jobsCount: "1526 Jobs Available",
    icon: marketingSvg,
    query: "Marketing",
    isBig: true,
  },
  {
    name: "Customer Help",
    jobsCount: "185 Jobs Available",
    icon: customerSvg,
    query: "Customer Help",
    isBig: true,
  },
  {
    name: "Finance",
    jobsCount: "168 Jobs Available",
    icon: financeSvg,
    query: "Finance",
    isBig: false,
  },
  {
    name: "Software",
    jobsCount: "1856 Jobs Available",
    icon: lightningSvg,
    query: "Software",
    isBig: false,
  },
  {
    name: "Human Resource",
    jobsCount: "165 Jobs Available",
    icon: humanSvg,
    query: "Human Resource",
    isBig: true,
  },
  {
    name: "Management",
    jobsCount: "965 Jobs Available",
    icon: managementSvg,
    query: "Management",
    isBig: false,
  },
  {
    name: "Retail & Products",
    jobsCount: "563 Jobs Available",
    icon: retailSvg,
    query: "Retail & Products",
    isBig: true,
  },
  {
    name: "Security Analyst",
    jobsCount: "254 Jobs Available",
    icon: securitySvg,
    query: "Security Analyst",
    isBig: true,
  },
  {
    name: "Content Writer",
    jobsCount: "142 Jobs Available",
    icon: contentSvg,
    query: "Content Writer",
    isBig: false,
  },
  {
    name: "Market Research",
    jobsCount: "180 Jobs Available",
    icon: researchSvg,
    query: "Market Research",
    isBig: true,
  },
];

const CARD_WIDTH = 199.19;
const GAP = 18;
const SHIFT_AMOUNT = CARD_WIDTH + GAP; // 217.19px per step

const BrowseByCategorySection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Maximum shift (allowing slide by 1 step at a time for 10 items with 5 visible)
  const maxIndex = Math.max(0, categoriesData.length - 5);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#EAEFF7] font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="mx-auto w-full max-w-[1260px] px-4 sm:px-6 lg:px-8">
        {/* Centered Section Header */}
        <div className="text-center max-w-[650px] mx-auto mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-[36px] font-bold text-[#05264E] leading-[1.25] tracking-tight">
            Browse by category
          </h2>
          <p className="mt-2 text-sm sm:text-[15px] font-normal text-[#66789C] leading-[22px]">
            Find the job that’s perfect for you. about 800+ new jobs everyday
          </p>
        </div>

        {/* Carousel Slider with Left & Right Arrows on both sides */}
        <div className="relative flex items-center justify-center gap-3 sm:gap-4">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous Category"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F2F6FD] text-[#05264E] hover:bg-[#3C65F5] hover:text-white disabled:opacity-30 disabled:hover:bg-[#F2F6FD] disabled:hover:text-[#05264E] disabled:cursor-not-allowed transition duration-200 shrink-0 cursor-pointer shadow-xs z-10"
          >
            <FiChevronLeft className="text-lg" />
          </button>

          {/* Masked Slider Viewport: Exactly fits 5 cards with ample clearance */}
          <div className="overflow-hidden w-full max-w-[1100px] px-1 py-4 min-h-[160px] flex items-start">
            <div
              className="flex items-start transition-transform duration-300 ease-in-out"
              style={{
                gap: `${GAP}px`,
                transform: `translateX(-${currentIndex * SHIFT_AMOUNT}px)`,
              }}
            >
              {categoriesData.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/jobs?category=${encodeURIComponent(cat.query)}`}
                  className={`group shrink-0 w-[199.19px] bg-white border border-[#E0E6F7] rounded-[12px] px-[18px] py-[22px] transition-all duration-300 hover:border-[#3C65F5] hover:shadow-lg hover:-translate-y-1 cursor-pointer block ${
                    cat.isBig
                      ? "h-[141px] flex flex-col justify-between items-start"
                      : "h-[94px] flex flex-row items-center gap-3.5"
                  }`}
                >
                  {/* Category SVG Icon */}
                  <img
                    src={cat.icon}
                    alt={cat.name}
                    className="w-10 h-10 object-contain shrink-0"
                  />

                  {/* Text details */}
                  <div className="text-info-right flex flex-col justify-center overflow-hidden">
                    <h4 className="text-[16px] font-bold text-[#05264E] group-hover:text-[#3C65F5] transition-colors leading-[20px] mb-[3px] truncate">
                      {cat.name}
                    </h4>
                    <p className="text-[12px] font-normal text-[#66789C] leading-[16px] whitespace-nowrap">
                      {cat.jobsCount}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next Category"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F2F6FD] text-[#05264E] hover:bg-[#3C65F5] hover:text-white disabled:opacity-30 disabled:hover:bg-[#F2F6FD] disabled:hover:text-[#05264E] disabled:cursor-not-allowed transition duration-200 shrink-0 cursor-pointer shadow-xs z-10"
          >
            <FiChevronRight className="text-lg" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrowseByCategorySection;
