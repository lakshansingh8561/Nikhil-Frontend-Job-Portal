import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { JobBrowserPagination } from "../types/jobBrowser.types";

interface PaginationProps {
  pagination: JobBrowserPagination;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { page, pages } = pagination;

  if (pages <= 1) return null;

  // Generate list of page numbers
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisible = 5;

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (page > 3) {
        pageNumbers.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(pages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        if (!pageNumbers.includes(i)) {
          pageNumbers.push(i);
        }
      }

      if (page < pages - 2) {
        pageNumbers.push("...");
      }

      if (!pageNumbers.includes(pages)) {
        pageNumbers.push(pages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#EAEFF7] pt-6">
      <p className="text-xs font-semibold text-[#66789C]">
        Page <span className="font-bold text-[#05264E]">{page}</span> of{" "}
        <span className="font-bold text-[#05264E]">{pages}</span>
      </p>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-10 px-3.5 items-center gap-1.5 rounded-xl border border-[#EAEFF7] bg-white text-xs font-semibold text-[#05264E] shadow-sm transition hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <FiChevronLeft className="text-sm" />
          <span>Previous</span>
        </button>

        {/* Numeric Page Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((num, idx) => {
            if (num === "...") {
              return (
                <span
                  key={`dots-${idx}`}
                  className="px-2 text-xs font-semibold text-gray-400"
                >
                  ...
                </span>
              );
            }

            const isCurrent = num === page;
            return (
              <button
                key={num}
                onClick={() => onPageChange(Number(num))}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-[#3C65F5] text-white shadow-md"
                    : "border border-[#EAEFF7] bg-white text-[#05264E] hover:bg-[#F8FAFC]"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(pages, page + 1))}
          disabled={page === pages}
          className="flex h-10 px-3.5 items-center gap-1.5 rounded-xl border border-[#EAEFF7] bg-white text-xs font-semibold text-[#05264E] shadow-sm transition hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Next</span>
          <FiChevronRight className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
