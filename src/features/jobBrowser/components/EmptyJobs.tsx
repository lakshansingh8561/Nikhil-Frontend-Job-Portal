import React from "react";
import { FiSearch, FiRotateCcw } from "react-icons/fi";

interface EmptyJobsProps {
  onReset: () => void;
}

const EmptyJobs: React.FC<EmptyJobsProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-[#EAEFF7] bg-white p-12 text-center shadow-sm min-h-[380px]">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E8F0FE] text-[#3C65F5] mb-6">
        <FiSearch className="text-4xl" />
      </div>

      <h3 className="text-xl font-bold text-[#05264E]">No Matching Jobs Found</h3>
      <p className="mt-2 max-w-md text-sm text-[#66789C]">
        We couldn't find any active jobs matching your search criteria. Try adjusting your filters or search terms.
      </p>

      <button
        onClick={onReset}
        className="mt-6 flex items-center gap-2 rounded-2xl bg-[#3C65F5] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#254BD6] hover:shadow-lg cursor-pointer"
      >
        <FiRotateCcw className="text-base" />
        <span>Reset Filters & Search Again</span>
      </button>
    </div>
  );
};

export default EmptyJobs;
