import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#EAEFF7] pt-5 mt-4">
      {totalItems !== undefined && (
        <p className="text-xs font-medium text-[#66789C]">
          Showing <span className="font-bold text-[#05264E]">{startItem}</span> to{" "}
          <span className="font-bold text-[#05264E]">{endItem}</span> of{" "}
          <span className="font-bold text-[#05264E]">{totalItems}</span> entries
        </p>
      )}

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAEFF7] bg-white text-gray-600 transition hover:bg-[#E8F0FE] hover:text-[#3C65F5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title="Previous page"
        >
          <FiChevronLeft className="text-base" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition cursor-pointer ${
                isActive
                  ? "bg-[#3C65F5] text-white shadow-xs"
                  : "border border-[#EAEFF7] bg-white text-[#66789C] hover:bg-[#E8F0FE] hover:text-[#3C65F5]"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAEFF7] bg-white text-gray-600 transition hover:bg-[#E8F0FE] hover:text-[#3C65F5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title="Next page"
        >
          <FiChevronRight className="text-base" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
